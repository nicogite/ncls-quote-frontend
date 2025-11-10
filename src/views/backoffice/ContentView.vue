<template>
  <div class="content-view">
    <h2 class="text-h4 mb-4">Gestion du contenu statique</h2>

    <v-row>
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>Concept</v-card-title>
          <v-card-text>
            <div ref="conceptEditor" class="quill-editor" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>CGU</v-card-title>
          <v-card-text>
            <div ref="cguEditor" class="quill-editor" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title>À propos</v-card-title>
          <v-card-text>
            <div ref="aboutEditor" class="quill-editor" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <v-col class="text-right">
        <v-btn
          color="secondary"
          variant="outlined"
          @click="resetContent"
          class="mr-2"
        >
          Annuler
        </v-btn>
        <v-btn color="primary" variant="flat" @click="saveContent">
          Enregistrer
        </v-btn>
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

interface ContentItem {
  key: string
  value: string
  description: string
}

const conceptEditor = ref<HTMLDivElement>()
const cguEditor = ref<HTMLDivElement>()
const aboutEditor = ref<HTMLDivElement>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let quillConcept: any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let quillCgu: any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let quillAbout: any

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

const contentData = ref({
  concept: '',
  cgu: '',
  about: '',
})

const originalData = ref({
  concept: '',
  cgu: '',
  about: '',
})

async function loadContent() {
  try {
    const response = await axios.get('/api/admin/content')
    const items: ContentItem[] = response.data

    items.forEach((item: ContentItem) => {
      if (item.key === 'concept') {
        contentData.value.concept = item.value
        quillConcept?.setContents(quillConcept.clipboard.convert(item.value))
      } else if (item.key === 'cgu') {
        contentData.value.cgu = item.value
        quillCgu?.setContents(quillCgu.clipboard.convert(item.value))
      } else if (item.key === 'about') {
        contentData.value.about = item.value
        quillAbout?.setContents(quillAbout.clipboard.convert(item.value))
      }
    })

    originalData.value = { ...contentData.value }
  } catch (err) {
    console.error('Error loading content:', err)
    showSnackbar('Erreur lors du chargement du contenu', 'error')
  }
}

async function saveContent() {
  try {
    const keys: Array<'concept' | 'cgu' | 'about'> = ['concept', 'cgu', 'about']
    const quills = { concept: quillConcept, cgu: quillCgu, about: quillAbout }

    for (const key of keys) {
      const content = quills[key]?.root.innerHTML || ''
      if (content !== originalData.value[key]) {
        await axios.put(`/api/admin/content/${key}`, {
          value: content,
        })
      }
    }

    originalData.value = { ...contentData.value }
    showSnackbar('Contenu enregistré avec succès', 'success')
  } catch (err) {
    console.error('Error saving content:', err)
    showSnackbar('Erreur lors de l\'enregistrement', 'error')
  }
}

function resetContent() {
  quillConcept?.setContents(quillConcept.clipboard.convert(originalData.value.concept))
  quillCgu?.setContents(quillCgu.clipboard.convert(originalData.value.cgu))
  quillAbout?.setContents(quillAbout.clipboard.convert(originalData.value.about))
  showSnackbar('Contenu réinitialisé', 'info')
}

function showSnackbar(message: string, color: string) {
  snackbar.value = { show: true, message, color }
}

onMounted(() => {
  // Initialiser les éditeurs Quill
  if (conceptEditor.value) {
    quillConcept = new Quill(conceptEditor.value, {
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
      },
      placeholder: 'Entrez votre contenu ici...',
    })
  }

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
      },
      placeholder: 'Entrez votre contenu ici...',
    })
  }

  if (aboutEditor.value) {
    quillAbout = new Quill(aboutEditor.value, {
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
      },
      placeholder: 'Entrez votre contenu ici...',
    })
  }

  loadContent()
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
