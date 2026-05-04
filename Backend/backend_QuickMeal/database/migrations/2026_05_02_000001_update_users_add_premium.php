<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        // If the users table already exists, add the column only when missing.
        if (Schema::hasTable('users')) {
            if (!Schema::hasColumn('users', 'isPremium')) {
                Schema::table('users', function (Blueprint $table) {
                    $table->boolean('isPremium')->default(false)->after('password');
                });
            }
            return;
        }

        // If users table does not exist (e.g. migrations ordering / clean DB), create it with the expected schema.
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('emailVerifiedAt')->nullable();
            $table->string('password');
            $table->boolean('isPremium')->default(false);
            $table->string('rememberToken')->nullable();
            $table->timestamps();
        });
    }


    public function down(): void
    {
        if (Schema::hasTable('users') && Schema::hasColumn('users', 'isPremium')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('isPremium');
            });
        }
    }
};
