<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ApiResponses;
use App\Models\Ingredient;
use Illuminate\Http\Request;

class IngredientController extends Controller
{
    use ApiResponses;

    /**
     * GET /api/ingredients
     */
    public function index(Request $request)
    {
        [$ingredients, $paginator] = $this->paginateOrLimit(Ingredient::query(), $request);

        return $this->successResponse(
            $ingredients,
            'Ingredients fetched successfully',
            200,
            $paginator ? ['meta' => $this->paginationMeta($paginator)] : []
        );
    }

    /**
     * POST /api/ingredients
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:ingredients,name',
            'ingredient_picture' => 'nullable|string',
            'ingredient_video' => 'nullable|string',
            'price_per_kg' => 'nullable|integer',
        ]);

        $ingredient = Ingredient::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Ingredient created successfully',
            'data' => $ingredient
        ], 201);
    }

    /**
     * GET /api/ingredients/{id}
     */
    public function show($id)
    {
        $ingredient = Ingredient::with('locations')->find($id);

        if (!$ingredient) {
            return $this->notFoundResponse('Ingredient');
        }

        return $this->successResponse($ingredient, 'Ingredient fetched successfully');
    }

    /**
     * PUT /api/ingredients/{id}
     */
    public function update(Request $request, $id)
    {
        $ingredient = Ingredient::find($id);

        if (!$ingredient) {
            return $this->notFoundResponse('Ingredient');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:ingredients,name,' . $id,
            'ingredient_picture' => 'nullable|string',
            'ingredient_video' => 'nullable|string',
            'price_per_kg' => 'nullable|integer',
        ]);

        $ingredient->update($validated);

        return $this->successResponse($ingredient, 'Ingredient updated successfully');
    }

    /**
     * DELETE /api/ingredients/{id}
     */
    public function destroy($id)
    {
        $ingredient = Ingredient::find($id);

        if (!$ingredient) {
            return $this->notFoundResponse('Ingredient');
        }

        $ingredient->delete();

        return $this->successResponse(null, 'Ingredient deleted successfully');
    }

    /**
     * GET /api/ingredients/{id}/locations
     */
    public function getLocations($id)
    {
        try {
            $ingredient = Ingredient::find($id);

            if (!$ingredient) {
                return $this->notFoundResponse('Ingredient');
            }

            // Get locations with price per kg location from the pivot table
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
        } catch (\Exception $e) {
            return $this->errorResponse('Error fetching locations', 500, ['error' => $e->getMessage()]);
        }
    }
}