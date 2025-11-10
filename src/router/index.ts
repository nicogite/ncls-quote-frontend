import { createRouter, createWebHistory } from 'vue-router'
import Bienvenue from '@/views/BienvenueView.vue'
import Citation from '@/views/CitationView.vue'
import Ademain from '@/views/AdemainView.vue'
import Inscription from '@/views/InscriptionView.vue'
import Concept from '@/views/ConceptView.vue'
import Contact from '@/views/ContactView.vue'
import CGU from '@/views/CguView.vue'
import BackofficeLayout from '@/views/backoffice/BackofficeLayout.vue'
import LoginView from '@/views/backoffice/LoginView.vue'
import DashboardView from '@/views/backoffice/DashboardView.vue'
import QuotesView from '@/views/backoffice/QuotesView.vue'
import ContentView from '@/views/backoffice/ContentView.vue'
import { useAuthStore } from '@/store/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/bienvenue' },
    { path: '/bienvenue', component: Bienvenue },
    { path: '/votre-citation', component: Citation },
    { path: '/a-demain', component: Ademain },
    { path: '/inscription', component: Inscription },
    { path: '/concept', component: Concept },
    { path: '/contact', component: Contact },
    { path: '/cgu', component: CGU },
    {
      path: '/admin',
      component: BackofficeLayout,
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'AdminDashboard', component: DashboardView },
        { path: 'quotes', name: 'AdminQuotes', component: QuotesView },
        { path: 'content', name: 'AdminContent', component: ContentView },
      ],
    },
    { path: '/admin/login', name: 'AdminLogin', component: LoginView, meta: { guest: true } },
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated()) {
    return next({ name: 'AdminLogin', query: { redirect: to.fullPath } })
  }
  if (to.meta.guest && auth.isAuthenticated()) {
    return next({ path: '/admin' })
  }
  next()
})

export default router

