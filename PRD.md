Berikut adalah pembaruan **Product Requirement Document (PRD)** yang disesuaikan dengan perubahan arsitektur pemicu _reminder_, di mana **Firebase Scheduler / Cloud Scheduler** digunakan sebagai pemicu (_trigger_) jadwal/pemberitahuan secara terpusat.

---

# Product Requirement Document (PRD)

## Rumaket & Elderly Management System

---

## 1. Executive Summary & Overview

### 1.1 Purpose

Aplikasi manajemen perawatan berbasis **Room Lansia** (_Patient Room_) yang memungkinkan pemilik/admin atau keluarga lansia mengelola ruang perawatan, mengundang/menambahkan _CareTaker_, menyusun jadwal tugas berdasarkan kategori & waktu, melakukan absensi langsung (_one-click check-in/out_), serta memantau catatan perkembangan lansia.

### 1.2 Target Roles & Access Control

- **Room Owner / Admin / Keluarga Lansia**:
- Membuat dan mengelola _Room Pasien_.
- Menambahkan (_invite/assign_) satu atau beberapa CareTaker ke dalam room tertentu.
- Mengatur jadwal harian, memantau log absensi, dan membaca catatan harian lansia.

- **CareTaker / Perawat**:
- Mengakses _Room Pasien_ tempat mereka ditugaskan.
- Melakukan absensi _check-in/check-out_ langsung tanpa verifikasi GPS/foto.
- Menandai tugas yang telah selesai dan menulis catatan perawatan (_Notes_).

---

## 2. Updated Tech Stack Architecture

| Layer                            | Technology                            | Purpose / Description                                                                                                    |
| -------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Backend & UI**                 | **Laravel Livewire**                  | Framework full-stack reaktif untuk performa dinamis tanpa SPA terpisah.                                                  |
| **Styling**                      | **Tailwind CSS**                      | Custom styling utility untuk kontrol penuh antarmuka (_Anti-AI Slop design_).                                            |
| **Scheduler / Automation**       | **Firebase / Google Cloud Scheduler** | Memicu tugas berkala/jadwal terencana (_scheduled jobs_) untuk memproses logika pengingat secara eksternal & _reliable_. |
| **Push Notification & Database** | **Firebase FCM & Realtime Sync**      | Mengirimkan _push notification_ instan ke perangkat CareTaker/Keluarga & pembaruan status _real-time_.                   |

---

## 3. Scheduler & Notification Workflow (Firebase Scheduler)

```
┌──────────────────────────┐      HTTP / Webhook      ┌──────────────────────────┐
│ Firebase / Cloud         │ ───────────────────────> │ Laravel Livewire Endpoint│
│ Scheduler (Cron Trigger) │                          │ (e.g., /api/v1/cron/run) │
└──────────────────────────┘                          └────────────┬─────────────┘
                                                                   │
                                                      Check Pending Schedules
                                                                   │
                                                                   ▼
┌──────────────────────────┐     Send Push Notif      ┌──────────────────────────┐
│ CareTaker Devices        │ <─────────────────────── │ Firebase FCM             │
│ (Push Notification)      │                          │ (Cloud Messaging)        │
└──────────────────────────┘                          └──────────────────────────┘

```

### 3.1 Detail Alur Kerja Firebase Scheduler

1. **Pemicu Berkala:** Firebase / Cloud Scheduler dikonfigurasi untuk memanggil endpoint API/Webhook terproteksi di aplikasi Laravel secara berkala (misal: tiap 1 menit atau 5 menit).
2. **Evaluasi Jadwal di Laravel:** Endpoint Laravel menerima request, memverifikasi token autentikasi webhook, lalu mengecek database untuk jadwal obat/tugas yang harus dikirim dalam rentang waktu tersebut.
3. **Dispatch Notification:** Laravel mengeksekusi pengiriman notifikasi melalui **Firebase Cloud Messaging (FCM)** langsung ke perangkat CareTaker yang bertugas di room terkait.

---

## 4. Core Features & Functional Requirements

### 4.1 Room Lansia & Management CareTaker

- **Manajemen Room Lansia:**
- Pembuatan ruang perawatan khusus (contoh: _Room Lansia - Ruang Melati / Opa Budi_).
- Dasbor terisolasi per room yang berisi informasi perawat aktif, jadwal harian, log absensi, dan riwayat catatan harian.

- **Koneksi Multi-CareTaker:**
- Seseorang/Admin dapat menambahkan satu atau **beberapa CareTaker** ke dalam satu room yang sama.
- CareTaker hanya memiliki akses ke room-room tempat mereka terdaftar.

---

### 4.2 Sistem Absen Direct (Tanpa Verifikasi Lokasi/Foto)

- **One-Tap Check-In / Check-Out:**
- CareTaker cukup menekan tombol **"Mulai Shift / Check-In"** dan **"Selesai Shift / Check-Out"** di dasbor Room Lansia.
- **Tanpa verifikasi GPS / Geofencing / Foto Selfie.**

- **Status Log Kehadiran:**
- Menampilkan indikator real-time perawat yang sedang _on-duty_ di room tersebut beserta waktu mulai shift.

---

### 4.3 Schedule CareTaker (Kategori & Sub-Menu Waktu)

- **Kategori Tugas:**
- 💊 _Pengobatan (Medication)_
- 🥗 _Nutrisi & Makanan (Meal/Diet)_
- 🧼 _Higiene & Perawatan Diri (Hygiene)_
- 🩺 _Pemeriksaan Tanda Vital (Vitals Check)_
- 🏃 _Terapi & Aktivitas (Therapy/Exercise)_

- **Pengelompokan Waktu:**
- Pagi (`06:00 - 11:59`)
- Siang (`12:00 - 16:59`)
- Sore / Malam (`17:00 - 21:59`)
- Dini Hari / Jam Spesifik (`HH:mm`)

- **Status Eksekusi:** _Pending_, _Completed_, atau _Skipped_ (beserta catatan alasan).

---

### 4.4 Notes (Catatan Perawatan Harian)

- Perekaman catatan ringkas harian oleh CareTaker setelah melakukan tindakan.
- Pengelompokan catatan: _Kondisi Kesehatan, Perubahan Perilaku, Hasil Tensi/Gula Darah, Pesan Serah-Terima Shift_.
- Dukungan unggah foto pendukung (seperti foto alat ukur tensi atau resep).

---

## 5. Anti-"AI Slop" Design Guidelines (UI/UX)

Untuk memastikan antarmuka terasa **profesional, fungsional, dan bersih**, serta tidak seperti template AI generik:

### 5.1 Elemen yang Dihindari (Anti-Patterns)

❌ **Gradient berlebihan** (seperti gradien ungu/pink neon mengkilap).

❌ **Soft shadow lebay** pada setiap _card_ yang membuat antarmuka terasa melayang dan tidak rapi.

❌ **Sudut melengkung ekstrem** (_rounded-full_ pada kontainer utama) yang tampak seperti mainan.

❌ **Ilustrasi kartun flat generik** (_corporate vector illustrations_) yang tidak menambah nilai fungsi.

### 5.2 Prinsip Desain UI

- **High Density & Clean Layout:** Menggunakan tata letak berbentuk _timeline_ vertikal ringkas atau tabel _checklist_ fungsional untuk jadwal harian.
- **Clear Visual Hierarchy:**
- Font sans-serif yang bersih (_Inter_ / _Plus Jakarta Sans_).
- Kontras warna yang tegas (_Zinc/Slate neutral backgrounds_ dengan aksen warna fungsional seperti Hijau Emerald untuk _Completed_, Kuning Amber untuk _Pending_, dan Merah Rose untuk _Overdue_).

- **Thumb-Friendly Actions:** Tombol _Check-In Absen_ dan _Check-Off Task_ dibuat tajam, berukuran proporsional, serta mudah ditekan dari layar smartphone tanpa ornamen hiasan yang mengganggu.

---

## 6. Information Architecture & Navigation

```
[ Dasbor Utama ]
   │
   ├── [ Room Lansia A ]
   │     ├── Status Active CareTaker (Siapa yang sedang Check-In)
   │     ├── [ Quick Action ] ────> (Check-In / Check-Out Shift)
   │     ├── [ CareTaker List ] ──> (Tambah / Kelola CareTaker di Room)
   │     │
   │     ├── [ Tab: Schedule ]
   │     │     ├── Filter Waktu (Pagi | Siang | Sore | Malam)
   │     │     └── Filter Kategori (Obat | Nutrisi | Higiene | Vital)
   │     │
   │     ├── [ Tab: Notes ] ──────> Catatan Perawatan & Serah Terima
   │     └── [ Tab: Attendance ] ─> Log Riwayat Kehadiran CareTaker
   │
   └── [ Buat Room Baru ]

```

---

## 7. MVP Development Roadmap

1. **Sprint 1: Base Setup & Room Management**

- Setup Laravel Livewire + Tailwind CSS.
- Model DB: `users`, `patient_rooms`, `room_caretakers`, `schedules`, `attendances`, `notes`.
- Fitur pembuatan _Room Pasien_ dan penambahan CareTaker ke dalam room.

2. **Sprint 2: Attendance System & Schedules**

- Implementasi tombol _Check-In / Check-Out_ sederhana (direct).
- Pembuatan fitur _Schedule_ dengan filter kategori dan slot waktu.

3. **Sprint 3: Notes & Firebase Scheduler Setup**

- Fitur pencatatan medis harian (_Notes_).
- Konfigurasi Firebase Scheduler (Cloud Scheduler) untuk memicu endpoint webhook Laravel.

4. **Sprint 4: Push Notification (FCM) & UI Polishing**

- Integrasi Firebase FCM untuk pengiriman notifikasi pengingat ke HP CareTaker.
- Penerapan panduan _Anti-AI Slop UI_ pada komponen Livewire.
