<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class tag extends Model
{
    protected $table = 'tag';

    protected $fillable = [
       'name',
       'type',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function recipe():HasMany
    {
        return $this->hasMany(Recipe::class,'recipe_id');
    }

    public function ingredient(): HasMany
    {
        return $this->hasMany(Ingredient::class, 'ingredient_id');
    }   
}
