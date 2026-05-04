<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Food extends Model
{
    protected $fillable = ['restaurantId', 'name', 'price', 'imageUrl', 'estimatedDeliveryTime'];

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function recommendations()
    {
        return $this->hasMany(RecommendationItem::class);
    }
}
