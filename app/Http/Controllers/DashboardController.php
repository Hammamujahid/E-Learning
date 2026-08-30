<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\LearningMaterial;
use App\Models\Question;
use App\Models\QuizAttempt;
use App\Models\Subject;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Admin dashboard. Every figure is computed here rather than assembled
     * from seven separate client requests.
     */
    public function admin(): Response
    {
        $oneWeekAgo = now()->subWeek();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'user_count' => User::where('role', '!=', User::ROLE_ADMIN)->count(),
                'new_user_count' => User::where('role', '!=', User::ROLE_ADMIN)->where('created_at', '>=', $oneWeekAgo)->count(),
                'material_count' => LearningMaterial::count(),
                'new_material_count' => LearningMaterial::where('created_at', '>=', $oneWeekAgo)->count(),
                'question_count' => Question::count(),
                'new_question_count' => Question::where('created_at', '>=', $oneWeekAgo)->count(),
                'subject_count' => Subject::count(),
                'attempt_count' => QuizAttempt::where('status', QuizAttempt::STATUS_SUBMITTED)->count(),
            ],
            'activities' => Activity::latest()
                ->take(25)
                ->get()
                ->map(fn (Activity $activity) => [
                    'id' => $activity->id,
                    'model_id' => $activity->model_id,
                    'type' => $activity->type,
                    'action' => $activity->action,
                    'description' => $activity->description,
                    'created_at' => $activity->created_at?->toIso8601String(),
                ])
                ->values(),
        ]);
    }

    /**
     * Teacher dashboard, scoped to the signed-in teacher's own content.
     */
    public function teacher(): Response
    {
        $teacher = request()->user();

        $materialIds = LearningMaterial::where('created_by', $teacher->id)->pluck('id');

        $attempts = QuizAttempt::whereIn('learning_material_id', $materialIds)
            ->where('status', QuizAttempt::STATUS_SUBMITTED)
            ->with(['user', 'learningMaterial'])
            ->latest('submitted_at')
            ->take(10)
            ->get();

        return Inertia::render('teacher/overview', [
            'stats' => [
                'material_count' => $materialIds->count(),
                'question_count' => Question::where('created_by', $teacher->id)->count(),
                'attempt_count' => QuizAttempt::whereIn('learning_material_id', $materialIds)
                    ->where('status', QuizAttempt::STATUS_SUBMITTED)
                    ->count(),
                'average_score' => QuizAttempt::whereIn('learning_material_id', $materialIds)
                    ->where('status', QuizAttempt::STATUS_SUBMITTED)
                    ->avg('score'),
            ],
            'recentAttempts' => $attempts
                ->map(fn (QuizAttempt $attempt) => [
                    'id' => $attempt->id,
                    'score' => $attempt->score,
                    'submitted_at' => $attempt->submitted_at?->toIso8601String(),
                    'student_name' => $attempt->user?->name ?? 'Pengguna dihapus',
                    'material_name' => $attempt->learningMaterial?->name ?? 'Materi dihapus',
                ])
                ->values(),
            'materials' => LearningMaterial::where('created_by', $teacher->id)
                ->withCount('questions')
                ->orderByDesc('created_at')
                ->take(5)
                ->get()
                ->map(fn (LearningMaterial $material) => [
                    'id' => $material->id,
                    'name' => $material->name,
                    'questions_count' => $material->questions_count,
                ])
                ->values(),
        ]);
    }

    /**
     * Public landing page counters. Deliberately returns aggregates only — the
     * question bank is never exposed to unauthenticated visitors.
     */
    public function welcome(): Response
    {
        return Inertia::render('welcome', [
            'stats' => [
                'subject_count' => Subject::count(),
                'material_count' => LearningMaterial::count(),
                'question_count' => Question::count(),
            ],
            'subjects' => Subject::orderBy('name')->get(['id', 'name', 'description']),
        ]);
    }
}
