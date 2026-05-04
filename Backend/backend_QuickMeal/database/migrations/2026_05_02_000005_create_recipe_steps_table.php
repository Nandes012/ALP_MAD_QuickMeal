<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('recipeSteps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recipeId')->constrained('recipes')->onDelete('cascade');
            $table->integer('stepNumber');
            $table->text('description');
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('recipeSteps');
    }
};
