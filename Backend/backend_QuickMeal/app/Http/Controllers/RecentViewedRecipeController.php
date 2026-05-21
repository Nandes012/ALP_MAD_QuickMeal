<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ApiResponses;
use App\Models\RecentViewedRecipe;
use Illuminate\Http\Request;

class RecentViewedRecipeController extends Controller
{
    use ApiResponses;

    /**
     * Display a listing of the 5 most recent viewed recipes for authenticated user.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return $this->unauthorizedResponse();
        }

        $recentRecipes = RecentViewedRecipe::where('user_id', $user->id)
            ->with('recipe')
            ->latest('created_at')
            ->limit(5)
            ->get();

        return $this->successResponse($recentRecipes, 'Recently viewed recipes retrieved successfully');
    }

    /**
     * Store a newly created resource in storage.
     * Creates a new view record and deletes the oldest if more than 5 exist.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'recipe_id' => 'required|exists:recipes,id',
        ]);

        $user = $request->user();

        if (!$user) {
            return $this->unauthorizedResponse();
        }

        // Delete any existing view of this recipe for this user (to avoid duplicates)
        RecentViewedRecipe::where('user_id', $user->id)
            ->where('recipe_id', $validated['recipe_id'])
            ->delete();

        // Create new recent viewed recipe record
        $recentView = RecentViewedRecipe::create([
            'user_id' => $user->id,
            'recipe_id' => $validated['recipe_id'],
        ]);

        // Keep only the newest 5 rows without loading the full history.
        RecentViewedRecipe::where('user_id', $user->id)
            ->whereNotIn('id', RecentViewedRecipe::where('user_id', $user->id)
                ->latest('created_at')
                ->limit(5)
                ->pluck('id'))
            ->delete();

        return $this->successResponse($recentView->load('recipe'), 'Recipe view recorded successfully', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

