<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test user only when not exists to avoid duplicate key errors
        if (!\App\Models\User::where('email', 'test@example.com')->exists()) {
            User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
        }

        // Seed recipes for testing
        $this->call(RecipeSeeder::class);
        // Seed ingredient master data
        $this->call(IngredientSeeder::class);
        // Seed recipe ingredient + price mapping
        $this->call(RecipeIngredientSeeder::class);
        // Seed recipe steps
        $this->call(RecipeStepSeeder::class);
        // Seed recipe tools
        $this->call(RecipeToolSeeder::class);
        // Seed orders for testing
        $this->call(OrderSeeder::class);
                // Seed locations
        $this->call(LocationSeeder::class);
    }
}
