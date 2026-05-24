<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * GET /api/auth/me
     */
    public function up(): void
    {
        Schema::create('ingredient_location', function (Blueprint $table) {

            $table->id();

            $table->unsignedBigInteger('ingredient_id');

            $table->unsignedBigInteger('id_location');

            $table->integer('price_per_kg_location')->nullable();

            $table->foreign('ingredient_id')
                ->references('id')
                ->on('ingredients')
                ->onDelete('cascade');

            $table->foreign('id_location')
                ->references('id_location')
                ->on('locations')
                ->onDelete('cascade');

            $table->timestamps();
        });
    }   

    /**
     * GET /api/auth/me
     */
    public function down(): void
    {
        Schema::dropIfExists('ingredient_location');
    }
};