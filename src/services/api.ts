// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Types for API responses
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
    verificationStatus: string;
    createdAt?: string;
    lastLoginAt?: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface User {
  id: string;
  email: string;
  role: string;
  verificationStatus: string;
  isActive?: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

// API service class
class ApiService {
  private baseURL: string;
  private accessToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Load token from localStorage on initialization
    this.accessToken = localStorage.getItem('accessToken');
  }

  // Set authentication token
  setAuthToken(token: string | null) {
    this.accessToken = token;
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
  }

  // Get authentication headers
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Authentication methods
  async signup(email: string, password: string, role: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });

    // Store tokens if signup is successful
    if (response.tokens) {
      this.setAuthToken(response.tokens.accessToken);
    }

    return response;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    console.log('API Service: Starting login request to:', `${this.baseURL}/auth/login`);
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    console.log('API Service: Login response received:', response);

    // Store tokens if login is successful
    if (response.tokens) {
      this.setAuthToken(response.tokens.accessToken);
      console.log('API Service: Token stored successfully');
    }

    return response;
  }

  async refreshTokens(refreshToken: string): Promise<{ tokens: { accessToken: string; refreshToken: string } }> {
    const response = await this.request<{ tokens: { accessToken: string; refreshToken: string } }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    // Update stored token
    if (response.tokens) {
      this.setAuthToken(response.tokens.accessToken);
    }

    return response;
  }

  async getCurrentUser(): Promise<{ user: User }> {
    return this.request<{ user: User }>('/auth/me');
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' });
    this.setAuthToken(null);
  }

  // Health check
  async healthCheck(): Promise<any> {
    const url = `${this.baseURL.replace('/api', '')}/health`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  // Test endpoint
  async testApi(): Promise<any> {
    return this.request('/test');
  }

  // Shipments
  async getShipments(): Promise<any[]> {
    const response = await this.request<{ shipments: any[] }>('/shipments');
    return response.shipments || [];
  }

  // Bids
  async getBids(): Promise<any[]> {
    const response = await this.request<{ bids: any[] }>('/shipments/bids');
    return response.bids || [];
  }
}

// Create singleton instance
export const apiService = new ApiService(API_BASE_URL);

// Export for use in components
export default apiService;
