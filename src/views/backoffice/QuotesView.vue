<template>
  <div class="quotes-view">
    <!-- Header avec bouton ajouter -->
    <v-row class="mb-4">
      <v-col>
        <h2 class="text-h4">Citations</h2>
      </v-col>
      <v-col class="text-right">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
          Ajouter une citation
        </v-btn>
      </v-col>
    </v-row>

    <!-- Tableau des citations -->
    <v-card>
      <v-data-table
        v-model:page="page"
        v-model:items-per-page="limit"
        :headers="headers"
        :items="quotes"
        :loading="loading"
        disable-sort
      >
        <!-- Colonne ID -->
        <!--template #item.id="{ item }">
          <div style="max-width: 100px">
            {{ item.id }}
          </div>
        </template-->

        <!-- Colonne texte -->
        <template #item.text="{ item }">
          <div class="text-truncate" style="max-width: 300px">
            {{ item.text }}
          </div>
        </template>

        <!-- Colonne Author -->
        <template #item.author="{ item }">
          <div style="max-width: 100px">
            <a :href="item.wiki_link" target="_blank">{{ item.author }}</a>
          </div>
        </template>

        <!-- Colonne rating -->
        <template #item.rating="{ item }">
          <v-rating
            v-model="item.rating"
            density="compact"
            readonly
            color="warning"
          />
        </template>

        <!-- Colonne Créée -->
        <template #item.created_at="{ item }">
          <div>
            {{ formatDate(item.created_at) }}
          </div>
        </template>

        <!-- Colonne actions -->
        <template #item.actions="{ item }">
          <v-btn
            size="small"
            variant="text"
            @click="editQuote(item)"
            title="Éditer"
          >
            ✏️
          </v-btn>
          <v-btn
            size="small"
            variant="text"
            color="red"
            @click="deleteQuote(item.id)"
            title="Supprimer"
          >
            🗑️
          </v-btn>
        </template>

        <!-- État de chargement -->
        <template #loading>
          <v-skeleton-loader type="table-row@10" />
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog pour créer/éditer une citation -->
    <v-dialog v-model="dialogOpen" max-width="600px">
      <v-card>
        <v-card-title>
          {{ editingId ? 'Éditer la citation' : 'Ajouter une citation' }}
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveQuote">
            <v-textarea
              v-model="formData.text"
              label="Texte de la citation"
              required
              counter
              maxlength="1000"
              rows="4"
            />
            <v-text-field
              v-model="formData.author"
              label="Auteur"
              class="mt-4"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogOpen = false">Annuler</v-btn>
          <v-btn color="primary" variant="flat" @click="saveQuote">
            {{ editingId ? 'Mettre à jour' : 'Ajouter' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Notification -->
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
const formData = ref({ text: '', author: '' })

console.log('page', page.value);
console.log('limit', limit.value);
console.log('total', total.value);
console.log('loading', loading.value);


const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
})

const headers = [
  { title: '#', key: 'id', width: '10%' },
  { title: 'Citation', key: 'text', width: '30%' },
  { title: 'Auteur', key: 'author', width: '20%' },
  { title: 'Vues', key: 'nb_views', width: '10%' },
  { title: 'Note', key: 'rating', width: '10%' },
  { title: 'Créée', key: 'created_at', width: '10%' },
  { title: 'Actions', key: 'actions', sortable: false, width: '10%' },
]

async function fetchQuotes(pageNum?: number) {
  console.log('fetchQuotes called with pageNum:', pageNum)
  loading.value = true
  try {
    // Charger TOUTES les citations (pas de pagination serveur)
    const response = await axios.get('/api/admin/quotes', {
      params: { limit: 1000 },  // Large limit pour avoir toutes les données
    })
    console.log('Fetched quotes:', response.data)
    quotes.value = response.data.data
    total.value = parseInt(response.data.total)
    console.log('✓ Loaded all quotes:', {
      itemsCount: quotes.value.length,
      total: total.value,
    })
  } catch (err) {
    console.error('Error fetching quotes:', err)
    showSnackbar('Erreur lors du chargement des citations', 'error')
  } finally {
    loading.value = false
  }
}

function openCreateDialog() {
  editingId.value = null
  formData.value = { text: '', author: '' }
  dialogOpen.value = true
}

function editQuote(quote: Quote) {
  editingId.value = quote.id
  formData.value = { text: quote.text, author: quote.author }
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
  return `${day}-${month}-${year}`
}

onMounted(() => {
  fetchQuotes()
})
</script>

<style scoped>
.quotes-view {
  width: 100%;
}
</style>
