<template>
  <footer>
    <router-link to="/concept">Le concept</router-link> |
    <router-link to="/contact">Contact</router-link> |
    <router-link to="/cgu">CGU</router-link>
  </footer>
</template>

<script setup lang="ts">
// Pas de logique spécifique
</script>

<script lang="ts">
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
footer {
  text-align: center;
  margin-top: 2rem;
}
</style>