<?php

namespace Database\Seeders;

use App\Models\Order;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // External order information from other food delivery apps
        $orders = [
            [
                'user_id' => 1,
                'source_app' => 'GrabFood',
                'merchant_name' => 'Ayam Bakar Nusantara',
                'external_order_code' => 'GF-20260512-001',
                'image_url' => 'https://i.pinimg.com/736x/11/a0/8f/11a08f16b0beaa1eefdb30583f1da8f6.jpg',
                'ordered_items_summary' => 'Ayam Bakar, Nasi Putih, Es Teh',
                'total_price' => 45000.00,
                'delivery_address' => 'Jl. Merdeka No.1, Jakarta',
                'status' => 'delivered',
            ],
            [
                'user_id' => 1,
                'source_app' => 'GoFood',
                'merchant_name' => 'Bakso Pak Min',
                'external_order_code' => 'GFOD-20260512-002',
                'image_url' => 'https://i.pinimg.com/736x/49/19/c5/4919c5c03ffd9c188ae991ca5a7ea9de.jpg',
                'ordered_items_summary' => 'Bakso Urat, Mie, Jeruk Hangat',
                'total_price' => 75000.00,
                'delivery_address' => 'Jl. Sudirman No.10, Jakarta',
                'status' => 'on_delivery',
            ],
            [
                'user_id' => 1,
                'source_app' => 'ShopeeFood',
                'merchant_name' => 'Burger Corner',
                'external_order_code' => 'SF-20260512-003',
                'image_url' => 'https://i.pinimg.com/736x/90/fa/94/90fa9415fa688431e05075009f721fcd.jpg',
                'ordered_items_summary' => 'Cheese Burger, Kentang Goreng',
                'total_price' => 32000.50,
                'delivery_address' => 'Jl. Thamrin No.5, Jakarta',
                'status' => 'confirmed',
            ],
            [
                'user_id' => 1,
                'source_app' => 'GrabFood',
                'merchant_name' => 'Sate Pak Haji',
                'external_order_code' => 'GF-20260512-004',
                'image_url' => 'https://i.pinimg.com/736x/91/4e/fe/914efeca7a7527e28549b2e6cc0e8fe1.jpg',
                'ordered_items_summary' => 'Sate Ayam 20 Tusuk, Lontong',
                'total_price' => 120000.00,
                'delivery_address' => 'Jl. Kebon Kacang No.12, Jakarta',
                'status' => 'pending',
            ],
        ];

        foreach ($orders as $orderData) {
            Order::create($orderData);
        }
    }
}
