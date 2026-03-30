<?php

use App\Http\Controllers\SubjectController;
use App\Http\Controllers\LearningMaterialController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\ActivityController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/getUsers', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//Subject Routes
Route::get('/getSubjects', [SubjectController::class, 'index']);

//Learning Material Routes
Route::get('/getLearningMaterials', [LearningMaterialController::class, 'index']);

//Question Routes
Route::get('/getQuestions', [QuestionController::class, 'index']);

//Activity Routes
Route::get('/getActivities', [ActivityController::class, 'index']);
