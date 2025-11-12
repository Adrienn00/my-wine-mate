// src/stores/authStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_URL = 'http://localhost:3000/api/users' // módosítsd, ha kell

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchWithAuth(url, options = {}) {
    const headers = options.headers || {}
    if (token.value) headers.Authorization = `Bearer ${token.value}`
    const res = await fetch(url, { ...options, headers })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Request failed')
    return data
  }
  async function register(formData) {
    loading.value = true
    error.value = null
    console.log('➡️ [register] Sending data to backend:', formData)

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      console.log('⬅️ [register] Raw response:', res)

      const data = await res.json()
      console.log('⬅️ [register] Parsed response JSON:', data)

      if (!res.ok) throw new Error(data.message || 'Registration failed')

      token.value = data.token
      localStorage.setItem('token', token.value)
      await loadProfile()
    } catch (e) {
      console.error('❌ [register] Error:', e.message)
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function login({ email, password }) {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')

      // 💡 Token mentés
      token.value = data.token
      localStorage.setItem('token', token.value)

      // 💡 User azonnali beállítása (reaktivitás miatt)
      user.value = data

      // 💡 Profil betöltés háttérben — ha elhasal, nem dob ki
      try {
        await loadProfile()
      } catch (err) {
        console.warn('Profile load failed (nem gond):', err.message)
      }
    } catch (e) {
      console.error('❌ [login] Error:', e.message)
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function loadProfile() {
    if (!token.value) return
    loading.value = true
    try {
      const data = await fetchWithAuth(`${API_URL}/profile`)
      user.value = data
    } catch (e) {
      console.error('Profile load failed:', e.message)
      error.value = e.message // logout() helyett csak hiba
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(updatedData) {
    try {
      const data = await fetchWithAuth(`${API_URL}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      })
      user.value = data
      return data
    } catch (e) {
      error.value = e.message
      throw e
    }
  }

  async function deleteProfile() {
    try {
      await fetchWithAuth(`${API_URL}/profile`, { method: 'DELETE' })
      logout()
    } catch (e) {
      error.value = e.message
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  if (token.value) loadProfile()

  return {
    token,
    user,
    loading,
    error,
    login,
    register,
    loadProfile,
    updateProfile,
    deleteProfile,
    logout,
  }
})
