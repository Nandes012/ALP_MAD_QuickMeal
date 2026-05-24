<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ApiResponses;
use App\Models\Ingredient;
use App\Models\IngredientLocation;
use Illuminate\Http\Request;

class IngredientLocationController extends Controller
{
    use ApiResponses;

    /**
     * GET /api/ingredients/{ingredient_id}/ingredient-locations
     * Get all locations for a specific ingredient with pricing
     */
    public function index($ingredient_id, Request $request)
    {
        $ingredient = Ingredient::find($ingredient_id);

        if (!$ingredient) {
            return $this->notFoundResponse('Ingredient');
        }

        $locations = $ingredient->locations()
            ->get()
            ->map(function ($location) {
                return [
                    'id_location' => $location->id_location,
                    'location_name' => $location->location_name,
                    'road_name' => $location->road_name,
                    'location_picture' => $location->location_picture,
                    'google_maps_link' => $location->google_maps_link,
                    'opening_time' => $location->opening_time,
                    'closing_time' => $location->closing_time,
                    'price_per_kg_location' => $location->pivot->price_per_kg_location,
                ];
            });

        return $this->successResponse($locations, 'Locations fetched successfully');
    }

    /**
     * GET /api/ingredients/{ingredient_id}/ingredient-locations/{id_location}
     * Get a specific ingredient location mapping with price
     */
    public function show($ingredient_id, $id_location)
    {
        $ingredient = Ingredient::find($ingredient_id);

        if (!$ingredient) {
            return $this->notFoundResponse('Ingredient');
        }

        $ingredientLocation = IngredientLocation::where('ingredient_id', $ingredient_id)
            ->where('id_location', $id_location)
            ->with('location')
            ->first();

        if (!$ingredientLocation) {
            return $this->notFoundResponse('Ingredient Location');
        }

        $locationData = [
            'id_location' => $ingredientLocation->location->id_location,
            'location_name' => $ingredientLocation->location->location_name,
            'road_name' => $ingredientLocation->location->road_name,
            'location_picture' => $ingredientLocation->location->location_picture,
            'google_maps_link' => $ingredientLocation->location->google_maps_link,
            'opening_time' => $ingredientLocation->location->opening_time,
            'closing_time' => $ingredientLocation->location->closing_time,
            'price_per_kg_location' => $ingredientLocation->price_per_kg_location,
        ];

        return $this->successResponse($locationData, 'Ingredient location fetched successfully');
    }

    /**
     * GET /api/ingredients/{ingredient_id}/locations-with-prices
     * Get all locations for an ingredient with pricing (alternative endpoint)
     */
    public function locationsWithPrices($ingredient_id)
    {
        $ingredient = Ingredient::find($ingredient_id);

        if (!$ingredient) {
            return $this->notFoundResponse('Ingredient');
        }

        $locationsWithPrices = $ingredient->locations()
            ->get()
            ->map(function ($location) {
                return [
                    'id_location' => $location->id_location,
                    'location_name' => $location->location_name,
                    'road_name' => $location->road_name,
                    'location_picture' => $location->location_picture,
                    'google_maps_link' => $location->google_maps_link,
                    'opening_time' => $location->opening_time,
                    'closing_time' => $location->closing_time,
                ];
            });

        return $this->successResponse($locationsWithPrices, 'Locations with prices fetched successfully');
    }
}
