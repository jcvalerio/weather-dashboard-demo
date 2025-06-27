import { describe, it, expect } from 'vitest'
import { render, screen } from '@/tests/test-utils'
import { WeatherIcon } from '@/components/weather/weather-icon'

describe('WeatherIcon Component', () => {
  it('should render sun icon for clear day', () => {
    render(<WeatherIcon icon="01d" className="test-class" />)
    const icon = screen.getByTestId('weather-icon')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveClass('test-class')
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

  it('should render snow icon for snowy weather', () => {
    render(<WeatherIcon icon="13d" />)
    const icon = screen.getByTestId('weather-icon')
    expect(icon).toBeInTheDocument()
  })

  it('should render default icon for unknown weather code', () => {
    render(<WeatherIcon icon="99x" />)
    const icon = screen.getByTestId('weather-icon')
    expect(icon).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(<WeatherIcon icon="01d" className="custom-class" />)
    const icon = screen.getByTestId('weather-icon')
    expect(icon).toHaveClass('custom-class')
  })

  it('should have default size class when no className provided', () => {
    render(<WeatherIcon icon="01d" />)
    const icon = screen.getByTestId('weather-icon')
    expect(icon).toHaveClass('h-6', 'w-6')
  })
})