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
            // 1. Telur Ceplok Kecap
            ['recipe_id' => 1, 'tag_id' => 1], // Gorengan
            ['recipe_id' => 1, 'tag_id' => 2], // Cemilan

            // 2. Tumis Sawi Putih & Bakso
            ['recipe_id' => 2, 'tag_id' => 4], // Tumisan

            // 3. Orek Tempe Kecap
            ['recipe_id' => 3, 'tag_id' => 4], // Tumisan

            // 4. Sup Telur Tomat
            ['recipe_id' => 4, 'tag_id' => 5], // Kuah

            // 5. Sosis Asam Manis
            ['recipe_id' => 5, 'tag_id' => 4], // Tumisan

            // 6. Nasi Goreng Telur Orak Arik
            ['recipe_id' => 6, 'tag_id' => 4], // Tumisan

            // 7. Orak Arik Telur Sosis
            ['recipe_id' => 7, 'tag_id' => 4], // Tumisan

            // 8. Tempe Goreng Kriuk
            ['recipe_id' => 8, 'tag_id' => 1], // Gorengan
            ['recipe_id' => 8, 'tag_id' => 2], // Cemilan

            // 9. Martabak Mie Telur
            ['recipe_id' => 9, 'tag_id' => 1], // Gorengan
            ['recipe_id' => 9, 'tag_id' => 2], // Cemilan

            // 10. Tahu Tumis Kecap
            ['recipe_id' => 10, 'tag_id' => 4], // Tumisan
        ];

        DB::table('recipe_tag')->insert($recipeTags);
    }
}