<template>
  <div class="backoffice-layout">
    <!-- Navigation Drawer (Menu latéral) -->
    <aside class="sidebar" :class="{ collapsed: rail }">
      <!-- Header du drawer -->
      <div class="sidebar-header">
        <h3>Admin</h3>
        <p>Citation du jour</p>
      </div>

      <!-- Navigation Items -->
      <nav class="sidebar-nav">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: activeItem === item.path }"
          @click="activeItem = item.path"
        >
          <span class="icon">{{ getIcon(item.icon) }}</span>
          <span class="label" v-if="!rail">{{ item.title }}</span>
        </router-link>
      </nav>

      <!-- Logout Button -->
      <div class="sidebar-footer">
        <button @click="logout" class="logout-btn">
          <span class="icon">🚪</span>
          <span class="label" v-if="!rail">Déconnexion</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Top Bar -->
      <header class="top-bar">
        <button class="menu-toggle" @click="rail = !rail">
          ☰
        </button>
        <h1>Espace d'administration</h1>
        <div class="spacer" />
        <button class="notification-btn">🔔</button>
      </header>

      <!-- Content -->
      <div class="content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()
const rail = ref(false)
const activeItem = ref('/admin')

const navItems = [
  { title: 'Statistiques', path: '/admin', icon: 'chart' },
  { title: 'Citations', path: '/admin/quotes', icon: 'quote' },
  { title: 'Contenu', path: '/admin/content', icon: 'file' },
]

function getIcon(icon: string): string {
  const icons: Record<string, string> = {
    chart: '📊',
    quote: '💬',
    file: '📄',
  }
  return icons[icon] || '📌'
}

function logout() {
  authStore.logout()
  router.push('/admin/login')
}
</script>

<style scoped>
.backoffice-layout {
  display: flex;
  min-height: 100vh;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #34495e;
  text-align: center;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.sidebar-header p {
  margin: 0.5rem 0 0 0;
  font-size: 0.85rem;
  color: #bdc3c7;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  list-style: none;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  color: #ecf0f1;
  text-decoration: none;
  transition: background-color 0.2s;
  cursor: pointer;
}

.nav-item:hover {
  background-color: #34495e;
}

.nav-item.active {
  background-color: #3498db;
  border-left: 4px solid #2980b9;
}

.nav-item .icon {
  font-size: 1.5rem;
  min-width: 40px;
  text-align: center;
}

.nav-item .label {
  margin-left: 1rem;
  white-space: nowrap;
}

.sidebar.collapsed .nav-item .label {
  display: none;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #34495e;
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 1rem;
}

.logout-btn:hover {
  background-color: #c0392b;
}

.logout-btn .icon {
  font-size: 1.5rem;
  min-width: 40px;
  text-align: center;
}

.logout-btn .label {
  margin-left: 1rem;
  white-space: nowrap;
}

.sidebar.collapsed .logout-btn .label {
  display: none;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.top-bar {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #34495e;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  gap: 1rem;
}

.menu-toggle {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

.top-bar h1 {
  margin: 0;
  font-size: 1.5rem;
}

.spacer {
  flex: 1;
}

.notification-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

.content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  background-color: #ecf0f1;
}
</style>
