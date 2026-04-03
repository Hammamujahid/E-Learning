<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthenticatedTokenController;
use App\Http\Controllers\Api\ConfirmablePasswordController;
use App\Http\Controllers\Api\EmailVerificationNotificationController;
use App\Http\Controllers\Api\PasswordResetLinkController;
use App\Http\Controllers\Api\RegisteredUserController;
use App\Http\Controllers\Api\VerifyEmailController;
use App\Http\Controllers\Api\NewPasswordController;

Route::middleware('guest')->group(function () {
    Route::post('register', [RegisteredUserController::class, 'store']);
    Route::post('login', [AuthenticatedTokenController::class, 'store']);
    Route::post('forgot-password', [PasswordResetLinkController::class, 'store']);
    Route::post('reset-password', [NewPasswordController::class, 'store']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)->middleware(['signed', 'throttle:6,1']);
    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])->middleware('throttle:6,1');
    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);
    Route::post('logout', [AuthenticatedTokenController::class, 'destroy']);
});
