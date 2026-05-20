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
        Schema::create('locations', function (Blueprint $table) {
            $table->id('id_location');

            $table->string('location_name');

            $table->string('road_name')->nullable();

            $table->text('location_picture');

            $table->text('google_maps_link');

            $table->timestamps();
        });
    }

    /**
     * GET /api/auth/me
     */
    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};