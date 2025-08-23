const API_BASE = 'http://localhost:8000/api/v1'

interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: this.getAuthHeaders(),
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'Request failed' }
      }

      return { data }
    } catch (error) {
      return { error: 'Network error' }
    }
  }

  // Authentication
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(userData: {
    email: string
    password: string
    name: string
    role: string
    phone: string
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  // Animals
  async getAnimals(params?: {
    owner_id?: string
    species?: string
    status?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.owner_id) searchParams.append('owner_id', params.owner_id)
    if (params?.species) searchParams.append('species', params.species)
    if (params?.status) searchParams.append('status', params.status)

    const query = searchParams.toString()
    return this.request(`/animals${query ? `?${query}` : ''}`)
  }

  async createAnimal(animalData: {
    name: string
    species: string
    breed: string
    dob: string
    weight: number
    location: string
  }) {
    return this.request('/animals', {
      method: 'POST',
      body: JSON.stringify(animalData),
    })
  }

  // Marketplace
  async getListings(params?: {
    seller_id?: string
    status?: string
    min_price?: string
    max_price?: string
    species?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.seller_id) searchParams.append('seller_id', params.seller_id)
    if (params?.status) searchParams.append('status', params.status)
    if (params?.min_price) searchParams.append('min_price', params.min_price)
    if (params?.max_price) searchParams.append('max_price', params.max_price)
    if (params?.species) searchParams.append('species', params.species)

    const query = searchParams.toString()
    return this.request(`/marketplace/listings${query ? `?${query}` : ''}`)
  }

  async createListing(listingData: {
    animal_id: string
    title: string
    description: string
    price: number
    location: string
  }) {
    return this.request('/marketplace/listings', {
      method: 'POST',
      body: JSON.stringify(listingData),
    })
  }

  // IoT Metrics
  async getIotMetrics(params?: {
    animal_id?: string
    limit?: string
  }) {
    const searchParams = new URLSearchParams()
    if (params?.animal_id) searchParams.append('animal_id', params.animal_id)
    if (params?.limit) searchParams.append('limit', params.limit)

    const query = searchParams.toString()
    return this.request(`/iot/metrics${query ? `?${query}` : ''}`)
  }

  async createIotMetrics(animalId: string) {
    return this.request('/iot/metrics', {
      method: 'POST',
      body: JSON.stringify({ animal_id: animalId }),
    })
  }

  async updateIotMetrics(animalId: string) {
    return this.request(`/iot/metrics?animal_id=${animalId}`, {
      method: 'PUT',
    })
  }

  // Analytics
  async getAnalytics() {
    return this.request('/analytics/dashboard')
  }
}

export const apiService = new ApiService()
