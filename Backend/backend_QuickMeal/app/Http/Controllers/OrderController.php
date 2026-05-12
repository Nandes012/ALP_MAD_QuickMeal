<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\JsonResponse;

class OrderController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $orders = Order::query()->latest()->get()->map(function ($order) {
                return [
                    'id' => (string) $order->id,
                    'user_id' => $order->user_id,
                    'source_app' => $order->source_app,
                    'merchant_name' => $order->merchant_name,
                    'external_order_code' => $order->external_order_code,
                    'ordered_items_summary' => $order->ordered_items_summary,
                    'total_price' => $order->total_price,
                    'delivery_address' => $order->delivery_address,
                    'status' => $order->status,
                    'created_at' => $order->created_at,
                    'image' => $order->image_url,
                ];
            });

            return response()->json(['success' => true, 'data' => $orders]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $order = Order::find($id);
            if (!$order) {
                return response()->json(['success' => false, 'message' => 'Order not found'], 404);
            }

            $payload = [
                'id' => (string) $order->id,
                'user_id' => $order->user_id,
                'source_app' => $order->source_app,
                'merchant_name' => $order->merchant_name,
                'external_order_code' => $order->external_order_code,
                'ordered_items_summary' => $order->ordered_items_summary,
                'total_price' => $order->total_price,
                'delivery_address' => $order->delivery_address,
                'status' => $order->status,
                'created_at' => $order->created_at,
                'image' => $order->image_url,
            ];

            return response()->json(['success' => true, 'data' => $payload]);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }
}
