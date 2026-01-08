# 🎥 Video Calling Interview Platform (Next.js)

A modern remote interview platform built with **Next.js 14**, supporting **real-time video interviews**, **role-based access**, and **interview scheduling**.

Designed for interviewers and candidates to seamlessly schedule and conduct live technical interviews.

---

## ✨ Features

- 🔐 Authentication with Clerk
- 🎭 Role-based access (Interviewer / Candidate)
- 📅 Interview scheduling with date & time picker
- 🎥 Real-time video calls using Stream
- 🧑‍💻 Live interview interface
- 🗂 Interview management dashboard
- ☁️ Serverless backend with Convex
- 🎨 Modern UI with Tailwind + Radix UI

---

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Auth:** Clerk
- **Video:** Stream Video SDK
- **Backend & DB:** Convex
- **UI:** Tailwind CSS, Radix UI
- **State & Utils:** React, date-fns
- **Deployment:** Vercel

---

## 📦 Main Dependencies

- next
- react
- @clerk/nextjs
- @stream-io/video-react-sdk
- convex
- tailwindcss
- radix-ui
- react-day-picker

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root of the project and add:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_JWT_ISSUER_DOMAIN=

# Convex
NEXT_PUBLIC_CONVEX_URL=
CONVEX_DEPLOYMENT=

# Stream Video
NEXT_PUBLIC_STREAM_API_KEY=
STREAM_SECRET_KEY=
```

⚠️ Never commit `.env.local` to GitHub.

---

## 🔑 Service Setup (For Developers Only)

This project relies on third-party services.  
If you want to run **your own copy** of this project locally or deploy it yourself,
you must create accounts and obtain API keys from the following services.

### 1. Clerk (Authentication)
- Website: https://clerk.com
- Used for: User authentication and identity management
- Required keys:
  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  - CLERK_SECRET_KEY
  - CLERK_JWT_ISSUER_DOMAIN

### 2. Convex (Backend & Database)
- Website: https://convex.dev
- Used for: Serverless backend, database, and real-time data
- Required keys:
  - NEXT_PUBLIC_CONVEX_URL
  - CONVEX_DEPLOYMENT

To initialize Convex locally:
```bash
npx convex dev
```

### 3. Stream Video (Video Calling)
- Website: https://getstream.io/video
- Used for: Real-time video interviews
- Required keys:
  - NEXT_PUBLIC_STREAM_API_KEY
  - STREAM_SECRET_KEY

⚠️ End users of the deployed application **do NOT** need to configure any of these services.
All keys are managed by the application owner.

---

## 🚀 Getting Started

### 1️⃣ Install dependencies
```bash
npm install
```

### 2️⃣ Start Convex
```bash
npx convex dev
```

### 3️⃣ Run the app
```bash
npm run dev
```

Open 👉 http://localhost:3000

---

## 📁 Project Structure (simplified)

```txt
src/
├─ app/            # App Router pages
├─ components/     # Reusable UI components
├─ constants/      # App-wide constants
├─ lib/            # Utilities & helpers
├─ hooks/          # Custom React hooks
├─ convex/         # Backend functions
```

---

## 🧠 Notes

- Microphone and camera permissions must be allowed in the browser
- Chrome enforces Permissions-Policy strictly in production
- Video calls are created dynamically using Stream

---

## 📄 License

This project is for learning and portfolio purposes.
