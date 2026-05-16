<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Ingredient extends Model
{
    protected $fillable = [
        'name',
        'ingredient_picture',
        'price_per_kg'
    ];

    public function recipes(): HasMany
    {
        return $this->hasMany(RecipeIngredient::class);
    }

    public function locations(): BelongsToMany
    {
        return $this->belongsToMany(
            Location::class,
            'ingredient_location',
            'ingredient_id',
            'id_location'
        );
    }
}