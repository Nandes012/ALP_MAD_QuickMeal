<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TagIngredient extends Model
{
    protected $table = 'tags';

    protected $fillable = [
        'Tag_id',
        'Ingredient_id'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function tag(): belongsTo
    {
        return $this->belongsTo(Tag::class, 'tag_id');
    }   

    public function ingredient(): belongsTo
    {
        return $this->belongsTo(Ingredient::class, 'ingredient_id');
    }
}
