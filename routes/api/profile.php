<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ProfileController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profiles', [ProfileController::class, 'index']);
    Route::put('/profiles/{id}', [ProfileController::class, 'update']);
    Route::get('/profiles/{id}', [ProfileController::class, 'show']);
    Route::delete('/profiles/{id}', [ProfileController::class, 'destroy']);
});
