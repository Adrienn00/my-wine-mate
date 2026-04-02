const API_BASE = import.meta.env.VITE_API_BASE_URL

const client = {
  async request(path, options = {}) {
    const headers = options.headers || {}

    const token = localStorage.getItem('token')
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    if (!headers['Content-Type'] && options.body) {
      headers['Content-Type'] = 'application/json'
    }

    const response = await fetch(`${API_BASE}/${path}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      let message = `HTTP error: ${response.status}`
      try {
        const errData = await response.json()
        if (errData.error) {
          message = errData.error
        } else if (errData.message) {
          message = errData.message
        }
      } catch {
        // Keep default message when the backend error body is not JSON.
      }
      throw new Error(message)
    }

    if (response.status === 204) return null

    return response.json()
  },

  get(path) {
    return this.request(path, { method: 'GET' })
  },

  post(path, data) {
    return this.request(path, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  put(path, data) {
    const options = { method: 'PUT' }
    if (data !== undefined) options.body = JSON.stringify(data)
    return this.request(path, options)
  },

  delete(path) {
    return this.request(path, { method: 'DELETE' })
  },
}

export default client
