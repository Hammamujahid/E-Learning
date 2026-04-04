<?php

use App\Http\Controllers\CityController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function(){
    Route::get('/cities', [CityController::class, 'index']);
});
