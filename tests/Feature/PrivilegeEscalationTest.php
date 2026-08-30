<?php

use App\Models\City;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('a user cannot change their own role through profile settings', function () {
    $student = User::factory()->student()->create();
    $student->profile()->create(['is_deleted' => false]);

    $this->actingAs($student)
        ->patch(route('settings.profile.update'), [
            'name' => 'Masih Siswa',
            'email' => $student->email,
            'role' => 'admin',
        ])
        ->assertSessionHasNoErrors();

    // The name change goes through; the role does not.
    expect($student->refresh()->name)->toBe('Masih Siswa');
    expect($student->role)->toBe(User::ROLE_USER);
});

test('a user cannot promote themselves through the admin endpoint', function () {
    $student = User::factory()->student()->create();

    $this->actingAs($student)
        ->patch(route('admin.user.update', $student), ['role' => 'admin'])
        ->assertForbidden();

    expect($student->refresh()->role)->toBe(User::ROLE_USER);
});

test('a teacher cannot promote anyone', function () {
    $teacher = User::factory()->teacher()->create();
    $student = User::factory()->student()->create();

    $this->actingAs($teacher)
        ->patch(route('admin.user.update', $student), ['role' => 'admin'])
        ->assertForbidden();

    expect($student->refresh()->role)->toBe(User::ROLE_USER);
});

test('an admin can change a role to a valid value only', function () {
    $admin = User::factory()->admin()->create();
    $student = User::factory()->student()->create();
    $student->profile()->create(['is_deleted' => false]);

    $this->actingAs($admin)
        ->patch(route('admin.user.update', $student), ['role' => 'teacher'])
        ->assertSessionHasNoErrors();

    expect($student->refresh()->role)->toBe(User::ROLE_TEACHER);

    // 'student' is not a role this application recognises.
    $this->actingAs($admin)
        ->patch(route('admin.user.update', $student), ['role' => 'student'])
        ->assertSessionHasErrors('role');

    expect($student->refresh()->role)->toBe(User::ROLE_TEACHER);
});

test('a user cannot change another user\'s email through their own settings', function () {
    $student = User::factory()->student()->create();
    $victim = User::factory()->student()->create(['email' => 'victim@example.com']);
    $student->profile()->create(['is_deleted' => false]);

    // Taking an address already in use must fail.
    $this->actingAs($student)
        ->patch(route('settings.profile.update'), [
            'name' => $student->name,
            'email' => 'victim@example.com',
        ])
        ->assertSessionHasErrors('email');

    expect($victim->refresh()->email)->toBe('victim@example.com');
});

test('an admin cannot delete their own account through user management', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->delete(route('admin.user.destroy', $admin))
        ->assertSessionHasErrors('user');

    expect(User::find($admin->id))->not->toBeNull();
});

test('self registration ignores a supplied role', function () {
    $this->post(route('register'), [
        'name' => 'Calon Admin',
        'email' => 'calon@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role' => 'admin',
    ]);

    expect(User::where('email', 'calon@example.com')->first()->role)->toBe(User::ROLE_USER);
});

test('admin user creation validates the role', function () {
    $admin = User::factory()->admin()->create();
    City::factory()->create();

    $this->actingAs($admin)
        ->post(route('admin.user.store'), [
            'name' => 'Guru Baru',
            'email' => 'guru@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'role' => 'superuser',
        ])
        ->assertSessionHasErrors('role');

    expect(User::where('email', 'guru@example.com')->exists())->toBeFalse();
});
