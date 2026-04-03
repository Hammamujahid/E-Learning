<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\SubjectController;

Route::get('/subjects', [SubjectController::class, 'index']);
