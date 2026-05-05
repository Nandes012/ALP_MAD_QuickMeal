<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubscriptionHistory extends Model
{
    protected $table = 'subscription_history';

    protected $fillable = [
        'userId',
        'startDate',
        'endDate',
        'status',
        'previousStatus',
        'changeReason',
    ];

    protected $casts = [
        'startDate' => 'date',
        'endDate' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'userId');
    }
}
