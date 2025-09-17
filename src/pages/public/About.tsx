import CompanyHeader from '../../components/layout/CompanyHeader';
import CompanyFooter from '../../components/layout/CompanyFooter';
import { Users, Target, Award, Globe, CheckCircle } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      <CompanyHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About CoPallet</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Revolutionizing pallet freight logistics across Europe with innovative technology and trusted partnerships.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                To create the most efficient, transparent, and reliable pallet freight marketplace in Europe. 
                We believe that logistics should be simple, cost-effective, and accessible to businesses of all sizes.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                By connecting verified carriers with quality shippers through our intelligent platform, 
                we're reducing costs, improving delivery times, and building trust in the freight industry.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-gray-600">Verified Carriers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">1,200+</div>
                  <div className="text-gray-600">Active Shippers</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Values</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Transparency</h4>
                    <p className="text-gray-600">Clear pricing, real-time tracking, and honest communication.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Reliability</h4>
                    <p className="text-gray-600">Verified carriers and guaranteed service quality.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Innovation</h4>
                    <p className="text-gray-600">Cutting-edge technology to streamline logistics.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Partnership</h4>
                    <p className="text-gray-600">Building long-term relationships with our users.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">
              Experienced professionals passionate about transforming logistics
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gray-200 w-32 h-32 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sarah Johnson</h3>
              <p className="text-blue-600 font-medium mb-2">CEO & Founder</p>
              <p className="text-gray-600">
                Former logistics executive with 15+ years in freight operations. 
                Passionate about technology-driven solutions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-200 w-32 h-32 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Michael Chen</h3>
              <p className="text-blue-600 font-medium mb-2">CTO</p>
              <p className="text-gray-600">
                Technology leader with expertise in marketplace platforms and 
                real-time tracking systems.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-gray-200 w-32 h-32 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Emma Rodriguez</h3>
              <p className="text-blue-600 font-medium mb-2">Head of Operations</p>
              <p className="text-gray-600">
                Operations expert focused on carrier verification and 
                quality assurance processes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">
              From startup to industry leader
            </p>
          </div>
          
          <div className="space-y-8">
            <div className="flex items-center space-x-6">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                2020
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Company Founded</h3>
                <p className="text-gray-600">
                  CoPallet was founded with a vision to revolutionize pallet freight logistics in Europe.
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                2021
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Platform Launch</h3>
                <p className="text-gray-600">
                  Launched our marketplace platform with 50 verified carriers and 100 shippers.
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                2022
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">European Expansion</h3>
                <p className="text-gray-600">
                  Expanded operations to Germany, France, and Belgium, reaching 500+ carriers.
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                2023
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Technology Innovation</h3>
                <p className="text-gray-600">
                  Introduced AI-powered matching, real-time tracking, and automated pricing.
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                2024
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Market Leadership</h3>
                <p className="text-gray-600">
                  Achieved 15,000+ completed shipments with 99.8% on-time delivery rate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CompanyFooter />
    </div>
  );
};

export default About;
