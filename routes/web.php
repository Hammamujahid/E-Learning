<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LearningMaterialController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', [DashboardController::class, 'welcome'])->name('home');

/*
|--------------------------------------------------------------------------
| Role-aware landing page
|--------------------------------------------------------------------------
| A single named target the auth controllers can redirect to without
| needing to know which role just signed in.
*/
Route::get('/dashboard', function () {
    return redirect(AuthenticatedSessionController::homeRouteFor(request()->user()?->role));
})->middleware('auth')->name('dashboard');

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'admin'])->name('dashboard');

    Route::get('user', [UserController::class, 'index'])->name('user');
    Route::get('learning-material', [LearningMaterialController::class, 'index'])->name('learning-material');

    // Subjects and cities share one "Lainnya" screen.
    Route::get('other', [SubjectController::class, 'index'])->name('other');
});

/*
|--------------------------------------------------------------------------
| Teacher
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:teacher'])->prefix('teacher')->name('teacher.')->group(function () {
    Route::get('overview', [DashboardController::class, 'teacher'])->name('overview');
    Route::get('learning-material', [LearningMaterialController::class, 'index'])->name('learning-material');
});

/*
|--------------------------------------------------------------------------
| Learning material & question management (admin and teacher)
|--------------------------------------------------------------------------
| Per-record ownership is enforced by LearningMaterialPolicy / QuestionPolicy,
| so teachers may only touch what they authored.
*/
Route::middleware(['auth', 'role:admin,teacher'])->group(function () {
    Route::post('learning-material', [LearningMaterialController::class, 'store'])->name('learning-material.store');
    Route::get('learning-material/{learningMaterial}', [LearningMaterialController::class, 'show'])->name('learning-material.show');
    Route::get('learning-material/{learningMaterial}/edit', [LearningMaterialController::class, 'edit'])->name('learning-material.edit');
    Route::post('learning-material/{learningMaterial}', [LearningMaterialController::class, 'update'])->name('learning-material.update');
    Route::patch('learning-material/{learningMaterial}/toggle', [LearningMaterialController::class, 'toggle'])->name('learning-material.toggle');
    Route::delete('learning-material/{learningMaterial}', [LearningMaterialController::class, 'destroy'])->name('learning-material.destroy');

    Route::post('question', [QuestionController::class, 'store'])->name('question.store');
    Route::post('question/{question}', [QuestionController::class, 'update'])->name('question.update');
    Route::delete('question/{question}', [QuestionController::class, 'destroy'])->name('question.destroy');
});

/*
|--------------------------------------------------------------------------
| User & reference data management (admin only)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::post('users', [UserController::class, 'store'])->name('user.store');
    Route::get('users/{user}', [UserController::class, 'show'])->name('user.show');
    Route::get('users/{user}/edit', [UserController::class, 'edit'])->name('user.edit');
    Route::patch('users/{user}', [UserController::class, 'update'])->name('user.update');
    Route::patch('users/{user}/toggle', [UserController::class, 'toggle'])->name('user.toggle');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('user.destroy');

    Route::post('subjects', [SubjectController::class, 'store'])->name('subject.store');
    Route::patch('subjects/{subject}', [SubjectController::class, 'update'])->name('subject.update');
    Route::delete('subjects/{subject}', [SubjectController::class, 'destroy'])->name('subject.destroy');

    Route::post('cities', [CityController::class, 'store'])->name('city.store');
    Route::patch('cities/{city}', [CityController::class, 'update'])->name('city.update');
    Route::delete('cities/{city}', [CityController::class, 'destroy'])->name('city.destroy');
});

/*
|--------------------------------------------------------------------------
| Student
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:user'])->prefix('user')->name('user.')->group(function () {
    Route::get('overview', [StudentController::class, 'overview'])->name('overview');

    Route::get('learning-material', [StudentController::class, 'index'])->name('learning-material');
    Route::get('learning-material/{learningMaterial}', [StudentController::class, 'show'])->name('learning-material.show');

    Route::get('history', [QuizController::class, 'history'])->name('history');

    Route::post('quiz/{learningMaterial}/start', [QuizController::class, 'start'])->name('quiz.start');
    Route::get('quiz/{quizAttempt}', [QuizController::class, 'show'])->name('quiz.show');
    Route::post('quiz/{quizAttempt}/submit', [QuizController::class, 'submit'])->name('quiz.submit');
    Route::get('quiz/{quizAttempt}/result', [QuizController::class, 'result'])->name('quiz.result');
});

require __DIR__.'/auth.php';
require __DIR__.'/settings.php';
