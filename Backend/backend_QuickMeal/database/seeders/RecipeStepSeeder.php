<?php

namespace Database\Seeders;

use App\Models\Recipe;
use App\Models\RecipeStep;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RecipeStepSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed recipe steps for each recipe
     */
    public function run(): void
    {
        $recipes = Recipe::all();

        foreach ($recipes as $recipe) {
            // Basic step templates
            $base = [
                "Siapkan semua bahan untuk {$recipe->name}.",
                "Cuci dan potong bahan sesuai kebutuhan.",
                "Panaskan wajan/panci lalu masak bahan hingga matang.",
                "Koreksi rasa dan tata di piring saji.",
                "Sajikan hangat dan nikmati."
            ];

            // Choose 3-5 steps
            $count = rand(3, 5);
            $chosen = array_slice($base, 0, $count);

            foreach ($chosen as $index => $desc) {
                RecipeStep::create([
                    'recipeId' => $recipe->id,
                    'stepNumber' => $index + 1,
                    'description' => $desc,
                ]);
            }
        }
    }
}
