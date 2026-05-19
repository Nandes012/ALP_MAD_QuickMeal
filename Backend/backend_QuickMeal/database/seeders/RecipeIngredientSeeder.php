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
        $bumbuDasar = 'Bumbu Dasar';

        $recipeIngredientMap = [
            'Ayam Goreng' => [
                ['Ayam', '1 ekor', 10000],
                ['Minyak', '500 ml', 2000],
                ['Tepung', '200 gr', 3000],
                ['Garam', '1 sdt', 500],
                ['Telur', '1 butir', 2500],
            ],
            'Ayam Bakar' => [
                ['Ayam', '1 ekor', 10000],
                ['Kecap', '3 sdm', 2000],
                [$bumbuDasar, 'secukupnya', 4000],
                ['Minyak', '100 ml', 1000],
            ],
            'Nasi Goreng' => [
                ['Nasi Putih', '1 porsi', 4000],
                ['Telur', '1 butir', 2500],
                ['Bawang', 'secukupnya', 1000],
                ['Kecap', '2 sdm', 1500],
            ],
            'Rendang' => [
                ['Daging Sapi', '500 gr', 45000],
                ['Santan', '500 ml', 8000],
                [$bumbuDasar, 'secukupnya', 5000],
            ],
            'Sate' => [
                ['Ayam', '500 gr', 12000],
                [$bumbuDasar, 'secukupnya', 4000],
                ['Kecap', '2 sdm', 1500],
            ],
            'Bakso' => [
                ['Daging Sapi', '300 gr', 25000],
                [$bumbuDasar, 'secukupnya', 3000],
                ['Mie', '1 porsi', 3000],
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
