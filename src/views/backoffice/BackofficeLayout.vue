<template>
  <div class="bo-shell">
    <!-- Sidebar -->
    <aside class="bo-sidebar" :class="{ 'is-rail': rail }">
      <div class="bo-sidebar__inner">
        <!-- Masthead -->
        <div class="bo-masthead">
          <div class="bo-masthead__mark" aria-hidden="true">
            <svg viewBox="0 0 64 64" width="36" height="36">
              <path
                d="M22 14c-7 0-12 5-12 12s5 12 12 12c2 0 4-.4 5.6-1.2-.8 5.6-5 9.4-9.6 10.6-1 .3-1.4 1.6-.6 2.4.6.6 1.6.8 2.4.4 8-3 13.2-10 13.2-19V26c0-6.6-5.4-12-11-12zm26 0c-7 0-12 5-12 12s5 12 12 12c2 0 4-.4 5.6-1.2-.8 5.6-5 9.4-9.6 10.6-1 .3-1.4 1.6-.6 2.4.6.6 1.6.8 2.4.4 8-3 13.2-10 13.2-19V26c0-6.6-5.4-12-11-12z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div class="bo-masthead__text" v-if="!rail">
            <span class="bo-masthead__eyebrow">Édition</span>
            <h1 class="bo-masthead__title">Ma&nbsp;Citation<br /><em>du&nbsp;Jour</em></h1>
          </div>
        </div>

        <hr class="bo-masthead__rule" />

        <!-- Nav -->
        <nav class="bo-nav" aria-label="Navigation principale">
          <span class="bo-nav__section" v-if="!rail">Atelier</span>
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="bo-nav__item"
            :class="{ 'is-active': activeItem === item.path }"
          >
            <span class="bo-nav__icon" v-html="getIcon(item.icon)" />
            <span class="bo-nav__label" v-if="!rail">{{ item.title }}</span>
            <span class="bo-nav__indicator" aria-hidden="true" />
          </router-link>
        </nav>

        <!-- Footer -->
        <div class="bo-sidebar__footer">
          <button class="bo-rail-toggle" @click="rail = !rail" :title="rail ? 'Déployer' : 'Réduire'">
            <span v-html="rail ? iconChevronRight : iconChevronLeft" />
          </button>
          <button class="bo-logout" @click="logout">
            <span class="bo-nav__icon" v-html="iconLogout" />
            <span class="bo-nav__label" v-if="!rail">Déconnexion</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main column -->
    <main class="bo-main">
      <div class="bo-content">
        <router-view v-slot="{ Component }">
          <transition name="bo-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>

      <footer class="bo-footer">
        <span>« Une citation par jour suffit à habiter le silence. »</span>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const rail = ref(false)

const activeItem = computed(() => route.path)

const navItems = [
  { title: 'Statistiques', path: '/admin', icon: 'chart' },
  { title: 'Citations', path: '/admin/quotes', icon: 'quote' },
  { title: 'Contenu', path: '/admin/content', icon: 'page' },
]

const iconChart = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-8"/><path d="M22 20H2"/></svg>`
const iconQuote = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h4v6c0 2.2-1.8 4-4 4"/><path d="M14 7h4v6c0 2.2-1.8 4-4 4"/></svg>`
const iconPage = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M9 14h6"/><path d="M9 17h4"/></svg>`
const iconLogout = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>`
const iconChevronLeft = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`
const iconChevronRight = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`

function getIcon(name: string): string {
  const icons: Record<string, string> = {
    chart: iconChart,
    quote: iconQuote,
    page: iconPage,
  }
  return icons[name] || iconPage
}

function logout() {
  authStore.logout()
  router.push('/admin/login')
}
</script>

<style scoped>
.bo-shell {
  display: grid;
  grid-template-columns: auto 1fr;
  min-height: 100vh;
}

/* ------------------------------------------------------------ */
/* Sidebar                                                       */
/* ------------------------------------------------------------ */
.bo-sidebar {
  width: 272px;
  background: linear-gradient(180deg, var(--mcdj-teal-800) 0%, var(--mcdj-teal-900) 100%);
  color: var(--mcdj-cream-50);
  transition: width 280ms cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow:
    inset -1px 0 0 rgba(255, 255, 255, 0.04),
    8px 0 24px -16px rgba(15, 65, 68, 0.4);
}
.bo-sidebar::after {
  /* gold hairline along the inside edge — echoes the band under the logo masthead */
  content: '';
  position: absolute;
  top: 6%;
  bottom: 6%;
  right: 0;
  width: 1px;
  background: linear-gradient(180deg, transparent, var(--mcdj-gold-500), transparent);
  opacity: 0.5;
}
.bo-sidebar.is-rail { width: 80px; }

.bo-sidebar__inner {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 28px 18px 18px;
}

/* Masthead */
.bo-masthead {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 4px 6px 22px;
}
.bo-masthead__mark {
  color: var(--mcdj-gold-300);
  width: 44px; height: 44px;
  display: grid; place-items: center;
  border: 1px solid rgba(230, 213, 168, 0.25);
  border-radius: 50%;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.03);
}
.bo-masthead__eyebrow {
  font-size: 10px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--mcdj-gold-300);
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}
.bo-masthead__title {
  font-family: var(--display-font);
  font-weight: 600;
  font-size: 18px;
  line-height: 1.1;
  margin: 0;
  color: var(--mcdj-cream-50);
}
.bo-masthead__title em {
  font-style: italic;
  font-weight: 500;
  color: var(--mcdj-gold-300);
}
.bo-masthead__rule {
  border: 0;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--mcdj-gold-500) 30%, var(--mcdj-gold-500) 70%, transparent);
  margin: 0 6px 18px;
  opacity: 0.7;
}

/* Nav */
.bo-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 0;
}
.bo-nav__section {
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgba(230, 213, 168, 0.55);
  padding: 0 14px 10px;
  font-weight: 600;
}
.bo-nav__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 11px 14px;
  color: rgba(251, 247, 238, 0.78);
  text-decoration: none;
  border-radius: var(--mcdj-r-sm);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.01em;
  transition: color 180ms ease, background-color 180ms ease;
  border-bottom: none;
}
.bo-nav__item:hover {
  color: var(--mcdj-cream-50);
  background: rgba(255, 255, 255, 0.04);
  border-bottom: none;
}
.bo-nav__icon {
  width: 20px; height: 20px;
  display: inline-grid; place-items: center;
  flex-shrink: 0;
  color: inherit;
}
.bo-nav__icon :deep(svg) { width: 100%; height: 100%; }
.bo-nav__label {
  white-space: nowrap;
  transition: opacity 200ms ease;
}
.bo-nav__indicator {
  position: absolute;
  left: -18px;
  top: 50%;
  width: 3px;
  height: 0;
  background: var(--mcdj-gold-500);
  border-radius: 0 2px 2px 0;
  transform: translateY(-50%);
  transition: height 240ms cubic-bezier(0.4, 0, 0.2, 1);
}
.bo-nav__item.is-active {
  color: var(--mcdj-cream-50);
  background: linear-gradient(
    90deg,
    rgba(201, 169, 97, 0.12) 0%,
    rgba(201, 169, 97, 0.02) 100%
  );
}
.bo-nav__item.is-active .bo-nav__indicator { height: 60%; }
.bo-nav__item.is-active .bo-nav__icon { color: var(--mcdj-gold-300); }

.bo-sidebar.is-rail .bo-nav__item { justify-content: center; padding: 12px; }
.bo-sidebar.is-rail .bo-nav__section { display: none; }

/* Footer */
.bo-sidebar__footer {
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.bo-rail-toggle {
  align-self: flex-end;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(251, 247, 238, 0.7);
  width: 28px; height: 28px;
  border-radius: 50%;
  display: grid; place-items: center;
  cursor: pointer;
  transition: color 160ms ease, border-color 160ms ease, background-color 160ms ease;
  margin-bottom: 4px;
}
.bo-rail-toggle :deep(svg) { width: 14px; height: 14px; }
.bo-rail-toggle:hover {
  color: var(--mcdj-gold-300);
  border-color: rgba(230, 213, 168, 0.4);
  background: rgba(255, 255, 255, 0.04);
}
.bo-sidebar.is-rail .bo-rail-toggle { align-self: center; }

.bo-logout {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 14px;
  background: transparent;
  color: rgba(251, 247, 238, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--mcdj-r-sm);
  cursor: pointer;
  font-family: var(--app-font);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.02em;
  transition: all 180ms ease;
}
.bo-logout:hover {
  color: var(--mcdj-cream-50);
  border-color: var(--mcdj-gold-500);
  background: rgba(201, 169, 97, 0.08);
}
.bo-sidebar.is-rail .bo-logout { justify-content: center; padding: 10px; }

/* ------------------------------------------------------------ */
/* Main column                                                   */
/* ------------------------------------------------------------ */
.bo-main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
}

/* Decorative giant quote behind the page — nods to the logo */
.bo-main::before {
  content: '\201C';
  position: fixed;
  top: 12vh;
  right: -4vw;
  font-family: var(--display-font);
  font-size: 52vw;
  line-height: 0.8;
  color: var(--mcdj-teal-900);
  opacity: 0.025;
  pointer-events: none;
  z-index: 0;
  user-select: none;
}

.bo-content {
  flex: 1;
  padding: 40px 40px 48px;
  position: relative;
  z-index: 1;
  animation: mcdj-rise 360ms cubic-bezier(0.4, 0, 0.2, 1);
}

.bo-footer {
  padding: 16px 40px 28px;
  font-family: var(--citation-italic-font);
  font-style: italic;
  font-size: 13px;
  color: var(--mcdj-ink-500);
  text-align: center;
  border-top: 1px solid var(--mcdj-stroke);
  background: rgba(237, 229, 210, 0.4);
}

/* Route transitions */
.bo-fade-enter-active,
.bo-fade-leave-active { transition: opacity 200ms ease, transform 200ms ease; }
.bo-fade-enter-from { opacity: 0; transform: translateY(6px); }
.bo-fade-leave-to   { opacity: 0; transform: translateY(-4px); }

/* Responsive */
@media (max-width: 960px) {
  .bo-shell { grid-template-columns: 1fr; }
  .bo-sidebar {
    width: 100%;
    height: auto;
    position: sticky;
    top: 0;
    z-index: 20;
  }
  .bo-sidebar__inner { height: auto; padding: 18px; }
  .bo-masthead { padding-bottom: 12px; }
  .bo-masthead__rule { margin-bottom: 10px; }
  .bo-nav { flex-direction: row; flex-wrap: wrap; padding: 0; }
  .bo-nav__section { display: none; }
  .bo-nav__indicator { display: none; }
  .bo-sidebar__footer { flex-direction: row; padding-top: 12px; }
  .bo-rail-toggle { display: none; }
  .bo-content { padding: 28px 20px 32px; }
  .bo-footer { padding: 14px 20px 24px; }
}
</style>
