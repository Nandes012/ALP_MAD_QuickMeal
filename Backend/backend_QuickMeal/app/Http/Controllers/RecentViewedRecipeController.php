<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ApiResponses;
use App\Services\RecentViewedService;
use Illuminate\Http\Request;

class RecentViewedRecipeController extends Controller
{
    use ApiResponses;

    /**
     * Display a listing of the 5 most recent viewed recipes for authenticated user.
     */
    public function __construct(private readonly RecentViewedService $recentViewedService)
    {
    }

    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return $this->unauthorizedResponse();
        }

        $recentRecipes = $this->recentViewedService->recentForUser($user);

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

        $recentView = $this->recentViewedService->storeView($user, (int) $validated['recipe_id']);

        return $this->successResponse($recentView, 'Recipe view recorded successfully', 201);
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

