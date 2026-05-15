<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    /**
     * GET /api/locations
     */
    public function index()
    {
        $locations = Location::with('ingredients')->get();

        return response()->json([
            'success' => true,
            'data' => $locations
        ]);
    }

    /**
     * GET /api/locations/{id}
     */
    public function show($id)
    {
        $location = Location::with('ingredients')
            ->find($id);

        if (!$location) {
            return response()->json([
                'success' => false,
                'message' => 'Location not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $location
        ]);
    }

    /**
     * POST /api/locations
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'location_name' => 'required|string|max:255',
            'location_picture' => 'required|string',
            'google_maps_link' => 'required|string',
            'ingredient_ids' => 'nullable|array',
            'ingredient_ids.*' => 'exists:ingredients,id',
        ]);

        $location = Location::create([
            'location_name' => $validated['location_name'],
            'location_picture' => $validated['location_picture'],
            'google_maps_link' => $validated['google_maps_link'],
        ]);

        if (!empty($validated['ingredient_ids'])) {
            $location->ingredients()->attach($validated['ingredient_ids']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Location created successfully',
            'data' => $location->load('ingredients')
        ], 201);
    }

    /**
     * PUT /api/locations/{id}
     */
    public function update(Request $request, $id)
    {
        $location = Location::find($id);

        if (!$location) {
            return response()->json([
                'success' => false,
                'message' => 'Location not found'
            ], 404);
        }

        $validated = $request->validate([
            'location_name' => 'sometimes|string|max:255',
            'location_picture' => 'sometimes|string',
            'google_maps_link' => 'sometimes|string',
            'ingredient_ids' => 'nullable|array',
            'ingredient_ids.*' => 'exists:ingredients,id',
        ]);

        $location->update($validated);

        if (isset($validated['ingredient_ids'])) {
            $location->ingredients()->sync($validated['ingredient_ids']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Location updated successfully',
            'data' => $location->load('ingredients')
        ]);
    }

    /**
     * DELETE /api/locations/{id}
     */
    public function destroy($id)
    {
        $location = Location::find($id);

        if (!$location) {
            return response()->json([
                'success' => false,
                'message' => 'Location not found'
            ], 404);
        }

        $location->delete();

        return response()->json([
            'success' => true,
            'message' => 'Location deleted successfully'
        ]);
    }
}