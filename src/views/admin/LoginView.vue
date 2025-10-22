<template>
  <main class="admin-login">
    <h2>Espace Admin</h2>
    <form @submit.prevent="submit">
      <v-text-field label="Email" v-model="email" variant="outlined"></v-text-field>
      <v-text-field label="Password" v-model="password" type="password" variant="outlined"></v-text-field>
      <button type="submit">Se connecter</button>
      <div v-if="error" class="error">{{ error }}</div>
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

async function submit() {
  try {
    console.log('Submitting login for', email.value);
    await auth.login({ email: email.value, password: password.value })
    const redirect = (route.query.redirect as string) || '/admin'
    router.push(redirect)
  } catch (e) {
    error.value = 'Identifiants invalides'
    console.error(e)
  }
}
</script>

<style scoped>
.admin-login { max-width: 360px; margin: 6rem auto; }
.error { color: red; margin-top: .5rem; }
</style>