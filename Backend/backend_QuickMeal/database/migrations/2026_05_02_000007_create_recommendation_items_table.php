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

        Schema::create('recommendationItems', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recommendationId')->constrained('recommendations')->onDelete('cascade');
            $table->foreignId('recipeId')->nullable()->constrained('recipes')->onDelete('cascade');
            // `foods` table may be created after this migration in some ordering; keep this nullable and avoid FK to prevent errors.
            $table->unsignedBigInteger('foodId')->nullable()->index();
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('recommendationItems');
    }
};
