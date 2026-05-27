<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ApiResponses;
use App\Services\LocationService;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    use ApiResponses;

    /**
     * GET /api/locations
     */
    public function __construct(private readonly LocationService $locationService)
    {
    }

    public function index(Request $request)
    {
        [$locations, $paginator] = $this->locationService->index($request);

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
        $location = $this->locationService->findById($id);

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

        $location = $this->locationService->create($validated);

        return $this->successResponse($location, 'Location created successfully', 201);
    }

    /**
     * PUT /api/locations/{id}
     */
    public function update(Request $request, $id)
    {
        $updated = $this->locationService->update($id, $request->all());

        if (!$updated) {
            return $this->notFoundResponse('Location');
        }

        return $this->successResponse($updated, 'Location updated successfully');
    }

    /**
     * DELETE /api/locations/{id}
     */
    public function destroy($id)
    {
        $deleted = $this->locationService->delete($id);

        if (!$deleted) {
            return $this->notFoundResponse('Location');
        }

        return $this->successResponse(null, 'Location deleted successfully');
    }
}
