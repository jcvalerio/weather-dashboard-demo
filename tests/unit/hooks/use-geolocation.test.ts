import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGeolocation } from '@/lib/hooks/use-geolocation'

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
  watchPosition: vi.fn(),
  clearWatch: vi.fn(),
}

Object.defineProperty(global, 'navigator', {
  value: {
    geolocation: mockGeolocation,
  },
  writable: true,
})

describe('useGeolocation Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should have initial state', () => {
    const { result } = renderHook(() => useGeolocation())
    
    expect(result.current.coordinates).toBe(null)
    expect(result.current.error).toBe(null)
    expect(result.current.loading).toBe(false)
    expect(result.current.isSupported).toBe(true)
  })

  it('should detect geolocation support', () => {
    const { result } = renderHook(() => useGeolocation())
    
    expect(result.current.isSupported).toBe(true)
  })

  it('should handle unsupported geolocation', () => {
    // Mock unsupported environment
    Object.defineProperty(global, 'navigator', {
      value: {},
      writable: true,
    })

    const { result } = renderHook(() => useGeolocation())
    
    expect(result.current.isSupported).toBe(false)
  })

  it('should handle successful geolocation', async () => {
    const mockPosition = {
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
    }

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition)
    })

    const { result } = renderHook(() => useGeolocation())

    act(() => {
      result.current.getCurrentPosition()
    })

    expect(result.current.coordinates).toEqual({
      lat: 37.7749,
      lon: -122.4194,
    })
    expect(result.current.error).toBe(null)
    expect(result.current.loading).toBe(false)
  })

  it('should handle geolocation errors', async () => {
    const mockError = {
      code: 1, // PERMISSION_DENIED
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    }

    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error(mockError)
    })

    const { result } = renderHook(() => useGeolocation())

    act(() => {
      result.current.getCurrentPosition()
    })

    expect(result.current.coordinates).toBe(null)
    expect(result.current.error).toBe('Geolocation permission denied')
    expect(result.current.loading).toBe(false)
  })

  it('should handle different error types', async () => {
    const timeoutError = {
      code: 3, // TIMEOUT
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    }

    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error(timeoutError)
    })

    const { result } = renderHook(() => useGeolocation())

    act(() => {
      result.current.getCurrentPosition()
    })

    expect(result.current.error).toBe('Location request timed out')
  })

  it('should use custom options', () => {
    const customOptions = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 600000,
    }

    renderHook(() => useGeolocation(customOptions))

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
      expect.objectContaining({
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 600000,
      })
    )
  })
})