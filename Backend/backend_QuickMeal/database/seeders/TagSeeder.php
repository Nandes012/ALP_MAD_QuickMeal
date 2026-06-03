<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tag;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [

            // TAG RESEP
            ['name' => 'Gorengan', 'type' => 'resep','icon'=>'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGDuAIy1GsGMV_2J14UMxC0DueC6yAKZjaEQ&s'],
            ['name' => 'Cemilan', 'type' => 'resep', 'icon'=>'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2VRh4MXua41tl4Kl6UmoL3g_CtDDaotHnCQ&s'],
            ['name' => 'Seafood', 'type' => 'resep', 'icon'=>'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz0FPuyJbjog71AUDqjQz36a1jJ19XcwV6Hg&s'],
            ['name' => 'Tumisan', 'type' => 'resep', 'icon'=>'storage/profile_pictures/215b4789-1233-4333-969d-4c3bbf363903.png'],
            ['name' => 'Kuah', 'type' => 'resep', 'icon'=>'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLjTuZfi9QALHnBxmdGr2kSj-ODor983RkOQ&s'],
            ['name' => 'Bakaran', 'type' => 'resep', 'icon'=>'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTu1XaFxHcvi7awzQ3YgWR-Lw87WyR2STDi8A&s'],
            ['name' => 'Panggang', 'type' => 'resep', 'icon'=>'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTei8iGYtBvWmka7carql8EVZ7fRef3gFHRFg&s'],

            // TAG BAHAN
            ['name' => 'Sayuran', 'type' => 'bahan', 'icon'=>'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4JsKCq46MQM9wl_yB6CiQ4jDyPSzX-9dBiw&s'],
            ['name' => 'Buah-buahan', 'type' => 'bahan', 'icon'=>'https://st2.depositphotos.com/7520316/11068/v/950/depositphotos_110680048-stock-illustration-fruit-icon-fruit-sign.jpg'],
            ['name' => 'bumbu dapur', 'type' => 'bahan', 'icon'=>'https://i.pinimg.com/originals/4d/c6/e7/4dc6e71ef8ce1265e174ce75f37fd94e.png'],
            ['name' => 'produk hewani', 'type' => 'bahan', 'icon'=>'https://www.shutterstock.com/image-vector/steak-meat-icon-isolated-on-260nw-2463464161.jpg'],
            ['name' => 'Kacang-kacangan', 'type' => 'bahan', 'icon'=>'https://i.pinimg.com/736x/ba/c4/29/bac42978ede9f323693907ba1411a66a.jpg'],
            ['name' => 'produk Susu', 'type' => 'bahan', 'icon'=>'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0NJ8AGz6zeQr-yqCVzI5kQ9xFrlwJ6FwrZA&s'],
        ];

        foreach ($tags as $tag) {
            Tag::firstOrCreate(
                ['name' => $tag['name']],
                $tag
            );
        }
    }
}