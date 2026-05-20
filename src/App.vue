<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

const route = useRoute()
const isAdmin = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <div>
    <Header v-if="!isAdmin" />
    <div :id="isAdmin ? undefined : 'main-container'">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="$route.fullPath" />
        </transition>
      </router-view>
    </div>
    <Footer v-if="!isAdmin" />
  </div>
</template>

<style scoped>
#main-container {
  min-height: 80vh;
  overflow: hidden;
}

/* Fade transition: disparition progressive puis apparition progressive */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

</style>
