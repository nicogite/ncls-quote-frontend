import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import axios from 'axios'

interface AdminUser {
  id?: number
  email: string
}

function decodeJwt(token: string): { sub?: number; email?: string } | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
    return JSON.parse(atob(padded))
  } catch {
    return null
  }
}

function userFromToken(token: string | null): AdminUser | null {
  if (!token) return null
  const payload = decodeJwt(token)
  if (!payload?.email) return null
  return { id: payload.sub, email: payload.email }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('admin_token'))
  const user = ref<AdminUser | null>(userFromToken(token.value))

  if (token.value) {
    axios.defaults.headers.common.Authorization = `Bearer ${token.value}`
  }

  const displayName = computed(() => {
    const email = user.value?.email
    if (!email) return 'administrateur'
    const local = email.split('@')[0] ?? email
    return local
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ')
  })

  function setToken(t: string | null) {
    token.value = t
    user.value = userFromToken(t)
    if (t) {
      localStorage.setItem('admin_token', t)
      axios.defaults.headers.common.Authorization = `Bearer ${t}`
    } else {
      localStorage.removeItem('admin_token')
      delete axios.defaults.headers.common.Authorization
    }
  }

  async function login(credentials: { email: string; password: string }) {
    const res = await axios.post('/api/admin/login', credentials)
    setToken(res.data.token)
    if (res.data.user) user.value = res.data.user
    return res
  }

  function logout() {
    setToken(null)
  }

  const isAuthenticated = () => !!token.value

  return { token, user, displayName, setToken, login, logout, isAuthenticated }
})