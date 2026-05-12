<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IngredientSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ingredients = [
            'Ayam',
            'Minyak',
            'Tepung',
            'Garam',
            'Telur',
            'Bumbu Dasar',
            'Nasi Putih',
            'Cabai',
            'Bawang',
            'Kecap',
            'Daging Sapi',
            'Santan',
            'Sayuran',
            'Mie',
            'Ikan',
        ];

        foreach ($ingredients as $name) {
            Ingredient::firstOrCreate(['name' => $name]);
        }
    }
}
