<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-4">
          <h1 class="text-h4">Projects</h1>
          <v-btn color="primary" @click="showCreateDialog = true">
            <v-icon left>mdi-plus</v-icon>
            New Project
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Projects Grid -->
    <v-row>
      <v-col
        v-for="project in projects"
        :key="project.id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="pa-4" hover>
          <v-card-title class="text-h6">{{ project.title }}</v-card-title>
          <v-card-text>
            <p class="text-body-2 mb-2">{{ project.description || 'No description' }}</p>
            <div class="text-caption text-medium-emphasis">
              Created: {{ new Date(project.created_at).toLocaleDateString() }}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="primary" @click="viewProjectTasks(project)">
              View Tasks
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon small @click.stop="editProject(project)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon small color="error" @click.stop="deleteProject(project)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create/Edit Project Dialog -->
    <v-dialog v-model="showCreateDialog" max-width="600px">
      <v-card>
        <v-card-title>
          {{ editingProject ? 'Edit Project' : 'Create New Project' }}
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveProject" ref="projectForm">
            <v-text-field
              v-model="projectForm.title"
              label="Title"
              required
              :rules="[v => !!v || 'Title is required']"
            ></v-text-field>

            <v-textarea
              v-model="projectForm.description"
              label="Description"
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showCreateDialog = false">Cancel</v-btn>
          <v-btn
            color="primary"
            @click="saveProject"
            :loading="saving"
          >
            {{ editingProject ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import api from '../services/api'
import type { Project, ProjectForm } from '../types'

const projects = ref<Project[]>([])
const loading = ref<boolean>(false)
const saving = ref<boolean>(false)
const showCreateDialog = ref<boolean>(false)
const editingProject = ref<Project | null>(null)

const projectForm = reactive<ProjectForm>({
  title: '',
  description: ''
})

const loadProjects = async (): Promise<void> => {
  loading.value = true
  try {
    const response = await api.get('/projects')
    projects.value = response.data
  } catch (error) {
    console.error('Failed to load projects:', error)
  } finally {
    loading.value = false
  }
}

const saveProject = async (): Promise<void> => {
  saving.value = true
  try {
    if (editingProject.value) {
      await api.put(`/projects/${editingProject.value.id}`, projectForm)
    } else {
      await api.post('/projects', projectForm)
    }
    showCreateDialog.value = false
    resetForm()
    loadProjects()
  } catch (error) {
    console.error('Failed to save project:', error)
  } finally {
    saving.value = false
  }
}

const editProject = (project: Project): void => {
  editingProject.value = project
  Object.assign(projectForm, project)
  showCreateDialog.value = true
}

const deleteProject = async (project: Project): Promise<void> => {
  if (confirm('Are you sure you want to delete this project?')) {
    try {
      await api.delete(`/projects/${project.id}`)
      loadProjects()
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }
}

const viewProjectTasks = (project: Project): void => {
  // TODO: Navigate to tasks view filtered by project
  console.log('View tasks for project:', project)
}

const resetForm = (): void => {
  editingProject.value = null
  Object.assign(projectForm, {
    title: '',
    description: ''
  })
}

onMounted(() => {
  loadProjects()
})
</script>
