<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IngredientLocation extends Model
{
    protected $table = 'ingredient_location';

    protected $fillable = [
        'ingredient_id',
        'id_location',
        'price_per_kg_location',
    ];

    protected $casts = [
        'price_per_kg_location' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function ingredient(): BelongsTo
    {
        return $this->belongsTo(
            Ingredient::class,
            'ingredient_id'
        );
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(
            Location::class,
            'id_location',
        );
    }
}