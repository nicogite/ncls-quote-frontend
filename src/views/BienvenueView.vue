<template>
  <div>
    <main>
      <button @click="handleClick">Voir la citation du jour</button>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function handleClick() {
  if (document.cookie.includes('quote_of_the_day=true')) {
    router.push('/a-demain')
  } else {
    document.cookie = 'quote_of_the_day=true; path=/'
    router.push('/votre-citation')
  }
}
</script>

<style scoped>
main {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}
</style>