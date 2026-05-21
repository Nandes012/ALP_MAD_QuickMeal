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
                'tag_id' => 10,
            ],

            // Cabai
            [
                'ingredient_id' => 8,
                'tag_id' => 1,
            ],

            // Sayuran
            [
                'ingredient_id' => 13,
                'tag_id' => 6,
            ],

            // Mie
            [
                'ingredient_id' => 14,
                'tag_id' => 5,
            ],

            // Ikan
            [
                'ingredient_id' => 15,
                'tag_id' => 6,
            ],
        ];

        DB::table('ingredient_tag')->insert($ingredientTags);
    }
}