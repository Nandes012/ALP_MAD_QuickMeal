<?php

namespace App\Http\Controllers;

use App\Services\RecipeService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RecipeController extends Controller
{
    public function __construct(private readonly RecipeService $recipeService)
    {
    }

    /**
     * Get popular recipes for today (randomized daily)
     * The randomization is seeded with the current date, so the same recipes
     * are returned throughout the day, but different recipes on different days
     */
    public function getPopularRecipes(): JsonResponse
    {
        try {
            return response()->json($this->recipeService->getPopularRecipes());
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching popular recipes: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all recipes with optional filtering by time, budget, and ingredients
     * Ranking Priority:
     * 1. Most matching ingredients (descending)
     * 2. Fastest cooking time (ascending)
     * 3. Cheapest price (ascending)
     */
    public function index(): JsonResponse
    {
        try {
            return response()->json($this->recipeService->getRecipes([
                'time' => request()->input('time', ''),
                'budgetMin' => request()->input('budgetMin', ''),
                'budgetMax' => request()->input('budgetMax', ''),
                'ingredients' => request()->input('ingredients', ''),
                'page' => request()->input('page'),
                'perPage' => (int) request()->input('perPage', 20),
                'limit' => (int) request()->input('limit', 100),
            ]));
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching recipes: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a single recipe by ID
     */
    public function show($id): JsonResponse
    {
        try {
            $recipe = $this->recipeService->findRecipeById($id);

            if (!$recipe) {
                return response()->json([
                    'success' => false,
                    'message' => 'Recipe not found'
                ], 404);
            }

            return response()->json($this->recipeService->getRecipeResponse($recipe));
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching recipe: ' . $e->getMessage()
            ], 500);
        }
    }
}
