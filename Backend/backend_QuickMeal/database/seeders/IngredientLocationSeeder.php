<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IngredientLocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ingredientLocations = [

            // Ayam -> Pasar Butung & Hypermart
            [
                'ingredient_id' => 1,
                'id_location' => 1,
                'price_per_kg_location' => 35000,
            ],
            [
                'ingredient_id' => 1,
                'id_location' => 3,
                'price_per_kg_location' => 42000,
            ],

            // Minyak -> Hypermart & Lotte Mart
            [
                'ingredient_id' => 2,
                'id_location' => 3,
                'price_per_kg_location' => 18000,
            ],
            [
                'ingredient_id' => 2,
                'id_location' => 4,
                'price_per_kg_location' => 20000,
            ],

            // Tepung -> Pasar Terong & Lotte Mart
            [
                'ingredient_id' => 3,
                'id_location' => 2,
                'price_per_kg_location' => 12000,
            ],
            [
                'ingredient_id' => 3,
                'id_location' => 4,
                'price_per_kg_location' => 15000,
            ],

            // Garam -> Semua tempat
            [
                'ingredient_id' => 4,
                'id_location' => 1,
                'price_per_kg_location' => 5000,
            ],
            [
                'ingredient_id' => 4,
                'id_location' => 2,
                'price_per_kg_location' => 5500,
            ],
            [
                'ingredient_id' => 4,
                'id_location' => 3,
                'price_per_kg_location' => 7000,
            ],
            [
                'ingredient_id' => 4,
                'id_location' => 4,
                'price_per_kg_location' => 7500,
            ],
            [
                'ingredient_id' => 4,
                'id_location' => 5,
                'price_per_kg_location' => 5000,
            ],

            // Telur -> Pasar Butung
            [
                'ingredient_id' => 5,
                'id_location' => 1,
                'price_per_kg_location' => 28000,
            ],

            // Cabai -> Pasar Terong & Pa'baeng-Baeng
            [
                'ingredient_id' => 8,
                'id_location' => 2,
                'price_per_kg_location' => 45000,
            ],
            [
                'ingredient_id' => 8,
                'id_location' => 5,
                'price_per_kg_location' => 43000,
            ],

            // Daging Sapi -> Hypermart & Lotte Mart
            [
                'ingredient_id' => 11,
                'id_location' => 3,
                'price_per_kg_location' => 135000,
            ],
            [
                'ingredient_id' => 11,
                'id_location' => 4,
                'price_per_kg_location' => 140000,
            ],

            // Sayuran -> Pasar Terong & Pa'baeng-Baeng
            [
                'ingredient_id' => 13,
                'id_location' => 2,
                'price_per_kg_location' => 10000,
            ],
            [
                'ingredient_id' => 13,
                'id_location' => 5,
                'price_per_kg_location' => 9000,
            ],

            // Ikan -> Pasar Butung
            [
                'ingredient_id' => 15,
                'id_location' => 1,
                'price_per_kg_location' => 65000,
            ],
        ];

        DB::table('ingredient_location')->insert($ingredientLocations);
    }
}