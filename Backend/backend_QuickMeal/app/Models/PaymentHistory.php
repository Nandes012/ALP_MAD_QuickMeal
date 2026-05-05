<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentHistory extends Model
{
    protected $table = 'payment_history';

    protected $fillable = [
        'subscriptionId',
        'method',
        'amount',
        'status',
        'previousStatus',
        'changeReason',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class, 'subscriptionId');
    }
}
