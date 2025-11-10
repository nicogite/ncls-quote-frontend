<template>
  <v-container>
    <v-row class="justify-center align-center" style="min-height: 100vh">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="4">
          <v-card-title class="text-center text-h4 mb-2">
            Espace Admin
          </v-card-title>
          <v-card-subtitle class="text-center mb-4">
            Citation du jour
          </v-card-subtitle>

          <v-card-text>
            <v-form @submit.prevent="submit">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                variant="outlined"
                class="mb-4"
                required
              />
              <v-text-field
                v-model="password"
                label="Mot de passe"
                type="password"
                variant="outlined"
                class="mb-4"
                required
              />
              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                class="mb-2"
                :loading="loading"
              >
                Se connecter
              </v-btn>
            </v-form>

            <v-alert v-if="error" type="error" class="mt-4">
              {{ error }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

async function submit() {
  if (!email.value || !password.value) {
    error.value = 'Email et mot de passe sont requis'
    return
  }

  loading.value = true
  try {
    await auth.login({ email: email.value, password: password.value })
    const redirect = (route.query.redirect as string) || '/admin'
    router.push(redirect)
  } catch {
    error.value = 'Identifiants invalides'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Styles supplémentaires si besoin */
</style>
