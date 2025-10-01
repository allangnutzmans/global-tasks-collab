Global Task & Collaboration Dashboard

A full-stack web application for task and project management, showcasing Vue 3 + Vuetify on the frontend, FastAPI (Python) as middleware, and PostgreSQL for the database. This project demonstrates RESTful API integration, authentication, and real-time dashboards.

Project Overview

This web app allows users to:

Create, edit, and delete projects and tasks.

Assign tasks to users and track task status.

Visualize productivity and project statistics using interactive charts.

Authenticate securely with JWT tokens.

Tech Stack
Layer	Technology
Frontend	Vue 3 + Vuetify, TypeScript, optional TailwindCSS, ApexCharts
Middleware	FastAPI (Python), JWT authentication, Pydantic validation
Database	PostgreSQL
Version Control	Git (GitHub)
Deployment	Heroku / Railway / Vercel
Setup Instructions
1. Clone the Repository
git clone https://github.com/yourusername/global-task-dashboard.git
cd global-task-dashboard

2. Backend (FastAPI) Setup

Create a virtual environment

python3 -m venv venv
source venv/bin/activate  # Linux / Mac
venv\Scripts\activate     # Windows


Install dependencies

pip install fastapi uvicorn psycopg2-binary sqlalchemy pydantic python-jose passlib


Configure PostgreSQL

Create a database, e.g., global_task_db

Update the connection URL in backend/config.py:

DATABASE_URL = "postgresql://username:password@localhost:5432/global_task_db"


Run migrations / create tables

# Using SQLAlchemy ORM
python backend/models.py  # or run Alembic if you prefer


Start the FastAPI server

uvicorn backend.main:app --reload


API docs available at http://localhost:8000/docs

3. Frontend (Vue 3 + Vuetify) Setup

Install dependencies

cd frontend
npm install


Run the development server

npm run dev


Access the app at http://localhost:5173
 (Vite default)

4. Environment Variables

Create a .env file in the backend folder:

SECRET_KEY=your_jwt_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=postgresql://username:password@localhost:5432/global_task_db

5. Features to Explore

Dashboard with draggable task cards

Filter tasks by project, status, and assignee

Interactive charts (tasks per user, status breakdown)

JWT-based authentication and secure user management

6. Deployment

Frontend: Vercel / Netlify

Backend: Heroku / Railway

PostgreSQL: Managed cloud database (Heroku Postgres, ElephantSQL, etc.)

7. Optional Enhancements

Real-time updates using WebSockets

Notifications for task deadlines

Unit and integration tests (Pytest for backend, Vitest/Jest for frontend)

I can also write a ready-to-run folder structure with sample FastAPI routes, Vue components, and PostgreSQL schema that you can literally attach to your portfolio.

Do you want me to create that full structure?