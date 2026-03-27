<?php

use App\Http\Controllers\SubjectController;
use App\Http\Controllers\LearningMaterialController;
use App\Http\Controllers\QuestionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//Subject Routes
Route::get('/subjects', [SubjectController::class, 'index']);

//Learning Material Routes
Route::get('/learning-materials', [LearningMaterialController::class, 'index']);

//Question Routes
Route::get('/questions', [QuestionController::class, 'index']);
