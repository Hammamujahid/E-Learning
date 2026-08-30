<?php

namespace App\Http\Controllers;

use App\Http\Requests\QuestionRequest;
use App\Models\Answer;
use App\Models\LearningMaterial;
use App\Models\Question;
use App\Services\MediaUploader;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuestionController extends Controller
{
    public function __construct(protected MediaUploader $uploader) {}

    /**
     * Store a question with exactly four answers.
     */
    public function store(QuestionRequest $request): RedirectResponse
    {
        $material = LearningMaterial::findOrFail($request->learning_material_id);

        DB::transaction(function () use ($request, $material) {
            $data = [
                'learning_material_id' => $material->id,
                'question_text' => $request->question_text,
                // Authorship from the session, not the request body.
                'created_by' => $request->user()->id,
                'is_deleted' => false,
            ];

            if ($request->hasFile('question_image')) {
                $upload = $this->uploader->uploadImage($request->file('question_image'), 'e-learning/questions', 'question');
                $data['media_path'] = $upload['url'];
                $data['public_id'] = $upload['public_id'];
            }

            $question = Question::create($data);

            foreach ($request->input('answers') as $index => $answer) {
                $row = [
                    'question_id' => $question->id,
                    'answer_text' => $answer['text'],
                    'is_correct' => filter_var($answer['is_correct'], FILTER_VALIDATE_BOOLEAN),
                    'is_deleted' => false,
                ];

                if ($request->hasFile("answers.{$index}.image")) {
                    $upload = $this->uploader->uploadImage($request->file("answers.{$index}.image"), 'e-learning/answers', "answer-{$index}");
                    $row['media_path'] = $upload['url'];
                    $row['public_id'] = $upload['public_id'];
                }

                Answer::create($row);
            }
        });

        return back()->with('success', 'Soal berhasil ditambahkan.');
    }

    public function update(QuestionRequest $request, Question $question): RedirectResponse
    {
        DB::transaction(function () use ($request, $question) {
            $data = ['question_text' => $request->question_text];

            if ($request->boolean('remove_question_image')) {
                $this->uploader->destroy($question->public_id);
                $data['media_path'] = null;
                $data['public_id'] = null;
            }

            if ($request->hasFile('question_image')) {
                $this->uploader->destroy($question->public_id);
                $upload = $this->uploader->uploadImage($request->file('question_image'), 'e-learning/questions', 'question');
                $data['media_path'] = $upload['url'];
                $data['public_id'] = $upload['public_id'];
            }

            $question->update($data);

            foreach ($request->input('answers') as $index => $input) {
                $answer = $question->answers()->findOrFail($input['id']);

                $row = [
                    'answer_text' => $input['text'],
                    'is_correct' => filter_var($input['is_correct'], FILTER_VALIDATE_BOOLEAN),
                ];

                if (filter_var($input['remove_image'] ?? false, FILTER_VALIDATE_BOOLEAN)) {
                    $this->uploader->destroy($answer->public_id);
                    $row['media_path'] = null;
                    $row['public_id'] = null;
                }

                if ($request->hasFile("answers.{$index}.image")) {
                    $this->uploader->destroy($answer->public_id);
                    $upload = $this->uploader->uploadImage($request->file("answers.{$index}.image"), 'e-learning/answers', "answer-{$index}");
                    $row['media_path'] = $upload['url'];
                    $row['public_id'] = $upload['public_id'];
                }

                $answer->update($row);
            }
        });

        return back()->with('success', 'Soal berhasil diperbarui.');
    }

    /**
     * Flag the question as deleted so submitted attempts keep their references.
     */
    public function destroy(Request $request, Question $question): RedirectResponse
    {
        $this->authorize('delete', $question);

        $question->softDelete();

        return back()->with('success', 'Soal berhasil dihapus.');
    }
}
