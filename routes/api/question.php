<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\QuestionController;
use App\Http\Middleware\RoleMiddleware;

Route::get('/questions', [QuestionController::class, 'index']);

Route::middleware(['auth:sanctum', RoleMiddleware::class . ':admin'])->group(function () {

    Route::get('/questions/latest', [QuestionController::class, 'latest']);
});
