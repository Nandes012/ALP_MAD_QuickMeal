<?php

namespace App\Http\Controllers;

use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(private readonly PaymentService $paymentService)
    {
    }

    public function current(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => $this->paymentService->current($user),
        ]);
    }

    public function history(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => $this->paymentService->history($user),
        ]);
    }

    public function createUpgrade(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'method' => 'required|string|max:50',
            'amount' => 'nullable|numeric|min:1',
        ]);

        $user = $request->user();

        $result = $this->paymentService->createUpgrade($user, $validated['method'], isset($validated['amount']) ? (float)$validated['amount'] : null);

        return response()->json([
            'success' => true,
            'message' => 'Upgrade payment created',
            'data' => [
                'payment_token' => $result['payment_token'],
                'payment_url' => url('/not_official/mockupPayment?t=' . $result['payment_token']),
                'amount' => $result['amount'],
                'subscription' => $result['subscription'],
                'payment_method' => $result['method'],
                'qris_code' => 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=' . urlencode(json_encode([
                    'token' => $result['payment_token'],
                    'amount' => $result['amount'],
                    'method' => $result['method'],
                    'subscription_id' => $result['subscription']->id,
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

        $result = $this->paymentService->confirmUpgrade($user, (int)$validated['subscription_id'], $validated['payment_method']);

        return response()->json([
            'success' => true,
            'message' => 'Account upgraded successfully',
            'data' => $result,
        ]);
    }
}

