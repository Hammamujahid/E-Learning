# E-Learning

Platform belajar mandiri dengan tiga peran:

- **Admin** — kelola pengguna, mata pelajaran, dan kota
- **Guru** — susun materi beserta bank soalnya
- **Siswa** — baca materi, kerjakan quiz, lihat pembahasan

Dibangun dengan Laravel + React.

---


## Setup

**1. Klon dan pasang dependensi**

```bash
git clone git@github.com:Hammamujahid/E-Learning.git
cd E-Learning

composer install
npm install
```

**2. Siapkan environment**

```bash
cp .env.example .env
php artisan key:generate
```

**3. Siapkan basis data**

Bawaannya PostgreSQL. Buat databasenya, lalu sesuaikan `DB_*` di `.env`:

```bash
createdb e-learning
```

Atau pakai SQLite biar tidak perlu server database — ubah `.env` jadi `DB_CONNECTION=sqlite`, hapus baris `DB_*` lainnya, lalu:

```bash
touch database/database.sqlite
```

**4. Migrasi dan isi data awal**

```bash
php artisan migrate --seed
```

**5. Jalankan**

Dua terminal:

```bash
php artisan serve      # http://localhost:8000
npm run dev
```

Atau satu perintah:

```bash
composer dev
```

---

## Akun demo

| Peran | Email                 | Password     |
| ----- | --------------------- | ------------ |
| Admin | `admin@example.com`   | `admin123`   |
| Guru  | `teacher@example.com` | `teacher123` |
| Siswa | `user@example.com`    | `user123`    |

Setelah masuk, tiap peran otomatis diarahkan ke dasbornya sendiri.

---

## Cloudinary (opsional)

Hanya dibutuhkan untuk mengunggah file materi dan gambar soal. Fitur lain jalan normal tanpanya. Isi di `.env`:

```env
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```
