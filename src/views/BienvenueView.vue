<template>
  <div>
    <main>
      <!-- Contenu chargé depuis la base de données -->
      <div v-if="welcomeContent" class="welcome-content">
        <div v-html="welcomeContent" class="stagger-wrapper" />
      </div>
      <!-- État de chargement -->
      <div v-else-if="loading" class="text-center">
        <v-progress-circular indeterminate />
      </div>
      <!-- Erreur -->
      <div v-else-if="error" class="text-error">
        {{ error }}
      </div>

      <!-- Bouton toujours visible -->
      <v-btn id="quote-button-cstm" variant="text" @click="handleClick" class="stagger-item" style="--stagger-index:6">
        - Découvrez votre citation -
      </v-btn>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const welcomeContent = ref('')
const loading = ref(false)
const error = ref('')

async function loadWelcomeContent() {
  loading.value = true
  error.value = ''
  try {
    // Utiliser la route PUBLIQUE (pas /admin/content)
    const response = await axios.get('/api/content/welcome')
    welcomeContent.value = response.data.value
  } catch (err) {
    console.error('Error loading welcome content:', err)
    error.value = 'Impossible de charger le contenu de bienvenue'
  } finally {
    loading.value = false
  }
}

function handleClick() {
  if (document.cookie.includes('quote_of_the_day=true')) {
    router.push('/a-demain')
  } else {
    document.cookie = 'quote_of_the_day=true; path=/'
    router.push('/votre-citation')
  }
}

onMounted(() => {
  loadWelcomeContent()
})
</script>

<style scoped>
main {
  line-height: 2.2rem;
}

.welcome-content {
  margin-bottom: 2rem;
}

.stagger-wrapper :deep(p) {
  opacity: 0;
  transform: translateY(10px);
  animation-name: fadeInUp;
  animation-duration: 1000ms;
  animation-fill-mode: forwards;
  animation-timing-function: ease;
  animation-delay: calc(var(--stagger-index, 0) * 2s);
  margin-bottom: 1rem;
}

.stagger-wrapper :deep(br) {
  display: none;
}

#quote-button-cstm {
  margin: 4rem auto 0 auto;
  display: block;
  font-size: 1.5rem;
  font-family: var(--citation-font);
}

.stagger-item {
  opacity: 0;
  transform: translateY(10px);
  animation-name: fadeInUp;
  animation-duration: 1000ms;
  animation-fill-mode: forwards;
  animation-timing-function: ease;
  animation-delay: calc(var(--stagger-index, 0) * 2s);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.text-error {
  color: #d32f2f;
  padding: 1rem;
  background-color: #ffebee;
  border-radius: 4px;
  margin-bottom: 2rem;
}

.text-center {
  text-align: center;
  padding: 2rem;
}
</style>