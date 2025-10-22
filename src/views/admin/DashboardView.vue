<template>
  <div class="admin-layout">
    <AdminHeader />
    <div class="admin-body">
      <AdminNav />
      <section class="admin-content">
        <router-view />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
//import AdminHeader from '@/components/admin/AdminHeader.vue'
//import AdminNav from '@/components/admin/AdminNav.vue'
</script>

<style scoped>
.admin-body { display:flex; }
.admin-content { flex:1; padding:1rem; }
</style>