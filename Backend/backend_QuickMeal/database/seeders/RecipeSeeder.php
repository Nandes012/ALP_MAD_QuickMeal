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
                'name' => 'Ayam Goreng',
                'description' => 'Kelezatan yang bikin balik lagi.',
                'cookingTime' => 22,
                'difficulty' => 'Mudah',
                'imageUrl' => 'https://i.pinimg.com/736x/22/bc/ba/22bcba3a598d866b204acd2031177c62.jpg',
            ],
            [
                'name' => 'Ayam Bakar',
                'description' => 'Sekali coba, langsung jatuh cinta.',
                'cookingTime' => 27,
                'difficulty' => 'Sedang',
                'imageUrl' => 'https://i.pinimg.com/736x/1a/9b/6e/1a9b6ed12a4d877dbf69f7a1cf93e1c2.jpg',
            ],
            [
                'name' => 'Nasi Goreng',
                'description' => 'Santapan yang selalu dirindukan.',
                'cookingTime' => 18,
                'difficulty' => 'Mudah',
                'imageUrl' => 'https://i.pinimg.com/1200x/d3/7b/f1/d37bf17c96e03b533f0f4b1c9b130011.jpg',
            ],
            [
                'name' => 'Nasi Kuning',
                'description' => 'Warna & rasa khas Indonesia.',
                'cookingTime' => 32,
                'difficulty' => 'Sedang',
                'imageUrl' => 'https://i.pinimg.com/736x/19/59/d2/1959d258e6df9c309edf3238151f85fb.jpg',
            ],
            [
                'name' => 'Sate',
                'description' => 'Potongan daging lezat tusuk demi tusuk.',
                'cookingTime' => 37,
                'difficulty' => 'Sedang',
                'imageUrl' => 'https://i.pinimg.com/736x/91/4e/fe/914efeca7a7527e28549b2e6cc0e8fe1.jpg',
            ],
            [
                'name' => 'Bakso',
                'description' => 'Kuah hangat, kenyal, penuh rasa.',
                'cookingTime' => 27,
                'difficulty' => 'Mudah',
                'imageUrl' => 'https://i.pinimg.com/736x/49/19/c5/4919c5c03ffd9c188ae991ca5a7ea9de.jpg',
            ],
            [
                'name' => 'Mie Ayam',
                'description' => 'Mie kenyal dengan ayam berbumbu.',
                'cookingTime' => 18,
                'difficulty' => 'Mudah',
                'imageUrl' => 'https://i.pinimg.com/736x/66/b8/8f/66b88f39805655a875f8cb56e49ab4d4.jpg',
            ],
            [
                'name' => 'Pempek',
                'description' => 'Kudapan Palembang yang gurih.',
                'cookingTime' => 35,
                'difficulty' => 'Sulit',
                'imageUrl' => 'https://i.pinimg.com/1200x/d6/41/a0/d641a0baebf71cf94032df80c7ab4ae7.jpg',
            ],
            [
                'name' => 'Rendang',
                'description' => 'Daging empuk, rempah kaya aroma.',
                'cookingTime' => 52,
                'difficulty' => 'Sulit',
                'imageUrl' => 'https://i.pinimg.com/736x/e3/24/d3/e324d32512d363c6d65512e44ce2896a.jpg',
            ],
            [
                'name' => 'Gado-Gado',
                'description' => 'Sayur segar dengan saus kacang.',
                'cookingTime' => 22,
                'difficulty' => 'Mudah',
                'imageUrl' => 'https://i.pinimg.com/1200x/be/cc/8f/becc8f639992b67d5930e9e07e466aed.jpg',
            ],
            [
                'name' => 'Soto',
                'description' => 'Kuah bening berisi rempah dan daging.',
                'cookingTime' => 27,
                'difficulty' => 'Mudah',
                'imageUrl' => 'https://i.pinimg.com/736x/d9/14/ee/d914eedf08d2a7c9e1463b155fd471b0.jpg',
            ],
            [
                'name' => 'Burger',
                'description' => 'Sensasi Daging Asli, Bikin Nagih.',
                'cookingTime' => 22,
                'difficulty' => 'Mudah',
                'imageUrl' => 'https://i.pinimg.com/736x/90/fa/94/90fa9415fa688431e05075009f721fcd.jpg',
            ],
            [
                'name' => 'Ayam Crispy',
                'description' => 'Ayam renyah dengan lapisan tepung sempurna.',
                'cookingTime' => 27,
                'difficulty' => 'Mudah',
                'imageUrl' => 'https://i.pinimg.com/736x/5b/d5/05/5bd505f837ab3aa00ac51eea9ce3c5a4.jpg',
            ],
            [
                'name' => 'Pisang Goreng',
                'description' => 'Camilan manis dan lezat yang populer.',
                'cookingTime' => 12,
                'difficulty' => 'Mudah',
                'imageUrl' => 'https://i.pinimg.com/736x/a9/ee/b1/a9eeb17125f76fe28397bdb5073a9026.jpg',
            ],
            [
                'name' => 'Bakwan',
                'description' => 'Gorengan tradisional berisi sayur pilihan.',
                'cookingTime' => 18,
                'difficulty' => 'Mudah',
                'imageUrl' => 'https://i.pinimg.com/1200x/0b/58/23/0b582305b2368e3f1e4e60a3f90da4b9.jpg',
            ],
            [
                'name' => 'Tempe Mendoan',
                'description' => 'Goreng tempe dengan tepung yang gurih.',
                'cookingTime' => 12,
                'difficulty' => 'Mudah',
                'imageUrl' => 'https://i.pinimg.com/736x/41/58/7b/41587be549c3e4ddda64cc86b69204cd.jpg',
            ],
            [
                'name' => 'Sayur Asem',
                'description' => 'Sayuran segar dengan kuah asam segar.',
                'cookingTime' => 22,
                'difficulty' => 'Mudah',
                'imageUrl' => 'https://i.pinimg.com/736x/77/a4/d1/77a4d1f15ba7a10919b0e55721130a58.jpg',
            ],
            [
                'name' => 'Telur Balado',
                'description' => 'Telur dengan sambal pedas yang lezat.',
                'cookingTime' => 18,
                'difficulty' => 'Mudah',
                'imageUrl' => 'https://i.pinimg.com/1200x/2f/1c/46/2f1c464817c86b700fe116f04081aa9f.jpg',
            ],
            [
                'name' => 'Cah Kangkung',
                'description' => 'Tumis kangkung dengan bumbu yang merata.',
                'cookingTime' => 12,
                'difficulty' => 'Mudah',
                'imageUrl' => 'https://i.pinimg.com/1200x/e2/33/70/e23370da5d06c784c091e8c3a56c9171.jpg',
            ],
            [
                'name' => 'Oreg Tempe',
                'description' => 'Tempe dengan bumbu yang kaya dan gurih.',
                'cookingTime' => 18,
                'difficulty' => 'Mudah',
                'imageUrl' => 'https://i.pinimg.com/736x/68/a8/84/68a8846edaee438a6ce6634199d56e68.jpg',
            ],
        ];

        foreach ($recipes as $recipe) {
            Recipe::create($recipe);
        }
    }
}
