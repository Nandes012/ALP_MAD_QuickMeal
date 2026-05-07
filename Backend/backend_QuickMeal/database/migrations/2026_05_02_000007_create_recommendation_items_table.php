<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        // Ensure any leftover table from a failed previous run is removed, then recreate.
        Schema::dropIfExists('recommendation_items');

        Schema::create('recommendation_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recommendation_id')->constrained('recommendations')->onDelete('cascade');
            $table->foreignId('recipe_id')->nullable()->constrained('recipes')->onDelete('cascade');
            // `foods` table may be created after this migration in some ordering; keep this nullable and avoid FK to prevent errors.
            $table->unsignedBigInteger('food_id')->nullable()->index();
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('recommendation_items');
    }
};
