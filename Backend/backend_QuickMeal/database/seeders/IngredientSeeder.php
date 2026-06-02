<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IngredientSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ingredients = [
            [
            'name' => 'Cabai Rawit Merah',
            'ingredient_picture'=>'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgMRysQRjqK9kByVyXQxcVTUO6YEcxOz-7Jg&s',
            'price_per_kg' => 50000
            ],
            [
            'name' => 'Cabai Rawit Hijau',
            'ingredient_picture'=>'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8R5a4g_HnEAFsEumVvLuJLXHefF1r2i-jpA&s',
            'price_per_kg' => 40000
            ],
            [
            'name' => 'Cabai Merah Besar',
            'ingredient_picture'=>'https://www.bibitbuahku.com/wp-content/uploads/2017/08/cabai-mb.jpg',
            'price_per_kg' => 60000
            ],
            [
            'name' => 'Cabai Merah Keriting',
            'ingredient_picture'=>'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3ZCgD36I9_Jwf5a5tv1tuAxmqjXw1KYLobA&s',
            'price_per_kg' => 55000
            ],
            [
            'name' => 'Bawang Merah',
            'ingredient_picture'=>'https://img-cdn.medkomtek.com/AF-U9Z1ZEn1u7L95aMTIRIGBz6U=/510x395/smart/filters:quality(100):format(webp)/article/tpqx_7Ik9yLWFVOeJTs4W/original/052222900_1607682083-Manfaat-Bawang-Merah_-Antialergi-hingga-Menurunkan-Risiko-Kanker-shutterstock_1724962108.jpg',
            'price_per_kg' => 25000
            ],
            [
            'name' => 'Bawang Putih Bonggol',
            'ingredient_picture'=>'https://down-id.img.susercontent.com/file/24934433a1a10a4260ad1547649a25f9',
            'price_per_kg' => 30000
            ],
            [
            'name' => 'Bawang Bombay',
            'ingredient_picture'=>'https://down-id.img.susercontent.com/file/24934433a1a10a4260ad1547649a25f9',
            'price_per_kg' => 20000
            ],
            [
            'name' => 'Tomat',
            'ingredient_picture'=>'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDvV9KYCqBAaFTOqLK7mO1ZpzXq6rTKDw5uA&s',
            'price_per_kg' => 15000
            ],
            [
            'name' => 'Wortel',
            'ingredient_picture'=>'https://image.jpnn.com/resize/1200x800-80/ilustrasi/normal/2022/02/15/wortel-foto-ricardojpnncom-e7bvg-pwzj.jpg',
            'price_per_kg' => 10000
            ],
            [
            'name' => 'Kentang',
            'ingredient_picture'=>'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiqRz6V1heAqIrvTnTQHOt1K2tbL4XJQDxKw&s',
            'price_per_kg' => 8000
            ],
            [
            'name' => 'Buncis',
            'ingredient_picture'=>'https://d1vbn70lmn1nqe.cloudfront.net/prod/wp-content/uploads/2024/08/16070745/Manfaat-Buncis-untuk-Kesehatan-yang-Perlu-Diketahui.jpg',
            'price_per_kg' => 12000
            ],
            [
            'name' => 'Sawi Hijau',
            'ingredient_picture'=>'https://image-asset.parto.id/i/2y/c9a22b71e24840fc87f9d3fe609df3d2.jpg',
            'price_per_kg' => 5000
            ],
            [
            'name' => 'Kol / Kubis',
            'ingredient_picture'=>'https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/img/VqbcmM/2021/7/31/e0cd1e3d-0b8a-419d-a906-ba3b001f7166.jpg~tplv-aphluv4xwc-resize-jpeg:700:0.jpg',
            'price_per_kg' => 6000
            ],
            [
            'name' => 'Kangkung',
            'ingredient_picture'=>'https://d1vbn70lmn1nqe.cloudfront.net/prod/wp-content/uploads/2021/11/15081555/Manfaat-Makan-Kangkung-untuk-Kecantikan-dan-Kesehatan-01.jpg',
            'price_per_kg' => 4000
            ],
            [
            'name' => 'Bayam',
            'ingredient_picture'=>'https://akcdn.detik.net.id/visual/2018/07/11/cc01493c-6a04-4bea-b33d-3be0086c9f09_169.jpeg?w=1200',
            'price_per_kg' => 30000
            ],
            [
            'name' => 'Bawang Bombay',
            'ingredient_picture'=>'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTA1SjUT5xhi6cmhF5Ltjt165RkoMWC6ltT7w&s',
            'price_per_kg' => 20000
            ],
            [
            'name' => 'Ubi Jalar',
            'ingredient_picture'=>'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnDhyPF7yBv-fmP4Eu2IdqZgi_A9pW4cD9oA&s',
            'price_per_kg' => 8000
            ],
            [
            'name' => 'Garam Konsumsi Beryodium (Halus)',
            'ingredient_picture'=>'https://brayamart.com/api/service_directory/product/20220510_153741.jpg',
            'price_per_kg' => 5000
            ],
            [
            'name' => 'Garam Konsumsi Beryodium (Bata)',
            'ingredient_picture'=>'https://down-id.img.susercontent.com/file/id-11134207-7r98r-llfql14db6mv0e',
            'price_per_kg' => 4000
            ],
            [
            'name' => 'Jagung Pipilan Kering',
            'ingredient_picture'=>'https://lh5.googleusercontent.com/proxy/j4TcV3uOEgXbrVZC0sWTP4SuNtK9koDDhFqUhRr1kq3vsYK4hfzbVewYdcEFQbP_elvGs698Zxo3EbYbhs-cjbwYURZLHnChJoHV5Dg',
            'price_per_kg' => 15000
            ],
            [
            'name' => 'Beras Premium',
            'ingredient_picture'=>'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY-vvkiCNHctuth6XaXLgY4CP5kpXnrzCm0g&s',
            'price_per_kg' => 12000
            ],
            [
            'name' => 'Beras Medium',
            'ingredient_picture'=>'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqv8PW0bXx0tCEFgQIcSfnBQo_8xcrKZFF3Q&s',
            'price_per_kg' => 10000
            ],
            [
            'name' => 'Daging Sapi Murni',
            'ingredient_picture'=>'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrLazmKBE3LXraMUsMU062t9faIzriAX4Aqg&s',
            'price_per_kg' => 80000
            ],
            [
            'name' => 'Daging Ayam Broiler',
            'ingredient_picture'=>'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//89/MTA-65613030/sayur_home_delivery_sayurhd_daging_ayam_broiler_boiler_1_ekor_-berat_1kg-_full01_szdx9e1m.jpg',
            'price_per_kg' => 30000
            ],
            [
            'name' => 'Daging Ayam Kampung',
            'ingredient_picture'=>'https://images.alodokter.com/dk0z4ums3/image/upload/v1760336047/attached_image/daging-ayam-kampung-ketahui-manfaat-dan-tips-mengolahnya.jpg',
            'price_per_kg' => 40000
            ],
            [
            'name' => 'Telur Ayam Ras',
            'ingredient_picture'=>'https://bosara.sultraprov.go.id/asset/foto_produk/product-sentral-sejahtera-20230327092219609.jpg',
            'price_per_kg' => 25000
            ],
            [
            'name' => 'Ikan Bandeng',
            'ingredient_picture'=>'https://kontainerindonesia.co.id/blog/wp-content/uploads/2023/07/10-Cara-Ekspor-Ikan-Bandeng-Simak-Langkah-Berikut-1-720x375.jpeg',
            'price_per_kg' => 20000
            ],
            [
            'name' => 'Ikan Kembung',
            'ingredient_picture'=>'https://images.alodokter.com/dk0z4ums3/image/upload/v1700209712/attached_image/ikan-kembung-kandungan-manfaat-dan-cara-mengolahnya.jpg',
            'price_per_kg' => 15000
            ],
            [
            'name' => 'Ikan Tongkol / Tuna / Cakalang',
            'ingredient_picture'=>'https://images.alodokter.com/dk0z4ums3/image/upload/v1592894797/attached_image/jangan-lewatkan-6-manfaat-ikan-tongkol-untuk-kesehatan-anda.jpg',
            'price_per_kg' => 50000
            ],
            [
            'name' => 'Udang Segar',
            'ingredient_picture'=>'https://parto.id/asset/foto_produk/IMG_2230.jpeg',
            'price_per_kg' => 100000
            ],
            [
            'name' => 'Ikan Asin Teri',
            'ingredient_picture'=>'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIinfnBxjdgOHtVJ-vcSFtbVZC2yE8UXJlDA&s',
            'price_per_kg' => 75000
            ],
            [
            'name' => 'Tempe',
            'ingredient_picture'=>'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBKZOCxL8IsSfN9msLRYCsg5yoOALg3Rq3Dg&s',
            'price_per_kg' => 15000
            ],
            [
            'name' => 'Tahu Mentah',
            'ingredient_picture'=>'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_PAoEcE42i5urJx5yKYWcGvY7Wa4KQ8W9IA&s',
            'price_per_kg' => 10000
            ],
            [
            'name' => 'Kacang Tanah',
            'ingredient_picture'=>'',
            'price_per_kg' => 25000
            ],
            [
            'name' => 'Kacang Hijau',
            'ingredient_picture'=>'',
            'price_per_kg' => 30000
            ],
            [
            'name' => 'Kacang Kedelai Lokal',
            'ingredient_picture'=>'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY3dmS5H1lTdD4rVWqufqadcC-DAJB465WZg&s',
            'price_per_kg' => 20000
            ],
            [
            'name' => 'Kacang Kedelai Impor',
            'ingredient_picture'=>'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/102/MTA-170052958/brd-103934_kacang-hijau-kacang-ijo-mung-bean-import-super-1-kg_full01-9ddee2c8.jpg',
            'price_per_kg' => 35000
            ],
            [
            'name' => 'Gula Pasir',
            'ingredient_picture'=>'https://awsimages.detik.net.id/community/media/visual/2015/09/02/0304cf7b-5d92-4636-8ccc-8fe21e13f881.jpg?w=1200',
            'price_per_kg' => 15000
            ],
            [
            'name' => 'Minyak Goreng Kemasan',
            'ingredient_picture'=>'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOpNC7ZzFRHPZsJ03nB_B4allX3MG_ygtzpQ&s',
            'price_per_kg' => 12000
            ],
            [
            'name' => 'Tepung Terigu Kemasan',
            'ingredient_picture'=>'https://images.alodokter.com/dk0z4ums3/image/upload/v1763545445/attached_image/tepung-terigu-jenis-manfaat-dan-cara-konsumsi-yang-aman.jpg',
            'price_per_kg' => 10000
            ],
            [
            'name' => 'Kecap Manis',
            'ingredient_picture'=>'https://assets.unileversolutions.com/v1/137002687.png',
            'price_per_kg' => 18000
            ],
            [
            'name' => 'Sawi Putih',
            'ingredient_picture'=>'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF2mm5iT94ZB6Rj0BuCrsu5oHXuuhhcH35bA&s',
            'price_per_kg' => 8000
            ],
            [
            'name' => 'Bakso',
            'ingredient_picture'=>'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS37WGw01TAs_UODLsknksKSBiiH21-x8DDfg&s',
            'price_per_kg' => 40000
            ],
            [
            'name' => 'Sosis',
            'ingredient_picture'=>'https://storage.cpfood.co.id/uploads/public/5ff/e40/060/5ffe400601c50351074117.jpg',
            'price_per_kg' => 35000
            ],
            [
            'name' => 'Cuka',
            'ingredient_picture'=>'https://asbajayaberkah.com/wp-content/uploads/2024/07/BELIBIS-CUKA-DAPUR-650ML-600x727.jpeg',
            'price_per_kg' => 15000
            ],
            [
            'name' => 'Mie Instan',
            'ingredient_picture'=>'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs4PGCMjgdFBnsXXvG7OqbRX7ynAVIQxEzvg&s',
            'price_per_kg' => 5000
            ],

        ];

        foreach ($ingredients as $ingredient) {
            Ingredient::firstOrCreate(
                ['name' => $ingredient['name']],
                $ingredient
            );
        }
    }
}