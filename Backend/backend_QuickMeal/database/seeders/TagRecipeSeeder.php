<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TagRecipeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $recipeTags = [

            // Ayam Goreng
            [
                'recipe_id' => 1,
                'tag_id' => 1, // Gorengan
            ],
            [
                'recipe_id' => 1,
                'tag_id' => 2, // Cemilan
            ],

            // Ayam Bakar
            [
                'recipe_id' => 2,
                'tag_id' => 6, // Bakaran
            ],
            [
                'recipe_id' => 2,
                'tag_id' => 7, // Panggang
            ],

            // Nasi Goreng
            [
                'recipe_id' => 3,
                'tag_id' => 4, // Tumisan
            ],

            // Sate
            [
                'recipe_id' => 5,
                'tag_id' => 6, // Bakaran
            ],
            [
                'recipe_id' => 5,
                'tag_id' => 7, // Panggang
            ],

            // Bakso
            [
                'recipe_id' => 6,
                'tag_id' => 5, // Kuah
            ],

            // Mie Ayam
            [
                'recipe_id' => 7,
                'tag_id' => 5, // Kuah
            ],

            // Pempek
            [
                'recipe_id' => 8,
                'tag_id' => 3, // Seafood
            ],
            [
                'recipe_id' => 8,
                'tag_id' => 2, // Cemilan
            ],

            // Rendang
            [
                'recipe_id' => 9,
                'tag_id' => 5, // Kuah
            ],

            // Pisang Goreng
            [
                'recipe_id' => 14,
                'tag_id' => 1, // Gorengan
            ],
            [
                'recipe_id' => 14,
                'tag_id' => 2, // Cemilan
            ],

            // Bakwan
            [
                'recipe_id' => 15,
                'tag_id' => 1, // Gorengan
            ],
            [
                'recipe_id' => 15,
                'tag_id' => 2, // Cemilan
            ],

            // Cah Kangkung
            [
                'recipe_id' => 19,
                'tag_id' => 4, // Tumisan
            ],
        ];

        DB::table('recipe_tag')->insert($recipeTags);
    }
}