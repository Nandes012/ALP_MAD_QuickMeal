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
            ],
            [
                'ingredient_id' => 1,
                'id_location' => 3,
            ],

            // Minyak -> Hypermart & Lotte Mart
            [
                'ingredient_id' => 2,
                'id_location' => 3,
            ],
            [
                'ingredient_id' => 2,
                'id_location' => 4,
            ],

            // Tepung -> Pasar Terong & Lotte Mart
            [
                'ingredient_id' => 3,
                'id_location' => 2,
            ],
            [
                'ingredient_id' => 3,
                'id_location' => 4,
            ],

            // Garam -> Semua tempat
            [
                'ingredient_id' => 4,
                'id_location' => 1,
            ],
            [
                'ingredient_id' => 4,
                'id_location' => 2,
            ],
            [
                'ingredient_id' => 4,
                'id_location' => 3,
            ],
            [
                'ingredient_id' => 4,
                'id_location' => 4,
            ],
            [
                'ingredient_id' => 4,
                'id_location' => 5,
            ],

            // Telur -> Pasar Butung
            [
                'ingredient_id' => 5,
                'id_location' => 1,
            ],

            // Cabai -> Pasar Terong & Pa'baeng-Baeng
            [
                'ingredient_id' => 8,
                'id_location' => 2,
            ],
            [
                'ingredient_id' => 8,
                'id_location' => 5,
            ],

            // Daging Sapi -> Hypermart & Lotte Mart
            [
                'ingredient_id' => 11,
                'id_location' => 3,
            ],
            [
                'ingredient_id' => 11,
                'id_location' => 4,
            ],

            // Sayuran -> Pasar Terong & Pa'baeng-Baeng
            [
                'ingredient_id' => 13,
                'id_location' => 2,
            ],
            [
                'ingredient_id' => 13,
                'id_location' => 5,
            ],

            // Ikan -> Pasar Butung
            [
                'ingredient_id' => 15,
                'id_location' => 1,
            ],
        ];

        DB::table('ingredient_location')->insert($ingredientLocations);
    }
}   