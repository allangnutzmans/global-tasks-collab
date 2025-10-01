// API Response Types
export interface User {
  id: number
  email: string
  username: string
  full_name?: string
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface Project {
  id: number
  title: string
  description?: string
  owner_id: number
  created_at: string
  updated_at?: string
}

export interface Task {
  id: number
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  project_id?: number
  assignee_id?: number
  due_date?: string
  created_at: string
  updated_at?: string
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

// Form Types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  email: string
  username: string
  full_name: string
  password: string
  confirmPassword: string
}

export interface TaskForm {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  project_id?: number
  due_date?: string
}

export interface ProjectForm {
  title: string
  description?: string
}

// API Response Types
export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface DashboardStats {
  total_projects: number
  total_tasks: number
  tasks_by_status: Record<string, number>
}

// Store Types
export interface AuthState {
  token: string | null
  user: User | null
}

export interface AuthResult {
  success: boolean
  message?: string
}

// Component Props Types
export interface TaskFilters {
  status?: TaskStatus | null
  priority?: TaskPriority | null
}

export interface StatusOption {
  title: string
  value: TaskStatus
}

export interface PriorityOption {
  title: string
  value: TaskPriority
}
