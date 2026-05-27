<?php

namespace App\Services;

use App\Repositories\LocationRepository;
use Illuminate\Http\Request;

class LocationService
{
    public function __construct(private readonly LocationRepository $repo)
    {
    }

    public function index(Request $request): array
    {
        return $this->repo->index($request);
    }

    public function findById($id)
    {
        return $this->repo->findById($id);
    }

    public function create(array $validated)
    {
        return $this->repo->create($validated);
    }

    public function update($id, array $validated)
    {
        return $this->repo->update($id, $validated);
    }

    public function delete($id): bool
    {
        return $this->repo->delete($id);
    }
}
