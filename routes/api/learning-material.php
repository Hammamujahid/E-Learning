<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\LearningMaterialController;
use App\Http\Middleware\RoleMiddleware;

Route::get('/learning-materials', [LearningMaterialController::class, 'index']);

Route::middleware(['auth:sanctum', RoleMiddleware::class . ':admin'])->group(function () {

    Route::get('/learning-materials/latest', [LearningMaterialController::class, 'latest']);
});
