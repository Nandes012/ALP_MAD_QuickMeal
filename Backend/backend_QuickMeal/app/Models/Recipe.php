<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Recipe extends Model
{
    protected $fillable = ['name', 'description', 'cookingTime', 'difficulty', 'imageUrl', 'video'];

    public function ingredients(): HasMany
    {
        return $this->hasMany(RecipeIngredient::class);
    }

    public function steps(): HasMany
    {
        return $this->hasMany(RecipeStep::class, 'recipeId');
    }

    public function tools(): HasMany
    {
        return $this->hasMany(RecipeTool::class);
    }

    public function recommendations()
    {
        return $this->hasMany(RecommendationItem::class);
    }

    public function recentViews(): HasMany
    {
        return $this->hasMany(RecentViewedRecipe::class);
    }

    public function tags()
    {
        return $this->belongsToMany(tag::class, 'recipe_tag', 'recipe_id', 'tag_id');
    }
}
