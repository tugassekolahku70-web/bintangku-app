# ⭐ Bintangku – Aplikasi Kebiasaan Baikku Setiap Hari

Aplikasi web frontend modern, interaktif, dan berestetika premium untuk pembiasaan karakter & ibadah anak islami, lengkap dengan **Portal Siswa**, **Dashboard Guru (Panel Guru)**, dan **Ekspor Raport/Laporan Resmi**.

Aplikasi ini dibangun identik dengan 7 mockup desain yang terdapat di direktori `D:\Proyekku\Pempek - Kohar\SMP`, siap untuk dideploy ke **Vercel** dan diintegrasikan dengan database **Supabase**.

---

## 📱 Daftar Halaman & Fitur Sesuai Mockup

1. **Landing Page (`bintangku.id`)** – *Sesuai Mockup 1*:
   - Hero section dengan Maskot 3D Bintang berpeci merah dan baju koko.
   - Interactive live preview aplikasi mobile anak dengan checklist interaktif.
   - 3 Fitur Unggulan: Shalat Tepat Waktu, Baca Al-Qur'an, Doa Sebelum Tidur.
   - Gelombang merah testimoni orang tua (Bunda Aisyah, Ayah Ridwan, Bunda Siti).
   - Navigasi & tombol CTA: "Unduh Sekarang", "Masuk Siswa", "Panel Guru".

2. **Halaman Masuk Siswa (`/student/login`)** – *Sesuai Mockup 2*:
   - Kubah lengkung merah ruby dengan maskot bintang melambaikan tangan.
   - Form input Nama Siswa & PIN 4-digit unik dengan auto-focus perpindahan kotak.
   - Tombol masuk gradasi emas bersinar (*glow effect*).
   - Card jaminan: *"Bintangku membantumu menjadi anak shalih setiap hari ❤️"*.

3. **Beranda Kebiasaan Siswa (`/student/beranda`)** – *Sesuai Mockup 3*:
   - Salam: *"Assalamu'alaikum, Adek Arman 👋 - Semangat jadi anak shalih hari ini!"*.
   - Counter bintang: ⭐ 320 Bintang (bertambah otomatis saat tugas diceklis).
   - Baris tanggal: *"Sabtu, 24 Mei 2025"* & tombol kalender pop-up.
   - Bar progress harian dinamis (misal 4/5 kebiasaan).
   - Checklist kebiasaan: Sholat Subuh, Sholat Dzuhur, Sholat Maghrib, Mengaji, Doa Sebelum Tidur (disertai efek suara / taburan konfeti bintang emas).
   - Floating Bottom Navigation Bar (Beranda, Kebiasaan, Quick Star, Hadiah, Profil).

4. **Progres & Toples Bintang (`/student/progres`)** – *Sesuai Mockup 4*:
   - Toples Kaca 3D *"Toples Bintang"* bercahaya dengan tutup emas, tag kulit "Bintangku", dan tumpukan bintang emas menyala di dalamnya.
   - Progres Mingguan: *"28/35 Kebiasaan Tercapai"* (18 - 24 Mei 2025).
   - 3 Kartu Statistik: 🔥 7 Hari Streak, 🛡️ 32 Kebiasaan, ⭐ 320 Total Bintang.
   - Kartu motivasi maskot: *"Kamu luar biasa!"*.

5. **Koleksi Lencana & Pencapaian (`/student/pencapaian`)** – *Sesuai Mockup 5*:
   - 9 Lencana dalam format Grid 3x3:
     - 5 Lencana Emas aktif (Bintang Rajin Sholat, Mengaji, Doa Malam, Sholat 5 Waktu, Berdoa).
     - 4 Lencana Perak terkunci dengan target bintang (Bintang Berbagi, Disiplin, Konsisten, Istimewa).
   - Klik pada lencana membuka modal interaktif detail pencapaian & sisa bintang yang dibutuhkan.

6. **Dashboard Guru / Panel Guru (`/teacher/dashboard`)** – *Sesuai Mockup 6*:
   - Sidebar merah ruby elegan dengan navigasi: Dashboard, Kelas Saya, Siswa, Kebiasaan, Pencapaian, Laporan, Pesan, Pengaturan.
   - Header: *"Assalamu'alaikum, Ustadzah Aisyah ✨"*, dropdown filter kelas ("Kelas 2A") & tanggal.
   - 4 Kartu KPI: Rata-rata Kelas (85%), Total Bintang Kelas (1.250), Streak Terbaik (12 Hari - Ahmad Zaki), Kebiasaan Tuntas (80%).
   - Tabel Konsistensi Siswa interaktif: pencarian, filter status, avatar santri, persentase konsistensi warna, streak, bintang, dan tombol aksi "+⭐ Beri Bintang" dengan modal penambahan bintang langsung.

7. **Export & Unduh Laporan Guru (`/teacher/reports/export`)** – *Sesuai Mockup 7*:
   - Dokumen Sertifikat Resmi Laporan Konsistensi Siswa dengan ornamen border sudut emas islami.
   - Grafik Batang (Bar Chart) Konsistensi Harian siswa (Ahmad Zaki 100%, Aisyah Humaira 85%, Muhammad Fathan 70%, Khalisa Putri 50%, Raihan Aditya 35%).
   - Panel ekspor laporan: pilihan format PDF / PNG, tombol *"Unduh Laporan"* (menggunakan html2canvas & jspdf) & *"Cetak Langsung"* (terhubung langsung ke print dialog `@media print` ukuran A4 yang rapi).

---

## 🚀 Cara Menjalankan Secara Lokal

1. Pastikan dependensi sudah terpasang:
   ```bash
   npm install
   ```

2. Jalankan server pengembangan Vite:
   ```bash
   npm run dev
   ```
   Buka browser di `http://localhost:5173`.

---

## 🌐 Panduan Deployment ke Vercel

Aplikasi ini sudah dilengkapi dengan file `vercel.json` untuk konfigurasi Single Page Application (SPA) routing rewrites.

### Opsi A: Menggunakan Vercel CLI
```bash
npm install -g vercel
vercel
```

### Opsi B: Menggunakan Vercel Dashboard (GitHub / GitLab)
1. Push repositori ini ke akun GitHub Anda.
2. Buka [vercel.com](https://vercel.com) dan pilih **Add New Project**.
3. Import repositori Anda. Vercel akan secara otomatis mendeteksi framework **Vite**.
4. Di bagian **Environment Variables**, tambahkan:
   - `VITE_SUPABASE_URL`: URL project Supabase Anda.
   - `VITE_SUPABASE_ANON_KEY`: Anon / Public key Supabase Anda.
5. Klik **Deploy**!

---

## 🗄️ Panduan Integrasi Supabase

File migrasi database telah disediakan di [`supabase/schema.sql`](file:///d:/Proyekku/Pempek%20-%20Kohar/SMP/supabase/schema.sql).

1. Buka dashboard [supabase.com](https://supabase.com) dan buat project baru.
2. Masuk ke menu **SQL Editor** di sidebar Supabase.
3. Buka file `supabase/schema.sql`, salin seluruh kodenya, lalu tempelkan ke SQL Editor dan klik **Run**.
4. Skema database (tabel `classes`, `students`, `habits`, `habit_logs`, `badges`, `student_badges`) beserta data awal mockup akan langsung terpasang!
5. Buka **Project Settings > API** di Supabase, lalu salin **Project URL** dan **anon public key**.
6. Buat file `.env.local` di folder proyek ini:
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJh......
   ```
7. Aplikasi akan otomatis beralih dari mode offline/local-storage ke koneksi real-time Supabase!
