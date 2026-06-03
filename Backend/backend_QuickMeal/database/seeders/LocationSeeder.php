<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Location;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [
            [
                'location_name' => 'Pasar Maricaya',
                'road_name' => 'Jl. Harimau No. 15-25, Kel. Maricaya, Kec. Makassar',
                'location_picture' => 'https://img.antaranews.com/cache/1200x800/2023/04/10/IMG-20230410-WA0052.jpg.webp',
                'google_maps_link' => 'https://maps.google.com/?q=Pasar+Butung+Makassar',
                'opening_time' => '06:00',
                'closing_time' => '17:00',
            ],
            [
                'location_name' => 'Pasar Pabaeng-Baeng',
                'road_name' => 'Jl. Sultan Alauddin No. 10, Kec. Tamalate',
                'location_picture' => 'https://img.antaranews.com/cache/1200x800/2023/04/10/IMG-20230410-WA0052.jpg.webp',
                'google_maps_link' => 'https://maps.google.com/?q=Pasar+Butung+Makassar',
                'opening_time' => '06:00',
                'closing_time' => '17:00',
            ],
            [
                'location_name' => 'Pasar Terong Bawakaraeng',
                'road_name' => 'Jl. G. Bawakaraeng No. 182, Kel. Tompo Balang, Kec. Bontoala',
                'location_picture' => 'https://img.antaranews.com/cache/1200x800/2023/04/10/IMG-20230410-WA0052.jpg.webp',
                'google_maps_link' => 'https://maps.google.com/?q=Pasar+Butung+Makassar',
                'opening_time' => '05:00',
                'closing_time' => '18:00',
            ],
            [
                'location_name' => 'Pasar Niaga Daya',
                'road_name' => 'Jl. Perintis Kemerdekaan KM 11, Kel. Daya, Kec. Biringkanaya',
                'location_picture' => 'https://img.antaranews.com/cache/1200x800/2023/04/10/IMG-20230410-WA0052.jpg.webp',
                'google_maps_link' => 'https://maps.google.com/?q=Pasar+Butung+Makassar',
                'opening_time' => '07:00',
                'closing_time' => '18:00',
            ],
            [
                'location_name' => 'Pasar Sambung Jawa',
                'road_name' => 'Jl. Hati Murni No. 4, RW.03, Kel. Mattoangin, Kec. Mariso',
                'location_picture' => 'https://img.antaranews.com/cache/1200x800/2023/04/10/IMG-20230410-WA0052.jpg.webp',
                'google_maps_link' => 'https://maps.google.com/?q=Pasar+Butung+Makassar',
                'opening_time' => '05:00',
                'closing_time' => '17:00',
            ],
            [
                'location_name' => 'Pasar Terong Kanal',
                'road_name' => 'Jl. Mentimun No. 60, Tompo Balang, Kec. Bontoala',
                'location_picture' => 'https://img.antaranews.com/cache/1200x800/2023/04/10/IMG-20230410-WA0052.jpg.webp',
                'google_maps_link' => 'https://maps.google.com/?q=Pasar+Butung+Makassar',
                'opening_time' => '05:00',
                'closing_time' => '18:00',
            ],
            [
                'location_name' => 'Pasar Sentral Makassar',
                'road_name' => 'Jl. KH. Ramli No. 1, Kel. Pattunuang, Kec. Wajo',
                'location_picture' => 'https://img.antaranews.com/cache/1200x800/2023/04/10/IMG-20230410-WA0052.jpg.webp',
                'google_maps_link' => 'https://maps.google.com/?q=Pasar+Butung+Makassar',
                'opening_time' => '06:00',
                'closing_time' => '18:00',
            ],
            [
                'location_name' => 'Pasar Kalimbu',
                'road_name' => 'Jl. Veteran Utara No. 249, Kel. Wajo Baru, Kec. Bontoala',
                'location_picture' => 'https://img.antaranews.com/cache/1200x800/2023/04/10/IMG-20230410-WA0052.jpg.webp',
                'google_maps_link' => 'https://maps.google.com/?q=Pasar+Butung+Makassar',
                'opening_time' => '05:00',
                'closing_time' => '17:00',
            ],
            [
                'location_name' => 'Terong Traditional Market',
                'road_name' => 'Jl. Ps. Terong, Wajo Baru, Kec. Bontoala',
                'location_picture' => 'https://img.antaranews.com/cache/1200x800/2023/04/10/IMG-20230410-WA0052.jpg.webp',
                'google_maps_link' => 'https://maps.google.com/?q=Pasar+Butung+Makassar',
                'opening_time' => '05:00',
                'closing_time' => '18:00',
            ],
            [
                'location_name' => 'Pasar Pelelangan Ikan Paotere',
                'road_name' => 'Jl. Sabutung No. 1, Kel. Gusung, Kec. Ujung Tanah',
                'location_picture' => 'https://img.antaranews.com/cache/1200x800/2023/04/10/IMG-20230410-WA0052.jpg.webp',
                'google_maps_link' => 'https://maps.google.com/?q=Pasar+Butung+Makassar',
                'opening_time' => '04:00',
                'closing_time' => '17:00',
            ],
            [
                'location_name' => 'LOTTE GROSIR MAKASSAR',
                'road_name' => 'Jl. Sultan Alauddin No. 87, Pa\'baeng-Baeng, Kec. Tamalate',
                'location_picture' => 'https://img.antaranews.com/cache/1200x800/2023/04/10/IMG-20230410-WA0052.jpg.webp',
                'google_maps_link' => 'https://maps.google.com/?q=Pasar+Butung+Makassar',
                'opening_time' => '08:00',
                'closing_time' => '22:00',
            ],
            [
                'location_name' => 'Toko Suka Berkah',
                'road_name' => 'Jl. Ps. Terong No. 36A, Tompo Balang, Kec. Bontoala',
                'location_picture' => 'https://img.antaranews.com/cache/1200x800/2023/04/10/IMG-20230410-WA0052.jpg.webp',
                'google_maps_link' => 'https://maps.google.com/?q=Toko+Suka+Berkah+Makassar',
                'opening_time' => '05:00',
                'closing_time' => '18:00',
            ],
            [
                'location_name' => 'Toko Kelontong Pak Ramli',
                'road_name' => 'Alamat los sembako Terong Traditional Market, Jl. Ps. Terong, Tompo Balang, Kec. Bontoala',
                'location_picture' => 'https://img.antaranews.com/cache/1200x800/2023/04/10/IMG-20230410-WA0052.jpg.webp',
                'google_maps_link' => 'https://maps.google.com/?q=Toko+Kelontong+Pak+Ramli+Makassar',
                'opening_time' => '05:00',
                'closing_time' => '18:00',
            ],
            [
                'location_name' => 'Toko Campuran Kurniati',
                'road_name' => 'Kawasan Los Sembako/Pakan Terong Traditional Market, Jl. Ps. Terong, Tompo Balang, Kec. Bontoala',
                'location_picture' => 'https://img.antaranews.com/cache/1200x800/2023/04/10/IMG-20230410-WA0052.jpg.webp',
                'google_maps_link' => 'https://maps.google.com/?q=Toko+Campuran+Kurniati+Makassar',
                'opening_time' => '05:00',
                'closing_time' => '18:00',
            ],
            [
                'location_name' => 'Toko Yunita',
                'road_name' => 'Blok Grosir Sembako Terong Traditional Market, Jl. Ps. Terong No. 36A, Tompo Balang, Kec. Bontoala',
                'location_picture' => 'https://img.antaranews.com/cache/1200x800/2023/04/10/IMG-20230410-WA0052.jpg.webp',
                'google_maps_link' => 'https://maps.google.com/?q=Toko+Yunita+Makassar',
                'opening_time' => '05:00',
                'closing_time' => '18:00',
            ],
            [
                'location_name' => 'Toko Suhadir',
                'road_name' => 'Los khusus komoditas kering/asin Terong Traditional Market, Jl. Ps. Terong, Tompo Balang, Kec. Bontoala',
                'location_picture' => 'https://img.antaranews.com/cache/1200x800/2023/04/10/IMG-20230410-WA0052.jpg.webp',
                'google_maps_link' => 'https://maps.google.com/?q=Toko+Suhadir+Makassar',
                'opening_time' => '05:00',
                'closing_time' => '18:00',
            ],
            [
                'location_name' => 'Toko Nurhayati',
                'road_name' => 'Blok Palawija & Sembako Terong Traditional Market, Jl. Ps. Terong, Tompo Balang, Kec. Bontoala',
                'location_picture' => 'https://img.antaranews.com/cache/1200x800/2023/04/10/IMG-20230410-WA0052.jpg.webp',
                'google_maps_link' => 'https://maps.google.com/?q=Toko+Nurhayati+Makassar',
                'opening_time' => '05:00',
                'closing_time' => '18:00',
            ],
        ];


        foreach ($locations as $location) {
            Location::firstOrCreate(
                ['location_name' => $location['location_name']],
                $location
            );
        }
    }
}