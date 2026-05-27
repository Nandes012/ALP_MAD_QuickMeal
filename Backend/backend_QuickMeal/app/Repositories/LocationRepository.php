<?php

namespace App\Repositories;

use App\Models\Location;
use Illuminate\Http\Request;

class LocationRepository
{
    public function index(Request $request): array
    {
        $query = Location::with('ingredients');

        if ($request->filled('page')) {
            $paginator = $query->paginate((int) $request->input('perPage', 20));

            return [collect($paginator->items()), $paginator];
        }

        return [$query->limit((int) $request->input('limit', 100))->get(), null];
    }

    public function findById($id)
    {
        return Location::with('ingredients')->find($id);
    }

    public function create(array $data)
    {
        $location = Location::create($data);

        if (!empty($data['ingredient_ids'])) {
            $location->ingredients()->attach($data['ingredient_ids']);
        }

        return $location->load('ingredients');
    }

    public function update($id, array $data)
    {
        $location = Location::find($id);

        if (!$location) {
            return null;
        }

        $location->update($data);

        if (isset($data['ingredient_ids'])) {
            $location->ingredients()->sync($data['ingredient_ids']);
        }

        return $location->load('ingredients');
    }

    public function delete($id): bool
    {
        $location = Location::find($id);

        if (!$location) {
            return false;
        }

        $location->delete();

        return true;
    }
}

