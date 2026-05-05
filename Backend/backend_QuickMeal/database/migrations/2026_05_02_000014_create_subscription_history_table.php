<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('subscriptionhistory', function (Blueprint $table) {
            $table->id();
            $table->foreignId('userId')->constrained('users')->onDelete('cascade');
            $table->date('startDate');
            $table->date('endDate');
            $table->string('status'); // active, expired, cancelled, paused, etc
            $table->string('previousStatus')->nullable(); // previous status before this change
            $table->string('changeReason')->nullable(); // reason for the change
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('subscription_history');
    }
};
