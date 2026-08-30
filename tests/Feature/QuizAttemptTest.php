<?php

use App\Models\LearningMaterial;
use App\Models\Question;
use App\Models\QuizAttempt;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

/**
 * Builds a material with the given number of questions, each carrying four
 * answers where the first option is the correct one.
 */
function materialWithQuestions(int $count = 3): LearningMaterial
{
    $material = LearningMaterial::factory()->create();

    Question::factory()
        ->count($count)
        ->withAnswers(correctIndex: 0)
        ->create(['learning_material_id' => $material->id]);

    return $material->refresh();
}

test('a student can start an attempt for a material that has questions', function () {
    $student = User::factory()->student()->create();
    $material = materialWithQuestions();

    $response = $this->actingAs($student)->post(route('user.quiz.start', $material));

    $attempt = QuizAttempt::first();

    expect($attempt)->not->toBeNull();
    expect($attempt->user_id)->toBe($student->id);
    expect($attempt->score)->toBe(0);
    expect($attempt->status)->toBe(QuizAttempt::STATUS_IN_PROGRESS);

    $response->assertRedirect(route('user.quiz.show', $attempt));
});

test('starting an attempt twice resumes the existing one instead of duplicating', function () {
    $student = User::factory()->student()->create();
    $material = materialWithQuestions();

    $this->actingAs($student)->post(route('user.quiz.start', $material));
    $this->actingAs($student)->post(route('user.quiz.start', $material));

    expect(QuizAttempt::count())->toBe(1);
});

test('an attempt cannot be started for a material with no questions', function () {
    $student = User::factory()->student()->create();
    $material = LearningMaterial::factory()->create();

    $this->actingAs($student)
        ->post(route('user.quiz.start', $material))
        ->assertSessionHasErrors('learning_material_id');

    expect(QuizAttempt::count())->toBe(0);
});

test('the question screen never exposes the answer key', function () {
    $student = User::factory()->student()->create();
    $material = materialWithQuestions();
    $attempt = QuizAttempt::factory()->create([
        'user_id' => $student->id,
        'learning_material_id' => $material->id,
    ]);

    $this->actingAs($student)
        ->get(route('user.quiz.show', $attempt))
        ->assertInertia(fn (Assert $page) => $page
            ->component('user/questions/page')
            ->has('questions', 3)
            ->has('questions.0.answers', 4)
            ->missing('questions.0.answers.0.is_correct')
        );
});

test('submitting all correct answers scores 100', function () {
    $student = User::factory()->student()->create();
    $material = materialWithQuestions();
    $attempt = QuizAttempt::factory()->create([
        'user_id' => $student->id,
        'learning_material_id' => $material->id,
    ]);

    $answers = $material->questions->map(fn (Question $question) => [
        'question_id' => $question->id,
        'answer_id' => $question->answers->firstWhere('is_correct', true)->id,
    ])->all();

    $this->actingAs($student)
        ->post(route('user.quiz.submit', $attempt), ['answers' => $answers])
        ->assertRedirect(route('user.quiz.result', $attempt));

    $attempt->refresh();

    expect($attempt->score)->toBe(100);
    expect($attempt->status)->toBe(QuizAttempt::STATUS_SUBMITTED);
    expect($attempt->submitted_at)->not->toBeNull();
});

test('score reflects the proportion of correct answers', function () {
    $student = User::factory()->student()->create();
    $material = materialWithQuestions(4);
    $attempt = QuizAttempt::factory()->create([
        'user_id' => $student->id,
        'learning_material_id' => $material->id,
    ]);

    // Answer the first two correctly, the rest wrongly.
    $answers = $material->questions->values()->map(function (Question $question, int $index) {
        $answer = $index < 2
            ? $question->answers->firstWhere('is_correct', true)
            : $question->answers->firstWhere('is_correct', false);

        return ['question_id' => $question->id, 'answer_id' => $answer->id];
    })->all();

    $this->actingAs($student)->post(route('user.quiz.submit', $attempt), ['answers' => $answers]);

    expect($attempt->refresh()->score)->toBe(50);
});

test('unanswered questions are graded as incorrect', function () {
    $student = User::factory()->student()->create();
    $material = materialWithQuestions(2);
    $attempt = QuizAttempt::factory()->create([
        'user_id' => $student->id,
        'learning_material_id' => $material->id,
    ]);

    $first = $material->questions->first();

    $this->actingAs($student)->post(route('user.quiz.submit', $attempt), [
        'answers' => [
            ['question_id' => $first->id, 'answer_id' => $first->answers->firstWhere('is_correct', true)->id],
        ],
    ]);

    expect($attempt->refresh()->score)->toBe(50);

    // Every question is still recorded, the missing one with a null answer.
    expect($attempt->checkingAnswers()->count())->toBe(2);
    expect($attempt->checkingAnswers()->whereNull('answer_id')->count())->toBe(1);
});

test('an answer belonging to another question does not earn a point', function () {
    $student = User::factory()->student()->create();
    $material = materialWithQuestions(2);
    $attempt = QuizAttempt::factory()->create([
        'user_id' => $student->id,
        'learning_material_id' => $material->id,
    ]);

    $questions = $material->questions->values();
    $first = $questions[0];
    $second = $questions[1];

    // Send the second question's correct answer under the first question's id.
    $this->actingAs($student)->post(route('user.quiz.submit', $attempt), [
        'answers' => [
            ['question_id' => $first->id, 'answer_id' => $second->answers->firstWhere('is_correct', true)->id],
            ['question_id' => $second->id, 'answer_id' => $second->answers->firstWhere('is_correct', true)->id],
        ],
    ]);

    expect($attempt->refresh()->score)->toBe(50);
});

test('a submitted attempt cannot be submitted again', function () {
    $student = User::factory()->student()->create();
    $material = materialWithQuestions(1);
    $attempt = QuizAttempt::factory()->submitted(score: 100)->create([
        'user_id' => $student->id,
        'learning_material_id' => $material->id,
    ]);

    $this->actingAs($student)
        ->post(route('user.quiz.submit', $attempt), ['answers' => []])
        ->assertForbidden();
});

test('a student cannot view or submit another student\'s attempt', function () {
    $owner = User::factory()->student()->create();
    $intruder = User::factory()->student()->create();
    $material = materialWithQuestions(1);

    $attempt = QuizAttempt::factory()->create([
        'user_id' => $owner->id,
        'learning_material_id' => $material->id,
    ]);

    $this->actingAs($intruder)->get(route('user.quiz.show', $attempt))->assertForbidden();
    $this->actingAs($intruder)->post(route('user.quiz.submit', $attempt), ['answers' => []])->assertForbidden();
    $this->actingAs($intruder)->get(route('user.quiz.result', $attempt))->assertForbidden();
});

test('visiting an in-progress attempt result redirects back to the questions', function () {
    $student = User::factory()->student()->create();
    $material = materialWithQuestions(1);
    $attempt = QuizAttempt::factory()->create([
        'user_id' => $student->id,
        'learning_material_id' => $material->id,
    ]);

    $this->actingAs($student)
        ->get(route('user.quiz.result', $attempt))
        ->assertRedirect(route('user.quiz.show', $attempt));
});

test('visiting a submitted attempt question screen redirects to the result', function () {
    $student = User::factory()->student()->create();
    $material = materialWithQuestions(1);
    $attempt = QuizAttempt::factory()->submitted()->create([
        'user_id' => $student->id,
        'learning_material_id' => $material->id,
    ]);

    $this->actingAs($student)
        ->get(route('user.quiz.show', $attempt))
        ->assertRedirect(route('user.quiz.result', $attempt));
});

test('the result page reveals the answer key after grading', function () {
    $student = User::factory()->student()->create();
    $material = materialWithQuestions(2);
    $attempt = QuizAttempt::factory()->create([
        'user_id' => $student->id,
        'learning_material_id' => $material->id,
    ]);

    $answers = $material->questions->map(fn (Question $question) => [
        'question_id' => $question->id,
        'answer_id' => $question->answers->firstWhere('is_correct', true)->id,
    ])->all();

    $this->actingAs($student)->post(route('user.quiz.submit', $attempt), ['answers' => $answers]);

    $this->actingAs($student)
        ->get(route('user.quiz.result', $attempt))
        ->assertInertia(fn (Assert $page) => $page
            ->component('user/questions/result')
            ->where('result.score', 100)
            ->where('result.correct_count', 2)
            ->where('result.total', 2)
            ->has('result.results', 2)
            ->whereNot('result.results.0.correct_answer_id', null)
        );
});

test('the result survives a page reload', function () {
    $student = User::factory()->student()->create();
    $material = materialWithQuestions(1);
    $attempt = QuizAttempt::factory()->create([
        'user_id' => $student->id,
        'learning_material_id' => $material->id,
    ]);

    $question = $material->questions->first();

    $this->actingAs($student)->post(route('user.quiz.submit', $attempt), [
        'answers' => [['question_id' => $question->id, 'answer_id' => $question->answers->firstWhere('is_correct', true)->id]],
    ]);

    // Two independent GETs must both return the graded result.
    foreach (range(1, 2) as $ignored) {
        $this->actingAs($student)
            ->get(route('user.quiz.result', $attempt))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->where('result.score', 100));
    }
});

test('quiz routes are closed to teachers and admins', function () {
    $material = materialWithQuestions(1);

    foreach ([User::factory()->teacher()->create(), User::factory()->admin()->create()] as $user) {
        $this->actingAs($user)
            ->post(route('user.quiz.start', $material))
            ->assertForbidden();
    }
});

test('the history page lists the student\'s own attempts only', function () {
    $student = User::factory()->student()->create();
    $other = User::factory()->student()->create();

    QuizAttempt::factory()->submitted(score: 80)->count(2)->create(['user_id' => $student->id]);
    QuizAttempt::factory()->submitted(score: 40)->create(['user_id' => $other->id]);

    $this->actingAs($student)
        ->get(route('user.history'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('user/history')
            ->has('attempts', 2)
        );
});
