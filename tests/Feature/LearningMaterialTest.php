<?php

use App\Models\Answer;
use App\Models\LearningMaterial;
use App\Models\Question;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

/**
 * @return array<int, array{text: string, is_correct: bool}>
 */
function answerPayload(int $correctIndex = 0): array
{
    return collect(range(0, 3))
        ->map(fn (int $i) => ['text' => "Jawaban {$i}", 'is_correct' => $i === $correctIndex])
        ->all();
}

test('a teacher can create a question with four answers', function () {
    $teacher = User::factory()->teacher()->create();
    $material = LearningMaterial::factory()->create(['created_by' => $teacher->id]);

    $this->actingAs($teacher)
        ->post(route('question.store'), [
            'learning_material_id' => $material->id,
            'question_text' => 'Apa ibu kota Indonesia?',
            'answers' => answerPayload(correctIndex: 2),
        ])
        ->assertSessionHasNoErrors();

    $question = Question::first();

    expect($question->question_text)->toBe('Apa ibu kota Indonesia?');
    // Authorship comes from the session, never the request body.
    expect($question->created_by)->toBe($teacher->id);
    expect($question->answers)->toHaveCount(4);
    expect($question->answers->where('is_correct', true))->toHaveCount(1);
    expect($question->answers->firstWhere('is_correct', true)->answer_text)->toBe('Jawaban 2');
});

test('a question is rejected without exactly one correct answer', function () {
    $teacher = User::factory()->teacher()->create();
    $material = LearningMaterial::factory()->create(['created_by' => $teacher->id]);

    // No correct answer at all.
    $noneCorrect = collect(range(0, 3))->map(fn ($i) => ['text' => "J{$i}", 'is_correct' => false])->all();

    $this->actingAs($teacher)
        ->post(route('question.store'), [
            'learning_material_id' => $material->id,
            'question_text' => 'Soal',
            'answers' => $noneCorrect,
        ])
        ->assertSessionHasErrors('answers');

    // Two correct answers.
    $twoCorrect = collect(range(0, 3))->map(fn ($i) => ['text' => "J{$i}", 'is_correct' => $i < 2])->all();

    $this->actingAs($teacher)
        ->post(route('question.store'), [
            'learning_material_id' => $material->id,
            'question_text' => 'Soal',
            'answers' => $twoCorrect,
        ])
        ->assertSessionHasErrors('answers');

    expect(Question::count())->toBe(0);
});

test('a question is rejected without exactly four answers', function () {
    $teacher = User::factory()->teacher()->create();
    $material = LearningMaterial::factory()->create(['created_by' => $teacher->id]);

    $this->actingAs($teacher)
        ->post(route('question.store'), [
            'learning_material_id' => $material->id,
            'question_text' => 'Soal',
            'answers' => [
                ['text' => 'A', 'is_correct' => true],
                ['text' => 'B', 'is_correct' => false],
            ],
        ])
        ->assertSessionHasErrors('answers');

    expect(Question::count())->toBe(0);
});

test('updating a question rewrites its answers', function () {
    $teacher = User::factory()->teacher()->create();
    $material = LearningMaterial::factory()->create(['created_by' => $teacher->id]);
    $question = Question::factory()->withAnswers(correctIndex: 0)->create([
        'learning_material_id' => $material->id,
        'created_by' => $teacher->id,
    ]);

    $answers = $question->answers->values()->map(fn (Answer $answer, int $index) => [
        'id' => $answer->id,
        'text' => "Diperbarui {$index}",
        'is_correct' => $index === 3,
    ])->all();

    $this->actingAs($teacher)
        ->post(route('question.update', $question), [
            'question_text' => 'Teks diperbarui',
            'answers' => $answers,
        ])
        ->assertSessionHasNoErrors();

    $question->refresh()->load('answers');

    expect($question->question_text)->toBe('Teks diperbarui');
    expect($question->answers->firstWhere('is_correct', true)->answer_text)->toBe('Diperbarui 3');
});

test('deleting a question flags it rather than removing the row', function () {
    $teacher = User::factory()->teacher()->create();
    $question = Question::factory()->withAnswers()->create([
        'learning_material_id' => LearningMaterial::factory()->create(['created_by' => $teacher->id])->id,
        'created_by' => $teacher->id,
    ]);

    $this->actingAs($teacher)->delete(route('question.destroy', $question));

    // The row survives so submitted attempts keep their references.
    $this->assertDatabaseHas('questions', ['id' => $question->id, 'is_deleted' => true]);
    expect(Question::find($question->id))->toBeNull();
    expect(Question::withDeleted()->find($question->id))->not->toBeNull();
});

test('a material requires a name and a valid subject', function () {
    $teacher = User::factory()->teacher()->create();

    $this->actingAs($teacher)
        ->post(route('learning-material.store'), ['name' => '', 'subject_id' => 999])
        ->assertSessionHasErrors(['name', 'subject_id']);

    expect(LearningMaterial::count())->toBe(0);
});

test('material names must be unique', function () {
    $teacher = User::factory()->teacher()->create();
    $subject = Subject::factory()->create();
    LearningMaterial::factory()->create(['name' => 'Materi Sama']);

    $this->actingAs($teacher)
        ->post(route('learning-material.store'), [
            'name' => 'Materi Sama',
            'subject_id' => $subject->id,
        ])
        ->assertSessionHasErrors('name');
});

test('a created material is attributed to the signed-in user', function () {
    $teacher = User::factory()->teacher()->create();
    $subject = Subject::factory()->create();
    $someoneElse = User::factory()->teacher()->create();

    $this->actingAs($teacher)->post(route('learning-material.store'), [
        'name' => 'Materi Baru',
        'subject_id' => $subject->id,
        'description' => 'Deskripsi',
        // A forged author id must be ignored.
        'created_by' => $someoneElse->id,
    ]);

    expect(LearningMaterial::first()->created_by)->toBe($teacher->id);
});

test('deleting a material flags it rather than removing the row', function () {
    $admin = User::factory()->admin()->create();
    $material = LearningMaterial::factory()->create();

    $this->actingAs($admin)->delete(route('learning-material.destroy', $material));

    $this->assertDatabaseHas('learning_materials', ['id' => $material->id, 'is_deleted' => true]);
    expect(LearningMaterial::find($material->id))->toBeNull();
});

test('a deactivated material can be reactivated', function () {
    $admin = User::factory()->admin()->create();
    $material = LearningMaterial::factory()->deleted()->create();

    $this->actingAs($admin)->patch(route('learning-material.toggle', $material), ['is_deleted' => false]);

    expect(LearningMaterial::find($material->id))->not->toBeNull();
});
