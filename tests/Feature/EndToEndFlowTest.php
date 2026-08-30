<?php

use App\Models\LearningMaterial;
use App\Models\Question;
use App\Models\QuizAttempt;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

/**
 * Walks the whole product: a teacher authors a material and its questions,
 * a student finds it, takes the quiz, and both sides see the outcome.
 */
test('a teacher authors content and a student completes the quiz end to end', function () {
    $teacher = User::factory()->teacher()->create();
    $student = User::factory()->student()->create();
    $subject = Subject::factory()->create(['name' => 'Matematika']);

    // ── 1. Teacher signs in and lands on their own dashboard ────────────
    $this->post(route('login'), ['email' => $teacher->email, 'password' => 'password'])
        ->assertRedirect(route('teacher.overview', absolute: false));

    $this->actingAs($teacher)
        ->get(route('teacher.overview'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('teacher/overview')
            ->where('stats.material_count', 0)
        );

    // ── 2. Teacher creates a material ───────────────────────────────────
    $this->actingAs($teacher)
        ->post(route('learning-material.store'), [
            'name' => 'Pecahan Dasar',
            'subject_id' => $subject->id,
            'description' => 'Pengenalan pecahan.',
        ])
        ->assertRedirect(route('teacher.learning-material'));

    $material = LearningMaterial::firstWhere('name', 'Pecahan Dasar');
    expect($material->created_by)->toBe($teacher->id);

    // ── 3. Teacher adds two questions ───────────────────────────────────
    foreach ([['1/2 + 1/2 = ?', 1], ['2/4 setara dengan?', 3]] as [$text, $correctIndex]) {
        $this->actingAs($teacher)->post(route('question.store'), [
            'learning_material_id' => $material->id,
            'question_text' => $text,
            'answers' => collect(range(0, 3))
                ->map(fn (int $i) => ['text' => "Opsi {$i}", 'is_correct' => $i === $correctIndex])
                ->all(),
        ])->assertSessionHasNoErrors();
    }

    expect($material->questions()->count())->toBe(2);

    // ── 4. Teacher's dashboard reflects the new content ─────────────────
    $this->actingAs($teacher)
        ->get(route('teacher.overview'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('stats.material_count', 1)
            ->where('stats.question_count', 2)
        );

    // ── 5. Student browses the catalogue and opens the material ─────────
    $this->actingAs($student)
        ->get(route('user.learning-material'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('user/learning-material/page')
            ->has('materials', 1)
            ->where('materials.0.question_count', 2)
        );

    $this->actingAs($student)
        ->get(route('user.learning-material.show', $material))
        ->assertInertia(fn (Assert $page) => $page
            ->component('user/learning-material/show')
            ->where('material.creator_name', $teacher->name)
            ->where('inProgressAttemptId', null)
        );

    // ── 6. Student starts the quiz ──────────────────────────────────────
    $this->actingAs($student)->post(route('user.quiz.start', $material));

    $attempt = QuizAttempt::firstWhere('user_id', $student->id);
    expect($attempt->status)->toBe(QuizAttempt::STATUS_IN_PROGRESS);

    // The answer key must not be in the payload the student receives.
    $this->actingAs($student)
        ->get(route('user.quiz.show', $attempt))
        ->assertInertia(fn (Assert $page) => $page
            ->has('questions', 2)
            ->missing('questions.0.answers.0.is_correct')
        );

    // ── 7. Student answers one right, one wrong ─────────────────────────
    $questions = $material->questions()->with('answers')->orderBy('id')->get();

    $this->actingAs($student)->post(route('user.quiz.submit', $attempt), [
        'answers' => [
            [
                'question_id' => $questions[0]->id,
                'answer_id' => $questions[0]->answers->firstWhere('is_correct', true)->id,
            ],
            [
                'question_id' => $questions[1]->id,
                'answer_id' => $questions[1]->answers->firstWhere('is_correct', false)->id,
            ],
        ],
    ])->assertRedirect(route('user.quiz.result', $attempt));

    expect($attempt->refresh()->score)->toBe(50);

    // ── 8. Student sees the graded result with the key revealed ─────────
    $this->actingAs($student)
        ->get(route('user.quiz.result', $attempt))
        ->assertInertia(fn (Assert $page) => $page
            ->component('user/questions/result')
            ->where('result.score', 50)
            ->where('result.correct_count', 1)
            ->where('result.results.0.is_correct', true)
            ->where('result.results.1.is_correct', false)
        );

    // ── 9. It shows up in history and on the overview ───────────────────
    $this->actingAs($student)
        ->get(route('user.history'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('attempts', 1)
            ->where('attempts.0.score', 50)
            ->where('attempts.0.material.name', 'Pecahan Dasar')
        );

    $this->actingAs($student)
        ->get(route('user.overview'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('stats.completed_quiz_count', 1)
            ->where('stats.average_score', 50)
        );

    // ── 10. The teacher sees the student's attempt ──────────────────────
    $this->actingAs($teacher)
        ->get(route('teacher.overview'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('stats.attempt_count', 1)
            ->where('recentAttempts.0.student_name', $student->name)
            ->where('recentAttempts.0.score', 50)
        );
});

test('the admin dashboard reports real counts and logged activity', function () {
    $admin = User::factory()->admin()->create();
    $teacher = User::factory()->teacher()->create();
    $subject = Subject::factory()->create();

    $this->actingAs($teacher)->post(route('learning-material.store'), [
        'name' => 'Materi Dashboard',
        'subject_id' => $subject->id,
    ]);

    $this->actingAs($admin)
        ->get(route('admin.dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->where('stats.material_count', 1)
            ->where('stats.new_material_count', 1)
            // ActivityObserver records both user creations and the material.
            ->has('activities')
        );

    // The activity feed is real data now, not factory noise.
    $this->assertDatabaseHas('activities', [
        'type' => 'learning_material',
        'action' => 'created',
        'description' => 'Materi "Materi Dashboard" ditambahkan.',
    ]);
});

test('a deactivated material disappears from the student catalogue', function () {
    $admin = User::factory()->admin()->create();
    $student = User::factory()->student()->create();

    $material = LearningMaterial::factory()->create();
    Question::factory()->withAnswers()->create(['learning_material_id' => $material->id]);

    $this->actingAs($student)
        ->get(route('user.learning-material'))
        ->assertInertia(fn (Assert $page) => $page->has('materials', 1));

    $this->actingAs($admin)->patch(route('learning-material.toggle', $material), ['is_deleted' => true]);

    $this->actingAs($student)
        ->get(route('user.learning-material'))
        ->assertInertia(fn (Assert $page) => $page->has('materials', 0));

    // Direct access is refused too, and a quiz cannot be started on it.
    $this->actingAs($student)->get(route('user.learning-material.show', $material))->assertNotFound();
    $this->actingAs($student)
        ->post(route('user.quiz.start', $material))
        ->assertSessionHasErrors('learning_material_id');
});

test('the public landing page exposes counts but never the question bank', function () {
    $material = LearningMaterial::factory()->create();
    Question::factory()->withAnswers()->create(['learning_material_id' => $material->id]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->where('stats.material_count', 1)
            ->where('stats.question_count', 1)
            ->has('subjects')
            // Aggregates only: no questions or answers reach a guest.
            ->missing('questions')
            ->missing('materials')
        );
});
