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

    Route::get('learning-material', function(){
        return Inertia::render('admin/learning-material');
    })->name('admin.learning-material');
});

Route::middleware(['auth', 'verified', RoleMiddleware::class . ':user'])->group(function () {
    Route::get('home', function () {
        return Inertia::render('user/home');
    })->name('user.home');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
