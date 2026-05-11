# Scalable REST API with Auth & RBAC

This project is a full-stack application featuring a secure REST API and a modern frontend UI. It was built as part of the Backend Developer Intern assignment for Primetrade.ai.

## 🚀 Features

### Backend (Primary Focus)
- **User Authentication**: JWT-based auth with password hashing (bcrypt).
- **Role-Based Access Control (RBAC)**: Supports `USER` and `ADMIN` roles.
- **Task Management CRUD**: Full CRUD operations for a secondary entity (Tasks).
- **Input Validation**: Robust validation using Zod.
- **API Documentation**: Interactive Swagger documentation at `/api-docs`.
- **Database**: PostgreSQL managed via Prisma ORM.
- **Scalability**: Clean modular structure separating controllers, routes, and middleware.

### Frontend
- **Modern UI**: Built with React (Vite) featuring glassmorphism and smooth animations (Framer Motion).
- **Secure Handling**: JWT token persistence in localStorage with interceptors.
- **Responsive Dashboard**: Dynamic task management with real-time feedback.
- **Role-specific UI**: Admin users can see the email of the task owner.

## 🛠️ Tech Stack
- **Frontend**: React.js, Vite, Lucide React, Framer Motion.
- **Backend**: Node.js, Express, TypeScript, Prisma.
- **Database**: PostgreSQL.
- **Validation**: Zod.
- **Auth**: JWT, Bcrypt.

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database

### Backend Setup
1. `cd backend`
2. `npm install`
3. Create a `.env` file with your `DATABASE_URL` and `JWT_SECRET`.
4. `npx prisma generate`
5. `npm run dev`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## 📖 API Documentation
Once the backend is running, visit `http://localhost:5000/api-docs` to view the Swagger documentation.
