import { API_CONFIG } from '@/lib/constants/config';
import type { ApiError, RequestOptions } from '@/types/api';

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_CONFIG.baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = {
        code: response.status.toString(),
        message: response.statusText,
      };

      try {
        const errorData = await response.json();
        error.message = errorData.message || response.statusText;
        error.details = errorData.details;
      } catch {
        // Ignore JSON parse errors
      }

      throw error;
    }

    return response.json();
  }

  private buildURL(endpoint: string, params?: Record<string, string | number>): string {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value.toString());
      });
    }

    return url.toString();
  }

  private async fetchWithRetry<T>(
    url: string,
    options: RequestInit,
    retries: number = API_CONFIG.retryAttempts
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        signal: options.signal || AbortSignal.timeout(API_CONFIG.timeout),
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      if (retries > 0 && !options.signal?.aborted) {
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay));
        return this.fetchWithRetry<T>(url, options, retries - 1);
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildURL(endpoint, options?.params);
    
    return this.fetchWithRetry<T>(url, {
      method: 'GET',
      headers: {
        ...this.defaultHeaders,
        ...options?.headers,
      },
      signal: options?.signal,
    });
  }

  async post<T, D = unknown>(
    endpoint: string,
    data?: D,
    options?: RequestOptions
  ): Promise<T> {
    const url = this.buildURL(endpoint, options?.params);
    
    return this.fetchWithRetry<T>(url, {
      method: 'POST',
      headers: {
        ...this.defaultHeaders,
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      signal: options?.signal,
    });
  }

  async put<T, D = unknown>(
    endpoint: string,
    data: D,
    options?: RequestOptions
  ): Promise<T> {
    const url = this.buildURL(endpoint, options?.params);
    
    return this.fetchWithRetry<T>(url, {
      method: 'PUT',
      headers: {
        ...this.defaultHeaders,
        ...options?.headers,
      },
      body: JSON.stringify(data),
      signal: options?.signal,
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = this.buildURL(endpoint, options?.params);
    
    return this.fetchWithRetry<T>(url, {
      method: 'DELETE',
      headers: {
        ...this.defaultHeaders,
        ...options?.headers,
      },
      signal: options?.signal,
    });
  }
}

export const apiClient = new ApiClient();