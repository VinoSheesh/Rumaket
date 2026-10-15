# Rumaket - Elderly Care Management System

> **Rumaket** as in **Care Together**, **Raket** as in **Stay Connected.** A simple platform for families to collaborate in caring for their loved ones — from anywhere.

[![Next.js](https://img.shields.io/badge/Next.js-16.4.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ecf8e?style=flat-square&logo=supabase)](https://supabase.com/)

---

## 📖 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Design Philosophy](#design-philosophy)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [User Roles & Access Control](#user-roles--access-control)
- [Core Features Deep Dive](#core-features-deep-dive)
- [Design System](#design-system)
- [Database Schema](#database-schema)
- [API & Actions](#api--actions)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Rumaket** is an elderly care management application based on **Patient Rooms** that enables families and caretakers to collaborate in caring for elderly parents or relatives. The system is designed to simplify coordination between family members who may not live in the same household, focusing on:

- **Informative**: Displaying important status (vital signs, medication schedules, shift status) clearly without cognitive overload
- **Clean**: Free from excessive decoration (No AI-slop, no heavy neon gradients)
- **Humanistic**: Using color combinations that convey professionalism, calmness, trustworthiness, and friendliness

### Problems Solved

1. **Family Coordination**: Family members in different locations struggle to coordinate care schedules
2. **Care Documentation**: Health records and changes in elderly conditions are often scattered
3. **Caretaker Shifts**: Shift handovers often miss critical information
4. **Transparency**: Families want to know who is on duty and what has been done

---

## ✨ Key Features

### 1. **Isolated Patient Rooms**
One dedicated dashboard per elderly patient — schedules, and notes are not mixed between different families. Each room has:
- Room name and patient name
- Unique invitation code (6 characters)
- List of assigned caretakers
- Complete activity history

### 2. **Categorized Schedules**
Medication, nutrition, hygiene, vital signs, and therapy — grouped by time slots, not confusing long lists.

**Schedule Categories:**
- 💊 **Medication** (medication)
- 🥗 **Nutrition & Meals** (meal)
- 🧼 **Hygiene & Personal Care** (hygiene)
- 🩺 **Vital Signs Checkup** (vitals)
- 🏃 **Therapy & Activities** (therapy)

**Time Slots:**
- Morning (06:00 - 11:59)
- Afternoon (12:00 - 16:59)
- Evening/Night (17:00 - 21:59)
- Specific Time (HH:mm)

### 3. **One-Tap Check-In/Out**
Caretakers can check in/out directly without GPS/photo verification. Real-time status shows who is currently on duty.

### 4. **Shift Handover Notes**
Health conditions, behavioral changes, and measurement results are neatly recorded between shifts, with supporting photos.

**Note Categories:**
- **Health Condition** (health_condition)
- **Behavior Change** (behavior_change)
- **Blood Pressure/Sugar Results** (vitals_result)
- **Shift Handover Message** (shift_handover)

### 5. **Caretaker Management**
Owners can invite and manage caretakers with a simple invite code system.

---

## 🎨 Design Philosophy

### Core Principles

Rumaket follows **Informative, Clean & Human-Centered Caretaker UI** design principles:

#### 1. Informative
- Display important status clearly without causing cognitive overload
- Concise information hierarchy that's easy to read quickly
- High contrast for optimal readability (min 4.5:1)

#### 2. Clean
- Free from excessive decoration (No AI-slop patterns)
- No heavy neon gradients
- No excessive rounded corners
- Consistent border radius (2px/6px/8px)
- Spacing system based on 8dp rhythm

#### 3. Humanistic (Empathetic & Warm)
- **Deep Navy Trust** (#0C1E5B) for professional and trustworthy impression
- **Ice Blue Accent** (#38BDF8) for active status and highlights
- **Sunlight Glow** (#F59E0B) for warm touch on notifications
- **Soft Slate** (#F8FAFC) for comfortable background during night shifts

### Design Tokens

```css
/* Primary Brand (Deep Navy Trust) */
--color-brand-700: #1b3ac9;
--color-brand-800: #0c1e5b;
--color-brand-900: #0a2540;

/* Accent (Ice Blue) */
--color-accent-400: #38bdf8;
--color-accent-500: #0ea5e9;

/* Warmth (Sunlight Glow) */
--color-warmth-100: #fef3c7;
--color-warmth-500: #f59e0b;
--color-warmth-600: #d97706;

/* Background & Surfaces */
--background: #f8fafc; /* Soft Slate */
--foreground: #0f172a; /* Slate-900 */

/* Spacing System (8dp rhythm) */
--space-2: 8px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;

/* Touch Targets (Mobile-First) */
Button sm: 40px (desktop/secondary)
Button md: 44px (mobile default) ✅
Button lg: 48px (primary CTA) ✅
```

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 16.4.0](https://nextjs.org/) (App Router)
- **React**: 19.3.0 (React 19 with Server Components)
- **TypeScript**: 5.x (Type-safe development)
- **Styling**: [Tailwind CSS 4.x](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: Inter (body), Plus Jakarta Sans (display)

### Backend & Database
- **BaaS**: [Supabase](https://supabase.com/)
  - Authentication (Email/Password)
  - PostgreSQL Database
  - Real-time Subscriptions
  - Storage (for note photos)
  - Row Level Security (RLS)

### Development Tools
- **Linter**: ESLint
- **Type Checking**: TypeScript
- **Package Manager**: npm/yarn/pnpm

### Deployment
- **Hosting**: Vercel (recommended)
- **Database**: Supabase Cloud
- **CDN**: Vercel Edge Network

---

## 📁 Project Structure

```
rumaket-hackathon/
├── public/                 # Static assets
│   ├── images/             # Images (hero, etc.)
│   ├── manifest.json       # PWA manifest
│   └── sw.js               # Service Worker
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/         # Auth pages (login, register, join)
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── join/page.tsx
│   │   │   └── actions.ts  # Server Actions for auth
│   │   ├── dashboard/      # Dashboard pages
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── rooms/new/page.tsx
│   │   │   └── actions.ts
│   │   ├── rooms/[roomId]/ # Room detail pages
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx    # Overview
│   │   │   ├── schedule/   # Schedule management
│   │   │   ├── notes/      # Notes management
│   │   │   ├── attendance/ # Attendance logs
│   │   │   ├── caretakers/ # Caretaker management
│   │   │   └── actions.ts
│   │   ├── globals.css     # Global styles & design tokens
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Landing page
│   ├── components/
│   │   ├── landing/        # Landing page components
│   │   │   └── MockSchedule.tsx
│   │   ├── rooms/          # Room-specific components
│   │   │   ├── RoomCard.tsx
│   │   │   ├── RoomTabs.tsx
│   │   │   ├── ScheduleItem.tsx
│   │   │   ├── NoteCard.tsx
│   │   │   ├── NoteForm.tsx
│   │   │   └── CheckInCard.tsx
│   │   ├── section/home/   # Landing sections
│   │   │   ├── Header.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── Roles.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── CTA.tsx
│   │   │   └── Footer.tsx
│   │   └── ui/             # Reusable UI primitives
│   │       ├── Button.tsx
│   │       ├── Badge.tsx
│   │       ├── Card.tsx
│   │       ├── Field.tsx   # Input, Textarea, Select
│   │       └── EmptyState.tsx
│   ├── data/
│   │   └── home.ts         # Landing page data (features, steps, roles)
│   ├── lib/
│   │   ├── constants.ts    # App constants & categories
│   │   ├── types.ts        # TypeScript types
│   │   ├── invite-code.ts  # Invite code generator
│   │   ├── rooms.ts        # Room context helper
│   │   └── supabase/       # Supabase clients
│   │       ├── client.ts   # Browser client
│   │       ├── server.ts   # Server client
│   │       └── middleware.ts
│   └── proxy.ts            # Proxy configuration (if any)
├── supabase/               # Supabase migrations & config
├── .env.example            # Environment variables template
├── .env                    # Environment variables (gitignored)
├── package.json
├── tsconfig.json
├── next.config.ts
├── DESIGN.md               # Design system specification
├── PRD.md                  # Product Requirements Document
├── AUDIT-REPORT.md         # UI/UX audit report
├── REFACTORING-SUMMARY.md  # Refactoring documentation
└── README.md               # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** / **yarn** / **pnpm**
- **Supabase Account** (free tier)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/rumaket-hackathon.git
cd rumaket-hackathon
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up Supabase Database**

Run the SQL migrations in your Supabase dashboard or via CLI. The schema includes:
- `profiles` - User profiles
- `patient_rooms` - Room/patient data
- `room_members` - Room membership & roles
- `schedules` - Daily schedules
- `notes` - Care notes with photos

5. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 👥 User Roles & Access Control

### 1. Room Owner / Family Member

**Responsibilities:**
- ✅ Create and manage patient rooms
- ✅ Invite one or more caretakers
- ✅ Set up daily schedules for the elderly
- ✅ Monitor activity logs & daily notes
- ✅ Delete or edit schedules
- ✅ Manage caretaker list (remove members)

**Access:**
- Dashboard: List of all owned rooms
- Room Detail: Full access (overview, schedule, notes, activity, caretakers)
- Invite Code: Can view and share invitation code

### 2. CareTaker / Nurse

**Responsibilities:**
- ✅ Access patient rooms where assigned
- ✅ One-tap check-in / check-out
- ✅ Mark tasks as complete or skipped
- ✅ Write daily care notes
- ✅ View today's schedule

**Access:**
- Dashboard: List of assigned rooms (not owner)
- Room Detail: Read-only caretakers tab, full access to others
- Schedule: Can mark as complete/skip
- Notes: Can create new notes

**Restrictions:**
- ❌ Cannot delete rooms
- ❌ Cannot edit schedules (only mark status)
- ❌ Cannot remove other caretakers
- ❌ Cannot view invite code

---

## 🔥 Core Features Deep Dive

### 1. Authentication Flow

```
┌─────────────┐
│   Landing   │
│    Page     │
└──────┬──────┘
       │
       ├─► Register
       │   └─► Create Profile → Dashboard
       │
       ├─► Login
       │   └─► Auth Check → Dashboard
       │
       └─► Join Room (Invite Code)
           └─► Login Required → Auto Join → Dashboard
```

**Related files:**
- `src/app/(auth)/register/page.tsx`
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/join/page.tsx`
- `src/app/(auth)/actions.ts`

### 2. Room Management

#### Creating a Room

1. User login → Dashboard
2. Click "Create Room" button
3. Fill form:
   - Room Name (e.g., "Jasmine Room")
   - Patient Name (e.g., "Mr. Smith")
4. System generates invite code (6 chars)
5. User becomes room owner

**Related files:**
- `src/app/dashboard/rooms/new/page.tsx`
- `src/app/dashboard/actions.ts` → `createRoom()`

#### Joining a Room

1. Caretaker receives invite code from owner
2. Navigate to `/join` or click "Have an Invite Code?"
3. Enter 6-character code (e.g., "7K3PQR")
4. If not logged in, redirect to register/login
5. After auth, auto-join room as caretaker

**Related files:**
- `src/app/(auth)/join/page.tsx`
- `src/app/(auth)/actions.ts` → `joinRoomByCode()`

### 3. Schedule Management

#### Creating a Schedule

1. Navigate to `/rooms/[roomId]/schedule`
2. Click "Create Schedule" button
3. Fill form:
   - **Category**: medication/meal/hygiene/vitals/therapy
   - **Time Slot**: morning/afternoon/evening/custom
   - **Specific Time**: (if custom selected)
   - **Title**: (e.g., "Blood Pressure Medication")
   - **Description**: (optional)
   - **Date**: Scheduled date
4. Submit → Schedule created with status `pending`

**Related files:**
- `src/app/rooms/[roomId]/schedule/new/page.tsx`
- `src/app/rooms/[roomId]/schedule/actions.ts` → `createSchedule()`

#### Managing Schedule Status

```
pending → [Complete] → completed
       → [Skip + Reason] → skipped
       → [Reset] → pending (owner only)
```

**Related files:**
- `src/components/rooms/ScheduleItem.tsx`
- `src/app/rooms/[roomId]/schedule/actions.ts`
  - `completeSchedule()`
  - `skipSchedule()`
  - `resetSchedule()`

### 4. Check-In/Out System

#### Check-In Flow

1. Caretaker arrives → Open room overview
2. Click "Check-In" button
3. Badge shows "On-duty" with green indicator

#### Check-Out Flow (?)

1. Caretaker finishes shift
2. Click "Check-Out" button
3. Badge shows shift duration

**Real-time Updates:**
- Uses Supabase Realtime subscription
- All users in same room see live status

**Related files:**
- `src/components/rooms/CheckInCard.tsx`
- `src/app/rooms/[roomId]/actions.ts`
  - `checkIn()`
  - `checkOut()`

### 5. Notes & Documentation

#### Creating a Note

1. Navigate to `/rooms/[roomId]/notes`
2. Select category (dropdown)
3. Write content (textarea)
4. (Optional) Upload photo (image file)
5. Submit → Note created with timestamp

#### Note Categories

- **health_condition**: Changes in health condition
- **behavior_change**: Changes in behavior or mood
- **vitals_result**: Blood pressure, sugar levels, etc.
- **shift_handover**: Shift handover notes

**Related files:**
- `src/components/rooms/NoteForm.tsx`
- `src/components/rooms/NoteCard.tsx`
- `src/app/rooms/[roomId]/notes/page.tsx`
- `src/app/rooms/[roomId]/notes/actions.ts` → `createNote()`

---

## 🎨 Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `brand-700` | `#1b3ac9` | Primary buttons, active nav |
| `brand-800` | `#0c1e5b` | Hero sections, header |
| `brand-900` | `#0a2540` | Deep backgrounds |
| `accent-400` | `#38bdf8` | Highlights, focus rings |
| `accent-500` | `#0ea5e9` | Links, hover states |
| `warmth-100` | `#fef3c7` | Pending badge background |
| `warmth-500` | `#f59e0b` | Warmth accent (notifications) |
| `warmth-600` | `#d97706` | Warmth text |
| `emerald-100` | `#dcfce7` | Success badge background |
| `rose-100` | `#ffe4e6` | Error/skipped badge background |
| `slate-50` | `#f8fafc` | Page background (soft slate) |
| `slate-100` | `#f1f5f9` | Card/surface background |

### Typography

- **Display Font**: Plus Jakarta Sans (headings, titles)
  - Weights: 500, 600, 700, 800
- **Body Font**: Inter (body text, UI)
  - Variable font for optimal loading

### Component Variants

#### Button

```tsx
<Button variant="primary" size="md">Save</Button>
<Button variant="secondary" size="lg">Cancel</Button>
<Button variant="ghost" size="sm">Edit</Button>
<Button variant="danger" size="md">Delete</Button>
```

| Size | Height | Usage |
|------|--------|-------|
| `sm` | 40px | Desktop/secondary actions |
| `md` | 44px | Mobile default (min touch target) |
| `lg` | 48px | Primary CTA buttons |

#### Badge

```tsx
<Badge variant="default">Owner</Badge>
<Badge variant="warmth">Pending</Badge>
<Badge variant="success">Completed</Badge>
<Badge variant="danger">Overdue</Badge>
```

#### Card

```tsx
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
</Card>
```

---

## 🗃 Database Schema

### Tables

#### `profiles`
```sql
id: uuid (PK, references auth.users)
full_name: text
phone: text
created_at: timestamp
```

#### `patient_rooms`
```sql
id: uuid (PK)
name: text (e.g., "Jasmine Room")
patient_name: text (e.g., "Mr. Smith")
invite_code: text (UNIQUE, 6 chars)
created_by: uuid (FK → profiles.id)
created_at: timestamp
```

#### `room_members`
```sql
id: uuid (PK)
room_id: uuid (FK → patient_rooms.id)
user_id: uuid (FK → profiles.id)
role: text ('owner' | 'caretaker')
created_at: timestamp

UNIQUE(room_id, user_id)
```

#### `schedules`
```sql
id: uuid (PK)
room_id: uuid (FK → patient_rooms.id)
category: text (medication/meal/hygiene/vitals/therapy)
time_slot: text (morning/afternoon/evening/custom)
specific_time: text (HH:mm, nullable)
title: text
description: text (nullable)
scheduled_date: date
status: text ('pending' | 'completed' | 'skipped')
skip_reason: text (nullable)
created_by: uuid (FK → profiles.id)
created_at: timestamp
```

#### `notes`
```sql
id: uuid (PK)
room_id: uuid (FK → patient_rooms.id)
caretaker_id: uuid (FK → profiles.id)
category: text (health_condition/behavior_change/vitals_result/shift_handover)
content: text
photo_url: text (nullable, Supabase Storage)
created_at: timestamp
```

### Row Level Security (RLS)

```sql
-- Only room members can view room data
CREATE POLICY "Room members can view" ON patient_rooms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM room_members
      WHERE room_id = patient_rooms.id
      AND user_id = auth.uid()
    )
  );

-- Only owners can delete rooms
CREATE POLICY "Owners can delete" ON patient_rooms
  FOR DELETE USING (created_by = auth.uid());

-- Members can view schedules
CREATE POLICY "Members can view schedules" ON schedules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM room_members
      WHERE room_id = schedules.room_id
      AND user_id = auth.uid()
    )
  );
```

---

## ⚙️ API & Actions

### Server Actions (Next.js 16)

#### Authentication (`src/app/(auth)/actions.ts`)

```typescript
signUp(formData: FormData) // Register new user
signIn(formData: FormData) // Login existing user
signOut() // Logout
joinRoomByCode(formData: FormData) // Join room by invite code
```

#### Dashboard (`src/app/dashboard/actions.ts`)

```typescript
createRoom(formData: FormData) // Create new patient room
```

#### Room (`src/app/rooms/[roomId]/actions.ts`)

```typescript
checkIn(roomId: string) // Check-in caretaker
```

#### Schedule (`src/app/rooms/[roomId]/schedule/actions.ts`)

```typescript
createSchedule(roomId: string, formData: FormData) // Create schedule
completeSchedule(scheduleId: string, roomId: string) // Mark complete
skipSchedule(scheduleId: string, roomId: string, reason: string) // Mark skipped
resetSchedule(scheduleId: string, roomId: string) // Reset to pending
```

#### Notes (`src/app/rooms/[roomId]/notes/actions.ts`)

```typescript
createNote(roomId: string, formData: FormData) // Create note with photo
```

#### Caretakers (`src/app/rooms/[roomId]/caretakers/actions.ts`)

```typescript
removeCaretaker(memberId: string, roomId: string) // Remove caretaker from room
```

---

## 💻 Development

### File Naming Conventions

- **Components**: PascalCase (e.g., `RoomCard.tsx`)
- **Actions/Utils**: camelCase (e.g., `actions.ts`, `invite-code.ts`)
- **Types**: PascalCase (e.g., `RoomRole`, `ScheduleCategory`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `SCHEDULE_CATEGORIES`)

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended config
- **Formatting**: Prettier (if configured)

### Best Practices

1. **Server Components by Default**
   - Use `"use client"` only when needed (hooks, event handlers)
   
2. **Server Actions for Mutations**
   - All mutations use Server Actions (no API routes)
   - Automatic revalidation with `router.refresh()`

3. **Supabase RLS**
   - All database access protected by Row Level Security
   - Use `createClient()` server-side for authenticated queries

4. **Touch Target Compliance**
   - All buttons minimum 44px height (iOS/Android standards)
   - Input fields minimum 44px height

5. **Type Safety**
   - Use TypeScript types from `src/lib/types.ts`
   - Avoid `any` type

### Testing Checklist

Before deployment, verify:

- [ ] Authentication flow (register, login, logout)
- [ ] Room creation & invite code generation
- [ ] Join room by code
- [ ] Check-in/out system
- [ ] Schedule CRUD operations
- [ ] Notes creation with photo upload
- [ ] Mobile responsiveness (375px - 1920px)
- [ ] Touch target sizes (min 44px)
- [ ] Dark mode (if implemented)

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/rumaket.git
git push -u origin main
```

2. **Deploy to Vercel**

- Go to [vercel.com/new](https://vercel.com/new)
- Import your GitHub repository
- Set environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Deploy

3. **Update Supabase Settings**

- Add your Vercel domain to Supabase Auth → URL Configuration
- Add to Allowed Redirect URLs

### Manual Deployment

```bash
npm run build
npm run start
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Analytics, Monitoring
# NEXT_PUBLIC_GOOGLE_ANALYTICS=...
```

---

## 📚 Documentation

### Additional Resources

- [DESIGN.md](./DESIGN.md) - Complete design system specification
- [PRD.md](./PRD.md) - Product Requirements Document
- [AUDIT-REPORT.md](./AUDIT-REPORT.md) - UI/UX audit findings
- [REFACTORING-SUMMARY.md](./REFACTORING-SUMMARY.md) - Design system refactoring

### Related Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow existing code style
- Write meaningful commit messages
- Update documentation if needed
- Test your changes thoroughly
- Ensure all touch targets meet 44px minimum

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Design System**: Based on UI/UX Pro Max principles
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Fonts**: [Google Fonts](https://fonts.google.com/)
- **Inspiration**: Real-world elderly care coordination challenges

---

## 📞 Support

For questions or issues:

- Open an issue on GitHub
- Contact: [your-email@example.com]
- Documentation: [https://docs.rumaket.com] (if available)

---

## 🗓 Changelog

### v0.1.0 (2026-10-14)

- ✅ Initial release
- ✅ Authentication system (register, login, logout)
- ✅ Room management (create, join by code)
- ✅ Schedule management (CRUD, categories, time slots)
- ✅ Check-in/out system (real-time updates)
- ✅ Notes system (with photo upload)
- ✅ Caretaker management
- ✅ Design system implementation (Deep Navy Trust theme)
- ✅ Mobile-first responsive design
- ✅ Touch target compliance (44px minimum)
- ✅ Landing page with hero, features, roles, how-it-works, CTA

---

**Built with ❤️ for families caring for their loved ones.**

**Care Together, Stay Connected.** 