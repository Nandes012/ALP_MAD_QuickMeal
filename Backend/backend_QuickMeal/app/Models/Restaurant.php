<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Restaurant extends Model
{
    protected $fillable = ['name', 'location', 'rating'];

    public function foods(): HasMany
    {
        return $this->hasMany(Food::class);
    }
}
