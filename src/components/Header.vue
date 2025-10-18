<template>
  <div id="header-container">
    <header>
      <h1 @click="goHome">Citation du jour</h1>
    </header>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

defineOptions({
  name: 'AppHeader'
})

const router = useRouter()
function goHome() {
  router.push('/bienvenue')
}
</script>

<style scoped>
#header-container {
  padding: 1rem;
}
header {
  text-align: center;
  margin-bottom: 2rem;
  height: 10vh;
}
h1 {
  cursor: pointer;
  user-select: none;
}
</style>