import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import userEvent from '@testing-library/user-event'

// Create a custom render function that includes all providers
const createTestQueryClient = () => 
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
    },
  })

interface AllTheProvidersProps {
  children: React.ReactNode
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({ children }) => {
  const testQueryClient = createTestQueryClient()
  
  return (
    <QueryClientProvider client={testQueryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllTheProviders, ...options })
  }
}

// Re-export everything
export * from '@testing-library/react'
export { customRender as render, createTestQueryClient }