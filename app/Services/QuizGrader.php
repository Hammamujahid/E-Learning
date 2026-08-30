<?php

namespace App\Services;

use App\Models\CheckingAnswer;
use App\Models\LearningMaterial;
use App\Models\QuizAttempt;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Owns quiz attempt lifecycle and grading. Scoring happens here, on the
 * server, using the stored answer key — never from client-supplied values.
 */
class QuizGrader
{
    /**
     * Start (or resume) an attempt for the given student and material.
     *
     * @throws ValidationException when the material has no questions
     */
    public function start(User $user, LearningMaterial $material): QuizAttempt
    {
        if ($material->isDeleted()) {
            throw ValidationException::withMessages([
                'learning_material_id' => 'Materi ini sudah tidak tersedia.',
            ]);
        }

        if ($material->questions()->count() === 0) {
            throw ValidationException::withMessages([
                'learning_material_id' => 'Materi ini belum memiliki soal.',
            ]);
        }

        // Resume rather than pile up duplicate attempts.
        $existing = QuizAttempt::where('user_id', $user->id)
            ->where('learning_material_id', $material->id)
            ->where('status', QuizAttempt::STATUS_IN_PROGRESS)
            ->first();

        if ($existing) {
            return $existing;
        }

        return QuizAttempt::create([
            'user_id' => $user->id,
            'learning_material_id' => $material->id,
            'score' => 0,
            'status' => QuizAttempt::STATUS_IN_PROGRESS,
            'is_deleted' => false,
        ]);
    }

    /**
     * Grade the submitted answers and finalise the attempt.
     *
     * @param  array<int, array{question_id: int, answer_id: int|null}>  $submitted
     *
     * @throws ValidationException when the attempt was already graded
     */
    public function submit(QuizAttempt $attempt, array $submitted): QuizAttempt
    {
        if ($attempt->isSubmitted()) {
            throw ValidationException::withMessages([
                'attempt' => 'Jawaban untuk percobaan ini sudah dikirim.',
            ]);
        }

        $questions = $attempt->learningMaterial->questions()->with('answers')->get();

        // Index the chosen answer per question, ignoring anything that does not
        // belong to this material or whose answer is not an option of that
        // question. This is what prevents a forged answer_id from scoring.
        $chosen = [];

        foreach ($submitted as $entry) {
            $question = $questions->firstWhere('id', $entry['question_id'] ?? null);

            if (! $question) {
                continue;
            }

            $answerId = $entry['answer_id'] ?? null;
            $answer = $answerId ? $question->answers->firstWhere('id', $answerId) : null;

            $chosen[$question->id] = $answer?->id;
        }

        $correctCount = 0;

        DB::transaction(function () use ($attempt, $questions, $chosen, &$correctCount) {
            // Re-submitting is blocked above, but clear any partial rows so a
            // retried request cannot double-count.
            CheckingAnswer::where('quiz_attempt_id', $attempt->id)->delete();

            foreach ($questions as $question) {
                $chosenAnswerId = $chosen[$question->id] ?? null;
                $correctAnswer = $question->answers->firstWhere('is_correct', true);
                $isCorrect = $chosenAnswerId !== null && $correctAnswer !== null && $chosenAnswerId === $correctAnswer->id;

                if ($isCorrect) {
                    $correctCount++;
                }

                CheckingAnswer::create([
                    'quiz_attempt_id' => $attempt->id,
                    'question_id' => $question->id,
                    'answer_id' => $chosenAnswerId,
                    'is_correct' => $isCorrect,
                    'is_deleted' => false,
                ]);
            }

            $total = $questions->count();

            $attempt->update([
                'score' => $total > 0 ? (int) round(($correctCount / $total) * 100) : 0,
                'status' => QuizAttempt::STATUS_SUBMITTED,
                'submitted_at' => now(),
            ]);
        });

        return $attempt->refresh();
    }

    /**
     * Build the graded result payload for a submitted attempt.
     *
     * @return array{
     *     quiz_attempt_id: int,
     *     score: int,
     *     correct_count: int,
     *     total: int,
     *     submitted_at: string|null,
     *     results: array<int, array{question_id: int, question_text: string, is_correct: bool, chosen_answer_id: int|null, correct_answer_id: int|null, answers: array<int, array{id: int, answer_text: string, media_path: string|null}>}>
     * }
     */
    public function result(QuizAttempt $attempt): array
    {
        $checkings = $attempt->checkingAnswers()->with('question.answers')->get();

        $results = $checkings->map(function (CheckingAnswer $checking) {
            $question = $checking->question;
            $correctAnswer = $question?->answers->firstWhere('is_correct', true);

            return [
                'question_id' => $checking->question_id,
                'question_text' => $question?->question_text ?? '',
                'media_path' => $question?->media_path,
                'is_correct' => $checking->is_correct,
                'chosen_answer_id' => $checking->answer_id,
                'correct_answer_id' => $correctAnswer?->id,
                'answers' => $question
                    ? $question->answers->map(fn ($answer) => [
                        'id' => $answer->id,
                        'answer_text' => $answer->answer_text,
                        'media_path' => $answer->media_path,
                    ])->values()->all()
                    : [],
            ];
        })->values()->all();

        return [
            'quiz_attempt_id' => $attempt->id,
            'learning_material_id' => $attempt->learning_material_id,
            'score' => $attempt->score,
            'correct_count' => $checkings->where('is_correct', true)->count(),
            'total' => $checkings->count(),
            'submitted_at' => $attempt->submitted_at?->toIso8601String(),
            'results' => $results,
        ];
    }
}
