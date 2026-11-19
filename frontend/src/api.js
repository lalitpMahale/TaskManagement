const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const payload = await response.json()
  if (!response.ok) {
    throw new Error(payload.message || `Request failed (${response.status})`)
  }

  return payload
}
