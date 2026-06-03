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
                'location_picture' => 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi-j2XvH7QW80ATJigojHIQWZnb98dUaJ9TxMyyivbK5U2M_qtjcz9Ks77hyWK3O-YGyXPtoIJwxQ-3rJR7jWsJHigfHxGzZzPREmcxxArXu0XuLSTN4s7V9zjsY_iAiSDhmfVttk8D8P4/s640/blogger-image-1821504834.jpg',
                'google_maps_link' => 'https://www.google.com/maps/place/PASAR+MARICAYA+vetran/@-5.150276,119.4199131,17z/data=!3m1!4b1!4m6!3m5!1s0x2dbee38c6b1a2357:0xa184362cfea23ca9!8m2!3d-5.150276!4d119.424784!16s%2Fg%2F11rrjc5ptv?entry=ttu&g_ep=EgoyMDI2MDUzMS4wIKXMDSoASAFQAw%3D%3D',
                'opening_time' => '06:00',
                'closing_time' => '17:00',
            ],
            [
                'location_name' => 'Pasar Pabaeng-Baeng',
                'road_name' => 'Jl. Sultan Alauddin No. 10, Kec. Tamalate',
                'location_picture' => 'https://bapenda.sulselprov.go.id/v1/wp-content/uploads/2024/01/samsat-baengbaeng.jpg',
                'google_maps_link' => 'https://www.google.com/maps/place/Pasar+Pabaeng-Baeng/@-5.1689847,119.4184611,17z/data=!3m1!4b1!4m6!3m5!1s0x2dbee28f679e497b:0xfc49e1dea68edd62!8m2!3d-5.1689847!4d119.421036!16s%2Fg%2F1pzw1fgh7?entry=ttu&g_ep=EgoyMDI2MDUzMS4wIKXMDSoASAFQAw%3D%3D',
                'opening_time' => '06:00',
                'closing_time' => '17:00',
            ],
            [
                'location_name' => 'Pasar Terong Bawakaraeng',
                'road_name' => 'Jl. G. Bawakaraeng No. 182, Kel. Tompo Balang, Kec. Bontoala',
                'location_picture' => 'https://media.suara.com/pictures/653x366/2026/02/20/65137-pasar-tradisional-terong-makassar.jpg',
                'google_maps_link' => 'https://www.google.com/maps/place/Pasar+Terong+Bawakaraeng/@-5.1349016,119.421723,17z/data=!4m6!3m5!1s0x2dbefdd3beb667cd:0x89c588908a99d3ab!8m2!3d-5.1349016!4d119.4242979!16s%2Fg%2F11t311xn1l?entry=ttu&g_ep=EgoyMDI2MDUzMS4wIKXMDSoASAFQAw%3D%3D',
                'opening_time' => '05:00',
                'closing_time' => '18:00',
            ],
            [
                'location_name' => 'Pasar Niaga Daya',
                'road_name' => 'Jl. Perintis Kemerdekaan KM 11, Kel. Daya, Kec. Biringkanaya',
                'location_picture' => 'https://www.mediasulsel.com/wp-content/uploads/2023/12/9_20231227_005457_0000.webp',
                'google_maps_link' => 'https://www.google.com/maps/place/Pasar+Daya+Perintis/@-5.1126291,119.5083572,17z/data=!4m15!1m8!3m7!1s0x2dbefb2a856ec8b5:0xb8d6156c866e702d!2sPasar+Daya+Perintis!8m2!3d-5.1131973!4d119.5124809!10e5!16s%2Fg%2F11gzrhgl5h!3m5!1s0x2dbefb2a856ec8b5:0xb8d6156c866e702d!8m2!3d-5.1131973!4d119.5124809!16s%2Fg%2F11gzrhgl5h?entry=ttu&g_ep=EgoyMDI2MDUzMS4wIKXMDSoASAFQAw%3D%3D',
                'opening_time' => '07:00',
                'closing_time' => '18:00',
            ],
            [
                'location_name' => 'Pasar Sambung Jawa',
                'road_name' => 'Jl. Hati Murni No. 4, RW.03, Kel. Mattoangin, Kec. Mariso',
                'location_picture' => 'https://media.suara.com/pictures/970x544/2022/04/09/33086-pasar.jpg',
                'google_maps_link' => 'https://www.google.com/maps/place/Pasar+Sambung+Jawa/@-5.1649293,119.4087926,17z/data=!3m1!4b1!4m6!3m5!1s0x2dbf1d62700cb769:0x8ea81ccb84eacbff!8m2!3d-5.1649293!4d119.4113675!16s%2Fg%2F11mw6qh0xk?entry=ttu&g_ep=EgoyMDI2MDUzMS4wIKXMDSoASAFQAw%3D%3D',
                'opening_time' => '05:00',
                'closing_time' => '17:00',
            ],
            [
                'location_name' => 'Pasar Terong Kanal',
                'road_name' => 'Jl. Mentimun No. 60, Tompo Balang, Kec. Bontoala',
                'location_picture' => 'https://beritakotamakassar.com/wp-content/uploads/2023/05/PASAR-TERONG.jpg',
                'google_maps_link' => 'https://www.google.com/maps/place/Pasar+Terong+Kanal/@-5.1347704,119.4204858,17z/data=!3m1!4b1!4m6!3m5!1s0x2dbefd0c3805a9db:0x8f53aece51c5db58!8m2!3d-5.1347704!4d119.4253567!16s%2Fg%2F11hz110x6f?entry=ttu&g_ep=EgoyMDI2MDUzMS4wIKXMDSoASAFQAw%3D%3D',
                'opening_time' => '05:00',
                'closing_time' => '18:00',
            ],
            [
                'location_name' => 'Pasar Sentral Makassar',
                'road_name' => 'Jl. KH. Ramli No. 1, Kel. Pattunuang, Kec. Wajo',
                'location_picture' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxvlp8o7YUjK9A_g-rFKx59pMdE6O04EQZVA&s',
                'google_maps_link' => 'https://www.google.com/maps?newwindow=1&sca_esv=a769f1ea62aa7e3c&biw=1536&bih=730&output=search&q=pasar+sentral+makassar&source=lnms&fbs=ADc_l-aN0CWEZBOHjofHoaMMDiKpUrv6YeyJhXfuYqj4Fj6c1UM_gfiPu45LsYicKAFFSwKzxUsaHJ8Gwi-OSTf7xEZYk_j6uERer1dYr13a7HxEKrAop1TqPSyBCNM4Vr4Cwq3jvf6x_ygHW6eImL6_XUTJ_7T-Doo198N0pxtUB6NLrqlf7eRv6IazqGEc6K1fhWuEHB-WwNqDmdXCzmX7R5htWQnlaQ&entry=mc&ved=1t:200715&ictx=111',
                'opening_time' => '06:00',
                'closing_time' => '18:00',
            ],
            [
                'location_name' => 'pasar sawah',
                'road_name' => 'Lajangiru, Ujung Pandang, kota makassar, sulawesi selatan 90145',
                'location_picture' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlBazoKEJcRuz5ZdwWnEHAPiWj7f-PvjFH2w&s',
                'google_maps_link' => 'https://www.google.com/maps?newwindow=1&sca_esv=a769f1ea62aa7e3c&biw=1536&bih=730&output=search&q=pasar+sawah&source=lnms&fbs=ADc_l-aN0CWEZBOHjofHoaMMDiKpUrv6YeyJhXfuYqj4Fj6c1SIV4w5e5qANUAPGe3KAH5wg6pKa6stPfy_bOTc8uksIkCC5kDirAp3fM5dAV4_gQbAGLwf39I7vf1n6ibfuok6rWP48d7Djx4jh377Di557_foRFTWMzPMJNF1E2vvLmIMCq8KTU3D2ONcz5kJTdmuWzmFbFKf71hLzkPDE6-MvQzuN8Q&entry=mc&ved=1t:200715&ictx=111',
                'opening_time' => '05:00',
                'closing_time' => '17:00',
            ],
            [
                'location_name' => 'pasar panakukkang',
                'road_name' => 'Paropo, Panakkukang, kota Makassar, sulawesi selatan 90231',
                'location_picture' => 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFMRz71LCuK_zzvoWnkP1_l53AIhT0x0TqBFmovQDEiKZVuBHP9yYTtFneJnOrkAXHMTYOo1N7dxBzoDkd67oOzSIL8RRpX7maEVtf52B0L_tXURTQvu70QkZh0RPjwwbacErs=w408-h306-k-no',
                'google_maps_link' => 'https://www.google.com/maps/place/Pasar+Panakkukang/@-5.1616137,119.4520953,17z/data=!3m1!4b1!4m6!3m5!1s0x2dbee347b66c2193:0x182bad266a394db0!8m2!3d-5.1616137!4d119.4546702!16s%2Fg%2F11gw0yp18m?entry=ttu&g_ep=EgoyMDI2MDUzMS4wIKXMDSoASAFQAw%3D%3D',
                'opening_time' => '05:00',
                'closing_time' => '18:00',
            ],
            [
                'location_name' => 'Pasar Pelelangan Ikan Paotere',
                'road_name' => 'Jl. Sabutung No. 1, Kel. Gusung, Kec. Ujung Tanah',
                'location_picture' => 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAE_87k_tXeDlx-d9FqAUymwTTys75aheNWu_Ay6MJERedwhpZRHBjzVy9PN9nyy91kKAgxDQZ_SU7FSzJFCW_aJPEmTOrCHIVg9povQVXlMI-IJN6LMWW1ediyi-uKS9sSz1HOV=w529-h298-k-no',
                'google_maps_link' => 'https://www.google.com/maps/place/Pasar+Paotere/@-5.1511279,119.3859918,13z/data=!4m10!1m2!2m1!1spasar+pelelangan+ikan+paottere+sign!3m6!1s0x2dbefd7dc1075ba5:0x82e25ea4cce72ad8!8m2!3d-5.1110305!4d119.4193166!15sCiJwYXNhciBwZWxlbGFuZ2FuIGlrYW4gcGFvdGVyZSBzaWduWiQiInBhc2FyIHBlbGVsYW5nYW4gaWthbiBwYW90ZXJlIHNpZ26SAQ5zZWFmb29kX21hcmtldJoBJENoZERTVWhOTUc5blMwVkpRMEZuU1VOc2IyVnlSM2xuUlJBQuABAPoBBAgAEDA!16s%2Fg%2F11btxhp1m8?entry=ttu&g_ep=EgoyMDI2MDUzMS4wIKXMDSoASAFQAw%3D%3D',
                'opening_time' => '04:00',
                'closing_time' => '17:00',
            ],
            [
                'location_name' => 'LOTTE GROSIR MAKASSAR',
                'road_name' => 'Jl. Sultan Alauddin No. 87, Pa\'baeng-Baeng, Kec. Tamalate',
                'location_picture' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT8soyTWhU04KJXIWy6Sf-AzQikaUDlPDDYw&s',
                'google_maps_link' => 'https://www.google.com/maps/place/LOTTE+GROSIR+MAKASSAR/@-5.1699355,119.4233705,17z/data=!3m1!4b1!4m6!3m5!1s0x2dbee284b79b1333:0xcb3cece13b8e5c8a!8m2!3d-5.1699355!4d119.4259454!16s%2Fg%2F1tjph10t?entry=ttu&g_ep=EgoyMDI2MDUzMS4wIKXMDSoASAFQAw%3D%3D',
                'opening_time' => '08:00',
                'closing_time' => '22:00',
            ],
            [
                'location_name' => 'Toko Suka Berkah',
                'road_name' => 'Jl. Ps. Terong No. 36A, Tompo Balang, Kec. Bontoala',
                'location_picture' => 'https://lh3.googleusercontent.com/gps-cs-s/APNQkAE0wTdkOVH6wGyu-qhvdIvIMgpTDW6T39GyO7EAc7yJa0Kg9VMn0n9KRolv3-LPvBrF2gxlTJ-t7Z89CsoTbn6VJIPO9YEmaPohKT0JnPyZLd4JaCN66-paqWvmDMbfp2o0sXp2=w203-h132-k-no',
                'google_maps_link' => 'https://www.google.com/maps/place/Toko+Surya+Berkat/@-5.1511289,119.406592,14z/data=!4m10!1m2!2m1!1stoko+surka+berka!3m6!1s0x2dbee3d7d15a4d7b:0x597dd13e1f28bad3!8m2!3d-5.1648491!4d119.4713852!15sChF0b2tvIHN1cnlhIGJlcmthaFoTIhF0b2tvIHN1cnlhIGJlcmthaJIBF2VsZWN0cmljYWxfc3VwcGx5X3N0b3JlmgEjQ2haRFNVaE5NRzluUzBWSlEwRm5UVVJCTTNSZloxUkJFQUXgAQD6AQQIABAh!16s%2Fg%2F11vhcb6xsl?entry=ttu&g_ep=EgoyMDI2MDUzMS4wIKXMDSoASAFQAw%3D%3D',
                'opening_time' => '05:00',
                'closing_time' => '18:00',
            ],
            [
                'location_name' => 'Pasar Tradisional Antang',
                'road_name' => 'Jl. Antang Raya No. 93, Kelurahan Antang, Kecamatan Manggala, Kota Makassar',
                'location_picture' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxpvJ1U7HGArzZ7P028p5tkgSR2onwqcvlCw&s',
                'google_maps_link' => 'https://www.google.com/maps?newwindow=1&sca_esv=f6b7f188eae7b463&biw=1536&bih=730&output=search&q=pasar+tradisional+antang&source=lnms&fbs=ADc_l-aN0CWEZBOHjofHoaMMDiKpaEWjvZ2Py1XXV8d8KvlI3kj_s5Jds98_ubVRf0unUVuttyzNArKNIU5GZzx4Y5djFcxQXOCsqeNxs4jgJuvK8N2Vxm5DxsGbu0xWF-bbBEylTM-2tI4JKsmjiWyQVw5gdLT6aE6zKgCZp_ToUBJ9niNx3WHObuFMRrE_vKo7k-m-HFvFj8ZV0F3sjpceZsUNkwgSUA&entry=mc&ved=1t:200715&ictx=111  ',
                'opening_time' => '05:00',
                'closing_time' => '18:00',
            ],
            [
                'location_name' => 'Toko Yunita',
                'road_name' => 'Jl. Opu Daeng Risadju No.273C, Tamparang Keke, Kec. Mamajang, Kota Makassar, Sulawesi Selatan 90121',
                'location_picture' => 'https://streetviewpixels-pa.googleapis.com/v1/thumbnail?panoid=wL2qpK4Xee2SIz_iJ1Iemw&cb_client=search.gws-prod.gps&w=408&h=240&yaw=107.05207&pitch=0&thumbfov=100',
                'google_maps_link' => 'https://www.google.com/maps/place/Toko+Yunita/@-5.1713498,119.375752,14z/data=!4m10!1m2!2m1!1stoko+yunita!3m6!1s0x2dbf1d7b473f9c93:0x85e19e6e808ae8f9!8m2!3d-5.1713498!4d119.4107709!15sCgt0b2tvIHl1bml0YZIBBXN0b3Jl4AEA!16s%2Fg%2F11hd9nhqpz?entry=ttu&g_ep=EgoyMDI2MDUzMS4wIKXMDSoASAFQAw%3D%3D',
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
        ];


        foreach ($locations as $location) {
            Location::firstOrCreate(
                ['location_name' => $location['location_name']],
                $location
            );
        }
    }
}