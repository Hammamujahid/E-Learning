<?php

use App\Http\Controllers\SubjectController;
use App\Http\Controllers\LearningMaterialController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/getUsers', [UserController::class, 'index']);
Route::get('/getNewUsers', [UserController::class, 'getNewUsers']);

//Subject Routes
Route::get('/getSubjects', [SubjectController::class, 'index']);

//Learning Material Routes
Route::get('/getLearningMaterials', [LearningMaterialController::class, 'index']);
Route::get('/getNewLearningMaterials', [LearningMaterialController::class, 'getNewMaterials']);

//Question Routes
Route::get('/getQuestions', [QuestionController::class, 'index']);
Route::get('/getNewQuestions', [QuestionController::class, 'getNewQuestions']);

//Activity Routes
Route::get('/getActivities', [ActivityController::class, 'index']);
