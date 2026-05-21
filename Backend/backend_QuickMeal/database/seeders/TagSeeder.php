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
            ['name' => 'Pedas'],
            ['name' => 'Manis'],
            ['name' => 'Gurih'],
            ['name' => 'Murah'],
            ['name' => 'Cepat'],
            ['name' => 'Sehat'],
            ['name' => 'Viral'],
            ['name' => 'Tradisional'],
            ['name' => 'Mudah'],
            ['name' => 'Protein Tinggi'],
        ];

        foreach ($tags as $tag) {
            Tag::firstOrCreate(
                ['name' => $tag['name']],
                $tag
            );
        }
    }
}