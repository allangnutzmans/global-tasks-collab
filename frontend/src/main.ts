import { createApp } from 'vue'
import type { App } from 'vue'
import App from './App.vue'
import router from './router/index'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light'
  }
})

const app: App = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

// Initialize authentication state
const authStore = useAuthStore()
authStore.initializeAuth()

app.mount('#app')
