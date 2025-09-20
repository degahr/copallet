import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { useToastHelpers } from './ToastContext';

export interface ApiError {
  message: string;
  statusCode?: number;
  details?: Record<string, string>;
  field?: string;
}

interface ErrorContextType {
  handleError: (error: unknown, context?: string) => void;
  handleApiError: (error: ApiError, context?: string) => void;
  handleValidationError: (errors: Record<string, string>) => void;
  handleNetworkError: () => void;
  handleAuthError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useErrorHandler = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorHandler must be used within an ErrorProvider');
  }
  return context;
};

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const { showError, showWarning, showInfo } = useToastHelpers();

  const handleError = useCallback((error: unknown, context?: string) => {
    console.error(`Error in ${context || 'unknown context'}:`, error);
    
    let message = 'An unexpected error occurred';
    
    if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      message = (error as any).message;
    }
    
    showError('Error', `${context ? `${context}: ` : ''}${message}`);
  }, [showError]);

  const handleApiError = useCallback((error: ApiError, context?: string) => {
    console.error(`API Error in ${context || 'unknown context'}:`, error);
    
    const { message, statusCode, details } = error;
    
    // Handle different error types
    switch (statusCode) {
      case 400:
        if (details && Object.keys(details).length > 0) {
          // Show validation errors
          const errorMessages = Object.values(details).join(', ');
          showError('Validation Error', errorMessages);
        } else {
          showError('Invalid Request', message);
        }
        break;
      case 401:
        showError('Authentication Required', 'Please log in to continue');
        break;
      case 403:
        showError('Access Denied', 'You do not have permission to perform this action');
        break;
      case 404:
        showError('Not Found', 'The requested resource was not found');
        break;
      case 409:
        showError('Conflict', message || 'This resource already exists');
        break;
      case 422:
        showError('Validation Error', message || 'Please check your input and try again');
        break;
      case 429:
        showWarning('Rate Limited', 'Too many requests. Please wait a moment and try again.');
        break;
      case 500:
        showError('Server Error', 'Something went wrong on our end. Please try again later.');
        break;
      case 503:
        showError('Service Unavailable', 'The service is temporarily unavailable. Please try again later.');
        break;
      default:
        showError('Error', `${context ? `${context}: ` : ''}${message}`);
    }
  }, [showError, showWarning]);

  const handleValidationError = useCallback((errors: Record<string, string>) => {
    console.warn('Validation errors:', errors);
    
    const errorCount = Object.keys(errors).length;
    if (errorCount === 1) {
      const [field, message] = Object.entries(errors)[0];
      showError('Validation Error', `${field}: ${message}`);
    } else if (errorCount > 1) {
      showError('Validation Errors', `Please fix ${errorCount} validation errors`);
    }
  }, [showError]);

  const handleNetworkError = useCallback(() => {
    showError('Network Error', 'Unable to connect to the server. Please check your internet connection.');
  }, [showError]);

  const handleAuthError = useCallback(() => {
    showError('Authentication Error', 'Your session has expired. Please log in again.');
  }, [showError]);

  return (
    <ErrorContext.Provider value={{
      handleError,
      handleApiError,
      handleValidationError,
      handleNetworkError,
      handleAuthError,
    }}>
      {children}
    </ErrorContext.Provider>
  );
};

// API error parsing utility
export const parseApiError = (error: unknown): ApiError => {
  if (error && typeof error === 'object') {
    const apiError = error as any;
    
    // Handle fetch API errors
    if (apiError.response) {
      const response = apiError.response;
      const data = response.data || {};
      
      return {
        message: data.error || data.message || 'An error occurred',
        statusCode: response.status,
        details: data.details || data.errors,
      };
    }
    
    // Handle axios errors
    if (apiError.isAxiosError) {
      const response = apiError.response;
      const data = response?.data || {};
      
      return {
        message: data.error || data.message || apiError.message || 'An error occurred',
        statusCode: response?.status,
        details: data.details || data.errors,
      };
    }
    
    // Handle standard errors
    if (apiError.message) {
      return {
        message: apiError.message,
        statusCode: apiError.statusCode || apiError.status,
        details: apiError.details || apiError.errors,
      };
    }
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return { message: error };
  }
  
  // Default fallback
  return { message: 'An unexpected error occurred' };
};

// Error boundary component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Something went wrong</h3>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Refresh Page
              </button>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
