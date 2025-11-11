<template>
  <div class="dashboard">
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="text-h4">Bienvenue sur votre espace d'administration</v-card-title>
          <v-card-text>
            <v-divider class="my-4" />
            <ul>
              <li><strong>Statistiques</strong> : Consulter les données clés de l'application</li>
              <li><strong>Citations</strong> : Gérer la base de citations</li>
              <li><strong>Contenu</strong> : Éditer le contenu statique de l'application</li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Statistiques rapides -->
    <v-row class="mt-4">
      <v-col cols="12" sm="6" md="4">
        <v-card color="primary" dark>
          <v-card-text>
            <div class="text-h6">Total Citations</div>
            <div class="text-h3">{{ stats.totalQuotes }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card color="success" dark>
          <v-card-text>
            <div class="text-h6">Utilisateurs Inscrits</div>
            <div class="text-h3">{{ stats.totalUsers }}</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card color="warning" dark>
          <v-card-text>
            <div class="text-h6">Citations Populaires</div>
            <div class="text-h3">{{ stats.topRatedQuotes }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const stats = ref({
  totalQuotes: 0,
  totalUsers: 0,
  topRatedQuotes: 0,
})
const loading = ref(false)
const error = ref('')

async function loadStats() {
  loading.value = true
  error.value = ''
  try {
    const response = await axios.get('/api/admin/quotes/stats')
    stats.value = response.data
    console.log('✓ Statistics loaded:', stats.value)
  } catch (err) {
    console.error('Error loading statistics:', err)
    error.value = 'Impossible de charger les statistiques'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.dashboard {
  width: 100%;
}
</style>
