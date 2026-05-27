<?php

namespace App\Repositories;

use App\Models\PaymentHistory;
use App\Models\Subscription;
use App\Models\Payment;
use App\Models\SubscriptionHistory;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentRepository
{
    public function latestSubscriptionForUser($user)
    {
        return Subscription::with(['payments'])
            ->where('user_id', $user->id)
            ->latest('id')
            ->first();
    }

    public function paymentHistoryForUser($user)
    {
        return PaymentHistory::whereHas('subscription', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->orderByDesc('created_at')->get();
    }

    public function createSubscriptionWithPayment($user, $startDate, $endDate, $method, $amount, $token)
    {
        return DB::transaction(function () use ($user, $startDate, $endDate, $method, $amount, $token) {
            $subscription = Subscription::create([
                'user_id' => $user->id,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => 'pending',
            ]);

            $payment = Payment::create([
                'subscription_id' => $subscription->id,
                'method' => $method,
                'amount' => $amount,
                'status' => 'pending',
            ]);

            PaymentHistory::create([
                'subscription_id' => $subscription->id,
                'method' => $method,
                'amount' => $amount,
                'status' => 'pending',
                'previous_status' => null,
                'change_reason' => 'upgrade initiated',
            ]);

            SubscriptionHistory::create([
                'user_id' => $user->id,
                'start_date' => $subscription->start_date,
                'end_date' => $subscription->end_date,
                'status' => 'pending',
                'previous_status' => null,
                'change_reason' => 'upgrade initiated',
            ]);

            $subscription->setRelation('payments', collect([$payment]));
            $subscription->payment_token = $token;

            return $subscription;
        });
    }

    public function findSubscriptionForUser($user, int $subscriptionId)
    {
        return Subscription::where('user_id', $user->id)
            ->where('id', $subscriptionId)
            ->firstOrFail();
    }

    public function latestPaymentForSubscription($subscription)
    {
        return Payment::where('subscription_id', $subscription->id)->latest('id')->firstOrFail();
    }

    public function recordCompletion($subscription, $paymentMethod, $previousSubscriptionStatus, $previousPaymentStatus, $payment)
    {
        DB::transaction(function () use ($subscription, $paymentMethod, $previousSubscriptionStatus, $previousPaymentStatus, $payment) {
            $subscription->update([
                'status' => 'active',
                'start_date' => $subscription->start_date,
                'end_date' => $subscription->end_date,
            ]);

            $payment->update([
                'status' => 'completed',
                'method' => $paymentMethod,
            ]);

            PaymentHistory::create([
                'subscription_id' => $subscription->id,
                'method' => $paymentMethod,
                'amount' => $payment->amount,
                'status' => 'completed',
                'previous_status' => $previousPaymentStatus,
                'change_reason' => 'upgrade payment completed',
            ]);

            SubscriptionHistory::create([
                'user_id' => $subscription->user_id,
                'start_date' => $subscription->start_date,
                'end_date' => $subscription->end_date,
                'status' => 'active',
                'previous_status' => $previousSubscriptionStatus,
                'change_reason' => 'account upgraded to premium',
            ]);
        });
    }
}
