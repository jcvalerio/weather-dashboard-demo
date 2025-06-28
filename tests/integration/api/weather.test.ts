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

    // Mock fetch responses for both current weather and forecast
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
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
          visibility: 10000,
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
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          cod: '200',
          message: 0,
          cnt: 40,
          list: Array.from({ length: 40 }, (_, i) => ({
            dt: 1633093200 + i * 3600,
            main: { temp: 20 + i, humidity: 65 },
            weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
            wind: { speed: 5, deg: 270 },
            visibility: 10000,
            pop: 0,
            sys: { pod: 'd' },
            dt_txt: new Date(1633093200000 + i * 3600000).toISOString(),
          })),
          city: {
            id: 5391959,
            name: 'San Francisco',
            coord: { lat: 37.7749, lon: -122.4194 },
            country: 'US',
          },
        }),
      })

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    // Expect transformed WeatherData format
    expect(data).toHaveProperty('location')
    expect(data).toHaveProperty('current')
    expect(data).toHaveProperty('forecast')
    expect(data).toHaveProperty('lastUpdated')
    expect(data.location.city).toBe('San Francisco')
    expect(data.location.country).toBe('US')
    expect(data.current).toHaveProperty('temperature')
    expect(data.current).toHaveProperty('humidity')
    expect(data.forecast).toHaveProperty('hourly')
    expect(data.forecast).toHaveProperty('daily')
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
    // Mock the constants to return empty API key
    vi.doMock('@/lib/constants/api', () => ({
      WEATHER_API_KEY: '',
      WEATHER_API_URL: 'https://api.openweathermap.org/data/2.5',
    }))

    // Reset and re-import modules with empty API key
    vi.resetModules()
    const { GET } = await import('@/app/api/weather/route')

    const url = 'http://localhost:3000/api/weather?lat=37.7749&lon=-122.4194'
    const request = new NextRequest(url)

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    // Expect transformed WeatherData format for mock data
    expect(data).toHaveProperty('location')
    expect(data).toHaveProperty('current')
    expect(data).toHaveProperty('forecast')
    expect(data).toHaveProperty('lastUpdated')
    // Mock data should have San Francisco as default
    expect(data.location.city).toBe('San Francisco')
    expect(data.current).toHaveProperty('temperature')
    expect(data.forecast).toHaveProperty('hourly')
    expect(data.forecast).toHaveProperty('daily')
    
    // Restore the mock
    vi.doUnmock('@/lib/constants/api')
    vi.resetModules()
  })

  it('should handle API errors gracefully', async () => {
    const url = 'http://localhost:3000/api/weather?lat=37.7749&lon=-122.4194'
    const request = new NextRequest(url)

    // Mock fetch error - should fall back to mock data
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))

    const response = await GET(request)
    const data = await response.json()

    // Should return mock data when API fails
    expect(response.status).toBe(200)
    expect(data).toHaveProperty('location')
    expect(data).toHaveProperty('current')
    expect(data).toHaveProperty('forecast')
    expect(data.location.city).toBe('San Francisco')
  })

  it('should handle non-OK responses from weather API', async () => {
    const url = 'http://localhost:3000/api/weather?lat=37.7749&lon=-122.4194'
    const request = new NextRequest(url)

    // Mock non-OK response - should fall back to mock data
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    })

    const response = await GET(request)
    const data = await response.json()

    // Should return mock data when API returns non-OK
    expect(response.status).toBe(200)
    expect(data).toHaveProperty('location')
    expect(data).toHaveProperty('current')
    expect(data).toHaveProperty('forecast')
    expect(data.location.city).toBe('San Francisco')
  })
})