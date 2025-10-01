# Global Task & Collaboration Dashboard

A full-stack web application for task and project management, showcasing Vue 3 + Vuetify on the frontend, FastAPI (Python) as middleware, and PostgreSQL for the database. This project demonstrates RESTful API integration, authentication, and real-time dashboards.

## Project Overview

This web app allows users to:

- Create, edit, and delete projects and tasks
- Assign tasks to users and track task status
- Visualize productivity and project statistics using interactive charts
- Authenticate securely with JWT tokens

## Tech Stack

| Layer      | Technology                  |
|------------|-----------------------------|
| Frontend   | Vue 3 + Vuetify, TypeScript, ApexCharts |
| Backend    | FastAPI (Python), JWT authentication, Pydantic validation |
| Database   | PostgreSQL                  |
| Version Control | Git (GitHub)            |
| Deployment | Heroku / Railway / Vercel   |

## Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- PostgreSQL database

### 2. Backend (FastAPI) Setup

#### Create a virtual environment
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Linux / Mac
# venv\Scripts\activate   # Windows
```

#### Install dependencies
```bash
pip install -r requirements.txt
```

#### Configure PostgreSQL

Create a database, e.g., `global_task_db`

Update the connection URL in `backend/.env`:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/global_task_db
SECRET_KEY=your_jwt_secret_key_here_change_this_in_production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

#### Run database migrations
```bash
# The database tables will be created automatically when you start the server
# Or run the SQL schema manually:
psql -d global_task_db -f backend/schema.sql
```

#### Start the FastAPI server
```bash
uvicorn main:app --reload
```

API docs available at http://localhost:8000/docs

### 3. Frontend (Vue 3 + Vuetify) Setup

#### Install dependencies
```bash
cd frontend
npm install
```

#### Start the development server
```bash
npm run dev
```

Access the app at http://localhost:5173

## Project Structure

```
global-tasks-collab/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── database.py          # Database configuration
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── auth.py              # JWT authentication
│   ├── crud.py              # Database operations
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Environment variables template
│   └── schema.sql           # PostgreSQL schema
├── frontend/
│   ├── src/
│   │   ├── main.ts          # Vue app entry point
│   │   ├── App.vue          # Root component
│   │   ├── router/
│   │   │   └── index.ts     # Vue Router configuration
│   │   ├── stores/
│   │   │   └── auth.ts      # Pinia auth store
│   │   ├── services/
│   │   │   └── api.ts       # Axios API service
│   │   ├── views/           # Page components
│   │   │   ├── LoginView.vue
│   │   │   ├── RegisterView.vue
│   │   │   ├── DashboardView.vue
│   │   │   └── TasksView.vue
│   │   └── types/
│   │       └── index.ts     # TypeScript type definitions
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.js
│   └── index.html
└── README.md
```

## Features

### Dashboard with Statistics
- Overview cards showing total projects and tasks
- Task status distribution charts
- Recent tasks list
- Quick action buttons

### Task Management
- Create, edit, and delete tasks
- Task status tracking (To Do, In Progress, Done)
- Priority levels (Low, Medium, High)
- Due date management
- Project assignment
- Filtering by status and priority

### User Authentication
- JWT-based authentication
- User registration and login
- Secure API endpoints
- Token expiration handling

### Responsive Design
- Built with Vuetify for Material Design
- Mobile-friendly interface
- Dark/light theme support

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Projects
- `GET /api/projects/` - Get user projects
- `POST /api/projects/` - Create project

### Tasks
- `GET /api/tasks/` - Get user tasks
- `POST /api/tasks/` - Create task
- `PUT /api/tasks/{task_id}` - Update task
- `DELETE /api/tasks/{task_id}` - Delete task

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Environment Variables

### Backend (.env)
```env
SECRET_KEY=your_jwt_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=postgresql://username:password@localhost:5432/global_task_db
DEBUG=True
```

## Development

### Running Tests
```bash
# Backend tests (if implemented)
cd backend
pytest

# Frontend type checking
cd frontend
npm run type-check
```

### Code Quality
```bash
# Frontend linting
cd frontend
npm run lint
```

## Deployment

### Frontend Deployment
- **Vercel**: Connect GitHub repo and deploy automatically
- **Netlify**: Build command: `npm run build`, publish directory: `dist`

### Backend Deployment
- **Heroku**: Use the `uvicorn` command in Procfile
- **Railway**: Python service with PostgreSQL database

### Database Deployment
- **Heroku Postgres**: Managed PostgreSQL service
- **ElephantSQL**: Cloud PostgreSQL hosting
- **AWS RDS**: Amazon Relational Database Service

## Optional Enhancements

- **Real-time updates**: WebSocket integration for live task updates
- **Notifications**: Email/SMS notifications for task deadlines
- **Unit tests**: Pytest for backend, Vitest for frontend
- **File uploads**: Task attachments and project files
- **Team collaboration**: User roles and permissions
- **Time tracking**: Task duration logging
- **Export functionality**: CSV/PDF report generation

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -am 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*This project demonstrates modern full-stack development practices with Vue 3, FastAPI, and PostgreSQL. Perfect for portfolios and learning advanced web development concepts.*