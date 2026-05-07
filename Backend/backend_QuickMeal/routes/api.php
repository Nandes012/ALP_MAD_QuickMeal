<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::post('/auth/register', [UserController::class, 'register']);
Route::post('/auth/login', [UserController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/auth/me', [UserController::class, 'me']);

    Route::post('/auth/logout', [UserController::class, 'logout']);

    Route::put('/user', [UserController::class, 'update']);

    Route::get('/users', [UserController::class, 'index']);

    Route::get('/users/{id}', [UserController::class, 'show']);

    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});