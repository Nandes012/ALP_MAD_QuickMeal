<?php

namespace App\Repositories;

use App\Models\Ingredient;
use Illuminate\Http\Request;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class IngredientRepository
{
    public function index(Request $request): array
    {
        $query = Ingredient::with('tags');

        if ($request->filled('page')) {
            $paginator = $query->paginate((int) $request->input('perPage', 20));

            return [collect($paginator->items()), $paginator];
        }

        return [$query->limit((int) $request->input('limit', 100))->get(), null];
    }

    public function findById($id): ?Ingredient
    {
        return Ingredient::with('locations', 'tags')->find($id);
    }

    public function create(array $data): Ingredient
    {
        return Ingredient::create($data);
    }

    public function update($id, array $data): ?Ingredient
    {
        $ingredient = Ingredient::find($id);

        if (!$ingredient) {
            return null;
        }

        $ingredient->update($data);

        return $ingredient;
    }

    public function delete($id): bool
    {
        $ingredient = Ingredient::find($id);

        if (!$ingredient) {
            return false;
        }

        $ingredient->delete();

        return true;
    }
}
