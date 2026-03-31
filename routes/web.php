<?php

use App\Http\Middleware\RoleMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified', RoleMiddleware::class . ':admin'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('admin.dashboard');

    Route::get('user', function () {
        return Inertia::render('admin/user');
    })->name('admin.user');

    Route::get('learning-material', function () {
        return Inertia::render('admin/learning-material');
    })->name('admin.learning-material');

    Route::get('question', function () {
        return Inertia::render('admin/question');
    })->name('admin.question');
});

Route::middleware(['auth', 'verified', RoleMiddleware::class . ':user'])->group(function () {
    Route::get('overview', function () {
        return Inertia::render('user/overview');
    })->name('user.overview');
});

Route::middleware(['auth', 'verified', RoleMiddleware::class . ':teacher'])->group(function () {
    Route::get('overview', function () {
        return Inertia::render('teacher/overview');
    })->name('teacher.overview');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
