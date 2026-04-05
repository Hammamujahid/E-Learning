<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UserController;
use App\Http\Middleware\RoleMiddleware;

Route::middleware(['auth:sanctum', RoleMiddleware::class . ':admin'])->group(function () {

    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/latest', [UserController::class, 'latest']);
    Route::post('/user', [UserController::class, 'store']);
    Route::patch('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});
