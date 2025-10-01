<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field
                v-model="form.email"
                label="Email"
                type="email"
                required
                :rules="emailRules"
              ></v-text-field>

              <v-text-field
                v-model="form.password"
                label="Password"
                type="password"
                required
                :rules="passwordRules"
              ></v-text-field>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  type="submit"
                  color="primary"
                  :loading="loading"
                  :disabled="loading"
                >
                  Login
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>

          <v-card-actions class="px-3 pb-3">
            <v-spacer></v-spacer>
            <router-link to="/register" style="text-decoration: none;">
              <v-btn text color="primary">Don't have an account? Register</v-btn>
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import type { LoginForm } from '../types'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive<LoginForm>({
  email: '',
  password: ''
})

const loading = ref<boolean>(false)
const error = ref<string | null>(null)

const emailRules: Array<(v: string) => string | boolean> = [
  v => !!v || 'Email is required',
  v => /.+@.+\..+/.test(v) || 'Email must be valid'
]

const passwordRules: Array<(v: string) => string | boolean> = [
  v => !!v || 'Password is required'
]

const login = async (): Promise<void> => {
  loading.value = true
  error.value = null

  const result = await authStore.login(form.email, form.password)

  if (result.success) {
    router.push('/dashboard')
  } else {
    error.value = result.message
  }

  loading.value = false
}
</script>
