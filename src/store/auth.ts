import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('admin_token'))
  const user = ref(null)

  // Initialiser l'header Authorization au chargement
  if (token.value) {
    axios.defaults.headers.common.Authorization = `Bearer ${token.value}`
  }

  function setToken(t: string | null) {
    token.value = t
    if (t) {
      localStorage.setItem('admin_token', t)
      axios.defaults.headers.common.Authorization = `Bearer ${t}`
    } else {
      localStorage.removeItem('admin_token')
      delete axios.defaults.headers.common.Authorization
    }
    console.log('Token set:', t ? '✓ Token stored' : '✗ Token cleared')
  }

  async function login(credentials: { email: string; password: string }) {
    console.log('Store: Attempting login with credentials:', credentials)
    try {
      const res = await axios.post('/api/admin/login', credentials)
      console.log('Login response:', res.data)
      setToken(res.data.token)
      return res
    } catch (err) {
      console.error('Login error:', err)
      throw err
    }
  }

  function logout() {
    setToken(null)
    user.value = null
  }

  const isAuthenticated = () => {
    const auth = !!token.value
    console.log('isAuthenticated:', auth, 'token:', token.value ? '✓ exists' : '✗ null')
    return auth
  }

  return { token, user, setToken, login, logout, isAuthenticated }
})