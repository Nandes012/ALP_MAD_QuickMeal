<?php

namespace Database\Seeders;

use App\Models\Recipe;
use App\Models\RecipeStep;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RecipeStepSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed recipe steps for each recipe
     */
    public function run(): void
    {
        $recipeSteps = [
            'Telur Ceplok Kecap' => [
                'Panaskan minyak goreng di wajan dengan api sedang.',
                'Masukkan bawang merah yang sudah diiris tipis, tumis hingga harum (1 menit).',
                'Pecahkan telur secara perlahan ke wajan, biarkan putih telur matang.',
                'Taburkan cabai rawit merah, garam, dan kecap manis secara merata.',
                'Masak hingga kuning telur setengah matang atau sesuai selera (2 menit).',
                'Angkat dan sajikan hangat di piring.',
            ],
            'Tumis Sawi Putih & Bakso' => [
                'Siapkan bahan: sawi putih dipotong, bakso dipotong melintang, bawang putih diulek.',
                'Panaskan minyak goreng di wajan dengan api sedang-besar.',
                'Masukkan bawang putih yang sudah diulek, tumis hingga harum (1 menit).',
                'Masukkan bakso yang sudah dipotong, tumis sampai berubah warna (2 menit).',
                'Masukkan sawi putih yang sudah dipotong, tumis hingga sedikit layu (4 menit).',
                'Tambahkan tomat yang sudah dipotong, garam secukupnya, aduk rata.',
                'Masak hingga sawi putih empuk, angkat dan sajikan.',
            ],
            'Orek Tempe Kecap' => [
                'Potong tempe tipis-tipis, bawang merah diiris, cabai rawit dibelah.',
                'Panaskan minyak goreng di wajan dengan api sedang-besar.',
                'Masukkan bawang merah dan cabai rawit, tumis hingga harum (1 menit).',
                'Masukkan potongan tempe, aduk-aduk hingga semua terkena minyak.',
                'Tuangkan kecap manis secukupnya, aduk rata hingga tempe merata tertutup kecap.',
                'Masak terus sambil diaduk hingga tempe kecoklatan dan crispy (6-7 menit).',
                'Angkat dan sajikan selagi hangat.',
            ],
            'Sup Telur Tomat' => [
                'Siapkan air dalam panci, didihkan hingga mendapat uap panas.',
                'Masukkan bawang merah dan bawang putih yang sudah diulek ke air mendidih.',
                'Potong tomat menjadi 4 bagian, masukkan ke dalam sup, masak 2 menit.',
                'Pecahkan telur dengan hati-hati, biarkan jatuh ke dalam sup.',
                'Tambahkan garam, biarkan telur matang sambil api tetap menyala (2-3 menit).',
                'Matikan api, koreksi rasa jika perlu.',
                'Sajikan sup dalam mangkuk, tambahkan bawang merah goreng jika ada.',
            ],
            'Sosis Asam Manis' => [
                'Potong sosis menjadi ukuran sedang (diagonal atau melintang).',
                'Panaskan minyak goreng di wajan, masukkan bawang merah iris, tumis sampai harum.',
                'Masukkan potongan sosis, aduk-aduk hingga semua bagian terkena panas (3 menit).',
                'Tambahkan cabai rawit yang dibelah untuk memberikan rasa pedas.',
                'Siapkan saus asam manis (cuka + kecap manis + sedikit air), tuangkan ke wajan.',
                'Aduk rata sampai sosis terbalut sempurna, masak hingga empuk (4-5 menit).',
                'Angkat dan sajikan selagi hangat.',
            ],
            'Nasi Goreng Telur Orak Arik' => [
                'Panaskan minyak goreng di wajan atau penggorengan, masukkan bawang putih ulek.',
                'Tumis bawang putih sampai harum, lalu tambahkan bawang merah iris.',
                'Pecahkan telur ke wajan, aduk-aduk cepat hingga telur tercampur rata.',
                'Masukkan beras medium yang sudah dingin, aduk terus hingga setiap butir nasi terpisah.',
                'Tambahkan kecap manis, garam, aduk rata hingga warna nasi merata.',
                'Masak sambil diaduk hingga semua bahan tercampur dengan baik (5-6 menit).',
                'Sajikan nasi goreng di piring sambil hangat.',
            ],
            'Orak Arik Telur Sosis' => [
                'Potong kangkung setengah, potongan sosis siap pakai.',
                'Panaskan minyak goreng di wajan dengan api sedang-besar.',
                'Masukkan bawang putih ulek, tumis sampai harum (30 detik).',
                'Pecahkan telur langsung ke wajan, aduk cepat hingga tercampur rata.',
                'Tambahkan potongan sosis, terus aduk hingga semua matang (2 menit).',
                'Masukkan kangkung yang sudah dipotong, tambahkan garam, aduk hingga layu (1 menit).',
                'Angkat dan sajikan dalam kondisi hangat.',
            ],
            'Tempe Goreng Kriuk' => [
                'Potong tempe tebal sekitar 1 cm, diamkan di atas tisu untuk menghilangkan air.',
                'Buat adonan tepung: campurkan tepung terigu dengan garam dan cabai rawit halus.',
                'Ambil air secukupnya, tambahkan sedikit garam untuk membuat adonan tepung basah.',
                'Celupkan potongan tempe ke adonan tepung hingga merata tertutup.',
                'Panaskan minyak goreng dalam jumlah banyak hingga benar-benar panas.',
                'Goreng tempe hingga kecoklatan dan sangat crispy di kedua sisi (5-7 menit).',
                'Angkat ke tisu, sajikan selagi panas dan crispy.',
            ],
            'Martabak Mie Telur' => [
                'Rebus mie instan hingga setengah matang, tiriskan dan sisihkan.',
                'Potong kangkung pendek, bawang putih diulek siap digunakan.',
                'Panaskan minyak goreng di wajan dengan api sedang-besar.',
                'Masukkan bawang putih ulek, tumis sampai harum (30 detik).',
                'Pecahkan telur ke wajan, aduk-aduk hingga tercampur rata.',
                'Tambahkan mie yang sudah direbus, kangkung, garam, aduk hingga semua matang (4-5 menit).',
                'Goreng hingga bagian bawah sedikit gosong dan crispy (2-3 menit).',
                'Angkat dan sajikan selagi hangat.',
            ],
            'Tahu Tumis Kecap' => [
                'Potong tahu mentah menjadi ukuran sedang (dadu atau tipis), sisihkan di tisu.',
                'Bawang merah diiris tipis, bawang putih diulek siap gunakan.',
                'Panaskan minyak goreng di wajan dengan api sedang-besar.',
                'Masukkan bawang merah iris dan bawang putih ulek, tumis sampai harum (1 menit).',
                'Masukkan potongan tahu, aduk hati-hati hingga semua bagian tersentuh minyak.',
                'Tuangkan kecap manis secukupnya, aduk rata hingga tahu terbalut kecap.',
                'Masak terus sambil diaduk dengan lembut hingga bumbu meresap (5-6 menit).',
                'Angkat dan sajikan dalam kondisi hangat.',
            ],
        ];

        foreach ($recipeSteps as $recipeName => $steps) {
            $recipe = Recipe::where('name', $recipeName)->first();
            if (!$recipe) {
                continue;
            }

            foreach ($steps as $index => $description) {
                RecipeStep::create([
                    'recipeId' => $recipe->id,
                    'stepNumber' => $index + 1,
                    'description' => $description,
                ]);
            }
        }
    }
}
