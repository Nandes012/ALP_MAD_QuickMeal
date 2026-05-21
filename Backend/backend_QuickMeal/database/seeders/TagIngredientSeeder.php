<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TagIngredientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ingredientTags = [

            // Ayam
            [
                'ingredient_id' => 1,
                'tag_id' => 11, // produk hewani
            ],

            // Minyak
            [
                'ingredient_id' => 2,
                'tag_id' => 10, // Bumbu Dapur
            ],

            // Tepung
            [
                'ingredient_id' => 3,
                'tag_id' => 10, // Bumbu Dapur
            ],

            // Telur
            [
                'ingredient_id' => 5,
                'tag_id' => 13, // Susu & Telur
            ],

            // Cabai
            [
                'ingredient_id' => 8,
                'tag_id' => 10, // Bumbu Dapur
            ],

            // Bawang
            [
                'ingredient_id' => 9,
                'tag_id' => 10, // Bumbu Dapur
            ],

            // Daging Sapi
            [
                'ingredient_id' => 11,
                'tag_id' => 11, //produk hewani
            ],

            // Sayuran
            [
                'ingredient_id' => 13,
                'tag_id' => 8, // Sayuran
            ],

            // Ikan
            [
                'ingredient_id' => 15,
                'tag_id' => 3, // Seafood
            ],
            [
                'ingredient_id' => 15,
                'tag_id' => 11, // produk hewani
            ],

            // Santan
            [
                'ingredient_id' => 12,
                'tag_id' => 13, // produk susu
            ],
        ];

        DB::table('ingredient_tag')->insert($ingredientTags);
    }
}