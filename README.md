# 🚀 Task Management App

Aplikasi Task Management fullstack menggunakan Next.js App Router, Prisma, PostgreSQL, dan Shadcn UI.

## 🛠 Tech Stack

- **Framework:** Next.js 16
- **Database:** PostgreSQL
- **ORM:** Prisma
- **UI:** Shadcn/UI + Tailwind CSS
- **State Management:** Zustand (Client) + Tanstack Query (Server)
- **Auth:** Custom Middleware & Secure Cookie

## 📦 State Management: Mengapa Zustand?

Saya memilih **Zustand** untuk manajemen state form di detail/create task karena:

1.  **Simplicity:** Boilerplate sangat minim dibanding Redux.
2.  **Performance:** Component hanya re-render jika state spesifik berubah.
3.  **Hooks-based:** Sangat natural digabungkan dengan React Functional Components.
4.  Tanstack Query sudah menangani Server State (Caching, Fetching), jadi saya hanya butuh client-state manager yang ringan untuk handle form input sebelum disubmit.

## 🚀 Cara Menjalankan

1.  **Clone Repository**

    ```bash
    git clone FATHURRAHMANARRIZKY/task-dashboard
    cd FATHURRAHMANARRIZKY/task-dashboard
    ```

2.  **Install Dependencies**

    ```bash
    npm install
    ```

3.  **Setup Environment**
    Copy `.env.example` ke `.env` dan isi `DATABASE_URL` & `JWT_SECRET`.

4.  **Database Setup**

    ```bash
    npx prisma generate
    npx prisma db push
    npx prisma db seed # Untuk generate 25 dummy data
    ```

5.  **Jalankan Server**
    ```bash
    npm run dev
    ```
    Buka [http://localhost:3000](http://localhost:3000).

## 🐳 Menjalankan dengan Docker

```bash
docker-compose up --build
```
