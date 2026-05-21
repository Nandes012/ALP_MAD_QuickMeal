<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use Illuminate\Http\Request;

class IngredientController extends Controller
{
    /**
     * GET /api/ingredients
     */
    public function index()
    {
        $page = request()->input('page');
        $perPage = (int) request()->input('perPage', 20);

        if ($page) {
            $paginator = Ingredient::paginate($perPage);
            return response()->json([
                'success' => true,
                'message' => 'Ingredients fetched successfully',
                'data' => $paginator->items(),
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                ]
            ]);
        }

        $limit = (int) request()->input('limit', 100);
        $ingredients = Ingredient::limit($limit)->get();

        return response()->json([
            'success' => true,
            'message' => 'Ingredients fetched successfully',
            'data' => $ingredients
        ]);
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
            return response()->json([
                'success' => false,
                'message' => 'Ingredient not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Ingredient fetched successfully',
            'data' => $ingredient
        ]);
    }

    /**
     * PUT /api/ingredients/{id}
     */
    public function update(Request $request, $id)
    {
        $ingredient = Ingredient::find($id);

        if (!$ingredient) {
            return response()->json([
                'success' => false,
                'message' => 'Ingredient not found'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:ingredients,name,' . $id,
            'ingredient_picture' => 'nullable|string',
            'ingredient_video' => 'nullable|string',
            'price_per_kg' => 'nullable|integer',
        ]);

        $ingredient->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Ingredient updated successfully',
            'data' => $ingredient
        ]);
    }

    /**
     * DELETE /api/ingredients/{id}
     */
    public function destroy($id)
    {
        $ingredient = Ingredient::find($id);

        if (!$ingredient) {
            return response()->json([
                'success' => false,
                'message' => 'Ingredient not found'
            ], 404);
        }

        $ingredient->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ingredient deleted successfully'
        ]);
    }

    /**
     * GET /api/ingredients/{id}/locations
     */
    public function getLocations($id)
    {
        try {
            $ingredient = Ingredient::with('locations')->find($id);

            if (!$ingredient) {
                return response()->json([
                    'success' => false,

                    'message' => 'Ingredient not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Locations fetched successfully',
                'data' => $ingredient->locations
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching locations',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}