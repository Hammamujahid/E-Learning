<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ActivityController;
use App\Http\Middleware\RoleMiddleware;

Route::middleware(['auth:sanctum', RoleMiddleware::class . ':admin'])->group(function () {

    Route::get('/activities', [ActivityController::class, 'index']);
    Route::get('/activities/{id}', [ActivityController::class, 'show']);
});
