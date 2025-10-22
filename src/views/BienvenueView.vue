<template>
  <div>
    <main>
      <p class="stagger-item" style="--stagger-index:0">Parfois, une phrase nous traverse comme une étoile filante.</p>
      <br/>
      <p class="stagger-item" style="--stagger-index:1">Elle tombe juste, éclaire une question, ouvre un souffle.</p>
      <br/>
      <p class="stagger-item" style="--stagger-index:2">Ici, les mots ne viennent pas par hasard.
      Ils vous sont soufflés par le temps, la lumière et le lieu où vous vous trouvez.</p>
      <br/>
      <p class="stagger-item" style="--stagger-index:3">À chaque instant, le monde murmure quelque chose de différent.</p>
      <br/>
      <p class="stagger-item" style="--stagger-index:4">Selon l’heure du jour, selon votre ciel, une parole se révèle — poétique, ancienne ou nouvelle — pour accompagner votre pas du moment.</p>
      <br/>
      <br/>
      <p class="stagger-item" style="--stagger-index:5">Prenez une respiration.
      <br>Laissez la citation apparaître.</p>
      <v-btn id="quote-button-cstm" variant="text" @click="handleClick" class="stagger-item" style="--stagger-index:6">
        - Découvrez votre citation -
      </v-btn>
      <!--button id="quote-button" active-color="var(--the-quote-light-blue)" @click="handleClick">Voir la citation du jour</button-->
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
    line-height: 2.2rem;
  }
  #quote-button {
    margin-top: 2rem;
    margin-left:auto;
    margin-right:auto;
    display: block;
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    background-color: var(--the-quote-light-blue);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  #quote-button-cstm {
    margin:4rem auto 0 auto;
    display: block;
    font-size: 1.5rem;
    font-family: var(--citation-font);
  }

  .stagger-item {
    opacity: 0;
    transform: translateY(10px);
    animation-name: fadeInUp;
    animation-duration: 1000ms;
    animation-fill-mode: forwards;
    animation-timing-function: ease;
    /* each item waits N * 1s before starting */
    animation-delay: calc(var(--stagger-index, 0) * 3s);
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>