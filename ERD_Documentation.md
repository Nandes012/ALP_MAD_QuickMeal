# QuickMeal - Entity Relationship Diagram (ERD) Documentation

Struktur data utama disimpan dalam database relasional MySQL. Skema database (ERD) yang terlampir dalam dokumen ini menjadi acuan utama. Berikut adalah deskripsi tabel-tabel penting:

## Tabel-Tabel Utama

- **users**: Menyimpan data dasar pengguna dan detail profil spesifik untuk pelanggan aplikasi QuickMeal. Mencakup informasi pribadi, autentikasi, status premium, dan foto profil.

- **recipes**: Tabel master untuk setiap resep makanan yang ditawarkan, berisi judul, deskripsi, waktu memasak, tingkat kesulitan, gambar, dan video tutorial lengkap.

- **ingredients**: Tabel master untuk setiap bahan makanan yang tersedia, mencakup nama, gambar, video panduan bahan, dan harga per kilogram.

- **recipe_ingredients**: Tabel transaksi yang menghubungkan resep dengan bahan yang diperlukan, berisi kuantitas bahan dan estimasi harga bahan untuk setiap resep.

- **recipe_steps**: Tabel yang menyimpan langkah-langkah detail memasak setiap resep, terurut berdasarkan nomor langkah dengan deskripsi lengkap.

- **restaurants**: Tabel master untuk informasi restoran mitra yang menjual makanan siap saji, berisi nama, lokasi, dan rating.

- **foods**: Tabel yang menyimpan menu makanan dari setiap restoran mitra, mencakup nama, harga, gambar, dan estimasi waktu pengiriman.

- **orders**: Tabel transaksi pemesanan makanan dari pelanggan, mencatat detail pesanan beserta status pengiriman dari pending hingga delivered.

- **subscriptions**: Tabel yang mencatat langganan premium pengguna, berisi tanggal mulai, tanggal berakhir, dan status aktivitas langganan.

- **subscription_history**: Tabel riwayat yang melacak setiap perubahan status langganan pengguna, termasuk alasan perubahan dan status sebelumnya.

- **payments**: Tabel transaksi pembayaran untuk semua langganan premium, mencatat metode pembayaran, jumlah, dan status pembayaran.

- **recommendations**: Tabel yang menyimpan rekomendasi personal untuk setiap pengguna, termasuk tipe rekomendasi yang diberikan.

- **recommendation_items**: Tabel junction yang menghubungkan rekomendasi dengan resep atau menu makanan yang direkomendasikan kepada pengguna.

## Relasi dan Koneksi Antar Tabel

### User-Centric Relationships
- **users ↔ recipes**: One-to-Many - Pengguna dapat melihat dan mengakses berbagai resep
- **users ↔ orders**: One-to-Many - Satu pengguna dapat melakukan banyak pesanan makanan
- **users ↔ subscriptions**: One-to-Many - Pengguna dapat memiliki beberapa langganan (aktif dan riwayat)
- **users ↔ recommendations**: One-to-Many - Satu pengguna menerima banyak rekomendasi personal
- **users ↔ subscription_history**: One-to-Many - Setiap pengguna memiliki log riwayat langganan

### Recipe-Ingredient Relationships
- **recipes ↔ ingredients**: Many-to-Many - Banyak resep menggunakan banyak bahan (melalui recipe_ingredients)
- **recipes ↔ recipe_steps**: One-to-Many - Satu resep memiliki banyak langkah memasak
- **recipes ↔ recommendation_items**: One-to-Many - Resep dapat direkomendasikan kepada pengguna

### Restaurant-Food Relationships
- **restaurants ↔ foods**: One-to-Many - Satu restoran menjual banyak menu makanan
- **foods ↔ recommendation_items**: One-to-Many - Menu makanan dapat direkomendasikan kepada pengguna

### Subscription & Payment Relationships
- **subscriptions ↔ payments**: One-to-Many - Satu langganan dapat memiliki banyak transaksi pembayaran
- **subscriptions ↔ subscription_history**: One-to-Many - Perubahan langganan dicatat dalam riwayat
- **recommendations ↔ recommendation_items**: One-to-Many - Satu rekomendasi berisi banyak item (resep/makanan)

## Alur Data dan Use Case

1. **Penelusuran Resep**: Pengguna menelusuri resep dengan bahan dan langkah memasak terperinci
2. **Pemesanan Makanan**: Pengguna memesan makanan dari restoran mitra, dilacak dalam tabel orders
3. **Langganan Premium**: Pengguna berlangganan fitur premium; pembayaran dicatat dalam tabel payments
4. **Pelacakan Langganan**: Riwayat mencatat setiap perubahan status langganan untuk audit trail
5. **Rekomendasi Personal**: Sistem merekomendasikan resep atau makanan berdasarkan preferensi pengguna
6. **Pencarian Bahan**: Pengguna dapat mencari bahan berdasarkan harga dan ketersediaan
