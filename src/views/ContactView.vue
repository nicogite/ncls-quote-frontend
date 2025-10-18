<template>
  <div>
    <h2>Ecrivez nous !</h2>
    
    <main>
      <form @submit.prevent="handleSubmit">
        <v-text-field label="Votre email" v-model="email" variant="outlined"></v-text-field>
        <v-textarea label="Votre message" v-model="message" variant="outlined"></v-textarea>
        <!--div>
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" />
        </div>
        <div>
          <label for="message">Votre message</label>
          <textarea id="message" v-model="message"></textarea>
        </div-->
        <button type="submit">Envoyer</button>
      </form>
      <div v-if="info" class="info">{{ info }}</div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const email = ref('')
const message = ref('')
const info = ref('')

async function handleSubmit() {
  try {
    await axios.post('/api/contact', {
      email: email.value,
      message: message.value,
    })
    info.value = "Message envoyé !"
    email.value = ''
    message.value = ''
  } catch (e) {
    console.log(e)
    info.value = "Erreur lors de l'envoi du message."
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
.info {
  margin-top: 1rem;
  text-align: center;
  color: green;
}

textarea {
  height: 175px;
}
</style>