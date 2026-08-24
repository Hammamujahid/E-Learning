<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\QuizAttemptController;
use App\Http\Middleware\RoleMiddleware;

Route::middleware(['auth:sanctum', RoleMiddleware::class . ':user'])->group(function () {
    Route::post('/quiz-attempt', [QuizAttemptController::class, 'store']);
    Route::get('/quiz-attempt/{id}', [QuizAttemptController::class, 'show']);
});
