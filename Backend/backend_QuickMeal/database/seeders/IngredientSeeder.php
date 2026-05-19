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
            [
                'name' => 'Ayam',
                'ingredient_picture' => 'https://images.unsplash.com/photo-1604503468506-a8da13d82791',
                'price_per_kg' => 45000,
            ],
            [
                'name' => 'Minyak',
                'ingredient_picture' => 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bbf',
                'price_per_kg' => 18000,
            ],
            [
                'name' => 'Tepung',
                'ingredient_picture' => 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b',
                'price_per_kg' => 12000,
            ],
            [
                'name' => 'Garam',
                'ingredient_picture' => 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442f',
                'price_per_kg' => 8000,
            ],
            [
                'name' => 'Telur',
                'ingredient_picture' => 'https://images.unsplash.com/photo-1506976785307-8732e854ad03',
                'price_per_kg' => 30000,
            ],
            [
                'name' => 'Bumbu Dasar',
                'ingredient_picture' => 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
                'price_per_kg' => 25000,
            ],
            [
                'name' => 'Nasi Putih',
                'ingredient_picture' => 'https://images.unsplash.com/photo-1516684732162-798a0062be99',
                'price_per_kg' => 14000,
            ],
            [
                'name' => 'Cabai',
                'ingredient_picture' => 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d',
                'price_per_kg' => 75000,
            ],
            [
                'name' => 'Bawang',
                'ingredient_picture' => 'https://images.unsplash.com/photo-1508747703725-719777637510',
                'price_per_kg' => 40000,
            ],
            [
                'name' => 'Kecap',
                'ingredient_picture' => 'https://images.unsplash.com/photo-1526318896980-cf78c088247c',
                'price_per_kg' => 22000,
            ],
            [
                'name' => 'Daging Sapi',
                'ingredient_picture' => 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f',
                'price_per_kg' => 140000,
            ],
            [
                'name' => 'Santan',
                'ingredient_picture' => 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41',
                'price_per_kg' => 20000,
            ],
            [
                'name' => 'Sayuran',
                'ingredient_picture' => 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
                'price_per_kg' => 15000,
            ],
            [
                'name' => 'Mie',
                'ingredient_picture' => 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841',
                'price_per_kg' => 17000,
            ],
            [
                'name' => 'Ikan',
                'ingredient_picture' => 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9',
                'price_per_kg' => 60000,
            ],
        ];

        foreach ($ingredients as $ingredient) {
            Ingredient::firstOrCreate(
                ['name' => $ingredient['name']],
                $ingredient
            );
        }
    }
}