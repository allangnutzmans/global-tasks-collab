import { defineStore } from 'pinia'
import axios from 'axios'

interface User {
  id: number
  email: string
  username: string
  full_name?: string
  is_active: boolean
  created_at: string
  updated_at?: string
}

interface AuthState {
  token: string | null
  user: User | null
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  email: string
  username: string
  full_name?: string
  password: string
}

interface AuthResult {
  success: boolean
  message?: string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token') || null,
    user: null
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.token
  },

  actions: {
    async login(email: string, password: string): Promise<AuthResult> {
      try {
        const response = await axios.post('/api/auth/login', {
          email,
          password
        })

        this.token = response.data.access_token
        localStorage.setItem('token', this.token)

        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

        // Get user info
        await this.fetchUser()

        return { success: true }
      } catch (error: any) {
        return {
          success: false,
          message: error.response?.data?.detail || 'Login failed'
        }
      }
    },

    async register(userData: RegisterData): Promise<AuthResult> {
      try {
        const response = await axios.post('/api/auth/register', userData)

        // Auto login after registration
        return await this.login(userData.email, userData.password)
      } catch (error: any) {
        return {
          success: false,
          message: error.response?.data?.detail || 'Registration failed'
        }
      }
    },

    async fetchUser(): Promise<void> {
      try {
        const response = await axios.get('/api/users/me')
        this.user = response.data
      } catch (error) {
        console.error('Failed to fetch user:', error)
        this.logout()
      }
    },

    logout(): void {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    },

    initializeAuth(): void {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        this.fetchUser()
      }
    }
  }
})
