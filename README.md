# Smart Student Administration System

A full-stack student database management project built with:

- Frontend: React (Vite)
- Backend: Python Flask (REST API)
- Database: SQLite (default) or MySQL

## Project Structure

- `backend/` Flask API server + SQLAlchemy ORM models
- `frontend/` React app for managing student records
- `docker-compose.yml` Optional MySQL local container

## 1) Choose Database

Option A: SQLite (default, no install needed)

1. In `backend/.env`, keep `DB_ENGINE=sqlite`.
2. Flask will create `backend/instance/smart_student_admin.db` automatically.

Option B: MySQL (optional)

If you later install MySQL, set `DB_ENGINE=mysql` in `backend/.env`, then use either:

- Local MySQL: create database/table using `backend/init_db.sql`
- Docker MySQL:
  ```powershell
  docker compose up -d
  ```

MySQL defaults in `.env.example`:
- user: `root`
- database: `smart_student_admin`

## 2) Run Flask Backend

1. Open terminal in `backend/`
2. Create virtual environment and install dependencies:
   ```powershell
   py -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```
3. Create `.env` from `.env.example` and set values.
4. Start backend:
   ```powershell
   python run.py
   ```

Backend will run on `http://127.0.0.1:5000`.

## 3) Run React Frontend

1. Open terminal in `frontend/`
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Create `.env` from `.env.example`
4. Start frontend:
   ```powershell
   npm run dev
   ```

Frontend will run on `http://127.0.0.1:5173`.

## API Endpoints

- `GET /api/health`
- `GET /api/students`
- `POST /api/students`
- `PUT /api/students/{id}`
- `DELETE /api/students/{id}`

## Core Features

- Add student
- View all students
- Edit student
- Delete student
- Unique email validation
