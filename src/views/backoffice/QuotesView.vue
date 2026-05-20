<template>
  <div class="quotes-view">
    <!-- Custom header -->
    <header class="qv-head">
      <div class="qv-head__text">
        <span class="mcdj-eyebrow">Catalogue</span>
        <h1 class="qv-head__title">Citations</h1>
        <p class="qv-head__sub">
          <span class="qv-head__count">{{ quotes.length }}</span>
          {{ quotes.length > 1 ? 'pensées' : 'pensée' }} dans la base
        </p>
      </div>
      <div class="qv-head__actions">
        <button class="btn btn--ghost" @click="exportToCSV" :disabled="!quotes.length">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Exporter CSV
        </button>
        <button class="btn btn--primary" @click="openCreateDialog">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nouvelle citation
        </button>
      </div>
    </header>

    <!-- Table card -->
    <div class="qv-card">
      <v-data-table
        v-model:page="page"
        v-model:items-per-page="limit"
        :headers="headers"
        :items="quotes"
        :loading="loading"
        density="comfortable"
      >
        <template #item.text="{ item }">
          <div class="cell-text" :title="item.text">
            <span class="cell-quote-mark">&ldquo;</span>{{ item.text }}
          </div>
        </template>

        <template #item.author="{ item }">
          <div class="cell-author">
            <a v-if="item.wiki_link" :href="item.wiki_link" target="_blank" rel="noopener">{{ item.author }}</a>
            <span v-else>{{ item.author }}</span>
          </div>
        </template>

        <template #item.wiki_link="{ item }">
          <div class="cell-link">
            <a v-if="item.wiki_link" :href="item.wiki_link" target="_blank" rel="noopener" class="link-pill">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Wiki
            </a>
            <span v-else class="muted">—</span>
          </div>
        </template>

        <template #item.nb_views="{ item }">
          <span class="num">{{ item.nb_views ?? 0 }}</span>
        </template>

        <template #item.rating="{ item }">
          <span v-if="item.rating != null" class="rating">
            <span class="rating__star">★</span>
            <span class="rating__value">{{ Number(item.rating).toFixed(1) }}</span>
          </span>
          <span v-else class="muted">—</span>
        </template>

        <template #item.created_at="{ item }">
          <span class="date">{{ formatDate(item.created_at) }}</span>
        </template>

        <template #item.actions="{ item }">
          <div class="row-actions">
            <button class="icon-btn" @click="editQuote(item)" title="Éditer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button class="icon-btn icon-btn--danger" @click="deleteQuote(item.id)" title="Supprimer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
              </svg>
            </button>
          </div>
        </template>

        <template #loading>
          <v-skeleton-loader type="table-row@8" />
        </template>

        <template #no-data>
          <div class="empty">
            <span class="empty__mark">&ldquo;</span>
            <h3>Pas encore de citation</h3>
            <p>Commencez par ajouter la première pensée qui sera servie au lever du jour.</p>
            <button class="btn btn--primary" @click="openCreateDialog">Ajouter une citation</button>
          </div>
        </template>
      </v-data-table>
    </div>

    <!-- Create/edit dialog -->
    <v-dialog v-model="dialogOpen" max-width="640px">
      <div class="dlg">
        <header class="dlg__head">
          <span class="mcdj-eyebrow">{{ editingId ? 'Édition' : 'Nouveau' }}</span>
          <h2 class="dlg__title">
            {{ editingId ? 'Éditer la citation' : 'Ajouter une citation' }}
          </h2>
        </header>
        <hr class="mcdj-rule" />

        <form class="dlg__body" @submit.prevent="saveQuote" novalidate>
          <label class="field">
            <span class="field__label">Texte de la citation</span>
            <textarea
              v-model="formData.text"
              class="field__textarea"
              maxlength="1000"
              rows="5"
              required
              placeholder="« La vie n'est pas faite pour comprendre, elle est faite pour la vivre. »"
            />
            <span class="field__counter">{{ formData.text.length }} / 1000</span>
          </label>

          <div class="dlg__grid">
            <label class="field">
              <span class="field__label">Auteur</span>
              <input v-model="formData.author" class="field__input" placeholder="Anonyme" />
            </label>
            <label class="field">
              <span class="field__label">Lien Wikipédia</span>
              <input v-model="formData.wiki_link" class="field__input" placeholder="https://fr.wikipedia.org/wiki/…" />
            </label>
          </div>
        </form>

        <footer class="dlg__foot">
          <button class="btn btn--ghost" @click="dialogOpen = false">Annuler</button>
          <button class="btn btn--primary" @click="saveQuote">
            {{ editingId ? 'Mettre à jour' : 'Ajouter' }}
          </button>
        </footer>
      </div>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Quote {
  id: number
  text: string
  author: string
  nb_views: number
  rating: number
  wiki_link: string
  created_at: string
}

const quotes = ref<Quote[]>([])
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const loading = ref(false)
const dialogOpen = ref(false)
const editingId = ref<number | null>(null)
const formData = ref({ text: '', author: '', wiki_link: '' })

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

const headers = [
  { title: '#', key: 'id', width: '6%', sortable: false },
  { title: 'Citation', key: 'text', width: '34%', sortable: false },
  { title: 'Auteur', key: 'author', width: '14%', sortable: false },
  { title: 'Wiki', key: 'wiki_link', width: '8%', sortable: false },
  { title: 'Vues', key: 'nb_views', width: '8%' },
  { title: 'Note', key: 'rating', width: '8%' },
  { title: 'Créée', key: 'created_at', width: '10%' },
  { title: 'Actions', key: 'actions', sortable: false, width: '12%' },
]

async function fetchQuotes() {
  loading.value = true
  try {
    const response = await axios.get('/api/admin/quotes', {
      params: { limit: 1000 },
    })
    quotes.value = response.data.data
    total.value = parseInt(response.data.total)
  } catch (err) {
    console.error('Error fetching quotes:', err)
    showSnackbar('Erreur lors du chargement des citations', 'error')
  } finally {
    loading.value = false
  }
}

function openCreateDialog() {
  editingId.value = null
  formData.value = { text: '', author: '', wiki_link: '' }
  dialogOpen.value = true
}

function editQuote(quote: Quote) {
  editingId.value = quote.id
  formData.value = { text: quote.text, author: quote.author, wiki_link: quote.wiki_link }
  dialogOpen.value = true
}

async function saveQuote() {
  if (!formData.value.text.trim()) {
    showSnackbar('Le texte de la citation est requis', 'error')
    return
  }

  try {
    if (editingId.value) {
      await axios.put(`/api/admin/quotes/${editingId.value}`, formData.value)
      showSnackbar('Citation mise à jour avec succès', 'success')
    } else {
      await axios.post('/api/admin/quotes', formData.value)
      showSnackbar('Citation ajoutée avec succès', 'success')
    }
    dialogOpen.value = false
    fetchQuotes()
  } catch (err) {
    console.error('Error saving quote:', err)
    showSnackbar('Erreur lors de la sauvegarde', 'error')
  }
}

async function deleteQuote(id: number) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette citation ?')) {
    try {
      await axios.delete(`/api/admin/quotes/${id}`)
      showSnackbar('Citation supprimée avec succès', 'success')
      fetchQuotes()
    } catch (err) {
      console.error('Error deleting quote:', err)
      showSnackbar('Erreur lors de la suppression', 'error')
    }
  }
}

function showSnackbar(message: string, color: string) {
  snackbar.value = { show: true, message, color }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

function exportToCSV() {
  try {
    const csvHeaders = ['ID', 'Citation', 'Auteur', 'Lien Wiki', 'Vues', 'Note', 'Date de création']
    const csvRows = [
      csvHeaders.join('\t'),
      ...quotes.value.map((quote) =>
        [
          quote.id,
          `"${quote.text.replace(/"/g, '""')}"`,
          `"${(quote.author ?? '').replace(/"/g, '""')}"`,
          `"${quote.wiki_link || ''}"`,
          quote.nb_views || 0,
          quote.rating != null ? Number(quote.rating).toFixed(1) : '',
          formatDate(quote.created_at),
        ].join('\t'),
      ),
    ]
    const csvContent = csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    const timestamp = new Date().toISOString().split('T')[0]
    link.setAttribute('href', url)
    link.setAttribute('download', `citations_${timestamp}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showSnackbar(`${quotes.value.length} citations exportées avec succès`, 'success')
  } catch (err) {
    console.error('Error exporting CSV:', err)
    showSnackbar("Erreur lors de l'export CSV", 'error')
  }
}

onMounted(() => {
  fetchQuotes()
})
</script>

<style scoped>
.quotes-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Head */
.qv-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  flex-wrap: wrap;
}
.qv-head__title {
  font-family: var(--display-font);
  font-weight: 500;
  font-size: clamp(1.75rem, 3vw, 2.4rem);
  line-height: 1.1;
  letter-spacing: -0.015em;
  margin: 12px 0 8px;
  color: var(--mcdj-ink-900);
}
.qv-head__sub {
  font-size: 13px;
  color: var(--mcdj-ink-500);
  margin: 0;
  font-family: var(--citation-italic-font);
  font-style: italic;
}
.qv-head__count {
  font-style: normal;
  font-family: var(--display-font);
  color: var(--mcdj-teal-700);
  font-weight: 600;
  margin-right: 4px;
}
.qv-head__actions { display: flex; gap: 10px; }

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
  text-transform: none;
}
.btn svg { width: 16px; height: 16px; }
.btn--primary {
  background: var(--mcdj-teal-700);
  color: var(--mcdj-cream-50);
  box-shadow: 0 1px 0 rgba(255,255,255,0.12) inset, var(--mcdj-shadow-sm);
}
.btn--primary:hover { background: var(--mcdj-teal-800); transform: translateY(-1px); box-shadow: var(--mcdj-shadow-md); }
.btn--primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
.btn--ghost {
  background: transparent;
  color: var(--mcdj-ink-700);
  border: 1px solid var(--mcdj-stroke-strong);
}
.btn--ghost:hover { border-color: var(--mcdj-teal-700); color: var(--mcdj-teal-700); background: var(--mcdj-cream-50); }
.btn--ghost:disabled { opacity: 0.4; cursor: not-allowed; }

/* Table card */
.qv-card {
  background: var(--mcdj-surface-card);
  border: 1px solid var(--mcdj-stroke);
  border-radius: var(--mcdj-r-md);
  overflow: hidden;
  position: relative;
}
.qv-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--mcdj-paper-grain);
  opacity: 0.3;
  mix-blend-mode: multiply;
  pointer-events: none;
}

/* Cell styles */
.cell-text {
  font-family: var(--citation-italic-font);
  font-style: italic;
  font-size: 14px;
  line-height: 1.5;
  color: var(--mcdj-ink-700);
  max-width: 480px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  position: relative;
  padding-left: 0;
}
.cell-quote-mark {
  font-family: var(--display-font);
  font-style: normal;
  font-size: 22px;
  font-weight: 700;
  color: var(--mcdj-gold-500);
  margin-right: 4px;
  vertical-align: -4px;
  line-height: 0;
}
.cell-author {
  font-weight: 500;
  color: var(--mcdj-ink-900);
  font-size: 14px;
}
.cell-author a {
  color: inherit;
  border-bottom: 1px solid var(--mcdj-stroke-gold);
}
.cell-author a:hover {
  color: var(--mcdj-teal-700);
  border-bottom-color: var(--mcdj-gold-500);
}

.link-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--mcdj-teal-700);
  padding: 4px 10px;
  border: 1px solid var(--mcdj-stroke-strong);
  border-radius: 99px;
  background: var(--mcdj-cream-50);
  border-bottom: 1px solid var(--mcdj-stroke-strong);
  transition: all 180ms ease;
}
.link-pill:hover {
  border-color: var(--mcdj-teal-700);
  background: var(--mcdj-teal-50);
  border-bottom-color: var(--mcdj-teal-700);
}

.num {
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  color: var(--mcdj-ink-700);
}
.rating {
  display: inline-flex; align-items: center; gap: 4px;
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}
.rating__star { color: var(--mcdj-gold-500); }
.rating__value { color: var(--mcdj-ink-700); }
.muted { color: var(--mcdj-ink-300); }
.date {
  font-variant-numeric: tabular-nums;
  font-size: 13px;
  color: var(--mcdj-ink-500);
}

/* Row actions */
.row-actions { display: flex; gap: 4px; }
.icon-btn {
  width: 32px; height: 32px;
  display: grid; place-items: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--mcdj-r-xs);
  color: var(--mcdj-ink-500);
  cursor: pointer;
  transition: all 160ms ease;
}
.icon-btn svg { width: 16px; height: 16px; }
.icon-btn:hover {
  color: var(--mcdj-teal-700);
  border-color: var(--mcdj-stroke-gold);
  background: var(--mcdj-cream-50);
}
.icon-btn--danger:hover {
  color: var(--mcdj-danger);
  border-color: rgba(168, 66, 28, 0.3);
  background: rgba(168, 66, 28, 0.06);
}

/* Empty state */
.empty {
  padding: 80px 24px;
  text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
}
.empty__mark {
  font-family: var(--display-font);
  font-size: 96px;
  line-height: 0.6;
  color: var(--mcdj-gold-300);
  font-weight: 700;
}
.empty h3 {
  font-family: var(--display-font);
  font-size: 1.4rem;
  font-weight: 500;
  margin: 8px 0 0;
  color: var(--mcdj-ink-900);
}
.empty p {
  color: var(--mcdj-ink-500);
  max-width: 40ch;
  margin: 0 0 12px;
  font-family: var(--citation-italic-font);
  font-style: italic;
}

/* Dialog */
.dlg {
  background: var(--mcdj-surface-card);
  border-radius: var(--mcdj-r-md);
  overflow: hidden;
  position: relative;
}
.dlg::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--mcdj-paper-grain);
  opacity: 0.4;
  mix-blend-mode: multiply;
  pointer-events: none;
}
.dlg > * { position: relative; }
.dlg__head { padding: 24px 28px 16px; }
.dlg__title {
  font-family: var(--display-font);
  font-weight: 500;
  font-size: 1.6rem;
  letter-spacing: -0.01em;
  margin: 8px 0 0;
  color: var(--mcdj-ink-900);
}
.dlg__body {
  padding: 22px 28px 8px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.dlg__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.dlg__foot {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 28px 24px;
}

/* Dialog fields */
.field { display: flex; flex-direction: column; gap: 6px; position: relative; }
.field__label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--mcdj-ink-700);
}
.field__input,
.field__textarea {
  font-family: var(--app-font);
  font-size: 15px;
  color: var(--mcdj-ink-900);
  padding: 12px 14px;
  background: var(--mcdj-cream-50);
  border: 1px solid var(--mcdj-stroke-strong);
  border-radius: var(--mcdj-r-sm);
  outline: none;
  transition: border-color 180ms ease, box-shadow 180ms ease, background 180ms ease;
  width: 100%;
}
.field__textarea {
  font-family: var(--citation-italic-font);
  font-style: italic;
  font-size: 16px;
  line-height: 1.6;
  resize: vertical;
  min-height: 120px;
}
.field__input:focus,
.field__textarea:focus {
  border-color: var(--mcdj-teal-700);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(31, 107, 110, 0.10);
}
.field__counter {
  position: absolute;
  right: 10px; bottom: 8px;
  font-size: 11px;
  color: var(--mcdj-ink-300);
  font-variant-numeric: tabular-nums;
  pointer-events: none;
}

/* Vuetify data-table fine tweaks scoped to this view */
:deep(.v-data-table) {
  font-family: var(--app-font);
  background: transparent !important;
}
:deep(.v-data-table-footer) {
  border-top: 1px solid var(--mcdj-stroke);
  background: var(--mcdj-cream-100);
  padding: 8px 16px;
}
:deep(.v-data-table__td),
:deep(.v-data-table__th) {
  background: transparent !important;
  padding-block: 14px !important;
}

@media (max-width: 640px) {
  .qv-head { align-items: flex-start; }
  .qv-head__actions { width: 100%; }
  .qv-head__actions .btn { flex: 1; justify-content: center; }
  .dlg__grid { grid-template-columns: 1fr; }
}
</style>
