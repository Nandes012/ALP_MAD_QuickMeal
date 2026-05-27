<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ApiResponses;
use App\Services\IngredientService;
use Illuminate\Http\Request;

class IngredientController extends Controller
{
    use ApiResponses;

    public function __construct(private readonly IngredientService $ingredientService)
    {
    }

    /**
     * GET /api/ingredients
     */
    public function index(Request $request)
    {
        $result = $this->ingredientService->index($request);
        $ingredientsMapped = $this->ingredientService->mapCollection($result['items']);

        return $this->successResponse(
            $ingredientsMapped,
            'Ingredients fetched successfully',
            200,
            $result['paginator'] ? ['meta' => $this->paginationMeta($result['paginator'])] : []
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

        $ingredient = $this->ingredientService->create($validated);

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
        $ingredient = $this->ingredientService->findById($id);

        if (!$ingredient) {
            return $this->notFoundResponse('Ingredient');
        }

        return $this->successResponse(
            [
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
            ],
            'Ingredient fetched successfully'
        );
    }

    /**
     * PUT /api/ingredients/{id}
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:ingredients,name,' . $id,
            'ingredient_picture' => 'nullable|string',
            'ingredient_video' => 'nullable|string',
            'price_per_kg' => 'nullable|integer',
        ]);

        $ingredient = $this->ingredientService->update($id, $validated);

        if (!$ingredient) {
            return $this->notFoundResponse('Ingredient');
        }

        return $this->successResponse($ingredient, 'Ingredient updated successfully');
    }

    /**
     * DELETE /api/ingredients/{id}
     */
    public function destroy($id)
    {
        $deleted = $this->ingredientService->delete($id);

        if (!$deleted) {
            return $this->notFoundResponse('Ingredient');
        }

        return $this->successResponse(null, 'Ingredient deleted successfully');
    }
}