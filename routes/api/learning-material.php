<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\LearningMaterialController;
use App\Http\Middleware\RoleMiddleware;

Route::get('/learning-materials', [LearningMaterialController::class, 'index']);

Route::middleware(['auth:sanctum', RoleMiddleware::class . ':admin'])->group(function () {
    Route::get('/learning-materials/latest', [LearningMaterialController::class, 'latest']);
    Route::post('/learning-material', [LearningMaterialController::class, 'store']);
    Route::get('/learning-materials/{id}', [LearningMaterialController::class, 'show']);
    Route::patch('/learning-materials/{id}', [LearningMaterialController::class, 'update']);
    Route::delete('/learning-materials/{id}', [LearningMaterialController::class, 'destroy']);
});
