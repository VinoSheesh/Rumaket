# UI/UX PRO MAX DESIGN SYSTEM: INFORMATIVE, CLEAN & HUMAN-CENTERED CARETAKER UI

## 1. CORE DESIGN PHILOSOPHY
- **Informatif:** Menampilkan status penting (vital lansia, jadwal obat, status shift) secara jelas tanpa memicu cognitive overload.
- **Clean:** Bebas dari dekorasi berlebih (No AI-slop, no heavy neon gradients, no excessive rounded corners).
- **Humanis (Empathetic & Warm):** Menggunakan kombinasi warna Deep Navy Trust, Ice Blue, dan aksen hangat (warm amber) yang memberikan kesan profesional, tenang, terpercaya, dan ramah bagi lansia & perawat.

---

## 2. COLOR PALETTE & TAILWIND DESIGN TOKENS (HOMEGUARD TRUST PALETTE REVISED)

### 2.1 Color Extraction & Mapping
- **Primary Brand (Deep Navy):** `#0A2540` / `#0C1E5B` (Digunakan untuk tombol utama, header shift, dan navigasi utama).
- **Accent / Highlight (Ice Blue):** `#89CFF0` / `#38BDF8` (Digunakan untuk status aktif, ring fokus, dan highlight ringkas).
- **Humanist Warmth (Sunlight Glow):** `#F59E0B` / `#FEF3C7` (Memberikan sentuhan hangat pada badge pending dan elemen notifikasi).
- **Backgrounds & Surfaces:** `#F8FAFC` / `#F1F5F9` (Menggunakan Soft Slate/Zinc netral untuk menghindari kontras putih polos murni agar nyaman di mata saat shift malam).
- **Typography:** `#0F172A` / `#1E293B` (Teks gelap dengan kontras tinggi dan keterbacaan optimal).

### 2.2 Tailwind Config Extension (`tailwind.config.js`)
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand System (Deep Navy Trust)
        brand: {
          50: '#f0f5ff',
          100: '#e5edff',
          200: '#cddbfe',
          300: '#b4c9fd',
          400: '#83a1f9',
          500: '#4e74f3',
          600: '#2b4ee6',
          700: '#1b3ac9',
          800: '#0c1e5b', // Hero Navy
          900: '#0a2540', // Deep Navy Surface
          950: '#051124',
        },
        // Highlight & Accent (Soft Ice Blue / Sky)
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        // Warm Humanist Accent (Warm Sunlight / Caregiver Warmth)
        warmth: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          500: '#f59e0b',
          600: '#d97706',
        },
        // Functional Status Colors
        status: {
          completed: {
            bg: '#dcfce7',   // emerald-100
            text: '#166534', // emerald-800
          },
          pending: {
            bg: '#fef3c7',   // amber-100
            text: '#92400e', // amber-800
          },
          overdue: {
            bg: '#ffe4e6',   // rose-100
            text: '#9f1239', // rose-800
          },
          neutral: {
            bg: '#f1f5f9',   // slate-100
            text: '#334155', // slate-700
          },
        },
      },
    },
  },
  plugins: [],
};