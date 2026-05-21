<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TagRecipe extends Model
{
    protected $table = 'tags';

    protected $fillable = [
        'Tag_id',
        'Recipe_id'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function tag(): belongsTo
    {
        return $this->belongsTo(Tag::class, 'tag_id');
    }   

    public function recipe(): belongsTo
    {
        return $this->belongsTo(Recipe::class, 'recipe_id');
    }
}
