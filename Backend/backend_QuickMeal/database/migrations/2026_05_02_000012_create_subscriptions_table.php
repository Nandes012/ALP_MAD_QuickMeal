<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('userId')->constrained('users')->onDelete('cascade');
            $table->date('startDate');
            $table->date('endDate');
            $table->string('status')->default('active'); // active, expired, cancelled
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
