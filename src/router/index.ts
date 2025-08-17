import { createRouter, createWebHistory } from 'vue-router'
import Bienvenue from '@/views/BienvenueView.vue'
import Citation from '@/views/CitationView.vue'
import Ademain from '@/views/AdemainView.vue'
import Inscription from '@/views/InscriptionView.vue'
import Concept from '@/views/ConceptView.vue'
import Contact from '@/views/ContactView.vue'
import CGU from '@/views/CguView.vue'

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
  ],
})

export default router

