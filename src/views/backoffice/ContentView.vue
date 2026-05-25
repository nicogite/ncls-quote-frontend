<template>
  <div class="content-view">
    <header class="cv-head">
      <div class="cv-head__text">
        <span class="mcdj-eyebrow">Édition</span>
        <h1 class="cv-head__title">Contenu de l'application</h1>
        <p class="cv-head__sub">
          Textes lus par les utilisateurs : accueil, introduction et mentions légales.
        </p>
      </div>
      <div class="cv-head__actions">
        <button class="btn btn--ghost" @click="resetContent">Annuler</button>
        <button class="btn btn--primary" @click="saveContent">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          Enregistrer
        </button>
      </div>
    </header>

    <section class="cv-section">
      <div class="cv-section__head">
        <span class="cv-step">01</span>
        <div>
          <h2 class="cv-section__title">Accueil &amp; introduction</h2>
          <p class="cv-section__sub">Le premier contact avec le lecteur, sur l'écran de bienvenue puis pendant l'onboarding.</p>
        </div>
      </div>

      <div class="cv-grid">
        <article class="cv-editor">
          <header class="cv-editor__head">
            <span class="cv-editor__tag">Bienvenue</span>
            <span class="cv-editor__hint">Écran d'arrivée du quotidien</span>
          </header>
          <div ref="welcomeEditor" class="quill-host" />
        </article>

        <article class="cv-editor">
          <header class="cv-editor__head">
            <span class="cv-editor__tag">Concept · Page 1</span>
            <span class="cv-editor__hint">Premier écran de l'onboarding</span>
          </header>
          <div ref="intro1Editor" class="quill-host" />
        </article>

        <article class="cv-editor">
          <header class="cv-editor__head">
            <span class="cv-editor__tag">Concept · Page 2</span>
            <span class="cv-editor__hint">Deuxième écran de l'onboarding</span>
          </header>
          <div ref="intro2Editor" class="quill-host" />
        </article>

        <article class="cv-editor">
          <header class="cv-editor__head">
            <span class="cv-editor__tag">Concept · Page 3</span>
            <span class="cv-editor__hint">Troisième écran de l'onboarding</span>
          </header>
          <div ref="intro3Editor" class="quill-host" />
        </article>

        <article class="cv-editor">
          <header class="cv-editor__head">
            <span class="cv-editor__tag">Concept · Page 4</span>
            <span class="cv-editor__hint">Quatrième écran de l'onboarding</span>
          </header>
          <div ref="intro4Editor" class="quill-host" />
        </article>
      </div>
    </section>

    <section class="cv-section">
      <div class="cv-section__head">
        <span class="cv-step">02</span>
        <div>
          <h2 class="cv-section__title">Conditions générales</h2>
          <p class="cv-section__sub">Mentions légales et conditions d'utilisation accessibles depuis l'application.</p>
        </div>
      </div>
      <article class="cv-editor cv-editor--wide">
        <header class="cv-editor__head">
          <span class="cv-editor__tag">CGU</span>
          <span class="cv-editor__hint">Document complet</span>
        </header>
        <div ref="cguEditor" class="quill-host" />
      </article>
    </section>

    <footer class="cv-foot">
      <button class="btn btn--ghost" @click="resetContent">Annuler les modifications</button>
      <button class="btn btn--primary" @click="saveContent">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
        Enregistrer
      </button>
    </footer>

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
const intro4Editor = ref<HTMLDivElement>()

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let quillIntro4: any

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
  intro_4: '',
})

const originalData = ref({
  cgu: '',
  welcome: '',
  intro_1: '',
  intro_2: '',
  intro_3: '',
  intro_4: '',
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
      } else if (item.key === 'intro_4') {
        contentData.value.intro_4 = item.value
        if (quillIntro4) {
          quillIntro4.setContents([])
          quillIntro4.clipboard.dangerouslyPasteHTML(item.value)
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
    const keys: Array<'cgu' | 'welcome' | 'intro_1' | 'intro_2' | 'intro_3' | 'intro_4'> = [
      'cgu',
      'welcome',
      'intro_1',
      'intro_2',
      'intro_3',
      'intro_4',
    ]
    const quills = {
      cgu: quillCgu,
      welcome: quillWelcome,
      intro_1: quillIntro1,
      intro_2: quillIntro2,
      intro_3: quillIntro3,
      intro_4: quillIntro4,
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
  if (quillIntro4) {
    quillIntro4.setContents([])
    quillIntro4.clipboard.dangerouslyPasteHTML(originalData.value.intro_4)
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

  if (intro4Editor.value) {
    quillIntro4 = new Quill(intro4Editor.value, {
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
    quillIntro4.on('text-change', () => {
      contentData.value.intro_4 = quillIntro4.root.innerHTML
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
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Head */
.cv-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  flex-wrap: wrap;
}
.cv-head__title {
  font-family: var(--display-font);
  font-weight: 500;
  font-size: clamp(1.75rem, 3vw, 2.4rem);
  line-height: 1.1;
  letter-spacing: -0.015em;
  margin: 12px 0 8px;
  color: var(--mcdj-ink-900);
}
.cv-head__sub {
  font-size: 14px;
  color: var(--mcdj-ink-500);
  margin: 0;
  max-width: 60ch;
  font-family: var(--citation-italic-font);
  font-style: italic;
}
.cv-head__actions { display: flex; gap: 10px; }

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--app-font);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 10px 18px;
  border-radius: var(--mcdj-r-sm);
  cursor: pointer;
  transition: all 200ms ease;
  border: 1px solid transparent;
}
.btn svg { width: 16px; height: 16px; }
.btn--primary {
  background: var(--mcdj-teal-700);
  color: var(--mcdj-cream-50);
  box-shadow: 0 1px 0 rgba(255,255,255,0.12) inset, var(--mcdj-shadow-sm);
}
.btn--primary:hover { background: var(--mcdj-teal-800); transform: translateY(-1px); box-shadow: var(--mcdj-shadow-md); }
.btn--ghost {
  background: transparent;
  color: var(--mcdj-ink-700);
  border: 1px solid var(--mcdj-stroke-strong);
}
.btn--ghost:hover { border-color: var(--mcdj-teal-700); color: var(--mcdj-teal-700); background: var(--mcdj-cream-50); }

/* Sections */
.cv-section {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.cv-section__head {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--mcdj-stroke);
  position: relative;
}
.cv-section__head::after {
  content: '';
  position: absolute;
  left: 0; bottom: -1px;
  width: 60px; height: 1px;
  background: var(--mcdj-gold-500);
}
.cv-step {
  font-family: var(--display-font);
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--mcdj-gold-500);
  line-height: 1;
  padding-top: 2px;
  letter-spacing: -0.01em;
}
.cv-section__title {
  font-family: var(--display-font);
  font-weight: 500;
  font-size: 1.4rem;
  margin: 0 0 4px;
  letter-spacing: -0.01em;
  color: var(--mcdj-ink-900);
}
.cv-section__sub {
  font-size: 13px;
  color: var(--mcdj-ink-500);
  margin: 0;
  max-width: 60ch;
}

/* Grid */
.cv-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
  gap: 20px;
}

/* Editor card */
.cv-editor {
  background: var(--mcdj-surface-card);
  border: 1px solid var(--mcdj-stroke);
  border-radius: var(--mcdj-r-md);
  overflow: hidden;
  position: relative;
  transition: border-color 200ms ease, box-shadow 200ms ease;
}
.cv-editor::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--mcdj-paper-grain);
  opacity: 0.3;
  mix-blend-mode: multiply;
  pointer-events: none;
  z-index: 0;
}
.cv-editor:hover {
  border-color: var(--mcdj-stroke-strong);
}
.cv-editor:focus-within {
  border-color: var(--mcdj-teal-700);
  box-shadow: 0 0 0 3px rgba(31, 107, 110, 0.08);
}
.cv-editor > * { position: relative; z-index: 1; }
.cv-editor--wide { width: 100%; }

.cv-editor__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 14px 18px 12px;
  border-bottom: 1px solid var(--mcdj-stroke);
}
.cv-editor__tag {
  font-family: var(--display-font);
  font-size: 1rem;
  font-weight: 600;
  color: var(--mcdj-ink-900);
  letter-spacing: -0.005em;
}
.cv-editor__hint {
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--mcdj-ink-500);
  font-weight: 500;
}

.quill-host {
  background: transparent;
}

/* Foot */
.cv-foot {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid var(--mcdj-stroke);
}

/* Quill internals tweak — scoped */
:deep(.ql-toolbar.ql-snow) {
  padding: 8px 14px !important;
  border: 0 !important;
  border-bottom: 1px solid var(--mcdj-stroke) !important;
  background: var(--mcdj-cream-100) !important;
  border-radius: 0 !important;
}
:deep(.ql-container.ql-snow) {
  border: 0 !important;
  border-radius: 0 !important;
  background: var(--mcdj-cream-50) !important;
  min-height: 280px;
}
:deep(.ql-editor) {
  min-height: 280px;
  font-family: var(--app-font);
  color: var(--mcdj-ink-900);
  line-height: 1.65;
  padding: 18px 22px;
}
:deep(.ql-editor.ql-blank::before) {
  font-style: italic;
  color: var(--mcdj-ink-300);
  font-family: var(--citation-italic-font);
  left: 22px;
  right: 22px;
}

@media (max-width: 640px) {
  .cv-head { align-items: flex-start; }
  .cv-head__actions { width: 100%; }
  .cv-head__actions .btn { flex: 1; justify-content: center; }
  .cv-grid { grid-template-columns: 1fr; }
  .cv-foot .btn { flex: 1; justify-content: center; }
}
</style>
