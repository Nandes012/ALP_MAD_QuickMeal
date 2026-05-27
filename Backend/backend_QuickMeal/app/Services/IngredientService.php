<?php

namespace App\Services;

use App\Repositories\IngredientRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;

class IngredientService
{
    public function __construct(private readonly IngredientRepository $repo)
    {
    }

    public function index(Request $request): array
    {
        [$items, $paginator] = $this->repo->index($request);

        return ['items' => $items, 'paginator' => $paginator];
    }

    public function mapCollection($ingredients)
    {
        return $ingredients->map(function ($ingredient) {
            return [
                'id' => $ingredient->id,
                'name' => $ingredient->name,
                'ingredient_picture' => $ingredient->ingredient_picture,
                'ingredient_video' => $ingredient->ingredient_video,
                'price_per_kg' => $ingredient->price_per_kg,
                'tags' => $ingredient->tags->map(function ($tag) {
                    return [
                        'id' => $tag->id,
                        'name' => $tag->name,
                        'icon' => $tag->icon,
                        'type' => $tag->type,
                    ];
                })->toArray(),
                'created_at' => $ingredient->created_at,
                'updated_at' => $ingredient->updated_at,
            ];
        });
    }

    public function findById(string|int $id)
    {
        return $this->repo->findById($id);
    }

    public function create(array $validated)
    {
        return $this->repo->create($validated);
    }

    public function update(string|int $id, array $validated)
    {
        return $this->repo->update($id, $validated);
    }

    public function delete(string|int $id): bool
    {
        return $this->repo->delete($id);
    }
}
