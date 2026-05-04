<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('foods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('restaurantId')->constrained('restaurants')->onDelete('cascade');
            $table->string('name');
            $table->decimal('price', 10, 2);
            $table->string('imageUrl')->nullable();
            $table->integer('estimatedDeliveryTime'); // in minutes
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('foods');
    }
};
