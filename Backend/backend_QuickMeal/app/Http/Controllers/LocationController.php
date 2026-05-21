<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ApiResponses;
use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    use ApiResponses;

    /**
     * GET /api/locations
     */
    public function index(Request $request)
    {
        $query = Location::with('ingredients');
        [$locations, $paginator] = $this->paginateOrLimit($query, $request);

        return $this->successResponse(
            $locations,
            null,
            200,
            $paginator ? ['meta' => $this->paginationMeta($paginator)] : []
        );
    }

    /**
     * GET /api/locations/{id}
     */
    public function show($id)
    {
        $location = Location::with('ingredients')
            ->find($id);

        if (!$location) {
            return $this->notFoundResponse('Location');
        }

        return $this->successResponse($location);
    }

    /**
     * POST /api/locations
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'location_name' => 'required|string|max:255',
            'road_name' => 'nullable|string|max:255',
            'location_picture' => 'required|string',
            'google_maps_link' => 'required|string',
            'opening_time' => 'nullable|date_format:H:i',
            'closing_time' => 'nullable|date_format:H:i',
            'ingredient_ids' => 'nullable|array',
            'ingredient_ids.*' => 'exists:ingredients,id',
        ]);

        $location = Location::create([
            'location_name' => $validated['location_name'],
            'road_name' => $validated['road_name'] ?? null,
            'location_picture' => $validated['location_picture'],
            'google_maps_link' => $validated['google_maps_link'],
            'opening_time' => $validated['opening_time'] ?? null,
            'closing_time' => $validated['closing_time'] ?? null,
        ]);

        if (!empty($validated['ingredient_ids'])) {
            $location->ingredients()->attach($validated['ingredient_ids']);
        }

        return $this->successResponse($location->load('ingredients'), 'Location created successfully', 201);
    }

    /**
     * PUT /api/locations/{id}
     */
    public function update(Request $request, $id)
    {
        $location = Location::find($id);

        if (!$location) {
            return $this->notFoundResponse('Location');
        }

        $validated = $request->validate([
            'location_name' => 'sometimes|string|max:255',
            'road_name' => 'nullable|string|max:255',
            'location_picture' => 'sometimes|string',
            'google_maps_link' => 'sometimes|string',
            'opening_time' => 'nullable|date_format:H:i',
            'closing_time' => 'nullable|date_format:H:i',
            'ingredient_ids' => 'nullable|array',
            'ingredient_ids.*' => 'exists:ingredients,id',
        ]);

        $location->update($validated);

        if (isset($validated['ingredient_ids'])) {
            $location->ingredients()->sync($validated['ingredient_ids']);
        }

        return $this->successResponse($location->load('ingredients'), 'Location updated successfully');
    }

    /**
     * DELETE /api/locations/{id}
     */
    public function destroy($id)
    {
        $location = Location::find($id);

        if (!$location) {
            return $this->notFoundResponse('Location');
        }

        $location->delete();

        return $this->successResponse(null, 'Location deleted successfully');
    }
}
