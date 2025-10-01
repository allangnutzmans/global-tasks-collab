from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from models import User, Project, Task, TaskStatus
from schemas import UserCreate, ProjectCreate, TaskCreate

# User CRUD
def create_user(db: Session, user: UserCreate):
    """Create a new user"""
    from auth import get_password_hash
    hashed_password = get_password_hash(user.password)
    user_data = user.dict()
    user_data["hashed_password"] = hashed_password
    del user_data["password"]

    db_user = User(**user_data)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session, skip: int = 0, limit: int = 100):
    """Get all users"""
    return db.query(User).offset(skip).limit(limit).all()

def get_user_by_email(db: Session, email: str):
    """Get user by email"""
    return db.query(User).filter(User.email == email).first()

# Project CRUD
def create_project(db: Session, project: ProjectCreate, user_id: int):
    """Create a new project"""
    db_project = Project(**project.dict(), owner_id=user_id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def get_projects(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    """Get all projects for a user"""
    return db.query(Project).filter(Project.owner_id == user_id).offset(skip).limit(limit).all()

def get_project(db: Session, project_id: int, user_id: int):
    """Get a specific project"""
    return db.query(Project).filter(Project.id == project_id, Project.owner_id == user_id).first()

# Task CRUD
def create_task(db: Session, task: TaskCreate, user_id: int):
    """Create a new task"""
    db_task = Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def get_tasks(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    """Get all tasks for a user"""
    return db.query(Task).filter(Task.assignee_id == user_id).offset(skip).limit(limit).all()

def get_task(db: Session, task_id: int, user_id: int):
    """Get a specific task"""
    return db.query(Task).filter(Task.id == task_id, Task.assignee_id == user_id).first()

def update_task(db: Session, task_id: int, task: TaskCreate, user_id: int):
    """Update a task"""
    db_task = db.query(Task).filter(Task.id == task_id, Task.assignee_id == user_id).first()
    if db_task:
        for key, value in task.dict().items():
            setattr(db_task, key, value)
        db.commit()
        db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int, user_id: int):
    """Delete a task"""
    db_task = db.query(Task).filter(Task.id == task_id, Task.assignee_id == user_id).first()
    if db_task:
        db.delete(db_task)
        db.commit()
        return True
    return False

# Dashboard statistics
def get_dashboard_stats(db: Session, user_id: int):
    """Get dashboard statistics for a user"""
    # Count tasks by status
    status_counts = db.query(Task.status, func.count(Task.id)).filter(
        Task.assignee_id == user_id
    ).group_by(Task.status).all()

    # Count projects
    project_count = db.query(Project).filter(Project.owner_id == user_id).count()

    # Count total tasks
    total_tasks = db.query(Task).filter(Task.assignee_id == user_id).count()

    stats = {
        "total_projects": project_count,
        "total_tasks": total_tasks,
        "tasks_by_status": {status.value: count for status, count in status_counts}
    }

    return stats
