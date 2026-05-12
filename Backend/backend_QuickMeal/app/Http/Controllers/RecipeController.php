<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\JsonResponse;

class RecipeController extends Controller
{
    private function mapRecipe($recipe): array
    {
        $totalIngredientPrice = (float) ($recipe->ingredients->sum('price_estimate') ?? 0);

        return [
            'id' => (string) $recipe->id,
            'title' => $recipe->name,
            'subtitle' => $recipe->description,
            'image' => $recipe->imageUrl,
            'cookingTime' => $recipe->cookingTime,
            'difficulty' => $recipe->difficulty,
            'totalIngredientPrice' => $totalIngredientPrice,
        ];
    }

    /**
     * Get popular recipes for today (randomized daily)
     * The randomization is seeded with the current date, so the same recipes
     * are returned throughout the day, but different recipes on different days
     */
    public function getPopularRecipes(): JsonResponse
    {
        try {
            // Get today's date to use as seed for consistent random selection
            $today = date('Y-m-d');
            
            // Convert date to a numeric seed
            $seed = crc32($today);
            
            // Get total count of recipes
            $totalRecipes = Recipe::count();
            
            if ($totalRecipes === 0) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'No recipes available'
                ]);
            }
            
            // Seed the random number generator for consistent results
            srand($seed);
            
            // Get 12 random recipes (or fewer if not enough exist)
            $limit = min(12, $totalRecipes);
            
            $recipes = Recipe::with('ingredients')
                ->get()
                ->shuffle()
                ->take($limit)
                ->values()
                ->map(function ($recipe) {
                    return $this->mapRecipe($recipe);
                });
            
            return response()->json([
                'success' => true,
                'data' => $recipes,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching popular recipes: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all recipes (optional, for future use)
     */
    public function index(): JsonResponse
    {
        try {
            $recipes = Recipe::with('ingredients')->get()->map(function ($recipe) {
                return $this->mapRecipe($recipe);
            });

            return response()->json([
                'success' => true,
                'data' => $recipes,
            ]);
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
            $recipe = Recipe::with(['ingredients.ingredient', 'steps'])->find($id);

            if (!$recipe) {
                return response()->json([
                    'success' => false,
                    'message' => 'Recipe not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => (string) $recipe->id,
                    'title' => $recipe->name,
                    'subtitle' => $recipe->description,
                    'image' => $recipe->imageUrl,
                    'cookingTime' => $recipe->cookingTime,
                    'difficulty' => $recipe->difficulty,
                    'totalIngredientPrice' => (float) ($recipe->ingredients->sum('price_estimate') ?? 0),
                    'ingredients' => $recipe->ingredients->map(function ($item) {
                        return [
                            'id' => (string) $item->id,
                            'ingredient_id' => (string) $item->ingredient_id,
                            'ingredient_name' => $item->ingredient?->name,
                            'quantity' => $item->quantity,
                            'price_estimate' => (float) $item->price_estimate,
                        ];
                    }),
                    'steps' => $recipe->steps,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching recipe: ' . $e->getMessage()
            ], 500);
        }
    }
}
