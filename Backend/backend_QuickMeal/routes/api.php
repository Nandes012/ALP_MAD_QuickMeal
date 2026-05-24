<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\IngredientLocationController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\RecentViewedRecipeController;
use App\Http\Controllers\TagController;

$ingredientDetailRoute = '/ingredients/' . '{id}';
$locationDetailRoute = '/locations/' . '{id}';

Route::post('/auth/register', [UserController::class, 'register']);
Route::post('/auth/login', [UserController::class, 'login']);

// Public recipe routes
Route::get('/recipes/popular', [RecipeController::class, 'getPopularRecipes']);
Route::get('/recipes', [RecipeController::class, 'index']);
Route::get('/recipes/{id}', [RecipeController::class, 'show']);

// Orders removed — endpoints no longer used

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [UserController::class, 'me']);
    Route::post('/auth/logout', [UserController::class, 'logout']);
    Route::put('/user', [UserController::class, 'update']);
    Route::post('/profile/update-picture', [UserController::class, 'updateProfilePicture']);

    Route::get('/subscription/current', [PaymentController::class, 'current']);
    Route::post('/subscription/upgrade', [PaymentController::class, 'createUpgrade']);
    Route::post('/subscription/upgrade/confirm', [PaymentController::class, 'confirmUpgrade']);
    Route::get('/subscription/history', [PaymentController::class, 'history']);

    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{id}', [UserController::class, 'show']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // Routes for recently viewed recipes
    Route::get('/recent-viewed-recipes', [RecentViewedRecipeController::class, 'index']);
    Route::post('/recent-viewed-recipes', [RecentViewedRecipeController::class, 'store']);
});

//routes for ingredients
Route::get('/ingredients', [IngredientController::class, 'index']);
Route::get($ingredientDetailRoute, [IngredientController::class, 'show']);
Route::post('/ingredients', [IngredientController::class, 'store']);
Route::put($ingredientDetailRoute, [IngredientController::class, 'update']);
Route::delete($ingredientDetailRoute, [IngredientController::class, 'destroy']);

//routes for ingredient locations (with prices)
Route::get('/ingredients/{ingredient_id}/ingredient-locations', [IngredientLocationController::class, 'index']);
Route::get('/ingredients/{ingredient_id}/ingredient-locations/{id_location}', [IngredientLocationController::class, 'show']);

//routes for tags
Route::get('/tags', [TagController::class, 'index']);
Route::get('/tags/{id}', [TagController::class, 'show']);

//routes for location
Route::get('/locations', [LocationController::class, 'index']);
Route::get($locationDetailRoute, [LocationController::class, 'show']);
Route::post('/locations', [LocationController::class, 'store']);
Route::put($locationDetailRoute, [LocationController::class, 'update']);
Route::delete($locationDetailRoute, [LocationController::class, 'destroy']);
