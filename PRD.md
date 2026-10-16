# Product Requirement Document (PRD)

## Rumaket - Elderly & Caretaker Management System

---

## 1. Executive Summary & Overview

### 1.1 Purpose
**Rumaket** adalah platform manajemen perawatan lansia berbasis **Patient Room** (_Room Lansia_). Platform ini dirancang untuk memudahkan keluarga/admin dan CareTaker (perawat) dalam mengelola ruang perawatan, memantau jadwal harian lansia (obat, nutrisi, higiene), melakukan pencatatan absensi shift secara instan (_one-click check-in/out_), serta mencatat perkembangan kesehatan lansia secara real-time.

### 1.2 Target Roles & Access Control
- **Room Owner / Admin / Keluarga Lansia**:
  - Membuat dan mengelola _Room Lansia_.
  - Menambahkan (_invite/assign_) satu atau beberapa CareTaker ke dalam room.
  - Mengatur jadwal harian, memantau riwayat absensi, dan membaca catatan harian lansia.
- **CareTaker / Perawat**:
  - Mengakses _Room Lansia_ tempat mereka bertugas.
  - Melakukan absensi _check-in/check-out_ langsung (tanpa verifikasi GPS/Foto).
  - Menandai tugas yang selesai (_checklist_) dan menambahkan catatan harian/kondisi medis.

---

## 2. Updated Tech Stack Architecture

| Layer | Technology | Purpose / Description |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js (App Router)** | Framework React modern untuk UI yang responsif, cepat, dan terstruktur. |
| **Styling & UI Components** | **Tailwind CSS + Radix UI / Lucide Icons** | Styling utility-first dengan desain Clean, Informatif, dan Humanis. |
| **Backend & Database** | **Laravel / Supabase API** | Rest API / Realtime backend untuk autentikasi, manajemen data, dan business logic. |
| **Scheduler & Worker** | **Firebase / Cloud Scheduler** | Pemicu cron job berkala untuk pengingat jadwal obat/kegiatan lansia. |
| **Push Notification** | **Firebase FCM (Web Push)** | Pengiriman notifikasi real-time ke perangkat CareTaker/Keluarga. |

---

## 3. Core Features & Functional Requirements

### 3.1 Room Lansia & CareTaker Management
- **Dashboard Room Lansia:** Halaman khusus per Lansia yang menyajikan status perawat aktif, timeline kegiatan harian, dan ringkasan catatan terbaru.
- **Multi-CareTaker Assignment:** Admin dapat menambahkan beberapa CareTaker ke dalam satu room lansia.

### 3.2 Direct Attendance System (Absen Shift)
- **One-Tap Check-In / Check-Out:** Tombol langsung untuk memulai/mengakhiri shift perawat tanpa kendala verifikasi GPS atau selfie.
- **Active Status Indicator:** Menampilkan perawat yang sedang _On-Duty_ secara visual pada header room.

### 3.3 Task Schedule (Kategori & Sub-Menu Waktu)
- **Kategori Tugas:**
  - 💊 _Pengobatan (Medication)_
  - 🥗 _Nutrisi & Makanan (Meal/Diet)_
  - 🧼 _Higiene & Perawatan Diri (Hygiene)_
  - 🩺 _Pemeriksaan Tanda Vital (Vitals Check)_
  - 🏃 _Terapi & Aktivitas (Therapy/Exercise)_
- **Pengelompokan Slot Waktu:** Pagi (`06:00 - 11:59`), Siang (`12:00 - 16:59`), Sore/Malam (`17:00 - 21:59`), Dini Hari / Jam Spesifik.
- **Status Action:** *Pending*, *Completed*, atau *Skipped* (disertai alasan).

### 3.4 Notes & Medical Log
- Pencatatan harian ringkas (tensi darah, gula darah, perilaku, serah-terima shift).
- Dukungan unggah foto pendukung (misal: alat ukur tensi atau resep obat).

---

## 4. UI/UX Pro Max Guidelines: Humanis, Clean & Informatif

Antarmuka **Rumaket** mengusung pendekatan **Warm & Empathetic UI**:

### 4.1 Prinsip Desain
1. **Informatif (Clear Hierarchy):**
   - Menampilkan status utama (Siapa yang bertugas, tugas berikutnya yang harus dilakukan) pada posisi teratas.
   - Penggunaan warna aksen fungsional yang kontras namun lembut (*Emerald* untuk selesai, *Amber* untuk pending, *Rose* untuk mendesak).
2. **Clean (Anti-AI Slop):**
   - Bebas dari gradien neon menyolok, ilustrasi kartun generik, atau *shadow* melayang yang tebal.
   - Menggunakan tata letak vertikal *timeline* dan *card grid* bertekstur lembut (`stone-50`/`zinc-50`).
3. **Humanis (Empathetic Touch):**
   - Menggunakan warna dasar *Warm Neutral* (Warm Stone, Soft Sage Green) yang menciptakan nuansa tenang dan terpercaya.
   - Tipografi yang ramah (*Plus Jakarta Sans*) dengan ukuran teks yang mudah dibaca oleh perawat maupun keluarga lansia.
   - Tombol aksi berukuran besar (*thumb-friendly*, min height 48px) untuk kemudahan akses di perangkat seluler saat perawat sedang sibuk.

---

## 5. Information Architecture & Layout (Next.js)
├── public
│   ├── icons
│   │   ├── apple-touch-icon.png
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   └── icon.svg
│   ├── images
│   │   ├── hero-section.jpg
│   │   ├── login-banner.jpg
│   │   └── register-banner.jpg
│   ├── manifest.json
│   └── sw.js
├── src
│   ├── app
│   │   ├── (auth)
│   │   │   ├── join
│   │   │   │   └── page.tsx
│   │   │   ├── login
│   │   │   │   └── page.tsx
│   │   │   ├── register
│   │   │   │   └── page.tsx
│   │   │   ├── actions.ts
│   │   │   └── layout.tsx
│   │   ├── dashboard
│   │   │   ├── rooms
│   │   │   │   └── new
│   │   │   │       └── page.tsx
│   │   │   ├── actions.ts
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── rooms
│   │   │   └── [roomId]
│   │   │       ├── attendance
│   │   │       │   └── page.tsx
│   │   │       ├── caretakers
│   │   │       │   ├── actions.ts
│   │   │       │   └── page.tsx
│   │   │       ├── notes
│   │   │       │   ├── actions.ts
│   │   │       │   └── page.tsx
│   │   │       ├── schedule
│   │   │       │   ├── new
│   │   │       │   │   └── page.tsx
│   │   │       │   ├── actions.ts
│   │   │       │   └── page.tsx
│   │   │       ├── actions.ts
│   │   │       ├── layout.tsx
│   │   │       └── page.tsx
│   │   ├── apple-icon.png
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── icon.png
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── auth
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── dashboard
│   │   │   └── Header.tsx
│   │   ├── landing
│   │   │   └── MockSchedule.tsx
│   │   ├── rooms
│   │   │   ├── CheckInCard.tsx
│   │   │   ├── NoteCard.tsx
│   │   │   ├── NoteForm.tsx
│   │   │   ├── RoomCard.tsx
│   │   │   ├── RoomTabs.tsx
│   │   │   └── ScheduleItem.tsx
│   │   ├── section
│   │   │   └── home
│   │   │       ├── CTA.tsx
│   │   │       ├── Features.tsx
│   │   │       ├── Footer.tsx
│   │   │       ├── Header.tsx
│   │   │       ├── Hero.tsx
│   │   │       ├── HowItWorks.tsx
│   │   │       └── Roles.tsx
│   │   └── ui
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── EmptyState.tsx
│   │       └── Field.tsx
│   ├── data
│   │   └── home.ts
│   ├── lib
│   │   ├── supabase
│   │   │   ├── client.ts
│   │   │   ├── middleware.ts
│   │   │   └── server.ts
│   │   ├── constants.ts
│   │   ├── invite-code.ts
│   │   ├── rooms.ts
│   │   └── types.ts
│   └── proxy.ts
├── supabase
│   ├── .temp
│   │   ├── cli-latest
│   │   ├── gotrue-version
│   │   ├── linked-project.json
│   │   ├── pooler-url
│   │   ├── postgres-version
│   │   ├── project-ref
│   │   ├── rest-version
│   │   ├── storage-migration
│   │   └── storage-version
│   ├── functions
│   │   └── send-reminders
│   │       └── index.ts
│   ├── migrations
│   │   └── 0001_init.sql
│   ├── .gitignore
│   └── config.toml
├── .gitignore
├── AGENTS.md
├── DESIGN.md
├── PRD.md
├── README.md
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
└── tsconfig.json

---

## 6. Development Roadmap

1. **Sprint 1: Base Setup & Next.js Architecture**
   - Setup Next.js + Tailwind CSS + UI Design System Rules.
   - Setup API integration untuk model `rooms`, `caretakers`, `schedules`, `attendances`, dan `notes`.
2. **Sprint 2: Attendance & Interactive Schedule UI**
   - Implementasi komponen *One-Tap Check-In/Out*.
   - Halaman jadwal dengan *filter category* dan *slot waktu*.
3. **Sprint 3: Notes & Notification Workflow**
   - Implementasi modul *Notes* & unggah foto.
   - Setup Firebase Scheduler & Web Push Notification.
4. **Sprint 4: Refactoring & UI Polishing**
   - Penerapan audit desain *Clean, Informatif & Humanis*.
   - Pengujian responsivitas seluler untuk perawat.