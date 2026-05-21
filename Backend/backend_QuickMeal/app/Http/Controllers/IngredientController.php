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
            $ingredient = Ingredient::with('locations')->find($id);

            if (!$ingredient) {
                return $this->notFoundResponse('Ingredient');
            }

            return $this->successResponse($ingredient->locations, 'Locations fetched successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Error fetching locations', 500, ['error' => $e->getMessage()]);
        }
    }
}

