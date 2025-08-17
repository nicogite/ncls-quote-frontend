<template>
  <div>
    <main>
      <p>Vous avez déjà consulté votre citation du jour. Revenez demain pour découvrir une nouvelle citation !</p>
      <p>
        Ou inscrivez vous
        <router-link to="/inscription">ici</router-link>
        pour recevoir régulièrement votre citation, à la fréquence que vous voulez
      </p>
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}
p {
  margin: 1rem 0;
  text-align: center;
}
</style>