<template>
  <div>
    <main>
      <h2>Inscrivez vous</h2>
      <form @submit.prevent="handleSubmit">
        <v-text-field label="Email" v-model="email" variant="outlined"></v-text-field>
        <v-text-field label="Téléphone" v-model="phone" variant="outlined"></v-text-field>

        <div>
          <p>A quelle fréquence souhaitez-vous recevoir vos citations du jour :</p>
          <v-radio-group v-model="frequency">
            <v-radio label="Chaque jour" value="daily"></v-radio>
            <v-radio label="Chaque semaine" value="weekly"></v-radio>
            <v-radio label="Chaque mois" value="monthly"></v-radio>
          </v-radio-group>
        </div>
        <div>
          <v-checkbox v-model="cgu_approved" required>
            <template v-slot:label>
              <div>
                J'accepte les <router-link to="/cgu">Conditions générales d'utilisation</router-link>
              </div>
            </template>
          </v-checkbox>
        </div>
        <button type="submit">Je m'inscris</button>
      </form>
      <div v-if="message" class="message">{{ message }}</div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const email = ref('')
const phone = ref('')
const frequency = ref('daily')
const cgu_approved = ref(false)
const message = ref('')

async function handleSubmit() {
  try {
    await axios.post('/api/subscribe', {
      email: email.value,
      phone: phone.value,
      frequency: frequency.value,
      cgu_approved: cgu_approved.value,
    })
    message.value = "Inscription réussie !"
  } catch (e) {
    console.log(e)
    message.value = "Erreur lors de l'inscription."
  }
}
</script>

<style scoped>
main {
  max-width: 400px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
form > div {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
}
button {
  margin-top: 1rem;
  width: 100%;
}
.message {
  margin-top: 1rem;
  text-align: center;
  color: green;
}
</style>