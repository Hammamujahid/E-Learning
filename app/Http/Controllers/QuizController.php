<?php

namespace App\Http\Controllers;

use App\Models\LearningMaterial;
use App\Models\QuizAttempt;
use App\Services\QuizGrader;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuizController extends Controller
{
    public function __construct(protected QuizGrader $grader) {}

    /**
     * Start or resume an attempt, then send the student to the question screen.
     */
    public function start(Request $request, LearningMaterial $learningMaterial): RedirectResponse
    {
        $attempt = $this->grader->start($request->user(), $learningMaterial);

        return redirect()->route('user.quiz.show', $attempt);
    }

    /**
     * Render the questions for an in-progress attempt.
     *
     * The answer key is deliberately excluded from these props: the student
     * receives only the answer options, never `is_correct`.
     */
    public function show(QuizAttempt $quizAttempt): Response|RedirectResponse
    {
        $this->authorize('view', $quizAttempt);

        if ($quizAttempt->isSubmitted()) {
            return redirect()->route('user.quiz.result', $quizAttempt);
        }

        $quizAttempt->load('learningMaterial.subject');

        $questions = $quizAttempt->learningMaterial
            ->questions()
            ->with('answers')
            ->orderBy('id')
            ->get()
            ->map(fn ($question) => [
                'id' => $question->id,
                'question_text' => $question->question_text,
                'media_path' => $question->media_path,
                'answers' => $question->answers->map(fn ($answer) => [
                    'id' => $answer->id,
                    'answer_text' => $answer->answer_text,
                    'media_path' => $answer->media_path,
                ])->values(),
            ])
            ->values();

        return Inertia::render('user/questions/page', [
            'attempt' => [
                'id' => $quizAttempt->id,
                'learning_material_id' => $quizAttempt->learning_material_id,
            ],
            'material' => [
                'id' => $quizAttempt->learningMaterial->id,
                'name' => $quizAttempt->learningMaterial->name,
                'subject' => $quizAttempt->learningMaterial->subject?->only(['id', 'name']),
            ],
            'questions' => $questions,
        ]);
    }

    /**
     * Grade the submitted answers server-side.
     */
    public function submit(Request $request, QuizAttempt $quizAttempt): RedirectResponse
    {
        $this->authorize('submit', $quizAttempt);

        $validated = $request->validate([
            'answers' => ['present', 'array'],
            'answers.*.question_id' => ['required', 'integer', 'exists:questions,id'],
            'answers.*.answer_id' => ['nullable', 'integer', 'exists:answers,id'],
        ]);

        $this->grader->submit($quizAttempt, $validated['answers']);

        return redirect()->route('user.quiz.result', $quizAttempt)
            ->with('success', 'Jawaban berhasil dikirim.');
    }

    /**
     * Show the graded result. Reloadable, unlike the previous in-memory result.
     */
    public function result(QuizAttempt $quizAttempt): Response|RedirectResponse
    {
        $this->authorize('view', $quizAttempt);

        if (! $quizAttempt->isSubmitted()) {
            return redirect()->route('user.quiz.show', $quizAttempt);
        }

        $quizAttempt->load('learningMaterial.subject');

        return Inertia::render('user/questions/result', [
            'material' => [
                'id' => $quizAttempt->learningMaterial->id,
                'name' => $quizAttempt->learningMaterial->name,
                'subject' => $quizAttempt->learningMaterial->subject?->only(['id', 'name']),
            ],
            'result' => $this->grader->result($quizAttempt),
        ]);
    }

    /**
     * The student's own attempt history.
     */
    public function history(Request $request): Response
    {
        $attempts = QuizAttempt::where('user_id', $request->user()->id)
            ->with('learningMaterial.subject')
            ->latest()
            ->get()
            ->map(fn (QuizAttempt $attempt) => [
                'id' => $attempt->id,
                'score' => $attempt->score,
                'status' => $attempt->status,
                'submitted_at' => $attempt->submitted_at?->toIso8601String(),
                'created_at' => $attempt->created_at?->toIso8601String(),
                'material' => [
                    'id' => $attempt->learningMaterial?->id,
                    'name' => $attempt->learningMaterial?->name ?? 'Materi dihapus',
                    'subject' => $attempt->learningMaterial?->subject?->name,
                ],
            ])
            ->values();

        return Inertia::render('user/history', [
            'attempts' => $attempts,
        ]);
    }
}
