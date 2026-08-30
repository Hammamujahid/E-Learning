<?php

namespace App\Http\Controllers;

use App\Http\Requests\LearningMaterialRequest;
use App\Models\LearningMaterial;
use App\Models\Subject;
use App\Models\User;
use App\Services\MediaUploader;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LearningMaterialController extends Controller
{
    public function __construct(protected MediaUploader $uploader) {}

    /**
     * Management list. Teachers see only the materials they authored; admins
     * see everything.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // The management table intentionally includes deactivated rows so they
        // can be restored.
        $materials = LearningMaterial::withDeleted()
            ->with(['subject', 'creator'])
            ->when($user->isTeacher(), fn ($query) => $query->where('created_by', $user->id))
            ->withCount('questions')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (LearningMaterial $material) => $this->presentRow($material, $user))
            ->values();

        return Inertia::render($user->isTeacher() ? 'teacher/learning-material' : 'admin/learning-material', [
            'materials' => $materials,
            'subjects' => Subject::orderBy('name')->get(['id', 'name']),
            'can' => [
                'create' => $user->can('create', LearningMaterial::class),
            ],
        ]);
    }

    /**
     * Detail screen, including the question bank for this material.
     */
    public function show(Request $request, LearningMaterial $learningMaterial): Response
    {
        $this->authorize('view', $learningMaterial);

        $user = $request->user();
        $learningMaterial->load(['subject', 'creator']);

        $questions = $learningMaterial->questions()
            ->with('answers')
            ->orderBy('id')
            ->get()
            ->map(fn ($question) => [
                'id' => $question->id,
                'question_text' => $question->question_text,
                'media_path' => $question->media_path,
                'created_at' => $question->created_at?->toIso8601String(),
                'answers' => $question->answers->map(fn ($answer) => [
                    'id' => $answer->id,
                    'answer_text' => $answer->answer_text,
                    'media_path' => $answer->media_path,
                    // Teachers and admins managing the bank must see the key.
                    'is_correct' => $answer->is_correct,
                ])->values(),
                'can' => [
                    'update' => $user->can('update', $question),
                    'delete' => $user->can('delete', $question),
                ],
            ])
            ->values();

        return Inertia::render('learning-material/detail', [
            'material' => [
                'id' => $learningMaterial->id,
                'name' => $learningMaterial->name,
                'description' => $learningMaterial->description,
                'file_path' => $learningMaterial->file_path,
                'created_at' => $learningMaterial->created_at?->toIso8601String(),
                'subject' => $learningMaterial->subject?->only(['id', 'name']),
                'creator_name' => $learningMaterial->creator?->name,
                'can' => [
                    'update' => $user->can('update', $learningMaterial),
                    'delete' => $user->can('delete', $learningMaterial),
                ],
            ],
            'questions' => $questions,
            'canCreateQuestion' => $user->can('create', \App\Models\Question::class),
        ]);
    }

    /**
     * Edit form.
     */
    public function edit(Request $request, LearningMaterial $learningMaterial): Response
    {
        $this->authorize('update', $learningMaterial);

        $learningMaterial->load('subject');

        return Inertia::render('learning-material/edit', [
            'material' => [
                'id' => $learningMaterial->id,
                'name' => $learningMaterial->name,
                'description' => $learningMaterial->description,
                'file_path' => $learningMaterial->file_path,
                'subject_id' => $learningMaterial->subject_id,
            ],
            'subjects' => Subject::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(LearningMaterialRequest $request): RedirectResponse
    {
        $data = [
            'subject_id' => $request->subject_id,
            'name' => $request->name,
            'description' => $request->description,
            // Authorship comes from the session, never from the request body.
            'created_by' => $request->user()->id,
            'is_deleted' => false,
        ];

        if ($request->hasFile('file')) {
            $upload = $this->uploader->uploadDocument($request->file('file'));
            $data['file_path'] = $upload['url'];
            $data['public_id'] = $upload['public_id'];
        }

        LearningMaterial::create($data);

        return redirect()->route($this->indexRouteFor($request->user()))
            ->with('success', 'Materi berhasil ditambahkan.');
    }

    public function update(LearningMaterialRequest $request, LearningMaterial $learningMaterial): RedirectResponse
    {
        $data = $request->only(['subject_id', 'name', 'description']);

        if ($request->boolean('remove_file') && $learningMaterial->public_id) {
            $this->uploader->destroy($learningMaterial->public_id, raw: true);
            $data['file_path'] = null;
            $data['public_id'] = null;
        }

        if ($request->hasFile('file')) {
            $this->uploader->destroy($learningMaterial->public_id, raw: true);
            $upload = $this->uploader->uploadDocument($request->file('file'));
            $data['file_path'] = $upload['url'];
            $data['public_id'] = $upload['public_id'];
        }

        $learningMaterial->update($data);

        return back()->with('success', 'Materi berhasil diperbarui.');
    }

    /**
     * Flag the material as deleted, keeping quiz history intact.
     */
    public function destroy(Request $request, LearningMaterial $learningMaterial): RedirectResponse
    {
        $this->authorize('delete', $learningMaterial);

        $learningMaterial->softDelete();

        return redirect()->route($this->indexRouteFor($request->user()))
            ->with('success', 'Materi berhasil dihapus.');
    }

    /**
     * Toggle the deleted flag from the management table.
     */
    public function toggle(Request $request, LearningMaterial $learningMaterial): RedirectResponse
    {
        $this->authorize('update', $learningMaterial);

        $validated = $request->validate(['is_deleted' => ['required', 'boolean']]);

        $learningMaterial->forceFill(['is_deleted' => $validated['is_deleted']])->save();

        return back()->with('success', $validated['is_deleted'] ? 'Materi dinonaktifkan.' : 'Materi diaktifkan.');
    }

    /**
     * @return array<string, mixed>
     */
    protected function presentRow(LearningMaterial $material, User $user): array
    {
        return [
            'id' => $material->id,
            'name' => $material->name,
            'description' => $material->description,
            'file_path' => $material->file_path,
            'is_deleted' => $material->is_deleted,
            'created_at' => $material->created_at?->toIso8601String(),
            'subject' => $material->subject?->only(['id', 'name']),
            'creator_name' => $material->creator?->name,
            'questions_count' => $material->questions_count,
            'can' => [
                'update' => $user->can('update', $material),
                'delete' => $user->can('delete', $material),
            ],
        ];
    }

    protected function indexRouteFor(User $user): string
    {
        return $user->isTeacher() ? 'teacher.learning-material' : 'admin.learning-material';
    }
}
