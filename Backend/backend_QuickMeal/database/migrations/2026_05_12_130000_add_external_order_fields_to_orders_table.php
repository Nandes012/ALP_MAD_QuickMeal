<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('source_app')->nullable()->after('user_id');
            $table->string('merchant_name')->nullable()->after('source_app');
            $table->string('external_order_code')->nullable()->after('merchant_name');
            $table->text('image_url')->nullable()->after('external_order_code');
            $table->text('ordered_items_summary')->nullable()->after('image_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'source_app',
                'merchant_name',
                'external_order_code',
                'image_url',
                'ordered_items_summary',
            ]);
        });
    }
};
