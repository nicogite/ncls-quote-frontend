<script setup lang="ts">
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <div>
    <Header />
    <div id="main-container">
      <!--router-view /-->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="$route.fullPath" />
        </transition>
      </router-view>
    </div>
    <Footer />
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
