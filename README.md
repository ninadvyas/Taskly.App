<div align="center">
  <img src="public/taskly.png" alt="Taskly Logo" width="80" />
  <h1>Taskly</h1>
  <p>A full-stack task management app with Google Calendar sync, analytics, and <kbd>⌘K</kbd> search.</p>

  <a href="https://task.nvdy.xyz">
    <img src="https://img.shields.io/badge/Live%20Demo-task.nvdy.xyz-black?style=for-the-badge&logo=vercel" alt="Live Demo" />
  </a>
</div>

---

## Screenshots

| Tasks                                 | Progress                                     |
| ------------------------------------- | -------------------------------------------- |
| ![Tasks page](public/images/home.png) | ![Progress page](public/images/progress.png) |

---

## Features

- **Task Management** — Create, edit, and delete tasks with title, description, priority, status, and due date
- **Priority levels** — Low / Medium / High with color-coded labels
- **Due date picker** — Calendar popover for selecting due dates; overdue dates are highlighted in red
- **Google Sign-In** — Secure OAuth authentication via NextAuth.js; all tasks are scoped per user
- **Google Calendar Sync** — Toggle to create/update/delete Google Calendar events alongside tasks
- **Progress page** — Line chart (tasks created last 7 days), status bar chart, stat cards, and recent tasks table
- **⌘K Search** — Global command palette (Cmd+K / Ctrl+K) to search tasks and navigate pages
- **Responsive layout** — Resizable split-panel UI built with shadcn/ui

---

## Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?logo=postgresql)
![NextAuth](https://img.shields.io/badge/NextAuth-Auth-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)

---

## Getting Started

### 1. Clone & install

```bash
git clone <your-repo-url>
cd taskly
npm install
```

### 2. Set up environment variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskly"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"           # openssl rand -base64 32
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

> Get Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/). Add `http://localhost:3000/api/auth/callback/google` as an authorised redirect URI.

### 3. Set up the database

```bash
npx prisma migrate dev
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## License

[MIT](LICENSE)
