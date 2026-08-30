<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LearningMaterialRequest extends FormRequest
{
    public function authorize(): bool
    {
        $material = $this->route('learningMaterial');

        return $material
            ? $this->user()->can('update', $material)
            : $this->user()->can('create', \App\Models\LearningMaterial::class);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $material = $this->route('learningMaterial');
        $required = $material ? 'sometimes' : 'required';

        return [
            'subject_id' => [$required, 'exists:subjects,id'],
            'name' => [
                $required,
                'string',
                'max:100',
                Rule::unique('learning_materials', 'name')->ignore($material?->id),
            ],
            'description' => ['nullable', 'string', 'max:1000'],
            'file' => ['nullable', 'file', 'mimes:pdf,doc,docx,ppt,pptx,xls,xlsx', 'max:20480'],
            'remove_file' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.unique' => 'Sudah ada materi dengan nama ini.',
            'file.mimes' => 'Format file harus PDF, Word, PowerPoint, atau Excel.',
            'file.max' => 'Ukuran file maksimal 20 MB.',
        ];
    }
}
