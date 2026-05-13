<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecipeTool extends Model
{
    protected $table = 'recipe_tools';

    protected $fillable = ['recipe_id', 'tool_name', 'description'];

    public function recipe(): BelongsTo
    {
        return $this->belongsTo(Recipe::class);
    }
}
