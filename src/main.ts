import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
        defaultSet: 'mdi',
        aliases,
        sets: { mdi }
    },
  defaults: {
    VTextField: {
      variant: 'outlined',
    },
    VTextarea: {
      variant: 'outlined',
      autoGrow: true,
      color: 'var(--the-quote-medium-blue)'
    },
    VRadio: {
      color: 'var(--the-quote-medium-blue)',
    },
  },
})

const app = createApp(App)

app.use(vuetify)
app.use(createPinia())
app.use(router)

app.mount('#app')
