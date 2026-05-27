<?php

namespace App\Services;

use App\Repositories\PaymentRepository;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class PaymentService
{
    private const VIP_AMOUNT = 80000;
    private const VIP_DAYS = 30;

    public function __construct(private readonly PaymentRepository $repo)
    {
    }

    public function current($user)
    {
        $latestSubscription = $this->repo->latestSubscriptionForUser($user);

        return [
            'is_premium' => (bool) $user->is_premium,
            'subscription' => $latestSubscription,
        ];
    }

    public function history($user)
    {
        return $this->repo->paymentHistoryForUser($user)->map(function ($payment) {
            return [
                'id' => $payment->id,
                'method' => $payment->method,
                'amount' => $payment->amount,
                'status' => $payment->status,
                'change_reason' => $payment->change_reason,
                'created_at' => $payment->created_at->toIso8601String(),
                'formatted_date' => $payment->created_at->format('d M Y, H:i'),
            ];
        });
    }

    public function createUpgrade($user, string $method, ?float $amount = null)
    {
        $amount = $amount ?? self::VIP_AMOUNT;
        $method = strtolower($method);
        $now = Carbon::now();
        $token = Str::uuid()->toString();

        $lastSubscription = $this->repo->latestSubscriptionForUser($user);

        if ($lastSubscription && Carbon::parse($lastSubscription->end_date)->isFuture()) {
            $startDate = Carbon::parse($lastSubscription->end_date)->toDateString();
            $endDate = Carbon::parse($lastSubscription->end_date)->addDays(self::VIP_DAYS)->toDateString();
        } else {
            $startDate = $now->toDateString();
            $endDate = $now->copy()->addDays(self::VIP_DAYS)->toDateString();
        }

        $subscription = $this->repo->createSubscriptionWithPayment($user, $startDate, $endDate, $method, $amount, $token);

        return [
            'subscription' => $subscription,
            'payment_token' => $subscription->payment_token,
            'amount' => $amount,
            'method' => $method,
        ];
    }

    public function confirmUpgrade($user, int $subscriptionId, string $paymentMethod)
    {
        $subscription = $this->repo->findSubscriptionForUser($user, $subscriptionId);

        $payment = $this->repo->latestPaymentForSubscription($subscription);
        $previousSubscriptionStatus = $subscription->status;
        $previousPaymentStatus = $payment->status;

        $this->repo->recordCompletion($subscription, $paymentMethod, $previousSubscriptionStatus, $previousPaymentStatus, $payment);

        return ['is_premium' => true, 'subscription_id' => $subscription->id];
    }
}

