<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-4">
          <h1 class="text-h4">Tasks</h1>
          <v-btn color="primary" @click="showCreateDialog = true">
            <v-icon left>mdi-plus</v-icon>
            New Task
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-row>
      <v-col cols="12" md="4">
        <v-select
          v-model="filters.status"
          :items="statusOptions"
          label="Filter by Status"
          clearable
          @update:modelValue="loadTasks"
        ></v-select>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="filters.priority"
          :items="priorityOptions"
          label="Filter by Priority"
          clearable
          @update:modelValue="loadTasks"
        ></v-select>
      </v-col>
    </v-row>

    <!-- Tasks List -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-data-table
            :headers="headers"
            :items="tasks"
            :loading="loading"
            item-key="id"
            @click:row="handleRowClick"
          >
            <template v-slot:item.status="{ item }">
              <v-chip
                :color="getStatusColor(item.status)"
                small
              >
                {{ item.status.replace('_', ' ') }}
              </v-chip>
            </template>

            <template v-slot:item.priority="{ item }">
              <v-chip
                :color="getPriorityColor(item.priority)"
                small
                outlined
              >
                {{ item.priority }}
              </v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn icon small @click.stop="editTask(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="error" @click.stop="deleteTask(item)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create/Edit Task Dialog -->
    <v-dialog v-model="showCreateDialog" max-width="600px">
      <v-card>
        <v-card-title>
          {{ editingTask ? 'Edit Task' : 'Create New Task' }}
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveTask" ref="taskForm">
            <v-text-field
              v-model="taskForm.title"
              label="Title"
              required
              :rules="[v => !!v || 'Title is required']"
            ></v-text-field>

            <v-textarea
              v-model="taskForm.description"
              label="Description"
            ></v-textarea>

            <v-select
              v-model="taskForm.status"
              :items="statusOptions"
              label="Status"
            ></v-select>

            <v-select
              v-model="taskForm.priority"
              :items="priorityOptions"
              label="Priority"
            ></v-select>

            <v-select
              v-model="taskForm.project_id"
              :items="projects"
              item-text="title"
              item-value="id"
              label="Project"
              clearable
            ></v-select>

            <v-text-field
              v-model="taskForm.due_date"
              label="Due Date"
              type="datetime-local"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showCreateDialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            @click="saveTask"
            :loading="saving"
          >
            {{ editingTask ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import api from '../services/api'
import { useRouter } from 'vue-router'
import type { Task, Project, TaskForm, TaskFilters, StatusOption, PriorityOption } from '../types'

const router = useRouter()

const tasks = ref<Task[]>([])
const projects = ref<Project[]>([])
const loading = ref<boolean>(false)
const saving = ref<boolean>(false)
const showCreateDialog = ref<boolean>(false)
const editingTask = ref<Task | null>(null)

const filters = reactive<TaskFilters>({
  status: null,
  priority: null
})

const headers = [
  { title: 'Title', key: 'title' },
  { title: 'Status', key: 'status' },
  { title: 'Priority', key: 'priority' },
  { title: 'Due Date', key: 'due_date' },
  { title: 'Actions', key: 'actions', sortable: false }
]

const statusOptions: StatusOption[] = [
  { title: 'To Do', value: 'todo' as const },
  { title: 'In Progress', value: 'in_progress' as const },
  { title: 'Done', value: 'done' as const }
]

const priorityOptions: PriorityOption[] = [
  { title: 'Low', value: 'low' as const },
  { title: 'Medium', value: 'medium' as const },
  { title: 'High', value: 'high' as const }
]

const taskForm = reactive<TaskForm>({
  title: '',
  description: '',
  status: 'todo' as const,
  priority: 'medium' as const,
  project_id: undefined,
  due_date: undefined
})

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

const loadTasks = async (): Promise<void> => {
  loading.value = true
  try {
    const params: Record<string, string> = {}
    if (filters.status) params.status = filters.status
    if (filters.priority) params.priority = filters.priority

    const response = await api.get('/tasks', { params })
    tasks.value = response.data
  } catch (error) {
    console.error('Failed to load tasks:', error)
  } finally {
    loading.value = false
  }
}

const loadProjects = async (): Promise<void> => {
  try {
    const response = await api.get('/projects')
    projects.value = response.data
  } catch (error) {
    console.error('Failed to load projects:', error)
  }
}

const saveTask = async (): Promise<void> => {
  saving.value = true
  try {
    if (editingTask.value) {
      await api.put(`/tasks/${editingTask.value.id}`, taskForm)
    } else {
      await api.post('/tasks', taskForm)
    }
    showCreateDialog.value = false
    resetForm()
    loadTasks()
  } catch (error) {
    console.error('Failed to save task:', error)
  } finally {
    saving.value = false
  }
}

const editTask = (task: Task): void => {
  editingTask.value = task
  Object.assign(taskForm, task)
  showCreateDialog.value = true
}

const deleteTask = async (task: Task): Promise<void> => {
  if (confirm('Are you sure you want to delete this task?')) {
    try {
      await api.delete(`/tasks/${task.id}`)
      loadTasks()
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }
}

const resetForm = (): void => {
  editingTask.value = null
  Object.assign(taskForm, {
    title: '',
    description: '',
    status: 'todo' as const,
    priority: 'medium' as const,
    project_id: undefined,
    due_date: undefined
  })
}

const handleRowClick = (event: MouseEvent, { item }: { item: Task }): void => {
  router.push(`/task/${item.id}`)
}

onMounted(() => {
  loadTasks()
  loadProjects()
})
</script>
