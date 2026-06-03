<?php

namespace Database\Seeders;

use App\Models\Recipe;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RecipeSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the recipes table with sample data
     */
    public function run(): void
    {   
        $recipes = [
     [
        'name' => 'Telur Ceplok Kecap',
        'description' => 'Telur ceplok sederhana dengan bumbu kecap manis gurih.',
        'cookingTime' => 5,
        'difficulty' => 'Mudah',
        'imageUrl' => 'https://cdn.yummy.co.id/content-images/images/20210320/ykLg139RP9xEJsNa5BaoKNohDt3g8om4-31363136323337303631d41d8cd98f00b204e9800998ecf8427e.jpg?x-oss-process=image/resize,w_388,h_388,m_fixed,x-oss-process=image/format,webp',
        'video' => 'storage/video_recipe/telur ceplok kecap.mp4',
    ],
    [
        'name' => 'Tumis Sawi Putih & Bakso',
        'description' => 'Tumis sawi putih segar dengan irisan bakso yang lezat.',
        'cookingTime' => 10,
        'difficulty' => 'Mudah',
        'imageUrl' => 'https://i.ytimg.com/vi/Ml5CiZYAUnU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDfXYoWIc-5Gl63up9X0M8U-njPOA',
        'video' => 'storage/video_recipe/tumis sawi putih dan bakso.mp4',
    ],
    [
        'name' => 'Orek Tempe Kecap',
        'description' => 'Tempe tumis kecap dengan cita rasa manis dan gurih.',
        'cookingTime' => 10,
        'difficulty' => 'Mudah',
        'imageUrl' => 'https://assets.unileversolutions.com/v1/132152390.jpg',
        'video' => 'storage/video_recipe/orak tempe.mp4',
    ],
    [
        'name' => 'Sup Telur Tomat',
        'description' => 'Sup hangat berisi telur dan tomat yang segar.',
        'cookingTime' => 10,
        'difficulty' => 'Mudah',
        'imageUrl' => 'https://cdn0-production-images-kly.akamaized.net/BPmpzw90NvkRcNpA46PojjN98W4=/0x0:1999x1127/469x260/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3508150/original/073657800_1626075478-shutterstock_1646426386.jpg',
        'video' => 'storage/video_recipe/sup telur tomat.mp4',
    ],
    [
        'name' => 'Sosis Asam Manis',
        'description' => 'Sosis tumis dengan saus asam manis yang menggugah selera.',
        'cookingTime' => 10,
        'difficulty' => 'Mudah',
        'imageUrl' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2wuOZa9ybdIsKKG0lGZy2jCQnJj17uJP48g&s',
        'video' => 'storage/video_recipe/sosis asam manis.mp4',
    ],
    [
        'name' => 'Nasi Goreng Telur Orak Arik',
        'description' => 'Nasi goreng praktis dengan campuran telur orak-arik.',
        'cookingTime' => 10,
        'difficulty' => 'Mudah',
        'imageUrl' => 'https://img-global.cpcdn.com/recipes/058722f6ad2cb4b4/680x781f0.5_0.5_1.0q80/nasi-goreng-telur-orak-arik-foto-resep-utama.jpg',
        'video' => 'storage/video_recipe/nasi goreng telur orak arik.mp4',
    ],
    [
        'name' => 'Orak Arik Telur Sosis',
        'description' => 'Telur dan sosis yang dimasak cepat untuk menu sehari-hari.',
        'cookingTime' => 5,
        'difficulty' => 'Mudah',
        'imageUrl' => 'https://i.ytimg.com/vi/MTPjM8iyy1Q/maxresdefault.jpg',
        'video' => 'storage/video_recipe/sosis telur orak arik.mp4',
    ],
    [
        'name' => 'Tempe Goreng Kriuk',
        'description' => 'Tempe goreng renyah dengan balutan tepung berbumbu.',
        'cookingTime' => 10,
        'difficulty' => 'Mudah',
        'imageUrl' => 'https://img-global.cpcdn.com/recipes/e1f5995154c195a5/1200x630cq80/photo.jpg',
        'video' => 'storage/video_recipe/tempe kriuk.mp4',
    ],
    [
        'name' => 'Martabak Mie Telur',
        'description' => 'Martabak sederhana berbahan mie instan dan telur.',
        'cookingTime' => 10,
        'difficulty' => 'Sedang',
        'imageUrl' => 'https://img-global.cpcdn.com/recipes/e39ac1ee84909b79/680x781cq80/martabak-mie-telur-bebek-foto-resep-utama.jpg',
        'video' => 'storage/video_recipe/martabak mie telur.mp4',
    ],
    [
        'name' => 'Tahu Tumis Kecap',
        'description' => 'Tahu tumis dengan bumbu kecap yang manis gurih.',
        'cookingTime' => 10,
        'difficulty' => 'Mudah',
        'imageUrl' => 'https://cdn.yummy.co.id/content-images/images/20220828/WYEzk5HRZ6sVQSUZAT4LMMTVVCfWCEsr-31363631373033343837d41d8cd98f00b204e9800998ecf8427e.jpg?x-oss-process=image/resize,w_388,h_388,m_fixed,x-oss-process=image/format,webp',
        'video' => 'storage/video_recipe/tumis tahu kecap.mp4',
    ],

        ];

        foreach ($recipes as $recipe) {
            Recipe::create($recipe);
        }
    }
}
