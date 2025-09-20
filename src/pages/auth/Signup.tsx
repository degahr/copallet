import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useErrorHandler } from '../../contexts/ErrorContext';
import { useToastHelpers } from '../../contexts/ToastContext';
import { signupSchema, validateForm } from '../../utils/validation';
import { Input, Select, Checkbox } from '../../components/forms/FormFields';
import { UserRole } from '../../types';
import { Mail, Lock, Eye, EyeOff, User, Truck, Package, MapPin, Clock, Users, ArrowLeft } from 'lucide-react';
import logo from '../../assets/logo.png';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    companyName: '',
    phone: '',
    role: 'shipper' as UserRole,
    terms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { signup } = useAuth();
  const { handleError } = useErrorHandler();
  const { showSuccess } = useToastHelpers();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validate form
    const validation = validateForm(signupSchema, formData);
    if (!validation.success) {
      setErrors(validation.errors || {});
      setLoading(false);
      return;
    }

    try {
      await signup(formData.email, formData.password, formData.role);
      showSuccess('Account Created!', 'Welcome to CoPallet. Please complete your profile setup.');
      navigate('/app/onboarding');
    } catch (error) {
      handleError(error, 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Signup Form */}
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
              Join CoPallet
            </h2>
            <p className="text-gray-600">
              Create your account and start optimizing your freight operations today
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

            {/* Role Selection */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <Select
                id="role"
                name="role"
                label="I am a"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value as UserRole)}
                error={errors.role}
                options={[
                  { value: 'shipper', label: 'Shipper (SME)' },
                  { value: 'carrier', label: 'Carrier (Owner-Operator)' },
                  { value: 'dispatcher', label: 'Dispatcher (Small Fleet)' },
                ]}
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
                autoComplete="new-password"
                required
                label="Password"
                placeholder="Create a password"
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

            {/* Confirm Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>

            {/* Terms and Conditions */}
            <Checkbox
              id="terms"
              name="terms"
              required
              label="I agree to the Terms of Service and Privacy Policy"
              checked={formData.terms}
              onChange={(e) => handleInputChange('terms', e.target.checked)}
              error={errors.terms}
            />

            {/* Create Account Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create account'
                )}
              </button>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Already have an account?{' '}
              </span>
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Sign in
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
              <Users className="h-16 w-16 text-primary-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join Our Network
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Connect with thousands of shippers and carriers across Europe
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-sm">
                <Truck className="h-6 w-6 text-primary-600" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Verified Carriers</h4>
                <p className="text-sm text-gray-600">Trusted transport partners</p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-sm">
                <Package className="h-6 w-6 text-primary-600" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Smart Matching</h4>
                <p className="text-sm text-gray-600">AI-powered load matching</p>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg shadow-sm">
                <MapPin className="h-6 w-6 text-primary-600" />
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-gray-900">Europe-Wide</h4>
                <p className="text-sm text-gray-600">Coverage across 25+ countries</p>
              </div>
            </div>
          </div>

          {/* Benefits by Role */}
          <div className="mt-12">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Why Join CoPallet?</h4>
            <div className="grid grid-cols-1 gap-4 text-left">
              <div className="bg-white bg-opacity-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">For Shippers</h5>
                <p className="text-sm text-gray-600">Access to verified carriers, competitive pricing, and real-time tracking</p>
              </div>
              <div className="bg-white bg-opacity-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">For Carriers</h5>
                <p className="text-sm text-gray-600">Find profitable loads, build reputation, and grow your business</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
