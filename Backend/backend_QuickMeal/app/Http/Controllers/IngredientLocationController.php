<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ApiResponses;
use App\Services\IngredientLocationService;
use Illuminate\Http\Request;

class IngredientLocationController extends Controller
{
    use ApiResponses;

    public function __construct(private readonly IngredientLocationService $ingredientLocationService)
    {
    }

    /**
     * GET /api/ingredients/{ingredient_id}/ingredient-locations
     * Get all locations for a specific ingredient with pricing
     */
    public function index($ingredient_id, Request $request)
    {
        $locations = $this->ingredientLocationService->indexForIngredient($ingredient_id);

        if ($locations === null) {
            return $this->notFoundResponse('Ingredient');
        }

        return $this->successResponse($locations, 'Locations fetched successfully');
    }

    /**
     * GET /api/ingredients/{ingredient_id}/ingredient-locations/{id_location}
     * Get a specific ingredient location mapping with price
     */
    public function show($ingredient_id, $id_location)
    {
        $locationData = $this->ingredientLocationService->findLocation($ingredient_id, $id_location);

        if ($locationData === null) {
            return $this->notFoundResponse('Ingredient Location');
        }

        return $this->successResponse($locationData, 'Ingredient location fetched successfully');
    }

    /**
     * GET /api/ingredients/{ingredient_id}/locations-with-prices
     * Get all locations for an ingredient with pricing (alternative endpoint)
     */
    public function locationsWithPrices($ingredient_id)
    {
        $locationsWithPrices = $this->ingredientLocationService->locationsWithPrices($ingredient_id);

        if ($locationsWithPrices === null) {
            return $this->notFoundResponse('Ingredient');
        }

        return $this->successResponse($locationsWithPrices, 'Locations with prices fetched successfully');
    }
}
