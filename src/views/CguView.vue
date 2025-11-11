<template>
  <div>
    <main>
      <!-- Contenu chargé depuis la base de données -->
      <div v-if="cguContent" v-html="cguContent" class="cgu-content" />
      <!-- État de chargement -->
      <div v-else-if="loading" class="text-center">
        <v-progress-circular indeterminate />
      </div>
      <!-- Erreur -->
      <div v-else-if="error" class="text-error">
        {{ error }}
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const cguContent = ref('')
const loading = ref(false)
const error = ref('')

async function loadCguContent() {
  loading.value = true
  error.value = ''
  try {
    // Utiliser la route PUBLIQUE (pas /admin/content)
    const response = await axios.get('/api/content/cgu')
    cguContent.value = response.data.value
  } catch (err) {
    console.error('Error loading CGU content:', err)
    error.value = 'Impossible de charger les CGU'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCguContent()
})
</script>

<style scoped>
.cgu-content {
  margin-bottom: 2rem;
}

.cgu-content h2,
.cgu-content h3 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.cgu-content p,
.cgu-content ul,
.cgu-content li {
  line-height: 1.6;
  margin-bottom: 1rem;
}

main {
  margin-bottom: 2rem;
}

.text-error {
  color: #d32f2f;
  padding: 1rem;
  background-color: #ffebee;
  border-radius: 4px;
}
</style>