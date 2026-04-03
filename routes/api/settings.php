<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\PasswordController;

Route::middleware('auth:sanctum')->group(function () {

    Route::put('settings/password', [PasswordController::class, 'update']);
});
