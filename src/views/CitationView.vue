<template>
  <div>
    <main>
      <div v-if="loading">Récupération de votre citation</div>
      <div id="quote-container" v-else>
        <quote>{{ citation }}</quote>
        <div id="author">— {{ author }}</div>
      </div>
      <div style="margin-top: 1rem;">
        Cette citation vous a plu ?
        <span>
          <i v-for="star in 5" :key="star" class="star" :class="{ active: star <= rating }" @click="setRating(star)">★</i>
        </span>
      </div>
      <div style="margin-top: 2rem;">
        <router-link to="/faire-suivre">Faire suivre par email</router-link>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

//const store = useStore()
const loading = ref(true)
const citation = ref('')
const author = ref('')
const rating = ref(0)

function setRating(star: number) {
  rating.value = star
}

onMounted(async () => {
  try {
    //const geo = store.geolocalisation
    const geo = 'FR' // Remplacez par la géolocalisation réelle si nécessaire
    const response = await axios.get('/api/quoteoftheday', { params: { geolocalisation: geo } })
    if (response.status === 200 && response.data.quote_of_the_day) {
      citation.value = response.data.quote_of_the_day
      author.value = response.data.author || 'Inconnu'
    } else {
      citation.value = "Le hasard c’est Dieu qui se balade incognito"
      author.value = 'Albert Einstein'
    }
  } catch (e) {
    console.log(e)
    citation.value = "Le hasard c’est Dieu qui se balade incognito"
    author.value = 'Albert Einstein'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

#quote-container {
  max-width: 600px;
  margin-bottom: 6rem;
}

quote {
  display: block;
  font-size: 1.5rem;
  margin: 2rem 0;
  text-align: center;
  font-style: italic;
  font-family: var(--citation-italic-font);
}
#author {
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: normal;
  text-align:right
}
.star {
  cursor: pointer;
  font-size: 2rem;
  color: #ccc;
}
.star.active {
  color: #FFD700;
}
</style>