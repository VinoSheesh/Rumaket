Berikut adalah pembaruan **Product Requirement Document (PRD)** yang disesuaikan dengan perubahan arsitektur pemicu *reminder*, di mana **Firebase Scheduler / Cloud Scheduler** digunakan sebagai pemicu (*trigger*) jadwal/pemberitahuan secara terpusat.

---

# Product Requirement Document (PRD)

## Caretaker & Patient Management System

---

## 1. Executive Summary & Overview

### 1.1 Purpose

Aplikasi manajemen perawatan berbasis **Room Pasien** (*Patient Room*) yang memungkinkan pemilik/admin atau keluarga pasien mengelola ruang perawatan, mengundang/menambahkan *CareTaker*, menyusun jadwal tugas berdasarkan kategori & waktu, melakukan absensi langsung (*one-click check-in/out*), serta memantau catatan perkembangan pasien.

### 1.2 Target Roles & Access Control

* **Room Owner / Admin / Keluarga Pasien**:
* Membuat dan mengelola *Room Pasien*.
* Menambahkan (*invite/assign*) satu atau beberapa CareTaker ke dalam room tertentu.
* Mengatur jadwal harian, memantau log absensi, dan membaca catatan harian pasien.


* **CareTaker / Perawat**:
* Mengakses *Room Pasien* tempat mereka ditugaskan.
* Melakukan absensi *check-in/check-out* langsung tanpa verifikasi GPS/foto.
* Menandai tugas yang telah selesai dan menulis catatan perawatan (*Notes*).



---

## 2. Updated Tech Stack Architecture

| Layer | Technology | Purpose / Description |
| --- | --- | --- |
| **Backend & UI** | **Laravel Livewire** | Framework full-stack reaktif untuk performa dinamis tanpa SPA terpisah. |
| **Styling** | **Tailwind CSS** | Custom styling utility untuk kontrol penuh antarmuka (*Anti-AI Slop design*). |
| **Scheduler / Automation** | **Firebase / Google Cloud Scheduler** | Memicu tugas berkala/jadwal terencana (*scheduled jobs*) untuk memproses logika pengingat secara eksternal & *reliable*. |
| **Push Notification & Database** | **Firebase FCM & Realtime Sync** | Mengirimkan *push notification* instan ke perangkat CareTaker/Keluarga & pembaruan status *real-time*. |

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

### 4.1 Room Pasien & Management CareTaker

* **Manajemen Room Pasien:**
* Pembuatan ruang perawatan khusus (contoh: *Room Pasien - Ruang Melati / Opa Budi*).
* Dasbor terisolasi per room yang berisi informasi perawat aktif, jadwal harian, log absensi, dan riwayat catatan harian.


* **Koneksi Multi-CareTaker:**
* Seseorang/Admin dapat menambahkan satu atau **beberapa CareTaker** ke dalam satu room yang sama.
* CareTaker hanya memiliki akses ke room-room tempat mereka terdaftar.



---

### 4.2 Sistem Absen Direct (Tanpa Verifikasi Lokasi/Foto)

* **One-Tap Check-In / Check-Out:**
* CareTaker cukup menekan tombol **"Mulai Shift / Check-In"** dan **"Selesai Shift / Check-Out"** di dasbor Room Pasien.
* **Tanpa verifikasi GPS / Geofencing / Foto Selfie.**


* **Status Log Kehadiran:**
* Menampilkan indikator real-time perawat yang sedang *on-duty* di room tersebut beserta waktu mulai shift.



---

### 4.3 Schedule CareTaker (Kategori & Sub-Menu Waktu)

* **Kategori Tugas:**
* 💊 *Pengobatan (Medication)*
* 🥗 *Nutrisi & Makanan (Meal/Diet)*
* 🧼 *Higiene & Perawatan Diri (Hygiene)*
* 🩺 *Pemeriksaan Tanda Vital (Vitals Check)*
* 🏃 *Terapi & Aktivitas (Therapy/Exercise)*


* **Pengelompokan Waktu:**
* Pagi (`06:00 - 11:59`)
* Siang (`12:00 - 16:59`)
* Sore / Malam (`17:00 - 21:59`)
* Dini Hari / Jam Spesifik (`HH:mm`)


* **Status Eksekusi:** *Pending*, *Completed*, atau *Skipped* (beserta catatan alasan).

---

### 4.4 Notes (Catatan Perawatan Harian)

* Perekaman catatan ringkas harian oleh CareTaker setelah melakukan tindakan.
* Pengelompokan catatan: *Kondisi Kesehatan, Perubahan Perilaku, Hasil Tensi/Gula Darah, Pesan Serah-Terima Shift*.
* Dukungan unggah foto pendukung (seperti foto alat ukur tensi atau resep).

---

## 5. Anti-"AI Slop" Design Guidelines (UI/UX)

Untuk memastikan antarmuka terasa **profesional, fungsional, dan bersih**, serta tidak seperti template AI generik:

### 5.1 Elemen yang Dihindari (Anti-Patterns)

❌ **Gradient berlebihan** (seperti gradien ungu/pink neon mengkilap).

❌ **Soft shadow lebay** pada setiap *card* yang membuat antarmuka terasa melayang dan tidak rapi.

❌ **Sudut melengkung ekstrem** (*rounded-full* pada kontainer utama) yang tampak seperti mainan.

❌ **Ilustrasi kartun flat generik** (*corporate vector illustrations*) yang tidak menambah nilai fungsi.

### 5.2 Prinsip Desain UI

* **High Density & Clean Layout:** Menggunakan tata letak berbentuk *timeline* vertikal ringkas atau tabel *checklist* fungsional untuk jadwal harian.
* **Clear Visual Hierarchy:**
* Font sans-serif yang bersih (*Inter* / *Plus Jakarta Sans*).
* Kontras warna yang tegas (*Zinc/Slate neutral backgrounds* dengan aksen warna fungsional seperti Hijau Emerald untuk *Completed*, Kuning Amber untuk *Pending*, dan Merah Rose untuk *Overdue*).


* **Thumb-Friendly Actions:** Tombol *Check-In Absen* dan *Check-Off Task* dibuat tajam, berukuran proporsional, serta mudah ditekan dari layar smartphone tanpa ornamen hiasan yang mengganggu.

---

## 6. Information Architecture & Navigation

```
[ Dasbor Utama ]
   │
   ├── [ Room Pasien A ]
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
* Setup Laravel Livewire + Tailwind CSS.
* Model DB: `users`, `patient_rooms`, `room_caretakers`, `schedules`, `attendances`, `notes`.
* Fitur pembuatan *Room Pasien* dan penambahan CareTaker ke dalam room.


2. **Sprint 2: Attendance System & Schedules**
* Implementasi tombol *Check-In / Check-Out* sederhana (direct).
* Pembuatan fitur *Schedule* dengan filter kategori dan slot waktu.


3. **Sprint 3: Notes & Firebase Scheduler Setup**
* Fitur pencatatan medis harian (*Notes*).
* Konfigurasi Firebase Scheduler (Cloud Scheduler) untuk memicu endpoint webhook Laravel.


4. **Sprint 4: Push Notification (FCM) & UI Polishing**
* Integrasi Firebase FCM untuk pengiriman notifikasi pengingat ke HP CareTaker.
* Penerapan panduan *Anti-AI Slop UI* pada komponen Livewire.