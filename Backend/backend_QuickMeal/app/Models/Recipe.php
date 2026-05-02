<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Recipe extends Model
{
    protected $fillable = ['name', 'description', 'cooking_time', 'difficulty', 'image_url'];

    public function ingredients(): HasMany
    {
        return $this->hasMany(RecipeIngredient::class);
    }

    public function steps(): HasMany
    {
        return $this->hasMany(RecipeStep::class);
    }

    public function recommendations()
    {
        return $this->hasMany(RecommendationItem::class);
    }
}
