# QuickMeal 

---

## 📁 Struktur Folder
- `backend_QuickMeal`: Source code Laravel (REST API)
- `frontend_QuickMeal`: Source code React Native (Expo)

---

## 🛠️ Setup Backend (Laravel)

1. **Masuk ke folder backend:**
   ```bash
   cd backend_QuickMeal
   ```
2. **Install dependencies:**
   ```bash
   composer install
   ```
3. **Konfigurasi Environment:**
   - Salin file `.env.example` menjadi `.env`:
     ```bash
     cp .env.example .env
     ```
   - Buka file `.env` dan sesuaikan pengaturan MySQL XAMPP Anda:
     - `DB_DATABASE=quickmeal` (Buat database ini di phpMyAdmin)
     - `DB_USERNAME=root`
     - `DB_PASSWORD=` (Kosongkan jika pakai XAMPP default)
4. **Generate Application Key:**
   ```bash
   php artisan key:generate
   ```
5. **Jalankan Migrasi Database:**
   ```bash
   php artisan migrate
   ```
6. **Jalankan Server:**
   ```bash
   php artisan serve --host=0.0.0.0
   ```
   *Catatan: Gunakan flag --host agar API bisa diakses dari HP melalui Wi-Fi.*

---

## 📱 Setup Frontend (React Native - Expo)

1. **Masuk ke folder frontend:**
   ```bash
   cd frontend_QuickMeal
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Konfigurasi API URL:**
   - Pastikan variabel `BASE_URL` pada file koneksi API menggunakan **IP Address Laptop** Anda (bukan localhost).
   - Contoh: `http://1.xx`
4. **Jalankan Aplikasi:**
   ```bash
   npx expo start
   ```
   - Buka aplikasi **Expo Go** di HP dan scan QR Code yang muncul.

---

## ⚠️ Penting untuk Kolaborator
- Pastikan HP dan Laptop berada di dalam **jaringan Wi-Fi yang sama**.
- Jangan mengunggah file `.env` ke GitHub (sudah masuk .gitignore).
- Jika menambah library baru, segera beritahu tim untuk menjalankan `npm install` atau `composer install`.
