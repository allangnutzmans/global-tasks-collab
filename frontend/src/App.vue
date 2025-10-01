<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Global Tasks & Collaboration</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="!isAuthenticated" @click="$router.push('/login')" text>Login</v-btn>
      <v-btn v-if="isAuthenticated" @click="logout" text>Logout</v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item v-if="isAuthenticated" @click="$router.push('/dashboard')">
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="isAuthenticated" @click="$router.push('/projects')">
          <v-list-item-icon>
            <v-icon>mdi-folder</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Projects</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="isAuthenticated" @click="$router.push('/tasks')">
          <v-list-item-icon>
            <v-icon>mdi-check-circle</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Tasks</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from './stores/auth'
import { useRouter } from 'vue-router'

const drawer = ref<boolean>(false)
const authStore = useAuthStore()
const router = useRouter()

const isAuthenticated = computed<boolean>(() => authStore.isAuthenticated)

const logout = (): void => {
  authStore.logout()
  router.push('/login')
}
</script>
