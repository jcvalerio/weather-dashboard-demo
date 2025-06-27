import { describe, it, expect } from 'vitest'
import { formatTemperature, formatSpeed, formatPressure, formatPercentage, formatNumber } from '@/lib/utils/format'

describe('Format Utilities', () => {
  describe('formatTemperature', () => {
    it('should format temperature with Celsius by default', () => {
      expect(formatTemperature(72)).toBe('72°C')
      expect(formatTemperature(32)).toBe('32°C')
      expect(formatTemperature(0)).toBe('0°C')
    })

    it('should format temperature with Fahrenheit when specified', () => {
      expect(formatTemperature(20, 'F')).toBe('20°F')
      expect(formatTemperature(0, 'F')).toBe('0°F')
      expect(formatTemperature(-10, 'F')).toBe('-10°F')
    })

    it('should round temperature to nearest integer', () => {
      expect(formatTemperature(72.7)).toBe('73°C')
      expect(formatTemperature(72.3)).toBe('72°C')
      expect(formatTemperature(72.5)).toBe('73°C')
    })

    it('should handle undefined values', () => {
      expect(formatTemperature(undefined as any)).toBe('--°C')
      expect(formatTemperature(undefined as any, 'F')).toBe('--°F')
    })

    it('should handle null values', () => {
      expect(formatTemperature(null as any)).toBe('--°C')
    })
  })

  describe('formatSpeed', () => {
    it('should format speed in km/h by default', () => {
      expect(formatSpeed(10)).toBe('10 km/h')
      expect(formatSpeed(25.5)).toBe('26 km/h')
      expect(formatSpeed(0)).toBe('0 km/h')
    })

    it('should format speed in mph when specified', () => {
      expect(formatSpeed(10, 'mph')).toBe('22 mph')
      expect(formatSpeed(25.5, 'mph')).toBe('57 mph')
    })

    it('should format speed in m/s when specified', () => {
      expect(formatSpeed(10, 'ms')).toBe('10 m/s')
      expect(formatSpeed(25.5, 'ms')).toBe('26 m/s')
    })

    it('should handle undefined values', () => {
      expect(formatSpeed(undefined as any)).toBe('-- km/h')
      expect(formatSpeed(undefined as any, 'mph')).toBe('-- mph')
      expect(formatSpeed(undefined as any, 'ms')).toBe('-- m/s')
    })
  })

  describe('formatPressure', () => {
    it('should format pressure in hPa by default', () => {
      expect(formatPressure(1013)).toBe('1013 hPa')
      expect(formatPressure(1000)).toBe('1000 hPa')
      expect(formatPressure(1025.5)).toBe('1026 hPa')
    })

    it('should format pressure in inHg when specified', () => {
      expect(formatPressure(1013, 'inhg')).toBe('29.91 inHg')
      expect(formatPressure(1000, 'inhg')).toBe('29.53 inHg')
    })

    it('should handle undefined values', () => {
      expect(formatPressure(undefined as any)).toBe('-- hPa')
      expect(formatPressure(undefined as any, 'inhg')).toBe('-- inHg')
    })
  })

  describe('formatPercentage', () => {
    it('should format percentage values', () => {
      expect(formatPercentage(50)).toBe('50%')
      expect(formatPercentage(0)).toBe('0%')
      expect(formatPercentage(100)).toBe('100%')
      expect(formatPercentage(75.5)).toBe('76%')
    })

    it('should handle undefined values', () => {
      expect(formatPercentage(undefined as any)).toBe('--%')
    })
  })

  describe('formatNumber', () => {
    it('should format numbers with default precision', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1000000)).toBe('1,000,000')
      expect(formatNumber(12345)).toBe('12,345')
    })

    it('should format numbers with specified decimals', () => {
      expect(formatNumber(12345.6789, 2)).toBe('12,345.68')
      expect(formatNumber(1000.5, 1)).toBe('1,000.5')
      expect(formatNumber(999.99, 0)).toBe('1,000')
    })

    it('should handle small numbers', () => {
      expect(formatNumber(0)).toBe('0')
      expect(formatNumber(999)).toBe('999')
      expect(formatNumber(-1000)).toBe('-1,000')
    })

    it('should handle undefined values', () => {
      expect(formatNumber(undefined as any)).toBe('--')
    })
  })
})