<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Payment extends Model
{
    protected $fillable = ['subscription_id', 'method', 'amount', 'status'];

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }

    public function paymentHistory(): HasMany
    {
        return $this->hasMany(PaymentHistory::class, 'subscription_id', 'subscription_id');
    }
}
