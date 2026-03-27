<template>
  <div class="content-view">
    <h2 class="text-h4 mb-4">Gestion du contenu statique</h2>

    <!-- 1ère ligne : Bienvenue (6 colonnes) et Le concept - Page 1 (6 colonnes) -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>Bienvenue</v-card-title>
          <v-card-text>
            <div ref="welcomeEditor" class="quill-editor" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>Le concept - Page 1</v-card-title>
          <v-card-text>
            <div ref="intro1Editor" class="quill-editor" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 2ème ligne : Le concept - Page 2 (6 colonnes) et Le concept - Page 3 (6 colonnes) -->
    <v-row class="mt-4">
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>Le concept - Page 2</v-card-title>
          <v-card-text>
            <div ref="intro2Editor" class="quill-editor" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>Le concept - Page 3</v-card-title>
          <v-card-text>
            <div ref="intro3Editor" class="quill-editor" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 3ème ligne : CGU (12 colonnes) -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title>CGU</v-card-title>
          <v-card-text>
            <div ref="cguEditor" class="quill-editor" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col class="text-right">
        <v-btn color="secondary" variant="outlined" @click="resetContent" class="mr-2">
          Annuler
        </v-btn>
        <v-btn color="primary" variant="flat" @click="saveContent"> Enregistrer </v-btn>
      </v-col>
    </v-row>

    <!-- Notification -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import htmlEditButton from 'quill-html-edit-button'

// Enregistrer le module HTML Edit
Quill.register('modules/htmlEditButton', htmlEditButton)

interface ContentItem {
  key: string
  value: string
  description: string
}

const cguEditor = ref<HTMLDivElement>()
const welcomeEditor = ref<HTMLDivElement>()
const intro1Editor = ref<HTMLDivElement>()
const intro2Editor = ref<HTMLDivElement>()
const intro3Editor = ref<HTMLDivElement>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let quillCgu: any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let quillWelcome: any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let quillIntro1: any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let quillIntro2: any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let quillIntro3: any

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

const contentData = ref({
  cgu: '',
  welcome: '',
  intro_1: '',
  intro_2: '',
  intro_3: '',
})

const originalData = ref({
  cgu: '',
  welcome: '',
  intro_1: '',
  intro_2: '',
  intro_3: '',
})

async function loadContent() {
  try {
    const response = await axios.get('/api/admin/content')
    const items: ContentItem[] = response.data
    console.log('Loaded content items:', items)

    items.forEach((item: ContentItem) => {
      console.log(`Loading ${item.key}:`, item.value)
      if (item.key === 'cgu') {
        contentData.value.cgu = item.value
        if (quillCgu) {
          quillCgu.setContents([])
          quillCgu.clipboard.dangerouslyPasteHTML(item.value)
        }
      } else if (item.key === 'welcome') {
        contentData.value.welcome = item.value
        if (quillWelcome) {
          quillWelcome.setContents([])
          quillWelcome.clipboard.dangerouslyPasteHTML(item.value)
        }
      } else if (item.key === 'intro_1') {
        contentData.value.intro_1 = item.value
        if (quillIntro1) {
          quillIntro1.setContents([])
          quillIntro1.clipboard.dangerouslyPasteHTML(item.value)
        }
      } else if (item.key === 'intro_2') {
        contentData.value.intro_2 = item.value
        if (quillIntro2) {
          quillIntro2.setContents([])
          quillIntro2.clipboard.dangerouslyPasteHTML(item.value)
        }
      } else if (item.key === 'intro_3') {
        contentData.value.intro_3 = item.value
        if (quillIntro3) {
          quillIntro3.setContents([])
          quillIntro3.clipboard.dangerouslyPasteHTML(item.value)
        }
      } else {
        console.warn(`Unknown content key: ${item.key}`)
      }
    })

    originalData.value = { ...contentData.value }
    console.log('Content loaded successfully')
  } catch (err) {
    console.error('Error loading content:', err)
    showSnackbar('Erreur lors du chargement du contenu', 'error')
  }
}

async function saveContent() {
  try {
    console.log('saveContent called')
    const keys: Array<'cgu' | 'welcome' | 'intro_1' | 'intro_2' | 'intro_3'> = [
      'cgu',
      'welcome',
      'intro_1',
      'intro_2',
      'intro_3',
    ]
    const quills = {
      cgu: quillCgu,
      welcome: quillWelcome,
      intro_1: quillIntro1,
      intro_2: quillIntro2,
      intro_3: quillIntro3,
    }

    let savedCount = 0

    for (const key of keys) {
      // Récupérer le contenu HTML de l'éditeur
      const content = quills[key]?.root.innerHTML || ''
      console.log(`Content for ${key}:`, content.substring(0, 100) + '...')
      console.log(`Original for ${key}:`, originalData.value[key].substring(0, 100) + '...')
      console.log(`Are they different?`, content !== originalData.value[key])

      // Mettre à jour contentData
      contentData.value[key] = content

      // Envoyer uniquement si le contenu a changé
      if (content !== originalData.value[key]) {
        console.log(`Calling API for ${key}`)
        const response = await axios.put(`/api/admin/content/${key}`, {
          value: content,
        })
        console.log(`${key} saved successfully:`, response.status)
        savedCount++
      } else {
        console.log(`No change detected for ${key}, skipping API call`)
      }
    }

    // Mettre à jour les données originales après sauvegarde réussie
    originalData.value = { ...contentData.value }

    if (savedCount > 0) {
      showSnackbar(`${savedCount} contenu(s) enregistré(s) avec succès`, 'success')
    } else {
      showSnackbar('Aucun changement à enregistrer', 'info')
    }
  } catch (err) {
    console.error('Error saving content:', err)
    showSnackbar("Erreur lors de l'enregistrement", 'error')
  }
}

function resetContent() {
  if (quillCgu) {
    quillCgu.setContents([])
    quillCgu.clipboard.dangerouslyPasteHTML(originalData.value.cgu)
  }
  if (quillWelcome) {
    quillWelcome.setContents([])
    quillWelcome.clipboard.dangerouslyPasteHTML(originalData.value.welcome)
  }
  if (quillIntro1) {
    quillIntro1.setContents([])
    quillIntro1.clipboard.dangerouslyPasteHTML(originalData.value.intro_1)
  }
  if (quillIntro2) {
    quillIntro2.setContents([])
    quillIntro2.clipboard.dangerouslyPasteHTML(originalData.value.intro_2)
  }
  if (quillIntro3) {
    quillIntro3.setContents([])
    quillIntro3.clipboard.dangerouslyPasteHTML(originalData.value.intro_3)
  }
  showSnackbar('Contenu réinitialisé', 'info')
}

function showSnackbar(message: string, color: string) {
  snackbar.value = { show: true, message, color }
}

onMounted(() => {
  // Initialiser les éditeurs Quill
  if (cguEditor.value) {
    quillCgu = new Quill(cguEditor.value, {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ header: 1 }, { header: 2 }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ],
        htmlEditButton: {},
      },
      placeholder: 'Entrez votre contenu ici...',
    })

    // Écouter les changements de contenu
    quillCgu.on('text-change', () => {
      contentData.value.cgu = quillCgu.root.innerHTML
    })
  }

  if (welcomeEditor.value) {
    quillWelcome = new Quill(welcomeEditor.value, {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ header: 1 }, { header: 2 }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ],
        htmlEditButton: {},
      },
      placeholder: 'Entrez votre contenu ici...',
    })

    // Écouter les changements de contenu
    quillWelcome.on('text-change', () => {
      contentData.value.welcome = quillWelcome.root.innerHTML
    })
  }

  if (intro1Editor.value) {
    quillIntro1 = new Quill(intro1Editor.value, {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ header: 1 }, { header: 2 }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ],
        htmlEditButton: {},
      },
      placeholder: 'Entrez votre contenu ici...',
    })

    // Écouter les changements de contenu
    quillIntro1.on('text-change', () => {
      contentData.value.intro_1 = quillIntro1.root.innerHTML
    })
  }

  if (intro2Editor.value) {
    quillIntro2 = new Quill(intro2Editor.value, {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ header: 1 }, { header: 2 }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ],
        htmlEditButton: {},
      },
      placeholder: 'Entrez votre contenu ici...',
    })

    // Écouter les changements de contenu
    quillIntro2.on('text-change', () => {
      contentData.value.intro_2 = quillIntro2.root.innerHTML
    })
  }

  if (intro3Editor.value) {
    quillIntro3 = new Quill(intro3Editor.value, {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ header: 1 }, { header: 2 }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ],
        htmlEditButton: {},
      },
      placeholder: 'Entrez votre contenu ici...',
    })

    // Écouter les changements de contenu
    quillIntro3.on('text-change', () => {
      contentData.value.intro_3 = quillIntro3.root.innerHTML
    })
  }

  // Charger le contenu après que les éditeurs soient prêts
  setTimeout(() => {
    loadContent()
  }, 100)
})
</script>

<style scoped>
.content-view {
  width: 100%;
}

.quill-editor {
  min-height: 300px;
  background-color: white;
}

:deep(.ql-container) {
  font-size: 16px;
  font-family: inherit;
}

:deep(.ql-editor) {
  min-height: 300px;
}
</style>
