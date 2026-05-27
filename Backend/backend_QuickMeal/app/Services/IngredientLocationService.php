<?php

namespace App\Services;

use App\Repositories\IngredientLocationRepository;

class IngredientLocationService
{
    public function __construct(private readonly IngredientLocationRepository $repo)
    {
    }

    public function indexForIngredient(string|int $ingredientId)
    {
        $locations = $this->repo->locationsForIngredient($ingredientId);

        if ($locations === null) {
            return null;
        }

        return $locations->map(function ($location) {
            return [
                'id_location' => $location->id_location,
                'location_name' => $location->location_name,
                'road_name' => $location->road_name,
                'location_picture' => $location->location_picture,
                'google_maps_link' => $location->google_maps_link,
                'opening_time' => $location->opening_time,
                'closing_time' => $location->closing_time,
                'price_per_kg_location' => $location->pivot->price_per_kg_location,
            ];
        });
    }

    public function findLocation(string|int $ingredientId, string|int $locationId)
    {
        $ingredientLocation = $this->repo->findLocation($ingredientId, $locationId);

        if (!$ingredientLocation) {
            return null;
        }

        return [
            'id_location' => $ingredientLocation->location->id_location,
            'location_name' => $ingredientLocation->location->location_name,
            'road_name' => $ingredientLocation->location->road_name,
            'location_picture' => $ingredientLocation->location->location_picture,
            'google_maps_link' => $ingredientLocation->location->google_maps_link,
            'opening_time' => $ingredientLocation->location->opening_time,
            'closing_time' => $ingredientLocation->location->closing_time,
            'price_per_kg_location' => $ingredientLocation->price_per_kg_location,
        ];
    }

    public function locationsWithPrices(string|int $ingredientId)
    {
        $locations = $this->repo->locationsForIngredient($ingredientId);

        if ($locations === null) {
            return null;
        }

        return $locations->map(function ($location) {
            return [
                'id_location' => $location->id_location,
                'location_name' => $location->location_name,
                'road_name' => $location->road_name,
                'location_picture' => $location->location_picture,
                'google_maps_link' => $location->google_maps_link,
                'opening_time' => $location->opening_time,
                'closing_time' => $location->closing_time,
            ];
        });
    }
}
