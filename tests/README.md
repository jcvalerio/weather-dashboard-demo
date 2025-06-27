# Testing Guide

This project uses a comprehensive testing strategy with unit, integration, and end-to-end tests.

## Test Structure

```
tests/
├── unit/                    # Unit tests for components, hooks, utils, stores
│   ├── components/         # Component tests
│   ├── hooks/             # Custom hook tests
│   ├── utils/             # Utility function tests
│   └── store/             # Store tests
├── integration/            # Integration tests
│   └── api/               # API route tests
├── e2e/                    # End-to-end tests with Playwright
├── factories/              # Test data factories
├── mocks/                  # MSW handlers and server setup
├── setup.ts                # Test setup file
├── test-utils.tsx          # Custom render functions and utilities
└── README.md              # This file
```

## Running Tests

### Unit and Integration Tests (Vitest)

```bash
# Run all unit/integration tests
npm run test

# Run tests in UI mode
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run a specific test file
npm run test path/to/test.test.ts

# Run tests in watch mode for a specific file
npm run test -- --watch path/to/test.test.ts
```

### End-to-End Tests (Playwright)

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run all E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui

# Run E2E tests in debug mode
npm run test:e2e:debug

# Run E2E tests for a specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run All Tests

```bash
npm run test:all
```

## Writing Tests

### Unit Tests

Use the custom render function from `test-utils.tsx` that includes all providers:

```typescript
import { render, screen } from '@/tests/test-utils'
import { MyComponent } from '@/components/my-component'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Testing Hooks

```typescript
import { renderHook, act } from '@testing-library/react'
import { useMyHook } from '@/lib/hooks/use-my-hook'

describe('useMyHook', () => {
  it('should update state', () => {
    const { result } = renderHook(() => useMyHook())
    
    act(() => {
      result.current.updateValue('new value')
    })
    
    expect(result.current.value).toBe('new value')
  })
})
```

### API Testing with MSW

MSW is configured to mock API responses during tests:

```typescript
import { server } from '@/tests/mocks/server'
import { http, HttpResponse } from 'msw'

// Override a handler for a specific test
server.use(
  http.get('/api/weather', () => {
    return HttpResponse.json({ error: 'Test error' }, { status: 500 })
  })
)
```

### E2E Tests

```typescript
import { test, expect } from '@playwright/test'

test('user can search for weather', async ({ page }) => {
  await page.goto('/')
  
  const searchInput = page.getByPlaceholder(/Search for a location/i)
  await searchInput.fill('San Francisco')
  
  await page.getByRole('option').first().click()
  
  await expect(page.getByText(/Current Weather/i)).toBeVisible()
})
```

## Test Data Factories

Use factories to create consistent test data:

```typescript
import { createMockWeatherData, createMockEnergyData } from '@/tests/factories'

const weatherData = createMockWeatherData({
  name: 'Test City',
  main: { temp: 75 }
})
```

## Coverage Thresholds

The project maintains the following coverage thresholds:
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

View coverage report:
```bash
npm run test:coverage
# Open coverage/index.html in browser
```

## TDD Workflow

1. **Write a failing test**: Start by writing a test that describes the desired behavior
2. **Run the test**: Verify it fails for the expected reason
3. **Write minimal code**: Implement just enough to make the test pass
4. **Refactor**: Clean up the code while keeping tests green
5. **Repeat**: Continue with the next test

## Best Practices

1. **Test behavior, not implementation**: Focus on what the component/function does, not how
2. **Use descriptive test names**: Tests should read like documentation
3. **Keep tests isolated**: Each test should be independent
4. **Use factories for test data**: Maintain consistency and reduce boilerplate
5. **Test edge cases**: Don't just test the happy path
6. **Mock external dependencies**: Use MSW for API calls, mock timers, etc.
7. **Follow AAA pattern**: Arrange, Act, Assert

## Debugging Tests

### Vitest
- Use `test.only()` to run a single test
- Add `console.log()` statements
- Use the UI mode for interactive debugging

### Playwright
- Use `page.pause()` to pause execution
- Use the UI mode to see tests run
- Use `--debug` flag for step-by-step debugging
- Take screenshots: `await page.screenshot({ path: 'debug.png' })`

## CI/CD Integration

Tests are automatically run in CI/CD pipelines. See `.github/workflows/` for configuration.