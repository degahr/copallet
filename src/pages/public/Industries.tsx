import CompanyHeader from '../../components/layout/CompanyHeader';
import CompanyFooter from '../../components/layout/CompanyFooter';
import { ArrowRight, Shield, Thermometer, Zap, Heart, Factory, ShoppingCart, Car } from 'lucide-react';

const Industries = () => {
  const industries = [
    {
      icon: <Factory className="h-8 w-8 text-blue-600" />,
      title: "Manufacturing",
      description: "Reliable transport for raw materials, components, and finished goods",
      features: [
        "Just-in-time delivery",
        "Heavy machinery transport",
        "Supply chain optimization",
        "Quality assurance protocols"
      ],
      stats: "500+ manufacturers trust us",
      color: "blue"
    },
    {
      icon: <Heart className="h-8 w-8 text-red-600" />,
      title: "Pharmaceuticals",
      description: "Temperature-controlled transport with full compliance and monitoring",
      features: [
        "Cold chain management",
        "ADR certification",
        "Real-time monitoring",
        "Regulatory compliance"
      ],
      stats: "99.8% compliance rate",
      color: "red"
    },
    {
      icon: <ShoppingCart className="h-8 w-8 text-green-600" />,
      title: "Retail & E-commerce",
      description: "Scalable solutions for growing retail operations and last-mile delivery",
      features: [
        "Last-mile delivery",
        "Inventory management",
        "Peak season handling",
        "Returns processing"
      ],
      stats: "1,200+ retailers served",
      color: "green"
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Technology",
      description: "Secure transport for high-value electronics and sensitive equipment",
      features: [
        "Secure handling",
        "Anti-static packaging",
        "Insurance coverage",
        "White-glove service"
      ],
      stats: "€50M+ equipment transported",
      color: "yellow"
    },
    {
      icon: <Car className="h-8 w-8 text-purple-600" />,
      title: "Automotive",
      description: "Specialized transport for automotive parts and finished vehicles",
      features: [
        "Parts distribution",
        "Vehicle transport",
        "Just-in-sequence delivery",
        "Quality control"
      ],
      stats: "200+ automotive clients",
      color: "purple"
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-600" />,
      title: "Food & Beverage",
      description: "Temperature-controlled transport for perishable goods",
      features: [
        "Cold chain logistics",
        "HACCP compliance",
        "Freshness monitoring",
        "Quick delivery"
      ],
      stats: "24/7 temperature monitoring",
      color: "indigo"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-50 to-blue-100 border-blue-200",
      red: "from-red-50 to-red-100 border-red-200",
      green: "from-green-50 to-green-100 border-green-200",
      yellow: "from-yellow-50 to-yellow-100 border-yellow-200",
      purple: "from-purple-50 to-purple-100 border-purple-200",
      indigo: "from-indigo-50 to-indigo-100 border-indigo-200"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-white">
      <CompanyHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Industries We Serve</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Specialized logistics solutions tailored to your industry's unique requirements
            </p>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Industry Expertise
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We understand the unique challenges of each industry and provide tailored solutions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <div key={index} className={`bg-gradient-to-br ${getColorClasses(industry.color)} border rounded-xl p-8 hover:shadow-lg transition-shadow`}>
                <div className="mb-6">
                  {industry.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{industry.title}</h3>
                <p className="text-gray-600 mb-6">{industry.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {industry.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="text-sm font-semibold text-gray-600 mb-4">
                  {industry.stats}
                </div>
                
                <button className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-lg transition-colors border">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Industry-Specific Solutions
            </h2>
            <p className="text-xl text-gray-600">
              Customized approaches for maximum efficiency
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Compliance & Certification</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">ADR Certification</h4>
                    <p className="text-gray-600">Dangerous goods transport with full compliance</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Thermometer className="h-6 w-6 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Temperature Control</h4>
                    <p className="text-gray-600">Cold chain management for pharmaceuticals and food</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="h-6 w-6 text-yellow-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Quality Assurance</h4>
                    <p className="text-gray-600">Strict protocols for sensitive goods</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Specialized Equipment</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Car className="h-6 w-6 text-purple-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Tail Lift Trucks</h4>
                    <p className="text-gray-600">Ground-level loading for heavy pallets</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Factory className="h-6 w-6 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Forklift Access</h4>
                    <p className="text-gray-600">Dock-to-dock delivery capabilities</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Heart className="h-6 w-6 text-red-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Secure Transport</h4>
                    <p className="text-gray-600">High-value goods protection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Stats */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted Across Industries
            </h2>
            <p className="text-xl text-blue-100">
              Serving diverse sectors with specialized expertise
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">6+</div>
              <div className="text-blue-100">Industry Sectors</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">1,200+</div>
              <div className="text-blue-100">Companies Served</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">99.8%</div>
              <div className="text-blue-100">Compliance Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready for Industry-Specific Solutions?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Let us show you how we can optimize your industry's unique logistics challenges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors inline-flex items-center justify-center"
            >
              Get Industry Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="/signup"
              className="border-2 border-blue-600 hover:bg-blue-600 text-blue-600 hover:text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors inline-flex items-center justify-center"
            >
              Start Free Trial
            </a>
          </div>
        </div>
      </section>

      <CompanyFooter />
    </div>
  );
};

export default Industries;
