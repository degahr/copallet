import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Truck, MapPin, Clock, Shield, Users, BarChart3, Star, Play, Calculator } from 'lucide-react';
import CompanyHeader from '../../components/layout/CompanyHeader';
import CompanyFooter from '../../components/layout/CompanyFooter';
import PricingCalculator from '../../components/PricingCalculator';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <CompanyHeader />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Revolutionize Your
                <span className="block text-yellow-400">Pallet Freight</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Connect shippers with verified carriers instantly. Streamline your logistics with our intelligent marketplace platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/signup"
                  className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold px-8 py-4 rounded-lg text-lg transition-colors inline-flex items-center justify-center"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <button className="border-2 border-white hover:bg-white hover:text-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors inline-flex items-center justify-center">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </button>
              </div>
              <div className="flex items-center space-x-6 text-blue-100">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>No setup fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
            <div className="lg:pl-8">
              <PricingCalculator />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CoPallet?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've built the most comprehensive pallet freight marketplace in Europe
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Verified Carriers</h3>
              <p className="text-gray-600">
                All carriers are thoroughly verified with insurance, licenses, and safety records checked.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Real-Time Tracking</h3>
              <p className="text-gray-600">
                Track your shipments in real-time with GPS updates and automated notifications.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Instant Matching</h3>
              <p className="text-gray-600">
                Get matched with available carriers in seconds, not hours or days.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="bg-red-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Secure Payments</h3>
              <p className="text-gray-600">
                Protected transactions with escrow services and automated invoicing.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="bg-yellow-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Dedicated Support</h3>
              <p className="text-gray-600">
                24/7 customer support to help you with any logistics challenges.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="bg-indigo-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Analytics & Insights</h3>
              <p className="text-gray-600">
                Detailed analytics to optimize your logistics operations and reduce costs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-blue-100">
              Join thousands of companies already using CoPallet
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Active Carriers</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">1,200+</div>
              <div className="text-blue-100">Verified Shippers</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">15,000+</div>
              <div className="text-blue-100">Shipments Completed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">99.8%</div>
              <div className="text-blue-100">On-Time Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Social Proof */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h2>
            <p className="text-gray-600">Join companies already transforming their logistics</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            <div className="text-center">
              <div className="bg-gray-200 h-16 w-32 mx-auto rounded flex items-center justify-center mb-2">
                <span className="text-gray-600 font-semibold">TechCorp</span>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-200 h-16 w-32 mx-auto rounded flex items-center justify-center mb-2">
                <span className="text-gray-600 font-semibold">RetailPlus</span>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-200 h-16 w-32 mx-auto rounded flex items-center justify-center mb-2">
                <span className="text-gray-600 font-semibold">PharmaLog</span>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-200 h-16 w-32 mx-auto rounded flex items-center justify-center mb-2">
                <span className="text-gray-600 font-semibold">AutoParts</span>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-8 text-gray-500">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm">ISO 9001 Certified</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">GDPR Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm">SSL Secured</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Real feedback from real businesses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6">
                "CoPallet has revolutionized our logistics operations. We've reduced costs by 30% and improved delivery times significantly."
              </p>
              <div className="font-semibold text-gray-900">Sarah Johnson</div>
              <div className="text-gray-600">Logistics Manager, TechCorp</div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6">
                "The platform is incredibly user-friendly. Finding reliable carriers has never been easier. Highly recommended!"
              </p>
              <div className="font-semibold text-gray-900">Michael Chen</div>
              <div className="text-gray-600">Operations Director, RetailPlus</div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6">
                "As a carrier, CoPallet has given me access to high-quality shipments and reliable shippers. Great platform!"
              </p>
              <div className="font-semibold text-gray-900">David Rodriguez</div>
              <div className="text-gray-600">Owner, Rodriguez Transport</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Logistics?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of companies already using CoPallet to streamline their freight operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold px-8 py-4 rounded-lg text-lg transition-colors inline-flex items-center justify-center"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white hover:bg-white hover:text-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors inline-flex items-center justify-center"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      <CompanyFooter />
    </div>
  );
};

export default Landing;
