<template>
  <div>
    <main>
      <div v-if="loading">Récupération de votre citation</div>
      <div v-else>
        <quote>{{ citation }}</quote>
        <div style="margin-top: 2rem;">
          <router-link to="/faire-suivre">Faire suivre par email</router-link>
        </div>
        <div style="margin-top: 1rem;">
          Cette citation vous a plu ?
          <span>
            <i v-for="star in 5" :key="star" class="star" :class="{ active: star <= rating }" @click="setRating(star)">★</i>
          </span>
        </div>
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
    } else {
      citation.value = "Quand tu tapes une jarre avec la tête et que ça sonne creux, ce n'est pas forcément la jarre qui est vide"
    }
  } catch (e) {
    console.log(e)
    citation.value = "Quand tu tapes une jarre avec la tête et que ça sonne creux, ce n'est pas forcément la jarre qui est vide"
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
quote {
  display: block;
  font-size: 1.5rem;
  margin: 2rem 0;
  text-align: center;
  font-style: italic;
  font-family: var(--citation-italic-font);
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