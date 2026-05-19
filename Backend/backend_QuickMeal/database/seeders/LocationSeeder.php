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
                'location_name' => 'Pasar Butung Makassar',
                'location_picture' => 'https://img.antaranews.com/cache/1200x800/2023/04/10/IMG-20230410-WA0052.jpg.webp',
                'google_maps_link' => 'https://maps.google.com/?q=Pasar+Butung+Makassar',
                'opening_time' => '06:00',
                'closing_time' => '17:00',
            ],
            [
                'location_name' => 'Pasar Terong Makassar',
                'location_picture' => 'https://img.antaranews.com/cache/1200x800/2023/04/10/IMG-20230410-WA0052.jpg.webp',
                'google_maps_link' => 'https://maps.google.com/?q=Pasar+Butung+Makassar',
                'opening_time' => '06:00',
                'closing_time' => '17:00',
            ],
            [
                'location_name' => 'Hypermart Panakkukang',
                'location_picture' => 'https://img.antaranews.com/cache/1200x800/2023/04/10/IMG-20230410-WA0052.jpg.webp',
                'google_maps_link' => 'https://maps.google.com/?q=Pasar+Butung+Makassar',
                'opening_time' => '10:00',
                'closing_time' => '22:00',
            ],
            [
                'location_name' => 'Lotte Mart Makassar',
                'location_picture' => 'https://img.antaranews.com/cache/1200x800/2023/04/10/IMG-20230410-WA0052.jpg.webp',
                'google_maps_link' => 'https://maps.google.com/?q=Pasar+Butung+Makassar',
                'opening_time' => '10:00',
                'closing_time' => '22:00',
            ],
            [
                'location_name' => 'Pasar Pa\'baeng-Baeng',
                'location_picture' => 'https://img.antaranews.com/cache/1200x800/2023/04/10/IMG-20230410-WA0052.jpg.webp',
                'google_maps_link' => 'https://maps.google.com/?q=Pasar+Butung+Makassar',
                'opening_time' => '06:00',
                'closing_time' => '17:00',
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