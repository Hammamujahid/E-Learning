<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $this->get('/dashboard')->assertRedirect('/auth/login');
});

test('the dashboard route sends each role to its own landing page', function () {
    $this->actingAs(User::factory()->admin()->create());
    $this->get('/dashboard')->assertRedirect(route('admin.dashboard', absolute: false));

    $this->actingAs(User::factory()->teacher()->create());
    $this->get('/dashboard')->assertRedirect(route('teacher.overview', absolute: false));

    $this->actingAs(User::factory()->student()->create());
    $this->get('/dashboard')->assertRedirect(route('user.overview', absolute: false));
});
