<?php

use App\Models\LearningMaterial;
use App\Models\Question;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('a teacher only sees the materials they authored', function () {
    $teacher = User::factory()->teacher()->create();
    $otherTeacher = User::factory()->teacher()->create();

    LearningMaterial::factory()->count(2)->create(['created_by' => $teacher->id]);
    LearningMaterial::factory()->count(3)->create(['created_by' => $otherTeacher->id]);

    $this->actingAs($teacher)
        ->get(route('teacher.learning-material'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('teacher/learning-material')
            ->has('materials', 2)
        );
});

test('an admin sees every material', function () {
    $admin = User::factory()->admin()->create();

    LearningMaterial::factory()->count(4)->create();

    $this->actingAs($admin)
        ->get(route('admin.learning-material'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/learning-material')
            ->has('materials', 4)
        );
});

test('a teacher can update and delete their own material', function () {
    $teacher = User::factory()->teacher()->create();
    $subject = Subject::factory()->create();
    $material = LearningMaterial::factory()->create(['created_by' => $teacher->id]);

    $this->actingAs($teacher)
        ->post(route('learning-material.update', $material), [
            'name' => 'Judul Baru',
            'subject_id' => $subject->id,
            'description' => 'Deskripsi baru',
        ])
        ->assertSessionHasNoErrors();

    expect($material->refresh()->name)->toBe('Judul Baru');

    $this->actingAs($teacher)->delete(route('learning-material.destroy', $material));

    expect($material->refresh()->is_deleted)->toBeTrue();
});

test('a teacher cannot touch another teacher\'s material', function () {
    $teacher = User::factory()->teacher()->create();
    $material = LearningMaterial::factory()->create(['created_by' => User::factory()->teacher()->create()->id]);

    $this->actingAs($teacher)
        ->post(route('learning-material.update', $material), ['name' => 'Dibajak'])
        ->assertForbidden();

    $this->actingAs($teacher)
        ->delete(route('learning-material.destroy', $material))
        ->assertForbidden();

    expect($material->refresh()->name)->not->toBe('Dibajak');
    expect($material->is_deleted)->toBeFalse();
});

test('an admin can update any material', function () {
    $admin = User::factory()->admin()->create();
    $subject = Subject::factory()->create();
    $material = LearningMaterial::factory()->create();

    $this->actingAs($admin)
        ->post(route('learning-material.update', $material), [
            'name' => 'Diedit Admin',
            'subject_id' => $subject->id,
        ])
        ->assertSessionHasNoErrors();

    expect($material->refresh()->name)->toBe('Diedit Admin');
});

test('a teacher cannot edit or delete another teacher\'s question', function () {
    $teacher = User::factory()->teacher()->create();
    $material = LearningMaterial::factory()->create();
    $question = Question::factory()->withAnswers()->create([
        'learning_material_id' => $material->id,
        'created_by' => User::factory()->teacher()->create()->id,
    ]);

    $answers = $question->answers->values()->map(fn ($answer, $index) => [
        'id' => $answer->id,
        'text' => 'Diubah',
        'is_correct' => $index === 0,
    ])->all();

    $this->actingAs($teacher)
        ->post(route('question.update', $question), [
            'question_text' => 'Dibajak',
            'answers' => $answers,
        ])
        ->assertForbidden();

    $this->actingAs($teacher)
        ->delete(route('question.destroy', $question))
        ->assertForbidden();

    expect($question->refresh()->question_text)->not->toBe('Dibajak');
    expect($question->is_deleted)->toBeFalse();
});

test('teachers are locked out of the admin area', function () {
    $teacher = User::factory()->teacher()->create();

    foreach (['admin.dashboard', 'admin.user', 'admin.learning-material', 'admin.other'] as $routeName) {
        $this->actingAs($teacher)->get(route($routeName))->assertForbidden();
    }
});

test('students are locked out of management screens', function () {
    $student = User::factory()->student()->create();
    $material = LearningMaterial::factory()->create();

    $this->actingAs($student)->get(route('admin.dashboard'))->assertForbidden();
    $this->actingAs($student)->get(route('teacher.overview'))->assertForbidden();
    $this->actingAs($student)->get(route('learning-material.show', $material))->assertForbidden();
    $this->actingAs($student)->post(route('learning-material.store'), [])->assertForbidden();
});

test('admins and teachers cannot reach student screens', function () {
    foreach ([User::factory()->admin()->create(), User::factory()->teacher()->create()] as $user) {
        $this->actingAs($user)->get(route('user.overview'))->assertForbidden();
        $this->actingAs($user)->get(route('user.learning-material'))->assertForbidden();
        $this->actingAs($user)->get(route('user.history'))->assertForbidden();
    }
});

test('guests are redirected away from every protected area', function () {
    foreach (['admin.dashboard', 'teacher.overview', 'user.overview'] as $routeName) {
        $this->get(route($routeName))->assertRedirect(route('login'));
    }
});
