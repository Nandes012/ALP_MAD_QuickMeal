<?php

namespace Database\Seeders;

use App\Models\Recipe;
use App\Models\RecipeTool;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RecipeToolSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the recipe_tools table with sample data
     */
    public function run(): void
    {
        // Common tools for cooking
        $commonTools = [
            ['tool_name' => 'Wajan', 'description' => 'Untuk menumis dan menggoreng'],
            ['tool_name' => 'Pisau', 'description' => 'Untuk memotong bahan-bahan'],
            ['tool_name' => 'Talenan', 'description' => 'Alas untuk memotong bahan'],
            ['tool_name' => 'Spatula', 'description' => 'Untuk mengaduk dan memindahkan masakan'],
            ['tool_name' => 'Sendok Makan', 'description' => 'Untuk mengaduk dan menyajikan'],
            ['tool_name' => 'Garpu', 'description' => 'Untuk memutar atau mengaduk bahan'],
            ['tool_name' => 'Panci', 'description' => 'Untuk merebus dan memasak kuah'],
            ['tool_name' => 'Penggorengan Dalam', 'description' => 'Untuk menggoreng dengan minyak banyak'],
            ['tool_name' => 'Saringan', 'description' => 'Untuk menyaring dan mencuci bahan'],
            ['tool_name' => 'Mangkuk Aduk', 'description' => 'Untuk mencampur bahan-bahan'],
        ];

        // Get all recipes
        $recipes = Recipe::all();

        // For each recipe, add 4-5 random tools
        foreach ($recipes as $recipe) {
            // Shuffle tools and take 4-5
            $shuffled = collect($commonTools)->shuffle()->take(rand(4, 5));
            
            foreach ($shuffled as $tool) {
                RecipeTool::create([
                    'recipe_id' => $recipe->id,
                    'tool_name' => $tool['tool_name'],
                    'description' => $tool['description'],
                ]);
            }
        }
    }
}
