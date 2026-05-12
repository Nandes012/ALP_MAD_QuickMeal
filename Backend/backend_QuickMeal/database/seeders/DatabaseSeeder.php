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
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        // Seed recipes for testing
        $this->call(RecipeSeeder::class);
        // Seed ingredient master data
        $this->call(IngredientSeeder::class);
        // Seed recipe ingredient + price mapping
        $this->call(RecipeIngredientSeeder::class);
        // Seed orders for testing
        $this->call(OrderSeeder::class);
    }
}
