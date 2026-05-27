<?php

namespace App\Services;

use App\Models\Recipe;
use App\Repositories\RecipeRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class RecipeService
{
    public function __construct(private readonly RecipeRepository $recipeRepository)
    {
    }

    private function mapRecipe(Recipe $recipe): array
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

    public function getPopularRecipes(): array
    {
        $totalRecipes = $this->recipeRepository->count();

        if ($totalRecipes === 0) {
            return [
                'success' => true,
                'data' => [],
                'message' => 'No recipes available',
            ];
        }

        $limit = min(12, $totalRecipes);
        $recipes = $this->recipeRepository->getPopular($limit);

        return [
            'success' => true,
            'data' => $recipes->map(fn (Recipe $recipe) => $this->mapRecipe($recipe)),
        ];
    }

    private function recipeIngredientNames(Recipe $recipe): array
    {
        return $recipe->ingredients->pluck('ingredient.name')->map(function ($name) {
            return strtolower($name);
        })->toArray();
    }

    private function matchesBudget(Recipe $recipe, string $budgetMin, string $budgetMax): bool
    {
        $totalIngredientPrice = (float) ($recipe->ingredients->sum('price_estimate') ?? 0);

        if ($budgetMin && $totalIngredientPrice < (float) $budgetMin) {
            return false;
        }

        if ($budgetMax && $totalIngredientPrice > (float) $budgetMax) {
            return false;
        }

        return true;
    }

    private function matchesIngredients(Recipe $recipe, string $ingredientsParam): bool
    {
        if (!$ingredientsParam) {
            return true;
        }

        $selectedIngredients = array_map('trim', explode(',', $ingredientsParam));
        $recipeIngredientNames = $this->recipeIngredientNames($recipe);

        foreach ($selectedIngredients as $ingredient) {
            if (in_array(strtolower($ingredient), $recipeIngredientNames)) {
                return true;
            }
        }

        return false;
    }

    private function matchCount(Recipe $recipe, string $ingredientsParam): int
    {
        if (!$ingredientsParam) {
            return 0;
        }

        $matchCount = 0;
        $selectedIngredients = array_map('trim', explode(',', $ingredientsParam));
        $recipeIngredientNames = $this->recipeIngredientNames($recipe);

        foreach ($selectedIngredients as $ingredient) {
            if (in_array(strtolower($ingredient), $recipeIngredientNames)) {
                $matchCount++;
            }
        }

        return $matchCount;
    }

    /**
     * @param Collection<int, Recipe>|LengthAwarePaginator $recipes
     */
    private function normalizeRecipes($recipes): array
    {
        $paginator = $recipes instanceof LengthAwarePaginator ? $recipes : null;
        $recipesCollection = $recipes instanceof LengthAwarePaginator ? collect($recipes->items()) : $recipes;

        return [$recipesCollection, $paginator];
    }

    public function getRecipes(array $filters): array
    {
        $recipes = $this->recipeRepository->getRecipes($filters);
        [$recipesCollection, $paginator] = $this->normalizeRecipes($recipes);

        $budgetMin = $filters['budgetMin'] ?? '';
        $budgetMax = $filters['budgetMax'] ?? '';
        $ingredientsParam = $filters['ingredients'] ?? '';

        $filteredRecipes = $recipesCollection->filter(function (Recipe $recipe) use ($budgetMin, $budgetMax, $ingredientsParam) {
            return $this->matchesBudget($recipe, $budgetMin, $budgetMax)
                && $this->matchesIngredients($recipe, $ingredientsParam);
        });

        $rankedRecipes = $filteredRecipes->map(function (Recipe $recipe) use ($ingredientsParam) {
            $matchCount = $this->matchCount($recipe, $ingredientsParam);

            $recipe->match_count = $matchCount;
            $recipe->total_ingredient_count = $recipe->ingredients->count();

            return $recipe;
        });

        $sortedRecipes = $rankedRecipes
            ->sortBy(function ($recipe) {
                return (float) ($recipe->ingredients->sum('price_estimate') ?? 0);
            })
            ->sortBy(function ($recipe) {
                return $recipe->cookingTime ?? 0;
            })
            ->sortByDesc(function ($recipe) {
                return $recipe->match_count;
            })
            ->values();

        $mappedRecipes = $sortedRecipes->map(fn (Recipe $recipe) => $this->mapRecipe($recipe));

        $response = [
            'success' => true,
            'data' => $mappedRecipes,
        ];

        if ($paginator) {
            $response['meta'] = [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ];
        }

        return $response;
    }

    public function findRecipeById(string|int $id): ?Recipe
    {
        return $this->recipeRepository->findById($id);
    }

    public function getRecipeResponse(Recipe $recipe): array
    {
        return [
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
            ],
        ];
    }
}
