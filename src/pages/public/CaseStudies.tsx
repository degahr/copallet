import CompanyHeader from '../../components/layout/CompanyHeader';
import CompanyFooter from '../../components/layout/CompanyFooter';
import { ArrowRight, TrendingUp, Clock, Euro, Users, MapPin, CheckCircle } from 'lucide-react';

const CaseStudies = () => {
  const caseStudies = [
    {
      id: 1,
      title: "TechCorp Reduces Logistics Costs by 35%",
      company: "TechCorp",
      industry: "Technology",
      challenge: "High logistics costs and unreliable delivery times affecting customer satisfaction",
      solution: "Implemented CoPallet's intelligent matching system with verified carriers",
      results: {
        costReduction: "35%",
        deliveryTime: "50% faster",
        customerSatisfaction: "95%",
        shipmentsPerMonth: "500+"
      },
      testimonial: {
        text: "CoPallet transformed our logistics operations. We've reduced costs by 35% while improving delivery times significantly.",
        author: "Sarah Johnson",
        position: "Logistics Manager",
        company: "TechCorp"
      },
      metrics: [
        { label: "Cost Reduction", value: "35%", icon: TrendingUp },
        { label: "Faster Delivery", value: "50%", icon: Clock },
        { label: "Monthly Savings", value: "€15,000", icon: Euro },
        { label: "Active Carriers", value: "25+", icon: Users }
      ]
    },
    {
      id: 2,
      title: "RetailPlus Scales to 1,200+ Monthly Shipments",
      company: "RetailPlus",
      industry: "Retail",
      challenge: "Rapid growth requiring scalable logistics solution with real-time tracking",
      solution: "Deployed CoPallet's full platform with automated workflows and real-time tracking",
      results: {
        costReduction: "28%",
        deliveryTime: "40% faster",
        customerSatisfaction: "98%",
        shipmentsPerMonth: "1,200+"
      },
      testimonial: {
        text: "The platform is incredibly user-friendly. Finding reliable carriers has never been easier. Highly recommended!",
        author: "Michael Chen",
        position: "Operations Director",
        company: "RetailPlus"
      },
      metrics: [
        { label: "Cost Reduction", value: "28%", icon: TrendingUp },
        { label: "Faster Delivery", value: "40%", icon: Clock },
        { label: "Monthly Savings", value: "€28,000", icon: Euro },
        { label: "Active Carriers", value: "45+", icon: Users }
      ]
    },
    {
      id: 3,
      title: "PharmaLog Achieves 99.8% On-Time Delivery",
      company: "PharmaLog",
      industry: "Pharmaceuticals",
      challenge: "Temperature-controlled transport requiring ADR certification and strict compliance",
      solution: "Leveraged CoPallet's specialized carrier network with temperature monitoring",
      results: {
        costReduction: "22%",
        deliveryTime: "30% faster",
        customerSatisfaction: "99%",
        shipmentsPerMonth: "300+"
      },
      testimonial: {
        text: "CoPallet's specialized carriers and temperature monitoring gave us peace of mind for our pharmaceutical shipments.",
        author: "Dr. Emma Rodriguez",
        position: "Supply Chain Director",
        company: "PharmaLog"
      },
      metrics: [
        { label: "On-Time Delivery", value: "99.8%", icon: CheckCircle },
        { label: "Cost Reduction", value: "22%", icon: TrendingUp },
        { label: "Monthly Savings", value: "€12,000", icon: Euro },
        { label: "Compliance Rate", value: "100%", icon: CheckCircle }
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Success Stories</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              See how companies like yours are transforming their logistics with CoPallet
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Real Results from Real Companies
            </h2>
            <p className="text-xl text-gray-600">
              Discover how our clients achieved measurable improvements
            </p>
          </div>
          
          <div className="space-y-16">
            {caseStudies.map((study, index) => (
              <div key={study.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="bg-white p-8 rounded-xl shadow-lg">
                    <div className="flex items-center mb-4">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        <span className="text-blue-600 font-bold text-lg">{study.company.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{study.title}</h3>
                        <p className="text-gray-600">{study.industry} • {study.company}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Challenge:</h4>
                      <p className="text-gray-600 mb-4">{study.challenge}</p>
                      
                      <h4 className="font-semibold text-gray-900 mb-2">Solution:</h4>
                      <p className="text-gray-600">{study.solution}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {study.metrics.map((metric, metricIndex) => (
                        <div key={metricIndex} className="text-center p-4 bg-gray-50 rounded-lg">
                          <metric.icon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                          <div className="text-sm text-gray-600">{metric.label}</div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-gray-700 italic mb-3">"{study.testimonial.text}"</p>
                      <div className="text-sm text-gray-600">
                        <div className="font-semibold">{study.testimonial.author}</div>
                        <div>{study.testimonial.position}, {study.testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 rounded-xl">
                    <h3 className="text-2xl font-bold mb-6">Key Results</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Cost Reduction</span>
                        <span className="text-2xl font-bold">{study.results.costReduction}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Faster Delivery</span>
                        <span className="text-2xl font-bold">{study.results.deliveryTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Customer Satisfaction</span>
                        <span className="text-2xl font-bold">{study.results.customerSatisfaction}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Monthly Shipments</span>
                        <span className="text-2xl font-bold">{study.results.shipmentsPerMonth}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Stats */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Industry-Leading Results
            </h2>
            <p className="text-xl text-gray-600">
              Our clients consistently achieve outstanding outcomes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">32%</div>
              <div className="text-gray-600">Average Cost Reduction</div>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">45%</div>
              <div className="text-gray-600">Faster Delivery Times</div>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">99.8%</div>
              <div className="text-gray-600">On-Time Delivery Rate</div>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600">Verified Carriers</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Achieve Similar Results?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join hundreds of companies already using CoPallet to transform their logistics operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold px-8 py-4 rounded-lg text-lg transition-colors inline-flex items-center justify-center"
            >
              Start Your Success Story
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="/contact"
              className="border-2 border-white hover:bg-white hover:text-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors inline-flex items-center justify-center"
            >
              Schedule Demo
            </a>
          </div>
        </div>
      </section>

      <CompanyFooter />
    </div>
  );
};

export default CaseStudies;
