import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocationStore } from '@/lib/store/location-store'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  length: 0,
  key: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('Location Store', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
    // Reset the store state
    const { result } = renderHook(() => useLocationStore())
    act(() => {
      result.current.clearLocation()
    })
  })

  it('should have initial state', () => {
    const { result } = renderHook(() => useLocationStore())
    
    expect(result.current.coordinates).toBe(null)
    expect(result.current.locationName).toBe(null)
  })

  it('should set location with coordinates', () => {
    const { result } = renderHook(() => useLocationStore())
    
    const mockCoordinates = {
      lat: 37.7749,
      lon: -122.4194,
    }

    act(() => {
      result.current.setLocation(mockCoordinates, 'San Francisco')
    })

    expect(result.current.coordinates).toEqual(mockCoordinates)
    expect(result.current.locationName).toBe('San Francisco')
  })

  it('should set location without name', () => {
    const { result } = renderHook(() => useLocationStore())
    
    const mockCoordinates = {
      lat: 40.7128,
      lon: -74.0060,
    }

    act(() => {
      result.current.setLocation(mockCoordinates)
    })

    expect(result.current.coordinates).toEqual(mockCoordinates)
    expect(result.current.locationName).toBe(null)
  })

  it('should clear location', () => {
    const { result } = renderHook(() => useLocationStore())
    
    const mockCoordinates = {
      lat: 37.7749,
      lon: -122.4194,
    }

    act(() => {
      result.current.setLocation(mockCoordinates, 'Test Location')
    })

    expect(result.current.coordinates).toEqual(mockCoordinates)
    expect(result.current.locationName).toBe('Test Location')

    act(() => {
      result.current.clearLocation()
    })

    expect(result.current.coordinates).toBe(null)
    expect(result.current.locationName).toBe(null)
  })

  it('should persist state across multiple hook instances', () => {
    const { result: result1 } = renderHook(() => useLocationStore())
    const { result: result2 } = renderHook(() => useLocationStore())
    
    const mockCoordinates = {
      lat: 51.5074,
      lon: -0.1278,
    }

    act(() => {
      result1.current.setLocation(mockCoordinates, 'London')
    })

    // Both instances should have the same state
    expect(result1.current.coordinates).toEqual(mockCoordinates)
    expect(result1.current.locationName).toBe('London')
    expect(result2.current.coordinates).toEqual(mockCoordinates)
    expect(result2.current.locationName).toBe('London')
  })

  it('should handle coordinate updates', () => {
    const { result } = renderHook(() => useLocationStore())
    
    const firstCoordinates = {
      lat: 35.6762,
      lon: 139.6503,
    }

    const secondCoordinates = {
      lat: 48.8566,
      lon: 2.3522,
    }

    act(() => {
      result.current.setLocation(firstCoordinates, 'Tokyo')
    })

    expect(result.current.coordinates).toEqual(firstCoordinates)
    expect(result.current.locationName).toBe('Tokyo')

    act(() => {
      result.current.setLocation(secondCoordinates, 'Paris')
    })

    expect(result.current.coordinates).toEqual(secondCoordinates)
    expect(result.current.locationName).toBe('Paris')
  })
})