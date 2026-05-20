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
            'video' => $recipe->video,
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
     * Get all recipes with optional filtering by time, budget, and ingredients
     * Ranking Priority:
     * 1. Most matching ingredients (descending)
     * 2. Fewest total ingredients required (ascending)
     * 3. Fastest cooking time (ascending)
     * 4. Cheapest price (ascending)
     */
    public function index(): JsonResponse
    {
        try {
            // Get filter parameters from request
            $time = request()->input('time', '');
            $budgetMin = request()->input('budgetMin', '');
            $budgetMax = request()->input('budgetMax', '');
            $ingredientsParam = request()->input('ingredients', '');

            // Start building the query
            $query = Recipe::with('ingredients.ingredient');

            // Filter by cooking time (time in minutes)
            if ($time) {
                $query->where('cookingTime', '<=', (int)$time);
            }

            // Execute query to get recipes
            $recipes = $query->get();

            // Filter by budget and ingredients, and count matching ingredients
            $filteredRecipes = $recipes->filter(function ($recipe) use ($budgetMin, $budgetMax, $ingredientsParam) {
                // Calculate total ingredient price
                $totalIngredientPrice = (float) ($recipe->ingredients->sum('price_estimate') ?? 0);

                // Filter by budget range
                if ($budgetMin && $totalIngredientPrice < (float)$budgetMin) {
                    return false;
                }
                if ($budgetMax && $totalIngredientPrice > (float)$budgetMax) {
                    return false;
                }

                // Filter by ingredients
                if ($ingredientsParam) {
                    $selectedIngredients = array_map('trim', explode(',', $ingredientsParam));
                    $recipeIngredientNames = $recipe->ingredients->pluck('ingredient.name')->map(function ($name) {
                        return strtolower($name);
                    })->toArray();

                    // Check if recipe contains at least one of the selected ingredients
                    $hasMatchingIngredient = false;
                    foreach ($selectedIngredients as $ingredient) {
                        if (in_array(strtolower($ingredient), $recipeIngredientNames)) {
                            $hasMatchingIngredient = true;
                            break;
                        }
                    }

                    if (!$hasMatchingIngredient) {
                        return false;
                    }
                }

                return true;
            });

            // Add ingredient match count and total ingredient count to each recipe
            $rankedRecipes = $filteredRecipes->map(function ($recipe) use ($ingredientsParam) {
                $matchCount = 0;

                if ($ingredientsParam) {
                    $selectedIngredients = array_map('trim', explode(',', $ingredientsParam));
                    $recipeIngredientNames = $recipe->ingredients->pluck('ingredient.name')->map(function ($name) {
                        return strtolower($name);
                    })->toArray();

                    // Count how many ingredients match
                    foreach ($selectedIngredients as $ingredient) {
                        if (in_array(strtolower($ingredient), $recipeIngredientNames)) {
                            $matchCount++;
                        }
                    }
                }

                // Count total ingredients in recipe
                $totalIngredientCount = $recipe->ingredients->count();

                $recipe->match_count = $matchCount;
                $recipe->total_ingredient_count = $totalIngredientCount;
                return $recipe;
            });

            // Sort hierarchically:
            // 1. Most matching ingredients (descending)
            // 2. Fewest total ingredients required (ascending)
            // 3. Fastest cooking time (ascending)
            // 4. Cheapest price (ascending)
            $sortedRecipes = $rankedRecipes->sortBy([
                [function ($recipe) { return -$recipe->match_count; }],  // Descending match count
                [function ($recipe) { return $recipe->total_ingredient_count; }],  // Ascending total ingredients
                [function ($recipe) { return $recipe->cookingTime ?? 0; }],  // Ascending cooking time
                [function ($recipe) { return (float) ($recipe->ingredients->sum('price_estimate') ?? 0); }]  // Ascending price
            ])->values();

            // Map the sorted recipes
            $mappedRecipes = $sortedRecipes->map(function ($recipe) {
                return $this->mapRecipe($recipe);
            });

            return response()->json([
                'success' => true,
                'data' => $mappedRecipes,
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
            $recipe = Recipe::with(['ingredients.ingredient', 'steps', 'tools'])->find($id);

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
                    'video' => $recipe->video,
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
                    'tools' => $recipe->tools->map(function ($tool) {
                        return [
                            'id' => (string) $tool->id,
                            'tool_name' => $tool->tool_name,
                            'description' => $tool->description,
                        ];
                    }),
                    'steps' => $recipe->steps->map(function ($step) {
                        return [
                            'id' => (string) $step->id,
                            'stepNumber' => $step->stepNumber,
                            'description' => $step->description,
                        ];
                    }),
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
