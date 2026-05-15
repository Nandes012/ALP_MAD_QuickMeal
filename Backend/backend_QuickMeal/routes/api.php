<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\OrderController;

Route::post('/auth/register', [UserController::class, 'register']);
Route::post('/auth/login', [UserController::class, 'login']);

// Public recipe routes
Route::get('/recipes/popular', [RecipeController::class, 'getPopularRecipes']);
Route::get('/recipes', [RecipeController::class, 'index']);
Route::get('/recipes/{id}', [RecipeController::class, 'show']);

// Public order routes
Route::get('/orders', [OrderController::class, 'index']);
Route::get('/orders/{id}', [OrderController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/auth/me', [UserController::class, 'me']);

    Route::post('/auth/logout', [UserController::class, 'logout']);

    Route::put('/user', [UserController::class, 'update']);

    Route::post('/profile/update-picture', [UserController::class, 'updateProfilePicture']);

    Route::get('/users', [UserController::class, 'index']);

    Route::get('/users/{id}', [UserController::class, 'show']);

    Route::delete('/users/{id}', [UserController::class, 'destroy']);
});