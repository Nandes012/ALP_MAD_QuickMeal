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
            ['name' => 'Gorengan', 'type' => 'resep'],
            ['name' => 'Cemilan', 'type' => 'resep'],
            ['name' => 'Seafood', 'type' => 'resep'],
            ['name' => 'Tumisan', 'type' => 'resep'],
            ['name' => 'Kuah', 'type' => 'resep'],
            ['name' => 'Bakaran', 'type' => 'resep'],
            ['name' => 'Panggang', 'type' => 'resep'],

            // TAG BAHAN
            ['name' => 'Sayuran', 'type' => 'bahan'],
            ['name' => 'Buah-buahan', 'type' => 'bahan'],
            ['name' => 'Dapur', 'type' => 'bahan'],
            ['name' => 'produk hewani', 'type' => 'bahan'],
            ['name' => 'Kacang-kacangan', 'type' => 'bahan'],
            ['name' => 'produk Susu', 'type' => 'bahan'],
        ];

        foreach ($tags as $tag) {
            Tag::firstOrCreate(
                ['name' => $tag['name']],
                $tag
            );
        }
    }
}