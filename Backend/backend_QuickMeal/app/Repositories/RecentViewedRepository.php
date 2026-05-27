<?php

namespace App\Repositories;

use App\Models\RecentViewedRecipe;

class RecentViewedRepository
{
    public function recentForUser($user)
    {
        return RecentViewedRecipe::where('user_id', $user->id)
            ->with('recipe')
            ->latest('created_at')
            ->limit(5)
            ->get();
    }

    public function storeView($user, int $recipeId)
    {
        RecentViewedRecipe::where('user_id', $user->id)
            ->where('recipe_id', $recipeId)
            ->delete();

        $recentView = RecentViewedRecipe::create([
            'user_id' => $user->id,
            'recipe_id' => $recipeId,
        ]);

        RecentViewedRecipe::where('user_id', $user->id)
            ->whereNotIn('id', RecentViewedRecipe::where('user_id', $user->id)
                ->latest('created_at')
                ->limit(5)
                ->pluck('id'))
            ->delete();

        return $recentView->load('recipe');
    }
}
