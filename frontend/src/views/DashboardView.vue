<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Dashboard</h1>
      </v-col>
    </v-row>

    <!-- Statistics Cards -->
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" color="primary" dark>
          <v-card-title class="text-h6">Total Projects</v-card-title>
          <v-card-text class="text-h3">{{ stats.total_projects || 0 }}</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" color="success" dark>
          <v-card-title class="text-h6">Total Tasks</v-card-title>
          <v-card-text class="text-h3">{{ stats.total_tasks || 0 }}</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" color="warning" dark>
          <v-card-title class="text-h6">In Progress</v-card-title>
          <v-card-text class="text-h3">{{ stats.tasks_by_status?.in_progress || 0 }}</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card class="pa-4" color="info" dark>
          <v-card-title class="text-h6">Completed</v-card-title>
          <v-card-text class="text-h3">{{ stats.tasks_by_status?.done || 0 }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Charts Row -->
    <v-row class="mt-6">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Task Status Distribution</v-card-title>
          <v-card-text>
            <div id="status-chart" style="height: 300px;"></div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Recent Tasks</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="task in recentTasks" :key="task.id" @click="$router.push(`/task/${task.id}`)">
                <v-list-item-content>
                  <v-list-item-title>{{ task.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ task.status }} • {{ task.priority }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-chip
                    :color="getStatusColor(task.status)"
                    small
                  >
                    {{ task.status }}
                  </v-chip>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card>
          <v-card-title>Quick Actions</v-card-title>
          <v-card-text>
            <v-btn
              color="primary"
              class="mr-2"
              @click="$router.push('/projects')"
            >
              <v-icon left>mdi-plus</v-icon>
              New Project
            </v-btn>

            <v-btn
              color="success"
              @click="$router.push('/tasks')"
            >
              <v-icon left>mdi-plus</v-icon>
              New Task
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ApexCharts from 'apexcharts'
import api from '../services/api'
import type { DashboardStats, Task } from '../types'

const stats = ref<DashboardStats>({} as DashboardStats)
const recentTasks = ref<Task[]>([])

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    todo: 'grey',
    in_progress: 'warning',
    done: 'success'
  }
  return colors[status] || 'grey'
}

const loadDashboardData = async (): Promise<void> => {
  try {
    const [statsResponse, tasksResponse] = await Promise.all([
      api.get('/dashboard/stats'),
      api.get('/tasks?limit=5')
    ])

    stats.value = statsResponse.data
    recentTasks.value = tasksResponse.data

    // Create status chart
    createStatusChart()
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  }
}

const createStatusChart = (): void => {
  const statusData = stats.value.tasks_by_status || {}
  const chartData = {
    series: Object.values(statusData),
    labels: Object.keys(statusData).map(status =>
      status.replace('_', ' ').toUpperCase()
    )
  }

  const options: ApexCharts.ApexOptions = {
    series: chartData.series,
    chart: {
      type: 'pie',
      height: 300
    },
    labels: chartData.labels,
    colors: ['#FF9800', '#2196F3', '#4CAF50']
  }

  const chart = new ApexCharts(document.querySelector("#status-chart"), options)
  chart.render()
}

onMounted(() => {
  loadDashboardData()
})
</script>
