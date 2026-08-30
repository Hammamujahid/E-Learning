<?php

namespace App\Http\Requests;

use App\Models\Question;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class QuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        $question = $this->route('question');

        return $question
            ? $this->user()->can('update', $question)
            : $this->user()->can('create', Question::class);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $isUpdate = $this->route('question') !== null;

        return [
            'learning_material_id' => [$isUpdate ? 'sometimes' : 'required', 'exists:learning_materials,id'],
            'question_text' => ['required', 'string', 'max:1000'],
            'question_image' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:2048'],
            'remove_question_image' => ['nullable', 'boolean'],
            'answers' => ['required', 'array', 'size:4'],
            'answers.*.id' => [$isUpdate ? 'required' : 'nullable', 'integer', 'exists:answers,id'],
            'answers.*.text' => ['required', 'string', 'max:255'],
            'answers.*.is_correct' => ['required', 'boolean'],
            'answers.*.image' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:2048'],
            'answers.*.remove_image' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Enforce exactly one correct answer.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            $correctCount = collect($this->input('answers', []))
                ->filter(fn ($answer) => filter_var($answer['is_correct'] ?? false, FILTER_VALIDATE_BOOLEAN))
                ->count();

            if ($correctCount !== 1) {
                $validator->errors()->add('answers', 'Tepat 1 jawaban harus ditandai benar.');
            }
        });
    }

    public function messages(): array
    {
        return [
            'answers.size' => 'Setiap soal harus memiliki tepat 4 pilihan jawaban.',
        ];
    }
}
