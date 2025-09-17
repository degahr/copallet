import CompanyHeader from '../../components/layout/CompanyHeader';
import CompanyFooter from '../../components/layout/CompanyFooter';
import { Truck, MapPin, Clock, Shield, Users, BarChart3, CheckCircle, ArrowRight } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Truck className="h-8 w-8 text-blue-600" />,
      title: "Pallet Freight Marketplace",
      description: "Connect with verified carriers instantly. Our intelligent matching system finds the best carriers for your shipments.",
      features: [
        "Verified carrier network",
        "Instant price quotes",
        "Real-time availability",
        "Quality assurance"
      ]
    },
    {
      icon: <MapPin className="h-8 w-8 text-green-600" />,
      title: "Real-Time Tracking",
      description: "Track your shipments from pickup to delivery with GPS updates and automated notifications.",
      features: [
        "GPS tracking",
        "ETA updates",
        "Delivery confirmations",
        "Exception alerts"
      ]
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: "Secure Payments",
      description: "Protected transactions with escrow services, automated invoicing, and secure payment processing.",
      features: [
        "Escrow protection",
        "Automated invoicing",
        "Multiple payment methods",
        "Fraud prevention"
      ]
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
      title: "Analytics & Reporting",
      description: "Comprehensive analytics to optimize your logistics operations and reduce costs.",
      features: [
        "Cost analysis",
        "Performance metrics",
        "Route optimization",
        "Custom reports"
      ]
    },
    {
      icon: <Users className="h-8 w-8 text-red-600" />,
      title: "Dedicated Support",
      description: "24/7 customer support to help you with any logistics challenges or questions.",
      features: [
        "24/7 availability",
        "Expert logistics advice",
        "Issue resolution",
        "Account management"
      ]
    },
    {
      icon: <Clock className="h-8 w-8 text-indigo-600" />,
      title: "Automated Operations",
      description: "Streamline your logistics with automated workflows, scheduling, and communication.",
      features: [
        "Automated scheduling",
        "Workflow automation",
        "Communication tools",
        "Document management"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <CompanyHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Comprehensive logistics solutions designed to streamline your pallet freight operations
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Logistics Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your pallet freight operations efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialized Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Specialized Services
            </h2>
            <p className="text-xl text-gray-600">
              Tailored solutions for specific industry needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Temperature-Controlled Transport</h3>
              <p className="text-gray-600 mb-6">
                Specialized carriers for pharmaceuticals, food, and other temperature-sensitive goods.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">Real-time temperature monitoring</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">Certified cold chain carriers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">Compliance documentation</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Dangerous Goods (ADR)</h3>
              <p className="text-gray-600 mb-6">
                Certified carriers for hazardous materials with full ADR compliance.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">ADR certified drivers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">Specialized equipment</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">Safety compliance</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Express Delivery</h3>
              <p className="text-gray-600 mb-6">
                Same-day and next-day delivery options for urgent shipments.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">Same-day pickup</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">Priority handling</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">Guaranteed delivery</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Cross-Border Shipping</h3>
              <p className="text-gray-600 mb-6">
                Seamless international shipping with customs clearance support.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">Customs documentation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">Border crossing expertise</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">Multi-language support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience Our Services?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of companies already using CoPallet to streamline their logistics operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold px-8 py-4 rounded-lg text-lg transition-colors inline-flex items-center justify-center"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="/contact"
              className="border-2 border-white hover:bg-white hover:text-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors inline-flex items-center justify-center"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      <CompanyFooter />
    </div>
  );
};

export default Services;
