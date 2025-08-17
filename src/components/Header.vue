<template>
  <div class="header-container">
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
.header-container {
}
header {
  text-align: center;
  margin-bottom: 2rem;
  align-self: center;
  justify-self: center;
}
h1 {
  cursor: pointer;
  user-select: none;
}
</style>