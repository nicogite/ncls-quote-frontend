<template>
  <div class="dashboard">
    <!-- Hero -->
    <section class="dash-hero">
      <div class="dash-hero__text">
        <span class="dash-hero__eyebrow">Édition du {{ todayLong }}</span>
        <h1 class="dash-hero__title">
          Bonjour {{ displayName }}.
        </h1>
        <p class="dash-hero__lede">
          Une vue rapide sur le catalogue, les lecteurs et les citations qui résonnent
          le plus auprès de l'audience. Tout reste éditable depuis les rubriques ci-dessous.
        </p>
      </div>

      <div class="dash-hero__mark" aria-hidden="true">&ldquo;</div>
    </section>

    <hr class="mcdj-rule dash-rule" />

    <!-- Stat cards -->
    <section class="dash-stats">
      <article class="stat" v-for="(s, i) in statBlocks" :key="s.key" :style="{ animationDelay: 80 * i + 'ms' }">
        <header class="stat__head">
          <span class="stat__icon" v-html="s.icon" />
          <span class="stat__label">{{ s.label }}</span>
        </header>
        <div class="stat__value-wrap">
          <span class="stat__value" v-if="!loading">{{ formatNumber(s.value) }}</span>
          <span class="stat__value stat__value--skel" v-else>&nbsp;</span>
        </div>
        <p class="stat__sub">{{ s.sub }}</p>
        <div class="stat__corner" aria-hidden="true" />
      </article>
    </section>

    <!-- Shortcuts -->
    <section class="dash-shortcuts">
      <div class="shortcuts__head">
        <span class="mcdj-eyebrow">Atelier</span>
        <h2 class="shortcuts__title">Reprendre l'édition</h2>
      </div>

      <div class="shortcuts__grid">
        <router-link to="/admin/quotes" class="shortcut">
          <div class="shortcut__icon" v-html="iconQuote" />
          <div class="shortcut__body">
            <h3>Citations</h3>
            <p>Ajouter, éditer ou retirer une citation du catalogue&nbsp;; trier par auteur, note ou vues.</p>
          </div>
          <span class="shortcut__arrow" aria-hidden="true">→</span>
        </router-link>

        <router-link to="/admin/content" class="shortcut">
          <div class="shortcut__icon" v-html="iconPage" />
          <div class="shortcut__body">
            <h3>Contenu</h3>
            <p>Mettre à jour les textes d'accueil, l'introduction et les CGU lus dans l'application&nbsp;mobile.</p>
          </div>
          <span class="shortcut__arrow" aria-hidden="true">→</span>
        </router-link>
      </div>
    </section>

    <!-- Error banner -->
    <transition name="alert">
      <div v-if="error" class="dash-error" role="alert">
        <span class="dash-error__icon">!</span>
        <span>{{ error }}</span>
        <button class="dash-error__retry" @click="loadStats">Réessayer</button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/store/auth'

const auth = useAuthStore()
const displayName = computed(() => auth.displayName)

const stats = ref({
  totalQuotes: 0,
  totalUsers: 0,
  topRatedQuotes: 0,
})
const loading = ref(false)
const error = ref('')

const todayLong = computed(() =>
  new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
)

const iconBook = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`
const iconUsers = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
const iconStar = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
const iconQuote = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h4v6c0 2.2-1.8 4-4 4"/><path d="M14 7h4v6c0 2.2-1.8 4-4 4"/></svg>`
const iconPage = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></svg>`

const statBlocks = computed(() => [
  {
    key: 'quotes',
    label: 'Citations au catalogue',
    value: stats.value.totalQuotes,
    sub: 'Total des pensées disponibles',
    icon: iconBook,
  },
  {
    key: 'users',
    label: 'Lecteurs inscrits',
    value: stats.value.totalUsers,
    sub: 'Appareils ayant ouvert l’application',
    icon: iconUsers,
  },
  {
    key: 'top',
    label: 'Citations plébiscitées',
    value: stats.value.topRatedQuotes,
    sub: 'Notées 4 étoiles ou plus',
    icon: iconStar,
  },
])

function formatNumber(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n ?? 0)
}

async function loadStats() {
  loading.value = true
  error.value = ''
  try {
    const response = await axios.get('/api/admin/quotes/stats')
    stats.value = response.data
  } catch (err) {
    console.error('Error loading statistics:', err)
    error.value = 'Impossible de charger les statistiques.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* ------------------------------------------------------------ */
/* Hero                                                          */
/* ------------------------------------------------------------ */
.dash-hero {
  position: relative;
  padding: 8px 4px 0;
}
.dash-hero__eyebrow {
  font-size: 11px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--mcdj-teal-700);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.dash-hero__eyebrow::before {
  content: '';
  width: 24px;
  height: 1px;
  background: var(--mcdj-gold-500);
}
.dash-hero__eyebrow::first-letter { text-transform: uppercase; }
.dash-hero__title {
  font-family: var(--display-font);
  font-weight: 500;
  font-size: clamp(1.75rem, 3.2vw, 2.6rem);
  line-height: 1.15;
  letter-spacing: -0.015em;
  margin: 14px 0 12px;
  color: var(--mcdj-ink-900);
  max-width: none;
}
.dash-hero__title em {
  font-style: italic;
  font-weight: 500;
  color: var(--mcdj-teal-700);
}
.dash-hero__lede {
  font-size: 15px;
  line-height: 1.65;
  color: var(--mcdj-ink-500);
  margin: 0;
  max-width: none;
}
.dash-hero__mark {
  position: absolute;
  top: -12px;
  right: -4px;
  font-family: var(--display-font);
  font-weight: 700;
  font-size: clamp(120px, 14vw, 200px);
  line-height: 0.6;
  color: var(--mcdj-teal-700);
  opacity: 0.08;
  user-select: none;
  pointer-events: none;
}

.dash-rule { margin: 8px 0; }

/* ------------------------------------------------------------ */
/* Stat cards                                                    */
/* ------------------------------------------------------------ */
.dash-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}
.stat {
  position: relative;
  padding: 24px 26px 22px;
  background: var(--mcdj-surface-card);
  border: 1px solid var(--mcdj-stroke);
  border-radius: var(--mcdj-r-md);
  overflow: hidden;
  isolation: isolate;
  transition: transform 280ms cubic-bezier(0.4,0,0.2,1), box-shadow 280ms ease, border-color 280ms ease;
  animation: mcdj-rise 480ms both cubic-bezier(0.4, 0, 0.2, 1);
}
.stat::before {
  /* paper grain */
  content: '';
  position: absolute;
  inset: 0;
  background: var(--mcdj-paper-grain);
  opacity: 0.4;
  mix-blend-mode: multiply;
  pointer-events: none;
  z-index: 0;
}
.stat::after {
  /* top gold hairline */
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--mcdj-gold-500) 30%, var(--mcdj-gold-500) 70%, transparent);
  opacity: 0;
  transition: opacity 320ms ease;
  z-index: 1;
}
.stat:hover {
  transform: translateY(-2px);
  box-shadow: var(--mcdj-shadow-md);
  border-color: var(--mcdj-stroke-strong);
}
.stat:hover::after { opacity: 0.8; }
.stat > * { position: relative; z-index: 1; }

.stat__head {
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 18px;
}
.stat__icon {
  width: 36px; height: 36px;
  display: grid; place-items: center;
  color: var(--mcdj-teal-700);
  background: var(--mcdj-cream-100);
  border: 1px solid var(--mcdj-stroke);
  border-radius: 50%;
  flex-shrink: 0;
}
.stat__icon :deep(svg) { width: 18px; height: 18px; }
.stat__label {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--mcdj-ink-700);
}

.stat__value-wrap {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.stat__value {
  font-family: var(--display-font);
  font-weight: 600;
  font-size: clamp(2.4rem, 4.4vw, 3.4rem);
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--mcdj-ink-900);
}
.stat__value--skel {
  width: 5ch;
  background: linear-gradient(90deg, var(--mcdj-cream-200), var(--mcdj-cream-100), var(--mcdj-cream-200));
  background-size: 200% 100%;
  border-radius: var(--mcdj-r-xs);
  animation: shimmer 1.4s infinite;
  color: transparent;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.stat__sub {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--mcdj-ink-500);
  font-family: var(--citation-italic-font);
  font-style: italic;
}

.stat__corner {
  /* tiny gold sparkle in the corner — like the small star on the logo */
  position: absolute;
  bottom: 14px; right: 14px;
  width: 12px; height: 12px;
  opacity: 0.55;
  background:
    linear-gradient(45deg, transparent 45%, var(--mcdj-gold-500) 45%, var(--mcdj-gold-500) 55%, transparent 55%),
    linear-gradient(-45deg, transparent 45%, var(--mcdj-gold-500) 45%, var(--mcdj-gold-500) 55%, transparent 55%);
  z-index: 1;
}

/* ------------------------------------------------------------ */
/* Shortcuts                                                     */
/* ------------------------------------------------------------ */
.shortcuts__head {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 18px;
}
.shortcuts__title {
  font-family: var(--display-font);
  font-weight: 500;
  font-size: 1.6rem;
  letter-spacing: -0.01em;
  margin: 0;
  color: var(--mcdj-ink-900);
}
.shortcuts__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}
.shortcut {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 20px 22px;
  background: var(--mcdj-surface-card);
  border: 1px solid var(--mcdj-stroke);
  border-radius: var(--mcdj-r-md);
  color: var(--mcdj-ink-900);
  text-decoration: none;
  border-bottom: 1px solid var(--mcdj-stroke);
  transition: border-color 240ms ease, background 240ms ease, transform 240ms ease;
}
.shortcut:hover {
  border-color: var(--mcdj-stroke-gold);
  background: var(--mcdj-surface-card);
  transform: translateY(-1px);
}
.shortcut__icon {
  width: 40px; height: 40px;
  display: grid; place-items: center;
  color: var(--mcdj-teal-700);
  border-radius: var(--mcdj-r-sm);
  background: var(--mcdj-cream-100);
  border: 1px solid var(--mcdj-stroke);
  flex-shrink: 0;
}
.shortcut__icon :deep(svg) { width: 20px; height: 20px; }
.shortcut__body h3 {
  font-family: var(--display-font);
  font-weight: 600;
  font-size: 1.05rem;
  margin: 0 0 4px;
  color: var(--mcdj-ink-900);
  display: flex; align-items: center; gap: 10px;
}
.shortcut__body p {
  font-size: 13px;
  line-height: 1.55;
  color: var(--mcdj-ink-500);
  margin: 0;
}
.shortcut__arrow {
  font-family: var(--display-font);
  font-size: 1.4rem;
  color: var(--mcdj-gold-500);
  transition: transform 240ms ease;
}
.shortcut:hover .shortcut__arrow { transform: translateX(4px); }

/* Error banner */
.dash-error {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: rgba(168, 66, 28, 0.06);
  border: 1px solid rgba(168, 66, 28, 0.18);
  border-left: 3px solid var(--mcdj-danger);
  border-radius: var(--mcdj-r-sm);
  color: var(--mcdj-danger);
  font-size: 14px;
}
.dash-error__icon {
  width: 20px; height: 20px;
  background: var(--mcdj-danger);
  color: var(--mcdj-cream-50);
  border-radius: 50%;
  display: grid; place-items: center;
  font-weight: 700;
  font-family: var(--display-font);
  font-size: 12px;
}
.dash-error__retry {
  margin-left: auto;
  background: transparent;
  border: 1px solid currentColor;
  color: var(--mcdj-danger);
  padding: 6px 12px;
  border-radius: var(--mcdj-r-xs);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  transition: background 160ms ease, color 160ms ease;
}
.dash-error__retry:hover {
  background: var(--mcdj-danger);
  color: var(--mcdj-cream-50);
}
.alert-enter-active, .alert-leave-active { transition: all 220ms ease; }
.alert-enter-from, .alert-leave-to { opacity: 0; transform: translateY(-4px); }

/* Responsive */
@media (max-width: 720px) {
  .dash-hero { grid-template-columns: 1fr; }
  .dash-hero__mark { display: none; }
}
</style>
