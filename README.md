# Weather Intelligence Dashboard

A production-ready Weather Intelligence Dashboard built with the latest versions of Next.js 15, React 19, and TypeScript. This application demonstrates software engineering best practices, clean architecture, and modern UI/UX design.

## 🚀 Features

### Core Features
- **Real-time Weather Data**: Current conditions, hourly forecasts, and 7-day outlook
- **Interactive Visualizations**: Beautiful charts for temperature, precipitation, wind patterns, and energy demand
- **Location Search**: Find weather for any location worldwide with autocomplete
- **Geolocation Support**: Automatic location detection with user permission
- **Dark/Light Mode**: System-aware theme with manual toggle
- **Responsive Design**: Mobile-first approach with seamless desktop experience

### Advanced Features
- **Energy Demand Forecasting**: Real-time energy consumption and renewable energy tracking
- **Air Quality Index**: Comprehensive air quality monitoring with health recommendations
- **Weather Alerts**: Real-time severe weather notifications
- **PWA Ready**: Offline support and app-like experience
- **Performance Optimized**: Code splitting, lazy loading, and aggressive caching

## 🛠 Tech Stack

### Core Technologies
- **Framework**: Next.js 15 (App Router)
- **React**: Version 19 (latest stable)
- **Language**: TypeScript 5.x with strict mode
- **Styling**: Tailwind CSS 3.x with custom design system

### UI & Visualization
- **Components**: Shadcn/ui for consistent design system
- **Charts**: Recharts for interactive data visualization
- **Icons**: Lucide React for modern iconography
- **Animations**: Framer Motion for smooth transitions

### State & Data Management
- **Data Fetching**: TanStack Query (React Query) v5 with caching
- **State Management**: Zustand for global state
- **Local Storage**: Persistent location preferences

### Development & Testing
- **Testing**: Vitest, React Testing Library, Playwright for E2E
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks
- **API Mocking**: MSW (Mock Service Worker) for development

## 🎯 Quick Start

### Prerequisites
- Node.js 18+ (recommended: 20+)
- npm, yarn, or pnpm

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your API keys (optional - works with mock data):
   ```env
   NEXT_PUBLIC_WEATHER_API_KEY=your_openweather_api_key
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript compiler

# Testing
npm run test         # Run unit tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report
```

## 🌡 Weather API Integration

The application supports multiple weather data sources:

### OpenWeatherMap (Primary)
```env
# Environment variable required
NEXT_PUBLIC_WEATHER_API_KEY=your_openweather_api_key
```

Features supported:
- Current weather conditions
- 5-day/3-hour forecasts
- Location search with geocoding
- Weather icons and descriptions

### Fallback Mode
When no API key is provided, the application uses realistic mock data for development and testing.

## 🎨 Key Components

### Weather Components
- **CurrentWeatherCard**: Real-time conditions with detailed metrics
- **WeatherForecastCard**: 24-hour and 7-day forecasts with interactive charts
- **WeatherAlertsCard**: Severe weather notifications and warnings

### Data Visualization
- **EnergyDemandChart**: Energy consumption trends and renewable energy mix
- **PrecipitationChart**: Rainfall probability with health recommendations
- **WindPatternsChart**: Wind speed timeline and direction distribution
- **AirQualityIndex**: Comprehensive air quality monitoring

### Utility Components
- **LocationPicker**: Intelligent location search with geolocation support
- **ThemeProvider**: System-aware dark/light mode switching

## 📊 Data Management

### API Routes
- `GET /api/weather` - Current weather and forecast data
- `GET /api/weather/search` - Location search with autocomplete
- `GET /api/energy` - Energy demand and renewable data

### Caching Strategy
- **React Query**: 5-minute cache for weather data, 10-minute for energy
- **Browser Cache**: Persistent location preferences
- **Service Worker**: Offline data availability (PWA feature)

## 🔒 Performance & Security

### Performance Features
- Code splitting with dynamic imports
- Image optimization with Next.js Image
- Lazy loading for chart components
- Debounced search inputs
- Optimized re-renders with React 19

### Security Measures
- Input validation and sanitization
- Environment variable protection
- Content Security Policy headers
- Rate limiting on API routes

## 🧪 Testing

The project includes comprehensive testing setup:

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run specific test files
npm run test -- weather-api
```

### Test Categories
- **Unit Tests**: Utility functions, custom hooks
- **Component Tests**: React components with React Testing Library
- **Integration Tests**: API routes and data flow
- **E2E Tests**: Critical user journeys with Playwright

## 🚀 Deployment

### Environment Variables
```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_WEATHER_API_KEY=your_api_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

### Deployment Platforms
- **Vercel** (recommended): Zero-config deployment
- **Netlify**: Static site deployment
- **Railway**: Full-stack hosting
- **Docker**: Containerized deployment

## 📁 Project Structure

```
weather-dashboard/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   ├── dashboard/          # Dashboard pages
│   │   └── layout.tsx          # Root layout
│   ├── components/             # React components
│   │   ├── ui/                 # Base UI components (Shadcn)
│   │   ├── weather/            # Weather-specific components
│   │   ├── charts/             # Data visualization components
│   │   ├── layout/             # Layout components
│   │   └── shared/             # Reusable components
│   ├── lib/                    # Utilities and configurations
│   │   ├── api/                # API clients and services
│   │   ├── hooks/              # Custom React hooks
│   │   ├── store/              # State management
│   │   ├── utils/              # Utility functions
│   │   ├── constants/          # Application constants
│   │   ├── providers/          # React context providers
│   │   └── mocks/              # Mock data for development
│   └── types/                  # TypeScript type definitions
├── tests/                      # Test files
└── public/                     # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Development Guidelines
- Use TypeScript for all new code
- Follow existing code patterns
- Write tests for new features
- Update documentation as needed

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data
- [Shadcn/ui](https://ui.shadcn.com/) for component library
- [Lucide](https://lucide.dev/) for icons
- [Recharts](https://recharts.org/) for charts

---

Built with ❤️ using Next.js 15, React 19, and TypeScript
