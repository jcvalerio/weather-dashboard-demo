import { http, HttpResponse } from 'msw'
import { createMockWeatherData, createMockEnergyData, createMockLocationSearchResults } from '../factories'

export const handlers = [
  // Weather API
  http.get('/api/weather', ({ request }) => {
    const url = new URL(request.url)
    const lat = url.searchParams.get('lat')
    const lon = url.searchParams.get('lon')
    
    if (!lat || !lon) {
      return HttpResponse.json(
        { error: 'Missing latitude or longitude' },
        { status: 400 }
      )
    }
    
    return HttpResponse.json(createMockWeatherData())
  }),

  // Weather search API
  http.get('/api/weather/search', ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q')
    
    if (!query) {
      return HttpResponse.json(
        { error: 'Missing search query' },
        { status: 400 }
      )
    }
    
    const results = createMockLocationSearchResults()
    const filtered = results.filter(location =>
      location.name.toLowerCase().includes(query.toLowerCase())
    )
    
    return HttpResponse.json(filtered)
  }),

  // Energy API
  http.get('/api/energy', ({ request }) => {
    const url = new URL(request.url)
    const lat = url.searchParams.get('lat')
    const lon = url.searchParams.get('lon')
    
    if (!lat || !lon) {
      return HttpResponse.json(
        { error: 'Missing latitude or longitude' },
        { status: 400 }
      )
    }
    
    return HttpResponse.json(createMockEnergyData())
  }),
]