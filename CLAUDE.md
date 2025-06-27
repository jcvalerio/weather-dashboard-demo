# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev          # Start development server with Turbopack on port 3000
npm run build        # Build for production
npm run start        # Start production server
```

### Code Quality
```bash
npm run lint         # Run ESLint checks
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # Run TypeScript compiler checks
```

### Testing
```bash
npm run test         # Run Vitest unit tests
npm run test:ui      # Run Vitest in UI mode
npm run test:coverage # Generate test coverage report
```

## Architecture

This is a Next.js 15 weather dashboard using the App Router with React 19 and TypeScript.

### Key Technical Decisions
- **State Management**: Zustand for global state (location preferences), TanStack Query v5 for server state
- **UI Components**: shadcn/ui (New York style) with Tailwind CSS v4
- **Data Visualization**: Recharts for interactive charts
- **API Layer**: Next.js API routes as a proxy to external services
- **Testing**: Vitest with React Testing Library for unit tests

### Directory Structure
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - React components organized by feature
  - `ui/` - Base shadcn/ui components
  - `weather/` - Weather-specific components
  - `charts/` - Data visualization components
- `src/lib/` - Core application logic
  - `api/` - API clients and services
  - `hooks/` - Custom React hooks wrapping TanStack Query
  - `store/` - Zustand store definitions
  - `utils/` - Utility functions
- `src/types/` - TypeScript type definitions

### API Architecture
The app uses Next.js API routes as a Backend-for-Frontend pattern:
1. `/api/weather` - Proxies to OpenWeatherMap API or returns mock data
2. `/api/weather/search` - Location search with Mapbox
3. `/api/energy` - Energy demand forecasting data

External API calls are centralized in `src/lib/api/` with proper error handling and type safety.

### Data Fetching Pattern
All data fetching uses custom hooks that wrap TanStack Query:
- `useWeather()` - Current weather and forecast
- `useEnergyData()` - Energy demand data
- `useLocationSearch()` - Location autocomplete

These hooks provide loading states, error handling, and automatic refetching.

### Testing Approach
The project follows a comprehensive TDD approach with three types of tests:

1. **Unit Tests** (Vitest + React Testing Library):
   - Components: UI behavior, props, loading/error states
   - Hooks: Data fetching, state management, side effects
   - Utilities: Pure functions and formatters
   - Stores: State management and persistence

2. **Integration Tests**:
   - API routes: Request/response handling, error scenarios
   - Component integration: Data flow between components

3. **E2E Tests** (Playwright):
   - Critical user journeys and workflows
   - Cross-browser compatibility
   - Mobile responsiveness
   - Error recovery flows

**Test Structure:**
```
tests/
├── unit/           # Unit tests for components, hooks, utils
├── integration/    # API and component integration tests
├── e2e/           # End-to-end Playwright tests
├── factories/     # Test data factories
├── mocks/         # MSW API mocking
└── test-utils.tsx # Custom render functions with providers
```

**Running Tests:**
- `npm run test` - Unit/integration tests
- `npm run test:coverage` - With coverage report (70% threshold)
- `npm run test:e2e` - End-to-end tests
- `npm run test:all` - All tests
- Run single test: `npm run test path/to/test.test.ts`

**TDD Workflow:**
1. Write failing test first
2. Implement minimal code to pass
3. Refactor while keeping tests green
4. Use test factories for consistent data
5. Mock external dependencies with MSW

### Environment Variables
Required for full functionality:
- `NEXT_PUBLIC_WEATHER_API_KEY` - OpenWeatherMap API key (falls back to mock data if missing)
- `NEXT_PUBLIC_MAPBOX_TOKEN` - Mapbox token for location search

### Important Patterns
1. **Error Boundaries**: Each major section has error handling
2. **Loading States**: All data fetching shows skeleton loaders
3. **Type Safety**: Strict TypeScript with comprehensive types
4. **Performance**: Code splitting, lazy loading for charts, debounced inputs
5. **Responsive**: Mobile-first design with Tailwind breakpoints