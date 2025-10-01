<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card v-if="task" class="pa-4">
          <v-card-title class="d-flex align-center">
            <v-icon left>mdi-check-circle</v-icon>
            {{ task.title }}
            <v-spacer></v-spacer>
            <v-chip
              :color="getStatusColor(task.status)"
              class="ml-2"
            >
              {{ task.status.replace('_', ' ') }}
            </v-chip>
          </v-card-title>

          <v-card-text>
            <div class="mb-4">
              <h3 class="text-h6 mb-2">Description</h3>
              <p class="text-body-1">{{ task.description || 'No description provided' }}</p>
            </div>

            <v-row>
              <v-col cols="12" md="6">
                <div class="mb-4">
                  <h4 class="text-subtitle-1 mb-2">Priority</h4>
                  <v-chip
                    :color="getPriorityColor(task.priority)"
                    outlined
                  >
                    {{ task.priority }}
                  </v-chip>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="mb-4">
                  <h4 class="text-subtitle-1 mb-2">Due Date</h4>
                  <span v-if="task.due_date">
                    {{ new Date(task.due_date).toLocaleDateString() }}
                  </span>
                  <span v-else class="text-medium-emphasis">No due date</span>
                </div>
              </v-col>
            </v-row>

            <div class="mb-4">
              <h4 class="text-subtitle-1 mb-2">Project</h4>
              <span v-if="task.project_id">Project #{{ task.project_id }}</span>
              <span v-else class="text-medium-emphasis">No project assigned</span>
            </div>

            <div class="mb-4">
              <h4 class="text-subtitle-1 mb-2">Assignee</h4>
              <span v-if="task.assignee_id">User #{{ task.assignee_id }}</span>
              <span v-else class="text-medium-emphasis">Unassigned</span>
            </div>

            <div class="text-caption text-medium-emphasis">
              Created: {{ new Date(task.created_at).toLocaleString() }}
              <br>
              Last updated: {{ new Date(task.updated_at || task.created_at).toLocaleString() }}
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn color="primary" @click="$router.push('/tasks')">
              <v-icon left>mdi-arrow-left</v-icon>
              Back to Tasks
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="secondary" @click="editTask">
              <v-icon left>mdi-pencil</v-icon>
              Edit Task
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-card v-else class="pa-4">
          <v-card-text class="text-center">
            <v-icon size="64" color="grey" class="mb-4">mdi-file-question</v-icon>
            <h2 class="text-h5 mb-2">Task Not Found</h2>
            <p class="text-body-1 mb-4">The task you're looking for doesn't exist or has been deleted.</p>
            <v-btn color="primary" @click="$router.push('/tasks')">
              <v-icon left>mdi-arrow-left</v-icon>
              Back to Tasks
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'
import type { Task } from '../types'

const route = useRoute()
const task = ref<Task | null>(null)
const loading = ref<boolean>(true)

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    todo: 'grey',
    in_progress: 'warning',
    done: 'success'
  }
  return colors[status] || 'grey'
}

const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    low: 'success',
    medium: 'warning',
    high: 'error'
  }
  return colors[priority] || 'grey'
}

const loadTask = async (): Promise<void> => {
  loading.value = true
  try {
    const taskId = route.params.id as string
    const response = await api.get(`/tasks/${taskId}`)
    task.value = response.data
  } catch (error) {
    console.error('Failed to load task:', error)
    task.value = null
  } finally {
    loading.value = false
  }
}

const editTask = (): void => {
  // TODO: Navigate to edit task form or open edit dialog
  console.log('Edit task:', task.value)
}

onMounted(() => {
  loadTask()
})
</script>
