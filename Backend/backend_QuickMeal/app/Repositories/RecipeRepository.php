<?php

namespace App\Repositories;

use App\Models\Recipe;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class RecipeRepository
{
    public function count(): int
    {
        return Recipe::count();
    }

    /**
     * @return Collection<int, Recipe>
     */
    public function getPopular(int $limit): Collection
    {
        return Recipe::with('ingredients', 'tags')
            ->inRandomOrder()
            ->limit($limit)
            ->get();
    }

    /**
     * @return Collection<int, Recipe>|LengthAwarePaginator
     */
    public function getRecipes(array $filters)
    {
        $query = Recipe::with('ingredients.ingredient', 'tags');

        if (!empty($filters['time'])) {
            $query->where('cookingTime', '<=', (int) $filters['time']);
        }

        if (!empty($filters['page'])) {
            return $query->paginate((int) ($filters['perPage'] ?? 20));
        }

        return $query->limit((int) ($filters['limit'] ?? 100))->get();
    }

    public function findById(string|int $id): ?Recipe
    {
        return Recipe::with(['ingredients.ingredient', 'steps', 'tools'])->find($id);
    }
}
