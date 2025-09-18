import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* 404 Illustration */}
          <div className="mx-auto h-32 w-32 text-gray-400 mb-8">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="h-full w-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709"
              />
            </svg>
          </div>
          
          {/* Error Message */}
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you might have entered the wrong URL.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/app/dashboard"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
            >
              <Home className="h-5 w-5 mr-2" />
              Go to Dashboard
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </button>
          </div>
          
          {/* Helpful Links */}
          <div className="mt-12">
            <h3 className="text-sm font-medium text-gray-500 mb-4">
              Popular Pages
            </h3>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                to="/app/shipments"
                className="text-primary-600 hover:text-primary-700 transition-colors"
              >
                My Shipments
              </Link>
              <Link
                to="/app/marketplace"
                className="text-primary-600 hover:text-primary-700 transition-colors"
              >
                Marketplace
              </Link>
              <Link
                to="/app/profile"
                className="text-primary-600 hover:text-primary-700 transition-colors"
              >
                Profile
              </Link>
              <Link
                to="/app/analytics"
                className="text-primary-600 hover:text-primary-700 transition-colors"
              >
                Analytics
              </Link>
            </div>
          </div>
          
          {/* Search Suggestion */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              Looking for something specific?
            </p>
            <Link
              to="/app/marketplace"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              <Search className="h-4 w-4 mr-1" />
              Browse Marketplace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
