import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('admin_token'))
  const user = ref(null)

  function setToken(t: string | null) {
    token.value = t
    if (t) localStorage.setItem('admin_token', t)
    else localStorage.removeItem('admin_token')
    axios.defaults.headers.common.Authorization = t ? `Bearer ${t}` : ''
  }

  async function login(credentials: { email: string; password: string }) {
    console.log('Store : Attempting login with credentials:', credentials);
    const res = await axios.post('/api/admin/login', credentials)
    setToken(res.data.token)
    // optionnel : charger user
    return res
  }

  function logout() {
    setToken(null)
    user.value = null
  }

  const isAuthenticated = () => !!token.value

  // init axios header si token existant au chargement
  if (token.value) axios.defaults.headers.common.Authorization = `Bearer ${token.value}`

  return { token, user, setToken, login, logout, isAuthenticated }
})