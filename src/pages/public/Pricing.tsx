import CompanyHeader from '../../components/layout/CompanyHeader';
import CompanyFooter from '../../components/layout/CompanyFooter';
import { CheckCircle, X, ArrowRight } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for small businesses getting started",
      features: [
        "Up to 5 shipments per month",
        "Basic tracking",
        "Email support",
        "Standard carriers",
        "Basic reporting"
      ],
      limitations: [
        "No priority support",
        "Limited analytics",
        "No custom integrations"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      price: "€99",
      period: "/month",
      description: "Ideal for growing businesses",
      features: [
        "Up to 50 shipments per month",
        "Real-time tracking",
        "Priority support",
        "Verified carriers",
        "Advanced analytics",
        "Custom reporting",
        "API access"
      ],
      limitations: [
        "No dedicated account manager"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with complex needs",
      features: [
        "Unlimited shipments",
        "Real-time tracking",
        "Dedicated support",
        "Premium carriers",
        "Custom analytics",
        "White-label options",
        "Full API access",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantees"
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const addOns = [
    {
      name: "Express Delivery",
      price: "€15",
      description: "Same-day or next-day delivery",
      features: ["Priority handling", "Guaranteed delivery", "Real-time updates"]
    },
    {
      name: "Temperature Control",
      price: "€25",
      description: "Cold chain transport",
      features: ["Temperature monitoring", "Certified carriers", "Compliance docs"]
    },
    {
      name: "Dangerous Goods",
      price: "€35",
      description: "ADR certified transport",
      features: ["ADR drivers", "Specialized equipment", "Safety compliance"]
    },
    {
      name: "Cross-Border",
      price: "€20",
      description: "International shipping",
      features: ["Customs clearance", "Documentation", "Multi-language support"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <CompanyHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Choose the plan that fits your business needs. No hidden fees, no surprises.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade anytime
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-lg p-8 relative ${
                  plan.popular ? 'ring-2 ring-blue-500 transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    {plan.price}
                    {plan.period && <span className="text-lg text-gray-600">{plan.period}</span>}
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations.map((limitation, limitationIndex) => (
                    <div key={limitationIndex} className="flex items-center space-x-3">
                      <X className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-400">{limitation}</span>
                    </div>
                  ))}
                </div>
                
                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Additional Services
            </h2>
            <p className="text-xl text-gray-600">
              Enhance your shipments with specialized services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{addon.name}</h3>
                <div className="text-2xl font-bold text-blue-600 mb-2">{addon.price}</div>
                <p className="text-gray-600 mb-4">{addon.description}</p>
                <ul className="space-y-2">
                  {addon.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our pricing
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                and we'll prorate any billing differences.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What happens if I exceed my shipment limit?
              </h3>
              <p className="text-gray-600">
                If you exceed your monthly shipment limit, we'll automatically charge you €5 per additional 
                shipment. You can also upgrade your plan to avoid overage charges.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Is there a setup fee?
              </h3>
              <p className="text-gray-600">
                No setup fees for any plan. You only pay for the services you use, starting with our 
                free Starter plan.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Do you offer custom pricing for large volumes?
              </h3>
              <p className="text-gray-600">
                Yes, our Enterprise plan offers custom pricing based on your specific needs and volume. 
                Contact our sales team for a personalized quote.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
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

export default Pricing;
