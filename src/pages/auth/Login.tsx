import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useErrorHandler } from '../../contexts/ErrorContext';
import { useToastHelpers } from '../../contexts/ToastContext';
import { loginSchema, validateForm } from '../../utils/validation';
import { Input } from '../../components/forms/FormFields';
import { Mail, Lock, Eye, EyeOff, Truck, Package, MapPin, Clock, ArrowLeft } from 'lucide-react';
import logo from '../../assets/logo.png';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const { handleError } = useErrorHandler();
  const { showSuccess } = useToastHelpers();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validate form
    const validation = validateForm(loginSchema, formData);
    if (!validation.success) {
      setErrors(validation.errors || {});
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting login with:', { email: formData.email, password: '***' });
      await login(formData.email, formData.password);
      console.log('Login successful, navigating to dashboard');
      showSuccess('Welcome back!', 'You have successfully logged in.');
      navigate('/app/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      handleError(error, 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Back to Website Button */}
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Website
            </Link>
          </div>

          {/* Logo */}
          <div className="flex items-center mb-8">
            <img 
              src={logo} 
              alt="CoPallet Logo" 
              className="h-10 w-auto mr-3"
            />
            <h1 className="text-2xl font-bold text-gray-900">CoPallet</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h2>
            <p className="text-gray-600">
              Sign in to your account to continue managing your freight operations
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                label="Email address"
                placeholder="you@company.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                className="pl-10"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                error={errors.password}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Sign In Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{' '}
              </span>
              <Link
                to="/signup"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Visual Content */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8 bg-gradient-to-br from-primary-50 to-primary-100 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary-600 rounded-full"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-primary-500 rounded-full"></div>
          <div className="absolute bottom-20 left-40 w-20 h-20 bg-primary-400 rounded-full"></div>
          <div className="absolute bottom-40 right-40 w-28 h-28 bg-primary-600 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-8">
          {/* Truck Illustration */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-white rounded-full shadow-lg mb-6">
              <Truck className="h-16 w-16 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Smart Freight Management
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Connect with reliable carriers and optimize your logistics operations
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-sm">
                <Package className="h-6 w-6 text-primary-600" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Pallet Tracking</h4>
                <p className="text-sm text-gray-600">Real-time shipment monitoring</p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-sm">
                <MapPin className="h-6 w-6 text-primary-600" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Route Optimization</h4>
                <p className="text-sm text-gray-600">Efficient delivery planning</p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-sm">
                <Clock className="h-6 w-6 text-primary-600" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">24/7 Support</h4>
                <p className="text-sm text-gray-600">Always here to help</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">500+</div>
              <div className="text-sm text-gray-600">Active Carriers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">10K+</div>
              <div className="text-sm text-gray-600">Shipments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">99%</div>
              <div className="text-sm text-gray-600">On-Time Delivery</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
