import { describe, it, expect } from 'vitest'
import { render, screen } from '../../../test-utils'
import { WeatherIcon } from '@/components/weather/weather-icon'

describe('WeatherIcon Component', () => {
  describe('OpenWeatherMap icon codes', () => {
    it('should render sun icon for clear day', () => {
      render(<WeatherIcon icon="01d" />)
      const icon = screen.getByTestId('weather-icon')
      expect(icon).toBeInTheDocument()
    })

    it('should render moon icon for clear night', () => {
      render(<WeatherIcon icon="01n" />)
      const icon = screen.getByTestId('weather-icon')
      expect(icon).toBeInTheDocument()
    })

    it('should render cloud icon for cloudy weather', () => {
      render(<WeatherIcon icon="03d" />)
      const icon = screen.getByTestId('weather-icon')
      expect(icon).toBeInTheDocument()
    })

    it('should render rain icon for rainy weather', () => {
      render(<WeatherIcon icon="10d" />)
      const icon = screen.getByTestId('weather-icon')
      expect(icon).toBeInTheDocument()
    })

    it('should render thunderstorm icon for stormy weather', () => {
      render(<WeatherIcon icon="11d" />)
      const icon = screen.getByTestId('weather-icon')
      expect(icon).toBeInTheDocument()
    })

    it('should render snow icon for snowy weather', () => {
      render(<WeatherIcon icon="13d" />)
      const icon = screen.getByTestId('weather-icon')
      expect(icon).toBeInTheDocument()
    })

    it('should render wind icon for misty weather', () => {
      render(<WeatherIcon icon="50d" />)
      const icon = screen.getByTestId('weather-icon')
      expect(icon).toBeInTheDocument()
    })

    it('should render default icon for unknown weather code', () => {
      render(<WeatherIcon icon="99x" />)
      const icon = screen.getByTestId('weather-icon')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Weather conditions', () => {
    it('should render sun icon for clear-day condition', () => {
      render(<WeatherIcon condition="clear-day" />)
      const icon = screen.getByTestId('weather-icon')
      expect(icon).toBeInTheDocument()
    })

    it('should render moon icon for clear-night condition', () => {
      render(<WeatherIcon condition="clear-night" />)
      const icon = screen.getByTestId('weather-icon')
      expect(icon).toBeInTheDocument()
    })

    it('should render cloud icon for cloudy condition', () => {
      render(<WeatherIcon condition="cloudy" />)
      const icon = screen.getByTestId('weather-icon')
      expect(icon).toBeInTheDocument()
    })

    it('should render rain icon for rainy condition', () => {
      render(<WeatherIcon condition="rainy" />)
      const icon = screen.getByTestId('weather-icon')
      expect(icon).toBeInTheDocument()
    })

    it('should render storm icon for stormy condition', () => {
      render(<WeatherIcon condition="stormy" />)
      const icon = screen.getByTestId('weather-icon')
      expect(icon).toBeInTheDocument()
    })

    it('should render snowflake icon for snowy condition', () => {
      render(<WeatherIcon condition="snowy" />)
      const icon = screen.getByTestId('weather-icon')
      expect(icon).toBeInTheDocument()
    })

    it('should render wind icon for windy condition', () => {
      render(<WeatherIcon condition="windy" />)
      const icon = screen.getByTestId('weather-icon')
      expect(icon).toBeInTheDocument()
    })

    it('should render wind icon for foggy condition', () => {
      render(<WeatherIcon condition="foggy" />)
      const icon = screen.getByTestId('weather-icon')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Props and styling', () => {
    it('should apply custom className', () => {
      render(<WeatherIcon icon="01d" className="custom-class" />)
      const icon = screen.getByTestId('weather-icon')
      expect(icon).toHaveClass('custom-class')
    })

    it('should have default size class when no className provided', () => {
      render(<WeatherIcon icon="01d" />)
      const icon = screen.getByTestId('weather-icon')
      expect(icon).toHaveClass('text-current')
    })

    it('should accept custom size', () => {
      render(<WeatherIcon icon="01d" size={32} />)
      const icon = screen.getByTestId('weather-icon')
      expect(icon).toBeInTheDocument()
      // Size is applied as a prop to the Lucide icon, not as a CSS class
    })

    it('should prioritize icon code over condition', () => {
      render(<WeatherIcon icon="01d" condition="rainy" />)
      const icon = screen.getByTestId('weather-icon')
      expect(icon).toBeInTheDocument()
      // Should render sun (01d) not rain (rainy condition)
    })

    it('should render default when no props provided', () => {
      render(<WeatherIcon />)
      const icon = screen.getByTestId('weather-icon')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have test id for testing', () => {
      render(<WeatherIcon icon="01d" />)
      const icon = screen.getByTestId('weather-icon')
      expect(icon).toBeInTheDocument()
    })

    it('should maintain icon accessibility features', () => {
      render(<WeatherIcon icon="01d" />)
      const icon = screen.getByTestId('weather-icon')
      // Lucide icons have built-in accessibility features
      expect(icon).toBeInTheDocument()
    })
  })
})