<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Location extends Model
{
    protected $primaryKey = 'id_location';

    protected $fillable = [
        'location_name',
        'location_picture',
        'google_maps_link',
        'opening_time',
        'closing_time',
    ];

    public function ingredients(): BelongsToMany
    {
        return $this->belongsToMany(
            Ingredient::class,
            'ingredient_location',
            'id_location',
            'ingredient_id'
        )->withTimestamps();
    }
}