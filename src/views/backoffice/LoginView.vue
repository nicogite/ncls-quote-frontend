<template>
  <div class="login-shell">
    <!-- Editorial panel (left) -->
    <aside class="login-panel">
      <div class="login-panel__inner">
        <span class="login-panel__eyebrow">Ma Citation du Jour</span>
        <h1 class="login-panel__title">
          L'atelier où s'<em>orchestre</em><br />
          la citation du jour.
        </h1>
        <p class="login-panel__lede">
          Une régie sobre pour préparer chaque matin une pensée à offrir.
          Sélectionner, polir, publier&nbsp;— puis laisser la nuit faire le reste.
        </p>

        <div class="login-panel__rule" />

        <ul class="login-panel__features">
          <li><span class="dot" /> Catalogue de citations &amp; auteurs</li>
          <li><span class="dot" /> Édition fine du contenu mobile</li>
          <li><span class="dot" /> Statistiques de lecture quotidienne</li>
        </ul>
      </div>

      <div class="login-panel__mark" aria-hidden="true">&ldquo;</div>
      <div class="login-panel__credit">
        <span>Édition&nbsp;{{ year }}</span>
        <span class="login-panel__credit-dot">•</span>
        <span>Verbamundi</span>
      </div>
    </aside>

    <!-- Form (right) -->
    <section class="login-form">
      <div class="login-form__inner">
        <header class="login-form__head">
          <span class="login-form__eyebrow">Accès réservé</span>
          <h2 class="login-form__title">Bonjour.</h2>
          <p class="login-form__sub">Identifiez-vous pour entrer dans l'atelier.</p>
        </header>

        <form class="login-form__body" @submit.prevent="submit" novalidate>
          <label class="field">
            <span class="field__label">Adresse e-mail</span>
            <input
              v-model="email"
              type="email"
              autocomplete="email"
              autofocus
              placeholder="vous@maison.fr"
              class="field__input"
              :disabled="loading"
              required
            />
          </label>

          <label class="field">
            <span class="field__label">
              Mot de passe
              <a class="field__hint" href="#" @click.prevent>Oublié&nbsp;?</a>
            </span>
            <div class="field__wrap">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="••••••••"
                class="field__input"
                :disabled="loading"
                required
              />
              <button
                type="button"
                class="field__toggle"
                @click="showPassword = !showPassword"
                :title="showPassword ? 'Masquer' : 'Afficher'"
                tabindex="-1"
              >
                <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.8 19.8 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a19.8 19.8 0 0 1-2.16 3.19" />
                  <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                  <path d="M1 1l22 22" />
                </svg>
              </button>
            </div>
          </label>

          <transition name="alert">
            <div v-if="error" class="alert" role="alert">
              <span class="alert__icon">!</span>{{ error }}
            </div>
          </transition>

          <button type="submit" class="submit" :disabled="loading">
            <span v-if="!loading">Entrer dans l'atelier</span>
            <span v-else class="submit__loader" aria-label="Connexion en cours">
              <span class="dot" /><span class="dot" /><span class="dot" />
            </span>
          </button>

          <p class="login-form__foot">
            En vous connectant, vous éditez le contenu visible par les lecteurs de l'application.
          </p>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)
const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const year = computed(() => new Date().getFullYear())

async function submit() {
  if (!email.value || !password.value) {
    error.value = 'Email et mot de passe sont requis.'
    return
  }
  error.value = ''
  loading.value = true
  try {
    await auth.login({ email: email.value, password: password.value })
    const redirect = (route.query.redirect as string) || '/admin'
    router.push(redirect)
  } catch {
    error.value = 'Identifiants invalides.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-shell {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  min-height: 100vh;
  background: var(--mcdj-cream-100);
}

/* ------------------------------------------------------------ */
/* Editorial panel                                               */
/* ------------------------------------------------------------ */
.login-panel {
  position: relative;
  padding: 64px 56px;
  background:
    radial-gradient(120% 80% at 0% 0%, rgba(255,255,255,0.06), transparent 60%),
    linear-gradient(165deg, var(--mcdj-teal-700) 0%, var(--mcdj-teal-900) 100%);
  color: var(--mcdj-cream-50);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  isolation: isolate;
}
/* gold hairline echoing the band under the masthead in the logo */
.login-panel::before {
  content: '';
  position: absolute;
  left: 56px; right: 56px; top: 56px;
  height: 1px;
  background: linear-gradient(to right, var(--mcdj-gold-500), transparent);
  opacity: 0.7;
}
.login-panel::after {
  /* paper grain over the teal block */
  content: '';
  position: absolute;
  inset: 0;
  background: var(--mcdj-paper-grain);
  opacity: 0.22;
  mix-blend-mode: overlay;
  pointer-events: none;
}

.login-panel__inner {
  max-width: 520px;
  position: relative;
  z-index: 2;
  animation: mcdj-rise 600ms 100ms both cubic-bezier(0.4, 0, 0.2, 1);
}
.login-panel__eyebrow {
  font-size: 11px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--mcdj-gold-300);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.login-panel__eyebrow::before {
  content: '';
  width: 28px;
  height: 1px;
  background: var(--mcdj-gold-500);
}
.login-panel__title {
  font-family: var(--display-font);
  font-weight: 500;
  font-size: clamp(2rem, 3.6vw, 3rem);
  line-height: 1.05;
  letter-spacing: -0.015em;
  margin: 28px 0 24px;
  color: var(--mcdj-cream-50);
}
.login-panel__title em {
  font-style: italic;
  font-weight: 500;
  color: var(--mcdj-gold-300);
}
.login-panel__lede {
  font-size: 16px;
  line-height: 1.65;
  color: rgba(251, 247, 238, 0.78);
  max-width: 44ch;
  margin: 0;
}
.login-panel__rule {
  width: 56px;
  height: 1px;
  background: var(--mcdj-gold-500);
  margin: 36px 0 24px;
}
.login-panel__features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 14px;
  color: rgba(251, 247, 238, 0.78);
}
.login-panel__features li {
  display: flex; align-items: center; gap: 12px;
  letter-spacing: 0.01em;
}
.login-panel__features .dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--mcdj-gold-300);
}

/* Giant quote mark — direct nod to the logo */
.login-panel__mark {
  position: absolute;
  right: -2vw;
  bottom: -8vh;
  font-family: var(--display-font);
  font-size: clamp(380px, 48vw, 720px);
  line-height: 0.72;
  color: var(--mcdj-cream-50);
  opacity: 0.04;
  font-weight: 700;
  user-select: none;
  pointer-events: none;
  z-index: 1;
}

.login-panel__credit {
  position: relative;
  z-index: 2;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(251, 247, 238, 0.4);
  display: flex; gap: 10px; align-items: center;
}
.login-panel__credit-dot { color: var(--mcdj-gold-500); }

/* ------------------------------------------------------------ */
/* Form                                                          */
/* ------------------------------------------------------------ */
.login-form {
  display: grid;
  place-items: center;
  padding: 48px 32px;
  position: relative;
}
.login-form::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--mcdj-paper-grain);
  opacity: 0.5;
  pointer-events: none;
  mix-blend-mode: multiply;
}
.login-form__inner {
  width: 100%;
  max-width: 420px;
  position: relative;
  animation: mcdj-rise 600ms 200ms both cubic-bezier(0.4, 0, 0.2, 1);
}

.login-form__head { margin-bottom: 36px; }
.login-form__eyebrow {
  font-size: 11px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--mcdj-teal-700);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.login-form__eyebrow::before {
  content: '';
  width: 24px;
  height: 1px;
  background: var(--mcdj-gold-500);
}
.login-form__title {
  font-family: var(--display-font);
  font-weight: 600;
  font-size: 36px;
  line-height: 1.05;
  margin: 16px 0 8px;
  letter-spacing: -0.015em;
  color: var(--mcdj-ink-900);
}
.login-form__sub {
  font-size: 14px;
  color: var(--mcdj-ink-500);
  margin: 0;
}

.login-form__body {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.field__label {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--mcdj-ink-700);
}
.field__hint {
  text-transform: none;
  letter-spacing: 0;
  font-size: 12px;
  color: var(--mcdj-teal-700);
  border-bottom: 1px dotted var(--mcdj-stroke-gold);
  padding-bottom: 0;
}
.field__hint:hover { color: var(--mcdj-teal-800); }

.field__wrap { position: relative; }
.field__input {
  width: 100%;
  font-family: var(--app-font);
  font-size: 15px;
  color: var(--mcdj-ink-900);
  padding: 14px 16px;
  background: var(--mcdj-cream-50);
  border: 1px solid var(--mcdj-stroke-strong);
  border-radius: var(--mcdj-r-sm);
  outline: none;
  transition: border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
}
.field__input::placeholder { color: var(--mcdj-ink-300); }
.field__input:hover { border-color: var(--mcdj-cream-300); }
.field__input:focus {
  border-color: var(--mcdj-teal-700);
  background: #fff;
  box-shadow: 0 0 0 4px rgba(31, 107, 110, 0.10);
}
.field__input:disabled { opacity: 0.55; cursor: not-allowed; }

.field__toggle {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: 0;
  color: var(--mcdj-ink-500);
  width: 32px; height: 32px;
  border-radius: var(--mcdj-r-xs);
  cursor: pointer;
  display: grid; place-items: center;
  transition: color 160ms ease, background 160ms ease;
}
.field__toggle:hover { color: var(--mcdj-teal-700); background: var(--mcdj-cream-100); }
.field__toggle svg { width: 18px; height: 18px; }

.alert {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: rgba(168, 66, 28, 0.06);
  border: 1px solid rgba(168, 66, 28, 0.2);
  border-left: 3px solid var(--mcdj-danger);
  border-radius: var(--mcdj-r-xs);
  color: var(--mcdj-danger);
  font-size: 13px;
}
.alert__icon {
  width: 18px; height: 18px;
  border-radius: 50%;
  background: var(--mcdj-danger);
  color: var(--mcdj-cream-50);
  display: grid; place-items: center;
  font-size: 11px;
  font-weight: 700;
  font-family: var(--display-font);
  flex-shrink: 0;
}
.alert-enter-active, .alert-leave-active { transition: all 220ms ease; }
.alert-enter-from, .alert-leave-to { opacity: 0; transform: translateY(-4px); }

.submit {
  margin-top: 6px;
  background: var(--mcdj-teal-800);
  color: var(--mcdj-cream-50);
  font-family: var(--app-font);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 16px 24px;
  border: 0;
  border-radius: var(--mcdj-r-sm);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: background 200ms ease, transform 200ms ease, box-shadow 200ms ease;
  box-shadow: 0 1px 0 rgba(255,255,255,0.1) inset, var(--mcdj-shadow-sm);
}
.submit::after {
  /* shimmering gold sweep on hover */
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(201, 169, 97, 0.22) 50%, transparent 100%);
  transform: translateX(-100%);
  transition: transform 600ms ease;
}
.submit:hover:not(:disabled) {
  background: var(--mcdj-teal-900);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px -12px rgba(15, 65, 68, 0.5);
}
.submit:hover:not(:disabled)::after { transform: translateX(100%); }
.submit:active:not(:disabled) { transform: translateY(0); }
.submit:disabled { opacity: 0.7; cursor: progress; }
.submit__loader {
  display: inline-flex; gap: 6px; align-items: center;
}
.submit__loader .dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--mcdj-gold-300);
  animation: pulse 1.2s infinite;
}
.submit__loader .dot:nth-child(2) { animation-delay: 0.15s; }
.submit__loader .dot:nth-child(3) { animation-delay: 0.30s; }
@keyframes pulse {
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
  40%           { opacity: 1;   transform: scale(1); }
}

.login-form__foot {
  margin-top: 8px;
  font-size: 12px;
  color: var(--mcdj-ink-500);
  text-align: center;
  font-family: var(--citation-italic-font);
  font-style: italic;
}

/* Responsive */
@media (max-width: 960px) {
  .login-shell { grid-template-columns: 1fr; }
  .login-panel {
    padding: 40px 28px 80px;
    min-height: 40vh;
  }
  .login-panel::before { left: 28px; right: 28px; top: 28px; }
  .login-panel__mark { font-size: 80vw; bottom: -10vh; right: -10vw; }
  .login-form { padding: 40px 24px; }
}
</style>
