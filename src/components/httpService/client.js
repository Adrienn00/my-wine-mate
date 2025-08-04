const API_BASE = import.meta.env.VITE_API_BASE_URL

const client = {
  async request(path, options = {}) {
    const response = await fetch(`${API_BASE}/${path}`, options)
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
    return response.json()
  },

  get(path) {
    return this.request(path, { method: 'GET' })
  },

  post(path, data) {
    return this.request(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  },
  put(path, data) {
    return this.request(path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  },
  delete(path) {
    return this.request(path, { method: 'DELETE' })
  },
}
export default client
