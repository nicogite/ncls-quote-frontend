<template>
  <div>
    <main>
      <h2>Inscrivez vous</h2>
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" required />
        </div>
        <div>
          <label for="phone">Phone</label>
          <input id="phone" v-model="phone" type="tel" />
        </div>
        <div>
          <p>A quelle fréquence souhaitez vous recevoir vos citations du jour</p>
          <label>
            <input type="radio" value="daily" v-model="frequency" required />
            Chaque jour
          </label>
          <label>
            <input type="radio" value="weekly" v-model="frequency" />
            Chaque semaine
          </label>
          <label>
            <input type="radio" value="monthly" v-model="frequency" />
            Chaque mois
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" v-model="cgu_approved" required />
            J'accepte les Conditions Générales d'Utilisation
          </label>
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