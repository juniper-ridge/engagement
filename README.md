# Juniper Ridge Landscape

> **© 2026 Juniper Ridge Landscape. All rights reserved.**
> This repository is publicly visible for portfolio and collaboration purposes only.
> Copying, forking, or reusing any part of this code without explicit written
> permission is prohibited. See [LICENSE](LICENSE) for details.

A full-featured landscape design business website built with **Next.js 16 App Router**, TypeScript, Tailwind CSS v4, Prisma (SQLite), and NextAuth v5.

## Features

- **Public pages:** Home, About, Blog, Contact
- **Blog:** visitors can like posts, share, and leave comments (comment approval required)
- **Admin panel** (`/admin`): create/edit/delete posts, approve or reject comments
- **Contact form** — sends email to your business inbox via SMTP
- **Microsoft Bookings** scheduling widget on the Contact page
- i18n-ready (English only; infrastructure for additional locales is in place)

---

## Prerequisites

- Node.js 20+
- npm 9+

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example below into a **`.env`** file at the project root and fill in your values:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="change-me-to-a-long-random-string"
NEXTAUTH_URL="http://localhost:3000"

# Admin credentials (used by the seed script)
ADMIN_EMAIL="admin@juniperridgelandscape.com"
ADMIN_PASSWORD="ChangeMe123!"

# Contact form — address that receives enquiries
CLIENT_EMAIL="info@juniperridgelandscape.com"

# SMTP (e.g. Gmail App Password, SendGrid, Mailgun …)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="you@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="Juniper Ridge Landscape <you@gmail.com>"

# Microsoft Bookings embed URL (optional — leave blank to show a placeholder)
NEXT_PUBLIC_BOOKINGS_URL=""
```

### 3. Run database migrations

```bash
npx prisma migrate dev --name init
```

### 4. Seed the admin user

```bash
npx prisma db seed
```

This creates the admin account using the `ADMIN_EMAIL` / `ADMIN_PASSWORD` values from `.env`.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Admin Panel

| URL                      | Description                         |
| ------------------------ | ----------------------------------- |
| `/admin/login`           | Admin sign-in page                  |
| `/admin`                 | Dashboard (post/comment/like stats) |
| `/admin/posts`           | List all posts                      |
| `/admin/posts/new`       | Create a new blog post              |
| `/admin/posts/[id]/edit` | Edit or delete a post               |
| `/admin/comments`        | Approve or delete visitor comments  |

---

## Microsoft Bookings

Set `NEXT_PUBLIC_BOOKINGS_URL` in `.env` to your Microsoft Bookings **embed URL** (found in the Bookings admin under **Booking page → Embed**). The Contact page will automatically render the scheduling widget.

---

## Building for Production

```bash
npm run build
npm start
```

---

## Tech Stack

| Layer      | Technology                                |
| ---------- | ----------------------------------------- |
| Framework  | Next.js 16 (App Router)                   |
| Language   | TypeScript                                |
| Styling    | Tailwind CSS v4 + @tailwindcss/typography |
| Database   | SQLite via Prisma ORM                     |
| Auth       | NextAuth v5 (Credentials)                 |
| Email      | nodemailer (SMTP)                         |
| Validation | Zod                                       |
| i18n       | next-intl (English-only for now)          |

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
