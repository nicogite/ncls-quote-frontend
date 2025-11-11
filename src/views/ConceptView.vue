<template>
  <div>
    <main>
      <!-- Contenu chargé depuis la base de données -->
      <div v-if="conceptContent" v-html="conceptContent" class="concept-content" />
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

const conceptContent = ref('')
const loading = ref(false)
const error = ref('')

async function loadConceptContent() {
  loading.value = true
  error.value = ''
  try {
    // Utiliser la route PUBLIQUE (pas /admin/content)
    const response = await axios.get('/api/content/concept')
    conceptContent.value = response.data.value
  } catch (err) {
    console.error('Error loading concept content:', err)
    error.value = 'Impossible de charger le concept'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadConceptContent()
})
</script>

<style scoped>
.concept-content {
  margin-bottom: 2rem;
}

.concept-content h2 {
  margin-bottom: 1.5rem;
}

.concept-content p,
.concept-content br {
  line-height: 1.8;
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

.text-center {
  text-align: center;
  padding: 2rem;
}
</style>

<script setup lang="ts">
</script>

<style scoped>
main {
  /*display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  font-size: 1.2rem;*/
}
</style>