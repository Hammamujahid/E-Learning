<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\SubjectController;

Route::get('/subjects', [SubjectController::class, 'index']);
Route::post('/subject', [SubjectController::class, 'store']);
Route::get('/subjects/{id}', [SubjectController::class, 'show']);
Route::patch('/subjects/{id}', [SubjectController::class, 'update']);
Route::delete('/subjects/{id}', [SubjectController::class, 'destroy']);
