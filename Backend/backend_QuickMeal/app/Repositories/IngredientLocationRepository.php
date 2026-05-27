<?php

namespace App\Repositories;

use App\Models\Ingredient;
use App\Models\IngredientLocation;

class IngredientLocationRepository
{
    public function locationsForIngredient($ingredientId)
    {
        $ingredient = Ingredient::find($ingredientId);

        if (!$ingredient) {
            return null;
        }

        return $ingredient->locations()->get();
    }

    public function findLocation($ingredientId, $locationId)
    {
        return IngredientLocation::where('ingredient_id', $ingredientId)
            ->where('id_location', $locationId)
            ->with('location')
            ->first();
    }
}
