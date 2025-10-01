<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Register</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-form @submit.prevent="register">
              <v-text-field
                v-model="form.email"
                label="Email"
                type="email"
                required
                :rules="emailRules"
              ></v-text-field>

              <v-text-field
                v-model="form.username"
                label="Username"
                required
                :rules="usernameRules"
              ></v-text-field>

              <v-text-field
                v-model="form.full_name"
                label="Full Name"
                :rules="nameRules"
              ></v-text-field>

              <v-text-field
                v-model="form.password"
                label="Password"
                type="password"
                required
                :rules="passwordRules"
              ></v-text-field>

              <v-text-field
                v-model="form.confirmPassword"
                label="Confirm Password"
                type="password"
                required
                :rules="confirmPasswordRules"
              ></v-text-field>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  type="submit"
                  color="primary"
                  :loading="loading"
                  :disabled="loading"
                >
                  Register
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>

          <v-card-actions class="px-3 pb-3">
            <v-spacer></v-spacer>
            <router-link to="/login" style="text-decoration: none;">
              <v-btn text color="primary">Already have an account? Login</v-btn>
            </router-link>
          </v-card-actions>
        </v-card>

        <v-alert
          v-if="error"
          type="error"
          class="mt-4"
          dismissible
          @input="error = null"
        >
          {{ error }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import type { RegisterForm } from '../types'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive<RegisterForm>({
  email: '',
  username: '',
  full_name: '',
  password: '',
  confirmPassword: ''
})

const loading = ref<boolean>(false)
const error = ref<string | null>(null)

const emailRules: Array<(v: string) => string | boolean> = [
  v => !!v || 'Email is required',
  v => /.+@.+\..+/.test(v) || 'Email must be valid'
]

const usernameRules: Array<(v: string) => string | boolean> = [
  v => !!v || 'Username is required',
  v => v.length >= 3 || 'Username must be at least 3 characters'
]

const nameRules: Array<(v: string) => string | boolean> = [
  v => !v || v.length >= 2 || 'Name must be at least 2 characters'
]

const passwordRules: Array<(v: string) => string | boolean> = [
  v => !!v || 'Password is required',
  v => v.length >= 6 || 'Password must be at least 6 characters'
]

const confirmPasswordRules = computed<Array<(v: string) => string | boolean>>(() => [
  v => !!v || 'Please confirm your password',
  v => v === form.password || 'Passwords do not match'
])

const register = async (): Promise<void> => {
  loading.value = true
  error.value = null

  const result = await authStore.register({
    email: form.email,
    username: form.username,
    full_name: form.full_name,
    password: form.password
  })

  if (result.success) {
    router.push('/dashboard')
  } else {
    error.value = result.message
  }

  loading.value = false
}
</script>
