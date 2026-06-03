<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TagIngredientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ingredientTags = [
            // 1-7. Cabai varieties → Dapur
            ['ingredient_id' => 1, 'tag_id' => 10],   // Cabai Rawit Merah
            ['ingredient_id' => 2, 'tag_id' => 10],   // Cabai Rawit Hijau
            ['ingredient_id' => 3, 'tag_id' => 10],   // Cabai Merah Besar
            ['ingredient_id' => 4, 'tag_id' => 10],   // Cabai Merah Keriting
            ['ingredient_id' => 5, 'tag_id' => 10],   // Bawang Merah
            ['ingredient_id' => 6, 'tag_id' => 10],   // Bawang Putih Bonggol
            ['ingredient_id' => 7, 'tag_id' => 10],   // Bawang Bombay

            // 8-10. Sayuran/Umbi/Kacang lainnya
            ['ingredient_id' => 8, 'tag_id' => 8],    // Tomat → Sayuran
            ['ingredient_id' => 9, 'tag_id' => 8],    // Wortel → Sayuran
            ['ingredient_id' => 10, 'tag_id' => 8],   // Kentang → Sayuran
            ['ingredient_id' => 11, 'tag_id' => 8],   // Buncis → Sayuran
            ['ingredient_id' => 12, 'tag_id' => 8],   // Sawi Hijau → Sayuran
            ['ingredient_id' => 13, 'tag_id' => 8],   // Kol/Kubis → Sayuran
            ['ingredient_id' => 14, 'tag_id' => 8],   // Kangkung → Sayuran
            ['ingredient_id' => 15, 'tag_id' => 8],   // Bayam → Sayuran
            ['ingredient_id' => 16, 'tag_id' => 8],   // Ubi Jalar → Sayuran

            // 17-19. Garam & Bumbu Dapur
            ['ingredient_id' => 17, 'tag_id' => 10],  // Garam Halus
            ['ingredient_id' => 18, 'tag_id' => 10],  // Garam Bata
            ['ingredient_id' => 19, 'tag_id' => 10],  // Jagung Pipilan

            // 20-21. Beras
            ['ingredient_id' => 20, 'tag_id' => 10],  // Beras Premium
            ['ingredient_id' => 21, 'tag_id' => 10],  // Beras Medium

            // 22-24. Daging → produk hewani
            ['ingredient_id' => 22, 'tag_id' => 11],  // Daging Sapi
            ['ingredient_id' => 23, 'tag_id' => 11],  // Daging Ayam Broiler
            ['ingredient_id' => 24, 'tag_id' => 11],  // Daging Ayam Kampung

            // 25. Telur → produk hewani
            ['ingredient_id' => 25, 'tag_id' => 11],  // Telur Ayam Ras

            // 26-30. Ikan & Seafood → produk hewani
            ['ingredient_id' => 26, 'tag_id' => 11],  // Ikan Bandeng
            ['ingredient_id' => 27, 'tag_id' => 11],  // Ikan Kembung
            ['ingredient_id' => 28, 'tag_id' => 11],  // Ikan Tongkol
            ['ingredient_id' => 29, 'tag_id' => 11],  // Udang Segar
            ['ingredient_id' => 30, 'tag_id' => 11],  // Ikan Asin Teri

            // 31-36. Tempe, Tahu & Kacang → Kacang-kacangan
            ['ingredient_id' => 31, 'tag_id' => 12],  // Tempe
            ['ingredient_id' => 32, 'tag_id' => 12],  // Tahu Mentah
            ['ingredient_id' => 33, 'tag_id' => 12],  // Kacang Tanah
            ['ingredient_id' => 34, 'tag_id' => 12],  // Kacang Hijau
            ['ingredient_id' => 35, 'tag_id' => 12],  // Kacang Kedelai Lokal
            ['ingredient_id' => 36, 'tag_id' => 12],  // Kacang Kedelai Impor

            // 37-45. Bumbu Dapur lainnya
            ['ingredient_id' => 37, 'tag_id' => 10],  // Gula Pasir
            ['ingredient_id' => 38, 'tag_id' => 10],  // Minyak Goreng Kemasan
            ['ingredient_id' => 39, 'tag_id' => 10],  // Tepung Terigu Kemasan
            ['ingredient_id' => 40, 'tag_id' => 10],  // Kecap Manis
            ['ingredient_id' => 41, 'tag_id' => 8],   // Sawi Putih → Sayuran
            ['ingredient_id' => 42, 'tag_id' => 11],  // Bakso → produk hewani
            ['ingredient_id' => 43, 'tag_id' => 11],  // Sosis → produk hewani
            ['ingredient_id' => 44, 'tag_id' => 10],  // Cuka → Dapur
            ['ingredient_id' => 45, 'tag_id' => 10],  // Mie Instan → Dapur
        ];

        DB::table('ingredient_tag')->insert($ingredientTags);
    }
}