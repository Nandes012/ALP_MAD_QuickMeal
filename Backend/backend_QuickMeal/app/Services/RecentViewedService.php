<?php

namespace App\Services;

use App\Repositories\RecentViewedRepository;

class RecentViewedService
{
    public function __construct(private readonly RecentViewedRepository $repo)
    {
    }

    public function recentForUser($user)
    {
        return $this->repo->recentForUser($user);
    }

    public function storeView($user, int $recipeId)
    {
        return $this->repo->storeView($user, $recipeId);
    }
}

