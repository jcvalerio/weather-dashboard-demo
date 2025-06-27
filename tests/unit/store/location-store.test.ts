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
      result.current.setSelectedLocation(null)
    })
  })

  it('should have initial state', () => {
    const { result } = renderHook(() => useLocationStore())
    
    expect(result.current.selectedLocation).toBe(null)
    expect(result.current.isLoading).toBe(false)
  })

  it('should set selected location', () => {
    const { result } = renderHook(() => useLocationStore())
    
    const mockLocation = {
      id: 'san-francisco-ca-us',
      name: 'San Francisco',
      region: 'California',
      country: 'United States',
      lat: 37.7749,
      lon: -122.4194,
      display_name: 'San Francisco, California, United States',
    }

    act(() => {
      result.current.setSelectedLocation(mockLocation)
    })

    expect(result.current.selectedLocation).toEqual(mockLocation)
  })

  it('should set loading state', () => {
    const { result } = renderHook(() => useLocationStore())
    
    expect(result.current.isLoading).toBe(false)

    act(() => {
      result.current.setLoading(true)
    })

    expect(result.current.isLoading).toBe(true)

    act(() => {
      result.current.setLoading(false)
    })

    expect(result.current.isLoading).toBe(false)
  })

  it('should clear location', () => {
    const { result } = renderHook(() => useLocationStore())
    
    const mockLocation = {
      id: 'test-location',
      name: 'Test Location',
      region: 'Test Region',
      country: 'Test Country',
      lat: 0,
      lon: 0,
      display_name: 'Test Location, Test Region, Test Country',
    }

    act(() => {
      result.current.setSelectedLocation(mockLocation)
    })

    expect(result.current.selectedLocation).toEqual(mockLocation)

    act(() => {
      result.current.setSelectedLocation(null)
    })

    expect(result.current.selectedLocation).toBe(null)
  })

  it('should persist state across multiple hook instances', () => {
    const { result: result1 } = renderHook(() => useLocationStore())
    const { result: result2 } = renderHook(() => useLocationStore())
    
    const mockLocation = {
      id: 'london-gb',
      name: 'London',
      region: 'England',
      country: 'United Kingdom',
      lat: 51.5074,
      lon: -0.1278,
      display_name: 'London, England, United Kingdom',
    }

    act(() => {
      result1.current.setSelectedLocation(mockLocation)
    })

    // Both instances should have the same state
    expect(result1.current.selectedLocation).toEqual(mockLocation)
    expect(result2.current.selectedLocation).toEqual(mockLocation)
  })

  it('should handle loading state independently', () => {
    const { result } = renderHook(() => useLocationStore())
    
    const mockLocation = {
      id: 'tokyo-jp',
      name: 'Tokyo',
      region: 'Tokyo',
      country: 'Japan',
      lat: 35.6762,
      lon: 139.6503,
      display_name: 'Tokyo, Tokyo, Japan',
    }

    act(() => {
      result.current.setLoading(true)
      result.current.setSelectedLocation(mockLocation)
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.selectedLocation).toEqual(mockLocation)

    act(() => {
      result.current.setLoading(false)
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.selectedLocation).toEqual(mockLocation)
  })
})