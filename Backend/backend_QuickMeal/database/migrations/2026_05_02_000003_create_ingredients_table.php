<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ingredients', function (Blueprint $table) {
            $table->id();

            $table->string('name');

            // Picture URL
            $table->string('ingredient_picture')->nullable();

            // Video stored in database
            $table->text('ingredient_video')->nullable();

            // Price per kilogram
            $table->integer('price_per_kg')->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ingredients');
    }
};