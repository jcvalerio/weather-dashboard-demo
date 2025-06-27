import { test, expect } from '@playwright/test'

test.describe('Weather Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the weather dashboard', async ({ page }) => {
    // Check if the main heading is visible
    await expect(page.getByRole('heading', { name: /Weather Intelligence Dashboard/i })).toBeVisible()
    
    // Check if location picker is visible
    await expect(page.getByPlaceholder(/Search for a location/i)).toBeVisible()
  })

  test('should search for and select a location', async ({ page }) => {
    // Click on the location search input
    const searchInput = page.getByPlaceholder(/Search for a location/i)
    await searchInput.click()
    await searchInput.fill('San Francisco')
    
    // Wait for search results
    await page.waitForTimeout(500) // Wait for debounce
    
    // Check if results appear
    const firstResult = page.getByRole('option').first()
    await expect(firstResult).toBeVisible()
    
    // Click on the first result
    await firstResult.click()
    
    // Check if weather data is displayed
    await expect(page.getByText(/Current Weather/i)).toBeVisible()
    await expect(page.getByTestId('temperature')).toBeVisible()
  })

  test('should display current weather information', async ({ page }) => {
    // First select a location
    const searchInput = page.getByPlaceholder(/Search for a location/i)
    await searchInput.click()
    await searchInput.fill('San Francisco')
    await page.waitForTimeout(500)
    await page.getByRole('option').first().click()
    
    // Check weather information elements
    await expect(page.getByText(/Temperature/i)).toBeVisible()
    await expect(page.getByText(/Feels Like/i)).toBeVisible()
    await expect(page.getByText(/Humidity/i)).toBeVisible()
    await expect(page.getByText(/Wind Speed/i)).toBeVisible()
    await expect(page.getByText(/Pressure/i)).toBeVisible()
    await expect(page.getByText(/UV Index/i)).toBeVisible()
  })

  test('should display hourly forecast', async ({ page }) => {
    // Select a location first
    const searchInput = page.getByPlaceholder(/Search for a location/i)
    await searchInput.click()
    await searchInput.fill('New York')
    await page.waitForTimeout(500)
    await page.getByRole('option').first().click()
    
    // Check if hourly forecast section is visible
    await expect(page.getByText(/24-Hour Forecast/i)).toBeVisible()
    
    // Check if chart is rendered
    const chartContainer = page.locator('.recharts-wrapper')
    await expect(chartContainer).toBeVisible()
  })

  test('should display weekly forecast', async ({ page }) => {
    // Select a location first
    const searchInput = page.getByPlaceholder(/Search for a location/i)
    await searchInput.click()
    await searchInput.fill('London')
    await page.waitForTimeout(500)
    await page.getByRole('option').first().click()
    
    // Check if weekly forecast section is visible
    await expect(page.getByText(/7-Day Forecast/i)).toBeVisible()
    
    // Check if forecast cards are displayed
    const forecastCards = page.locator('[data-testid="forecast-card"]')
    await expect(forecastCards).toHaveCount(7)
  })

  test('should display energy demand chart', async ({ page }) => {
    // Select a location first
    const searchInput = page.getByPlaceholder(/Search for a location/i)
    await searchInput.click()
    await searchInput.fill('Tokyo')
    await page.waitForTimeout(500)
    await page.getByRole('option').first().click()
    
    // Check if energy section is visible
    await expect(page.getByText(/Energy Demand Forecast/i)).toBeVisible()
    
    // Check if energy metrics are displayed
    await expect(page.getByText(/Current Demand/i)).toBeVisible()
    await expect(page.getByText(/Renewable/i)).toBeVisible()
    await expect(page.getByText(/Efficiency Score/i)).toBeVisible()
  })

  test('should handle location search errors gracefully', async ({ page }) => {
    // Try searching with empty input
    const searchInput = page.getByPlaceholder(/Search for a location/i)
    await searchInput.click()
    await searchInput.fill(' ')
    await page.waitForTimeout(500)
    
    // Should show appropriate message
    await expect(page.getByText(/Type to search for a location/i)).toBeVisible()
  })

  test('should persist location selection on page reload', async ({ page }) => {
    // Select a location
    const searchInput = page.getByPlaceholder(/Search for a location/i)
    await searchInput.click()
    await searchInput.fill('San Francisco')
    await page.waitForTimeout(500)
    await page.getByRole('option').first().click()
    
    // Wait for weather data to load
    await expect(page.getByText(/Current Weather/i)).toBeVisible()
    
    // Reload the page
    await page.reload()
    
    // Check if location is still selected
    await expect(page.getByText(/San Francisco/i)).toBeVisible()
    await expect(page.getByText(/Current Weather/i)).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check if layout adapts
    await expect(page.getByRole('heading', { name: /Weather Intelligence Dashboard/i })).toBeVisible()
    
    // Navigation should be mobile-friendly
    const searchInput = page.getByPlaceholder(/Search for a location/i)
    await expect(searchInput).toBeVisible()
    
    // Select a location
    await searchInput.click()
    await searchInput.fill('London')
    await page.waitForTimeout(500)
    await page.getByRole('option').first().click()
    
    // Check if content is still accessible on mobile
    await expect(page.getByText(/Current Weather/i)).toBeVisible()
  })

  test('should handle API errors gracefully', async ({ page, context }) => {
    // Block the weather API to simulate an error
    await context.route('**/api/weather*', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      })
    })
    
    // Try to select a location
    const searchInput = page.getByPlaceholder(/Search for a location/i)
    await searchInput.click()
    await searchInput.fill('Paris')
    await page.waitForTimeout(500)
    await page.getByRole('option').first().click()
    
    // Should show error message
    await expect(page.getByText(/Failed to load weather data/i)).toBeVisible()
  })
})