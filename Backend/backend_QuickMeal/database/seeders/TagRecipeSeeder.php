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
                'tag_id' => 1,
            ],
            [
                'recipe_id' => 1,
                'tag_id' => 4,
            ],

            // Ayam Bakar
            [
                'recipe_id' => 2,
                'tag_id' => 2,
            ],
            [
                'recipe_id' => 2,
                'tag_id' => 8,
            ],

            // Nasi Goreng
            [
                'recipe_id' => 3,
                'tag_id' => 1,
            ],
            [
                'recipe_id' => 3,
                'tag_id' => 5,
            ],

            // Rendang
            [
                'recipe_id' => 9,
                'tag_id' => 1,
            ],
            [
                'recipe_id' => 9,
                'tag_id' => 8,
            ],

            // Burger
            [
                'recipe_id' => 12,
                'tag_id' => 7,
            ],
            [
                'recipe_id' => 12,
                'tag_id' => 10,
            ],
        ];

        DB::table('recipe_tag')->insert($recipeTags);
    }
}