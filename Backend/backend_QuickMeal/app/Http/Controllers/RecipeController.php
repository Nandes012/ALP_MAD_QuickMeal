<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Illuminate\Http\JsonResponse;

class RecipeController extends Controller
{
    private function mapRecipe($recipe): array
    {
        $totalIngredientPrice = (float) ($recipe->ingredients->sum('price_estimate') ?? 0);

        $tags = [];
        if ($recipe->relationLoaded('tags')) {
            $tags = $recipe->tags->map(function ($tag) {
                return [
                    'id' => $tag->id,
                    'name' => $tag->name,
                    'icon' => $tag->icon,
                    'type' => $tag->type,
                ];
            })->toArray();
        }

        return [
            'id' => (string) $recipe->id,
            'title' => $recipe->name,
            'subtitle' => $recipe->description,
            'image' => $recipe->imageUrl,
            'video' => $recipe->video,
            'cookingTime' => $recipe->cookingTime,
            'difficulty' => $recipe->difficulty,
            'totalIngredientPrice' => $totalIngredientPrice,
            'tags' => $tags,
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
            // Use a database-level random selection and limit to avoid
            // loading all recipes into memory.
            $totalRecipes = Recipe::count();

            if ($totalRecipes === 0) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'No recipes available'
                ]);
            }

            $limit = min(12, $totalRecipes);

            // Use inRandomOrder() which delegates randomness to the DB and
            // applies a LIMIT so only the needed rows are fetched.
            $recipes = Recipe::with('ingredients', 'tags')
                ->inRandomOrder()
                ->limit($limit)
                ->get()
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
     * 2. Fastest cooking time (ascending)
     * 3. Cheapest price (ascending)
     */
    public function index(): JsonResponse
    {
        try {
            // Get filter parameters from request
            $time = request()->input('time', '');
            $budgetMin = request()->input('budgetMin', '');
            $budgetMax = request()->input('budgetMax', '');
            $ingredientsParam = request()->input('ingredients', '');

            // Start building the query and only fetch what's necessary. We
            // support optional pagination via `page` and `perPage` query params.
            $query = Recipe::with('ingredients.ingredient', 'tags');

            if ($time) {
                $query->where('cookingTime', '<=', (int)$time);
            }

            $page = request()->input('page');
            $perPage = (int) request()->input('perPage', 20);

            if ($page) {
                $paginator = $query->paginate($perPage);
                $recipesCollection = collect($paginator->items());
            } else {
                $limit = (int) request()->input('limit', 100);
                $recipesCollection = $query->limit($limit)->get();
            }

            // Filter by budget and ingredients, and count matching ingredients
            $filteredRecipes = $recipesCollection->filter(function ($recipe) use ($budgetMin, $budgetMax, $ingredientsParam) {
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
                $matchedIngredients = [];

                if ($ingredientsParam) {
                    $selectedIngredients = array_map('trim', explode(',', $ingredientsParam));
                    $recipeIngredientNames = $recipe->ingredients->pluck('ingredient.name')->map(function ($name) {
                        return strtolower($name);
                    })->toArray();

                    // Count how many ingredients match
                    foreach ($selectedIngredients as $ingredient) {
                        if (in_array(strtolower($ingredient), $recipeIngredientNames)) {
                            $matchCount++;
                            $matchedIngredients[] = $ingredient;
                        }
                    }
                }

                // Count total ingredients in recipe
                $totalIngredientCount = $recipe->ingredients->count();

                $recipe->match_count = $matchCount;
                $recipe->total_ingredient_count = $totalIngredientCount;
                
                return $recipe;
            });


            // Sort hierarchically using stable sort (sort in reverse priority order):
            // 1. Most matching ingredients (descending)
            // 2. Fastest cooking time (ascending)
            // 3. Cheapest price (ascending)
            $sortedRecipes = $rankedRecipes
                ->sortBy(function ($recipe) {
                    return (float) ($recipe->ingredients->sum('price_estimate') ?? 0);
                })  // Sort by price first (lowest priority)
                ->sortBy(function ($recipe) {
                    return $recipe->cookingTime ?? 0;
                })  // Then by cooking time
                ->sortByDesc(function ($recipe) {
                    return $recipe->match_count;
                })  // Finally by match count descending (highest priority)
                ->values();
            // Map the sorted recipes
            $mappedRecipes = $sortedRecipes->map(function ($recipe) {
                return $this->mapRecipe($recipe);
            });

            $response = [
                'success' => true,
                'data' => $mappedRecipes,
            ];

            // Include pagination meta when applicable
            if (isset($paginator)) {
                $response['meta'] = [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                ];
            }

            return response()->json($response);
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
