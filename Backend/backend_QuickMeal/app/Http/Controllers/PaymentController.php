<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\PaymentHistory;
use App\Models\Subscription;
use App\Models\SubscriptionHistory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    private const VIP_AMOUNT = 80000;
    private const VIP_DAYS = 30;

    public function current(Request $request): JsonResponse
    {
        $user = $request->user();

        $latestSubscription = Subscription::with(['payments'])
            ->where('user_id', $user->id)
            ->latest('id')
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'is_premium' => (bool) $user->is_premium,
                'subscription' => $latestSubscription,
            ],
        ]);
    }

    public function history(Request $request): JsonResponse
    {
        $user = $request->user();

        $paymentHistory = PaymentHistory::whereHas('subscription', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($payment) {
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

        return response()->json([
            'success' => true,
            'data' => $paymentHistory,
        ]);
    }

    public function createUpgrade(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'method' => 'required|string|max:50',
            'amount' => 'nullable|numeric|min:1',
        ]);

        $user = $request->user();
        $amount = (float) ($validated['amount'] ?? self::VIP_AMOUNT);
        $method = strtolower($validated['method']);
        $now = Carbon::now();
        $token = Str::uuid()->toString();

        // Check if user already has an active or completed subscription
        $lastSubscription = Subscription::where('user_id', $user->id)
            ->whereIn('status', ['active', 'completed'])
            ->latest('end_date')
            ->first();

        // If user has an active subscription, add 30 days from its end date (renewal)
        // Otherwise, start fresh from today
        if ($lastSubscription && Carbon::parse($lastSubscription->end_date)->isFuture()) {
            $startDate = Carbon::parse($lastSubscription->end_date)->toDateString();
            $endDate = Carbon::parse($lastSubscription->end_date)->addDays(self::VIP_DAYS)->toDateString();
        } else {
            $startDate = $now->toDateString();
            $endDate = $now->copy()->addDays(self::VIP_DAYS)->toDateString();
        }

        $subscription = DB::transaction(function () use ($user, $amount, $method, $startDate, $endDate, $token) {
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

        return response()->json([
            'success' => true,
            'message' => 'Upgrade payment created',
            'data' => [
                'payment_token' => $subscription->payment_token,
                'payment_url' => url('/not_official/mockupPayment?t=' . $subscription->payment_token),
                'amount' => $amount,
                'subscription' => $subscription,
                'payment_method' => $method,
                'qris_code' => 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' . urlencode(json_encode([
                    'token' => $subscription->payment_token,
                    'amount' => $amount,
                    'method' => $method,
                    'subscription_id' => $subscription->id,
                ])),
            ],
        ]);
    }

    public function confirmUpgrade(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'subscription_id' => 'required|integer|exists:subscriptions,id',
            'payment_method' => 'required|string|max:50',
        ]);

        $user = $request->user();
        $subscription = Subscription::where('user_id', $user->id)
            ->where('id', $validated['subscription_id'])
            ->firstOrFail();

        $payment = Payment::where('subscription_id', $subscription->id)->latest('id')->firstOrFail();
        $previousSubscriptionStatus = $subscription->status;
        $previousPaymentStatus = $payment->status;

        DB::transaction(function () use ($user, $subscription, $payment, $validated, $previousSubscriptionStatus, $previousPaymentStatus) {
            $subscription->update([
                'status' => 'active',
                'start_date' => $subscription->start_date,
                'end_date' => $subscription->end_date,
            ]);

            $payment->update([
                'status' => 'completed',
                'method' => $validated['payment_method'],
            ]);

            $user->update([
                'is_premium' => true,
            ]);

            PaymentHistory::create([
                'subscription_id' => $subscription->id,
                'method' => $validated['payment_method'],
                'amount' => $payment->amount,
                'status' => 'completed',
                'previous_status' => $previousPaymentStatus,
                'change_reason' => 'upgrade payment completed',
            ]);

            SubscriptionHistory::create([
                'user_id' => $user->id,
                'start_date' => $subscription->start_date,
                'end_date' => $subscription->end_date,
                'status' => 'active',
                'previous_status' => $previousSubscriptionStatus,
                'change_reason' => 'account upgraded to premium',
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Account upgraded successfully',
            'data' => [
                'is_premium' => true,
                'subscription_id' => $subscription->id,
            ],
        ]);
    }
}

