// API configuration
const getApiBaseUrl = () => {
  // Check for environment variable first
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    console.log('Using VITE_API_URL:', envUrl);
    // Ensure the URL ends with /api
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  }
  
  // Fallback: detect environment based on hostname
  const hostname = window.location.hostname;
  console.log('No VITE_API_URL found, detecting environment from hostname:', hostname);
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    console.log('Detected local development environment');
    return 'http://localhost:3001/api';
  }
  
  if (hostname.includes('render.com')) {
    console.log('Detected Render production environment');
    return 'https://copallet-w9do.onrender.com/api';
  }
  
  // Default fallback
  console.log('Using default localhost fallback');
  return 'http://localhost:3001/api';
};

const API_BASE_URL = getApiBaseUrl();

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

  async getShipment(id: string): Promise<any> {
    return this.request<{ shipment: any }>(`/shipments/${id}`);
  }

  async createShipment(shipmentData: any): Promise<any> {
    return this.request<{ shipment: any }>('/shipments', {
      method: 'POST',
      body: JSON.stringify(shipmentData),
    });
  }

  async updateShipment(id: string, shipmentData: any): Promise<any> {
    return this.request<{ shipment: any }>(`/shipments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(shipmentData),
    });
  }

  async deleteShipment(id: string): Promise<void> {
    await this.request(`/shipments/${id}`, { method: 'DELETE' });
  }

  // Bids
  async getBids(): Promise<any[]> {
    const response = await this.request<{ bids: any[] }>('/shipments/bids');
    return response.bids || [];
  }

  // Blog posts
  async getBlogPosts(category?: string, featured?: boolean): Promise<any[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (featured) params.append('featured', 'true');
    
    const queryString = params.toString();
    const endpoint = queryString ? `/blog?${queryString}` : '/blog';
    const response = await this.request<{ posts: any[] }>(endpoint);
    return response.posts || [];
  }

  async getBlogPost(id: string): Promise<any> {
    return this.request<{ post: any }>(`/blog/${id}`);
  }

  async getBlogPostBySlug(slug: string): Promise<any> {
    return this.request<{ post: any }>(`/blog/slug/${slug}`);
  }

  async createBlogPost(postData: any): Promise<any> {
    return this.request<{ post: any }>('/blog', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async updateBlogPost(id: string, postData: any): Promise<any> {
    return this.request<{ post: any }>(`/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  }

  async deleteBlogPost(id: string): Promise<void> {
    await this.request(`/blog/${id}`, { method: 'DELETE' });
  }

  async getAllBlogPosts(): Promise<any[]> {
    const response = await this.request<{ posts: any[] }>('/blog/admin');
    return response.posts || [];
  }

  // Shipment Templates
  async getShipmentTemplates(): Promise<any[]> {
    const response = await this.request<{ templates: any[] }>('/shipments/templates');
    return response.templates || [];
  }

  async createShipmentTemplate(templateData: any): Promise<any> {
    return this.request<{ template: any }>('/shipments/templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  }

  async updateShipmentTemplate(id: string, templateData: any): Promise<any> {
    return this.request<{ template: any }>(`/shipments/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(templateData),
    });
  }

  async deleteShipmentTemplate(id: string): Promise<void> {
    await this.request(`/shipments/templates/${id}`, { method: 'DELETE' });
  }

  async createShipmentFromTemplate(templateId: string, shipmentData: any): Promise<any> {
    return this.request<{ shipment: any }>(`/shipments/templates/${templateId}/create-shipment`, {
      method: 'POST',
      body: JSON.stringify(shipmentData),
    });
  }

  // Company Profile
  async getCompanyProfile(): Promise<any> {
    return this.request<{ profile: any }>('/users/company-profile');
  }

  async updateCompanyProfile(profileData: any): Promise<any> {
    return this.request<{ profile: any }>('/users/company-profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async uploadCompanyLogo(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('logo', file);
    
    return this.request<{ logoUrl: string }>('/users/company-logo', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type, let browser set it with boundary
      },
    });
  }

  // Tracking methods
  async getTrackingPoints(shipmentId: string): Promise<any> {
    return this.request<{ shipmentId: string; trackingPoints: any[] }>(`/shipments/${shipmentId}/tracking`);
  }

  async addTrackingPoint(shipmentId: string, trackingData: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    speed?: number;
    heading?: number;
  }): Promise<any> {
    return this.request<{ trackingPoint: any }>(`/shipments/${shipmentId}/tracking`, {
      method: 'POST',
      body: JSON.stringify(trackingData),
    });
  }
}

// Create singleton instance
export const apiService = new ApiService(API_BASE_URL);

// Export for use in components
export default apiService;
