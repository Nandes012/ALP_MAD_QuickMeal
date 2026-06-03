<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use App\Models\Recipe;
use App\Models\RecipeIngredient;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RecipeIngredientSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $recipeIngredientMap = [
            'Telur Ceplok Kecap' => [
                ['Telur Ayam Ras', '2 butir', 5000],
                ['Kecap Manis', '2 sdm', 3000],
                ['Minyak Goreng Kemasan', '2 sdm', 2000],
                ['Bawang Merah', '2 siung', 2000],
                ['Garam Konsumsi Beryodium (Halus)', '1 sdt', 500],
            ],
            'Tumis Sawi Putih & Bakso' => [
                ['Sawi Putih', '200 gr', 1600],
                ['Bakso', '100 gr', 4000],
                ['Minyak Goreng Kemasan', '2 sdm', 2000],
                ['Bawang Putih Bonggol', '3 siung', 2400],
                ['Garam Konsumsi Beryodium (Halus)', '1 sdt', 500],
            ],
            'Orek Tempe Kecap' => [
                ['Tempe', '1 blok', 3000],
                ['Kecap Manis', '2 sdm', 3000],
                ['Minyak Goreng Kemasan', '3 sdm', 3000],
                ['Bawang Merah', '2 siung', 2000],
                ['Cabai Rawit Merah', '2 buah', 1000],
            ],
            'Sup Telur Tomat' => [
                ['Telur Ayam Ras', '2 butir', 5000],
                ['Tomat', '2 buah', 3000],
                ['Bawang Putih Bonggol', '3 siung', 2400],
                ['Bawang Merah', '2 siung', 2000],
                ['Garam Konsumsi Beryodium (Halus)', '1 sdt', 500],
            ],
            'Sosis Asam Manis' => [
                ['Sosis', '150 gr', 5250],
                ['Kecap Manis', '3 sdm', 4500],
                ['Cuka', '1 sdm', 1500],
                ['Minyak Goreng Kemasan', '2 sdm', 2000],
                ['Bawang Merah', '2 siung', 2000],
            ],
            'Nasi Goreng Orak Arik' => [
                ['Beras Medium', '1 porsi', 5000],
                ['Telur Ayam Ras', '2 butir', 5000],
                ['Bawang Putih Bonggol', '3 siung', 2400],
                ['Kecap Manis', '2 sdm', 3000],
                ['Minyak Goreng Kemasan', '2 sdm', 2000],
            ],
            'Orak Arik Telur Sosis' => [
                ['Telur Ayam Ras', '3 butir', 7500],
                ['Sosis', '100 gr', 3500],
                ['Bawang Putih Bonggol', '3 siung', 2400],
                ['Minyak Goreng Kemasan', '2 sdm', 2000],
                ['Garam Konsumsi Beryodium (Halus)', '1 sdt', 500],
            ],
            'Tempe Goreng Kriuk' => [
                ['Tempe', '1 blok', 3000],
                ['Tepung Terigu Kemasan', '200 gr', 2000],
                ['Garam Konsumsi Beryodium (Halus)', '1 sdt', 500],
                ['Minyak Goreng Kemasan', '500 ml', 6000],
                ['Cabai Rawit Merah', '2 buah', 1000],
            ],
            'Martabak Mie Telur' => [
                ['Mie Instan', '1 bungkus', 2500],
                ['Telur Ayam Ras', '2 butir', 5000],
                ['Bawang Putih Bonggol', '2 siung', 1600],
                ['Minyak Goreng Kemasan', '2 sdm', 2000],
                ['Garam Konsumsi Beryodium (Halus)', '1 sdt', 500],
            ],
            'Tahu Tumis Kecap' => [
                ['Tahu Mentah', '200 gr', 2000],
                ['Kecap Manis', '2 sdm', 3000],
                ['Minyak Goreng Kemasan', '2 sdm', 2000],
                ['Bawang Putih Bonggol', '3 siung', 2400],
                ['Garam Konsumsi Beryodium (Halus)', '1 sdt', 500],
            ],
        ];

        foreach ($recipeIngredientMap as $recipeName => $items) {
            $recipe = Recipe::where('name', $recipeName)->first();
            if (!$recipe) {
                continue;
            }

            foreach ($items as [$ingredientName, $quantity, $priceEstimate]) {
                $ingredient = Ingredient::where('name', $ingredientName)->first();
                if (!$ingredient) {
                    continue;
                }

                RecipeIngredient::updateOrCreate(
                    [
                        'recipe_id' => $recipe->id,
                        'ingredient_id' => $ingredient->id,
                    ],
                    [
                        'quantity' => $quantity,
                        'price_estimate' => $priceEstimate,
                    ]
                );
            }
        }
    }
}
