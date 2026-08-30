<?php

namespace App\Http\Controllers;

use App\Models\LearningMaterial;
use App\Models\QuizAttempt;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Student-facing screens: the material catalogue, a material detail page and
 * the learning overview.
 */
class StudentController extends Controller
{
    /**
     * Landing page with the student's real progress figures.
     */
    public function overview(Request $request): Response
    {
        $user = $request->user();

        $submitted = QuizAttempt::where('user_id', $user->id)
            ->where('status', QuizAttempt::STATUS_SUBMITTED)
            ->get();

        return Inertia::render('user/overview', [
            'stats' => [
                'subject_count' => Subject::count(),
                'material_count' => LearningMaterial::count(),
                'completed_quiz_count' => $submitted->count(),
                'average_score' => $submitted->isEmpty() ? null : (int) round($submitted->avg('score')),
                'best_score' => $submitted->isEmpty() ? null : (int) $submitted->max('score'),
            ],
            'recentAttempts' => QuizAttempt::where('user_id', $user->id)
                ->where('status', QuizAttempt::STATUS_SUBMITTED)
                ->with('learningMaterial')
                ->latest('submitted_at')
                ->take(3)
                ->get()
                ->map(fn (QuizAttempt $attempt) => [
                    'id' => $attempt->id,
                    'score' => $attempt->score,
                    'submitted_at' => $attempt->submitted_at?->toIso8601String(),
                    'material_name' => $attempt->learningMaterial?->name ?? 'Materi dihapus',
                ])
                ->values(),
        ]);
    }

    /**
     * Browsable material catalogue.
     */
    public function index(): Response
    {
        return Inertia::render('user/learning-material/page', [
            'materials' => LearningMaterial::with('subject')
                ->orderBy('name')
                ->get()
                ->map(fn (LearningMaterial $material) => [
                    'id' => $material->id,
                    'name' => $material->name,
                    'description' => $material->description,
                    'subject' => $material->subject?->only(['id', 'name']),
                    'question_count' => $material->questions()->count(),
                ])
                ->values(),
            'subjects' => Subject::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Material detail with the student's attempt state for it.
     */
    public function show(Request $request, LearningMaterial $learningMaterial): Response
    {
        // Route binding reaches deactivated rows so admins can restore them;
        // students must not see them.
        abort_if($learningMaterial->isDeleted(), 404);

        $learningMaterial->load('subject', 'creator');

        $attempts = QuizAttempt::where('user_id', $request->user()->id)
            ->where('learning_material_id', $learningMaterial->id)
            ->latest()
            ->get();

        return Inertia::render('user/learning-material/show', [
            'material' => [
                'id' => $learningMaterial->id,
                'name' => $learningMaterial->name,
                'description' => $learningMaterial->description,
                'file_path' => $learningMaterial->file_path,
                'created_at' => $learningMaterial->created_at?->toIso8601String(),
                'subject' => $learningMaterial->subject?->only(['id', 'name']),
                'creator_name' => $learningMaterial->creator?->name,
                'question_count' => $learningMaterial->questions()->count(),
            ],
            'inProgressAttemptId' => $attempts->firstWhere('status', QuizAttempt::STATUS_IN_PROGRESS)?->id,
            'lastResult' => $attempts->firstWhere('status', QuizAttempt::STATUS_SUBMITTED)
                ? [
                    'id' => $attempts->firstWhere('status', QuizAttempt::STATUS_SUBMITTED)->id,
                    'score' => $attempts->firstWhere('status', QuizAttempt::STATUS_SUBMITTED)->score,
                ]
                : null,
        ]);
    }
}
