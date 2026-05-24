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
        [$ingredients, $paginator] = $this->paginateOrLimit(Ingredient::with('tags'), $request);

        // Map ingredients to include tags
        $ingredientsMapped = $ingredients->map(function ($ingredient) {
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

        return $this->successResponse(
            $ingredientsMapped,
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
        $ingredient = Ingredient::with('locations', 'tags')->find($id);

        if (!$ingredient) {
            return $this->notFoundResponse('Ingredient');
        }

        $ingredientData = [
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

        return $this->successResponse($ingredientData, 'Ingredient fetched successfully');
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
}