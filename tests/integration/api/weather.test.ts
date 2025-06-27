import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from '@/app/api/weather/route'
import { NextRequest } from 'next/server'

// Mock the environment variables
vi.mock('@/lib/constants/api', () => ({
  WEATHER_API_KEY: 'test-api-key',
  WEATHER_API_URL: 'https://api.openweathermap.org/data/2.5',
}))

describe('Weather API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return weather data for valid coordinates', async () => {
    const url = 'http://localhost:3000/api/weather?lat=37.7749&lon=-122.4194'
    const request = new NextRequest(url)

    // Mock fetch response
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        coord: { lon: -122.4194, lat: 37.7749 },
        weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
        main: {
          temp: 72,
          feels_like: 68,
          temp_min: 65,
          temp_max: 78,
          pressure: 1013,
          humidity: 65,
        },
        wind: { speed: 12, deg: 270 },
        clouds: { all: 0 },
        dt: 1633093200,
        sys: {
          type: 2,
          id: 2012516,
          country: 'US',
          sunrise: 1633091820,
          sunset: 1633134480,
        },
        timezone: -25200,
        id: 5391959,
        name: 'San Francisco',
        cod: 200,
      }),
    })

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('coord')
    expect(data).toHaveProperty('weather')
    expect(data).toHaveProperty('main')
    expect(data.name).toBe('San Francisco')
  })

  it('should return 400 for missing latitude', async () => {
    const url = 'http://localhost:3000/api/weather?lon=-122.4194'
    const request = new NextRequest(url)

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toBe('Latitude and longitude are required')
  })

  it('should return 400 for missing longitude', async () => {
    const url = 'http://localhost:3000/api/weather?lat=37.7749'
    const request = new NextRequest(url)

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toBe('Latitude and longitude are required')
  })

  it('should return mock data when API key is missing', async () => {
    // Mock missing API key
    vi.doMock('@/lib/constants/api', () => ({
      WEATHER_API_KEY: '',
      WEATHER_API_URL: 'https://api.openweathermap.org/data/2.5',
    }))

    const url = 'http://localhost:3000/api/weather?lat=37.7749&lon=-122.4194'
    const request = new NextRequest(url)

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('coord')
    expect(data).toHaveProperty('weather')
    expect(data).toHaveProperty('main')
    // Mock data should be returned
    expect(data.base).toBe('mock')
  })

  it('should handle API errors gracefully', async () => {
    const url = 'http://localhost:3000/api/weather?lat=37.7749&lon=-122.4194'
    const request = new NextRequest(url)

    // Mock fetch error
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toHaveProperty('error')
    expect(data.error).toBe('Failed to fetch weather data')
  })

  it('should handle non-OK responses from weather API', async () => {
    const url = 'http://localhost:3000/api/weather?lat=37.7749&lon=-122.4194'
    const request = new NextRequest(url)

    // Mock non-OK response
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    })

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data).toHaveProperty('error')
    expect(data.error).toBe('Failed to fetch weather data')
  })
})