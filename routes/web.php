<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


Route::get('/settings/profile', function(){
    return Inertia::render('settings/profile');
})->name('settings.profile');

Route::get('/settings/password', function(){
    return Inertia::render('settings/password');
})->name('settings.password');

Route::get('/settings/appearance', function(){
    return Inertia::render('settings/appearance');
})->name('settings.appearance');


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

Route::get('/admin/question', function () {
    return Inertia::render('admin/question');
});

//Teacher Routes
Route::get('/teacher/overview', function () {
    return Inertia::render('teacher/overview');
});

//User Routes
Route::get('/user/overview', function () {
    return Inertia::render('user/overview');
});

