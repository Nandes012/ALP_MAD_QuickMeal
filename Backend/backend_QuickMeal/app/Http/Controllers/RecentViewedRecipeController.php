<?php

namespace App\Http\Controllers;

use App\Models\RecentViewedRecipe;
use Illuminate\Http\Request;

class RecentViewedRecipeController extends Controller
{
    /**
     * Display a listing of the 5 most recent viewed recipes for authenticated user.
     */
    public function index()
    {
        $userId = auth()->id();
        
        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $recentRecipes = RecentViewedRecipe::where('user_id', $userId)
            ->with('recipe')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'message' => 'Recently viewed recipes retrieved successfully',
            'data' => $recentRecipes
        ]);
    }

    /**
     * Store a newly created resource in storage.
     * Creates a new view record and deletes the oldest if more than 5 exist.
     */
    public function store(Request $request)
    {
        $request->validate([
            'recipe_id' => 'required|exists:recipes,id',
        ]);

        $userId = auth()->id();

        if (!$userId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Delete any existing view of this recipe for this user (to avoid duplicates)
        RecentViewedRecipe::where('user_id', $userId)
            ->where('recipe_id', $request->recipe_id)
            ->delete();

        // Create new recent viewed recipe record
        $recentView = RecentViewedRecipe::create([
            'user_id' => $userId,
            'recipe_id' => $request->recipe_id,
        ]);

        // Get all views for this user ordered by oldest first
        $userViews = RecentViewedRecipe::where('user_id', $userId)
            ->orderBy('created_at', 'asc')
            ->get();

        // If more than 5, delete the oldest ones
        if ($userViews->count() > 5) {
            $toDelete = $userViews->count() - 5;
            RecentViewedRecipe::where('user_id', $userId)
                ->orderBy('created_at', 'asc')
                ->take($toDelete)
                ->delete();
        }

        return response()->json([
            'message' => 'Recipe view recorded successfully',
            'data' => $recentView->load('recipe')
        ], 201);
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

