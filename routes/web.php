<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


Route::get('/settings/profile', function () {
    return Inertia::render('settings/profile');
})->name('settings.profile');

Route::get('/settings/password', function () {
    return Inertia::render('settings/password');
})->name('settings.password');

Route::get('/settings/appearance', function () {
    return Inertia::render('settings/appearance');
})->name('settings.appearance');

Route::get('/profile/{id}', function ($id) {
    return Inertia::render('profile/detail', [
        'id' => $id,
    ]);
});

Route::get('/profile/edit/{id}', function ($id) {
    return Inertia::render('profile/edit', [
        'id' => $id,
    ]);
});

Route::get('/learning-material/{id}', function ($id) {
    return Inertia::render('learning-material/detail', [
        'id' => $id,
    ]);
});

Route::get('/learning-material/edit/{id}', function ($id) {
    return Inertia::render('learning-material/edit', [
        'id' => $id,
    ]);
});


Route::get('/auth/login', function () {
    return Inertia::render('auth/login');
})->name('login');

Route::get('/auth/register', function () {
    return Inertia::render('auth/register');
})->name('register');


//Admin Routes
Route::get('/admin/dashboard', function () {
    return Inertia::render('admin/dashboard');
});

Route::get('/admin/user', function () {
    return Inertia::render('admin/user');
});

Route::get('/admin/learning-material', function () {
    return Inertia::render('admin/learning-material');
});

Route::get('/admin/other', function () {
    return Inertia::render('admin/other');
});

//Teacher Routes
Route::get('/teacher/overview', function () {
    return Inertia::render('teacher/overview');
});

//User Routes
Route::get('/user/overview', function () {
    return Inertia::render('user/overview');
});
