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
            ['name' => 'Gorengan'],
            ['name' => 'Cemilan'],
            ['name' => 'Seafood'],
            ['name' => 'Tumisan'],
            ['name' => 'Kuah'],
            ['name' => 'Bakaran'],
            ['name' => 'Panggang'],

            // TAG BAHAN
            ['name' => 'Sayuran'],
            ['name' => 'Buah-buahan'],
            ['name' => 'Dapur'],
            ['name' => 'produk hewani'],
            ['name' => 'Kacang-kacangan'],
            ['name' => 'produk Susu'],
        ];

        foreach ($tags as $tag) {
            Tag::firstOrCreate(
                ['name' => $tag['name']],
                $tag
            );
        }
    }
}