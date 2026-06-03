<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class IngredientLocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ingredientLocations = [
            // 1. Cabai Rawit Merah (Rp50.000/kg)
            ['ingredient_id' => 1, 'id_location' => 1, 'price_per_kg_location' => 50000],
            ['ingredient_id' => 1, 'id_location' => 2, 'price_per_kg_location' => 50000],

            // 2. Cabai Rawit Hijau (Rp30.000/kg)
            ['ingredient_id' => 2, 'id_location' => 1, 'price_per_kg_location' => 30000],
            ['ingredient_id' => 2, 'id_location' => 3, 'price_per_kg_location' => 30000],

            // 3. Cabai Merah Besar (Rp30.000/kg)
            ['ingredient_id' => 3, 'id_location' => 2, 'price_per_kg_location' => 30000],
            ['ingredient_id' => 3, 'id_location' => 4, 'price_per_kg_location' => 30000],

            // 4. Cabai Merah Keriting (Rp30.000/kg)
            ['ingredient_id' => 4, 'id_location' => 1, 'price_per_kg_location' => 30000],
            ['ingredient_id' => 4, 'id_location' => 3, 'price_per_kg_location' => 30000],

            // 5. Bawang Merah (Rp45.000/kg)
            ['ingredient_id' => 5, 'id_location' => 1, 'price_per_kg_location' => 45000],
            ['ingredient_id' => 5, 'id_location' => 5, 'price_per_kg_location' => 45000],

            // 6. Bawang Putih Bonggol (Rp35.000/kg)
            ['ingredient_id' => 6, 'id_location' => 3, 'price_per_kg_location' => 35000],
            ['ingredient_id' => 6, 'id_location' => 2, 'price_per_kg_location' => 35000],

            // 7. Bawang Bombay (Rp35.000/kg)
            ['ingredient_id' => 7, 'id_location' => 6, 'price_per_kg_location' => 35000],
            ['ingredient_id' => 7, 'id_location' => 7, 'price_per_kg_location' => 35000],

            // 8. Tomat (Rp18.000/kg)
            ['ingredient_id' => 8, 'id_location' => 3, 'price_per_kg_location' => 18000],
            ['ingredient_id' => 8, 'id_location' => 2, 'price_per_kg_location' => 18000],

            // 9. Wortel (Rp10.000/kg)
            ['ingredient_id' => 9, 'id_location' => 3, 'price_per_kg_location' => 10000],
            ['ingredient_id' => 9, 'id_location' => 4, 'price_per_kg_location' => 10000],

            // 10. Kentang (Rp15.000/kg)
            ['ingredient_id' => 10, 'id_location' => 1, 'price_per_kg_location' => 15000],
            ['ingredient_id' => 10, 'id_location' => 2, 'price_per_kg_location' => 15000],

            // 11. Buncis (Rp15.000/kg)
            ['ingredient_id' => 11, 'id_location' => 3, 'price_per_kg_location' => 15000],
            ['ingredient_id' => 11, 'id_location' => 5, 'price_per_kg_location' => 15000],

            // 12. Sawi Hijau (Rp10.000/ikat besar)
            ['ingredient_id' => 12, 'id_location' => 2, 'price_per_kg_location' => 10000],
            ['ingredient_id' => 12, 'id_location' => 8, 'price_per_kg_location' => 10000],

            // 13. Kol / Kubis (Rp10.000/kg)
            ['ingredient_id' => 13, 'id_location' => 3, 'price_per_kg_location' => 10000],
            ['ingredient_id' => 13, 'id_location' => 4, 'price_per_kg_location' => 10000],

            // 14. Kangkung (Rp10.000/ikat besar)
            ['ingredient_id' => 14, 'id_location' => 9, 'price_per_kg_location' => 10000],
            ['ingredient_id' => 14, 'id_location' => 2, 'price_per_kg_location' => 10000],

            // 15. Bayam (Rp10.000/ikat besar)
            ['ingredient_id' => 15, 'id_location' => 5, 'price_per_kg_location' => 10000],
            ['ingredient_id' => 15, 'id_location' => 8, 'price_per_kg_location' => 10000],

            // 16. Ketela Pohon / Singkong (Rp5.500/kg)
            ['ingredient_id' => 16, 'id_location' => 4, 'price_per_kg_location' => 5500],

            // 17. Ubi Jalar (Rp8.000/kg)
            ['ingredient_id' => 17, 'id_location' => 9, 'price_per_kg_location' => 8000],
            ['ingredient_id' => 17, 'id_location' => 5, 'price_per_kg_location' => 8000],

            // 18. Garam Konsumsi Beryodium (Halus) (Rp4.750/250gr)
            ['ingredient_id' => 18, 'id_location' => 12, 'price_per_kg_location' => 19000],

            // 19. Garam Konsumsi Beryodium (Bata) (Rp3.700/250gr)
            ['ingredient_id' => 19, 'id_location' => 13, 'price_per_kg_location' => 14800],

            // 20. Jagung Pipilan Kering (Rp7.900/kg)
            ['ingredient_id' => 20, 'id_location' => 14, 'price_per_kg_location' => 7900],

            // 21. Beras Premium (Rp16.000/kg)
            ['ingredient_id' => 21, 'id_location' => 12, 'price_per_kg_location' => 16000],
            ['ingredient_id' => 21, 'id_location' => 1, 'price_per_kg_location' => 16000],

            // 22. Beras Medium (Rp14.000/kg)
            ['ingredient_id' => 22, 'id_location' => 2, 'price_per_kg_location' => 14000],
            ['ingredient_id' => 22, 'id_location' => 4, 'price_per_kg_location' => 14000],

            // 23. Daging Sapi Murni (Rp120.000 - Rp130.000/kg)
            ['ingredient_id' => 23, 'id_location' => 7, 'price_per_kg_location' => 120000],
            ['ingredient_id' => 23, 'id_location' => 2, 'price_per_kg_location' => 130000],

            // 24. Daging Ayam Broiler (Rp29.000/kg)
            ['ingredient_id' => 24, 'id_location' => 1, 'price_per_kg_location' => 29000],

            // 25. Daging Ayam Kampung (Rp90.000/kg)
            ['ingredient_id' => 25, 'id_location' => 2, 'price_per_kg_location' => 90000],

            // 26. Telur Ayam Ras (Rp48.000 - Rp55.000/rak isi 30)
            ['ingredient_id' => 26, 'id_location' => 15, 'price_per_kg_location' => 48000],
            ['ingredient_id' => 26, 'id_location' => 13, 'price_per_kg_location' => 55000],

            // 27. Ikan Bandeng (Rp38.300/kg)
            ['ingredient_id' => 27, 'id_location' => 10, 'price_per_kg_location' => 38300],

            // 28. Ikan Kembung (Rp46.600/kg)
            ['ingredient_id' => 28, 'id_location' => 10, 'price_per_kg_location' => 46600],

            // 29. Ikan Tongkol / Tuna / Cakalang (Rp35.500/kg)
            ['ingredient_id' => 29, 'id_location' => 10, 'price_per_kg_location' => 35500],

            // 30. Udang Segar (Rp62.300/kg)
            ['ingredient_id' => 30, 'id_location' => 7, 'price_per_kg_location' => 62300],

            // 31. Ikan Asin Teri (Rp106.500/kg)
            ['ingredient_id' => 31, 'id_location' => 10, 'price_per_kg_location' => 106500],

            // 32. Tempe (Rp5.200/papan)
            ['ingredient_id' => 32, 'id_location' => 8, 'price_per_kg_location' => 5200],

            // 33. Tahu Mentah (Rp5.000/bungkus)
            ['ingredient_id' => 33, 'id_location' => 8, 'price_per_kg_location' => 5000],

            // 34. Kacang Tanah (Rp31.000/kg)
            ['ingredient_id' => 34, 'id_location' => 1, 'price_per_kg_location' => 31000],

            // 35. Kacang Hijau (Rp25.500/kg)
            ['ingredient_id' => 35, 'id_location' => 9, 'price_per_kg_location' => 25500],

            // 36. Kacang Kedelai Lokal (Rp24.400/kg)
            ['ingredient_id' => 36, 'id_location' => 1, 'price_per_kg_location' => 24400],

            // 37. Kacang Kedelai Impor (Rp23.100/kg)
            ['ingredient_id' => 37, 'id_location' => 12, 'price_per_kg_location' => 23100],

            // 38. Gula Pasir (Rp17.900/kg)
            ['ingredient_id' => 38, 'id_location' => 2, 'price_per_kg_location' => 17900],

            // 39. Minyak Goreng Kemasan (Rp20.000/liter)
            ['ingredient_id' => 39, 'id_location' => 11, 'price_per_kg_location' => 20000],

            // 40. Tepung Terigu Kemasan (Rp13.000/kg)
            ['ingredient_id' => 40, 'id_location' => 12, 'price_per_kg_location' => 13000],
        ];

        DB::table('ingredient_location')->insert($ingredientLocations);
    }
}