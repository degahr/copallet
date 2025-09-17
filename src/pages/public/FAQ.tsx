import CompanyHeader from '../../components/layout/CompanyHeader';
import CompanyFooter from '../../components/layout/CompanyFooter';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqData = [
    {
      category: "General",
      questions: [
        {
          question: "What is CoPallet?",
          answer: "CoPallet is a digital marketplace that connects shippers with verified carriers for pallet freight transportation across Europe. We streamline the logistics process by providing real-time matching, tracking, and secure payments."
        },
        {
          question: "How does CoPallet work?",
          answer: "Shippers post their freight requirements on our platform, and verified carriers can bid on shipments that match their routes and capabilities. Once a bid is accepted, the carrier picks up and delivers the goods while providing real-time tracking updates."
        },
        {
          question: "Is CoPallet available in my country?",
          answer: "CoPallet currently operates in the Netherlands, Germany, Belgium, France, Austria, Italy, and Switzerland. We're continuously expanding to cover more European countries."
        }
      ]
    },
    {
      category: "For Shippers",
      questions: [
        {
          question: "How do I get started as a shipper?",
          answer: "Simply sign up for a free account, verify your business details, and start posting shipments. You can begin with our free Starter plan which includes up to 5 shipments per month."
        },
        {
          question: "How are carriers verified?",
          answer: "All carriers undergo a comprehensive verification process including insurance checks, license validation, safety record review, and equipment inspection. We also monitor performance ratings and customer feedback."
        },
        {
          question: "What types of goods can I ship?",
          answer: "We handle standard palletized freight, temperature-controlled goods, dangerous goods (ADR), and specialized cargo. Each shipment type has specific carrier requirements and pricing."
        },
        {
          question: "How do I track my shipments?",
          answer: "You can track shipments in real-time through our platform or mobile app. You'll receive GPS updates, ETA notifications, and delivery confirmations automatically."
        }
      ]
    },
    {
      category: "For Carriers",
      questions: [
        {
          question: "How do I become a carrier on CoPallet?",
          answer: "Apply through our carrier registration process, provide required documentation (insurance, licenses, safety records), and complete our verification process. Once approved, you can start bidding on shipments."
        },
        {
          question: "What documents do I need to provide?",
          answer: "You'll need valid transport insurance, commercial vehicle licenses, ADR certification (if applicable), safety records, and proof of business registration. We'll guide you through the specific requirements."
        },
        {
          question: "How do I get paid?",
          answer: "Payments are processed automatically upon successful delivery confirmation. We use secure escrow services and offer multiple payment methods including bank transfer and digital wallets."
        },
        {
          question: "Can I set up automated bidding?",
          answer: "Yes, our Professional and Enterprise plans include auto-bid rules that automatically place bids on shipments matching your criteria, helping you win more business while you focus on driving."
        }
      ]
    },
    {
      category: "Pricing & Billing",
      questions: [
        {
          question: "How much does CoPallet cost?",
          answer: "We offer a free Starter plan with up to 5 shipments per month. Professional plans start at €99/month for up to 50 shipments, and Enterprise plans offer custom pricing for unlimited shipments."
        },
        {
          question: "Are there any hidden fees?",
          answer: "No hidden fees. Our pricing is transparent with clear per-shipment costs and optional add-on services. You only pay for what you use."
        },
        {
          question: "How does billing work?",
          answer: "Monthly subscriptions are billed in advance. Additional shipments beyond your plan limit are charged at €5 per shipment. Enterprise customers receive custom billing arrangements."
        },
        {
          question: "Can I cancel anytime?",
          answer: "Yes, you can cancel your subscription at any time. Changes take effect at the end of your current billing period, and we'll prorate any differences."
        }
      ]
    },
    {
      category: "Support & Technical",
      questions: [
        {
          question: "What support do you offer?",
          answer: "We provide 24/7 customer support via email, phone, and live chat. Professional and Enterprise customers receive priority support with faster response times."
        },
        {
          question: "Do you have a mobile app?",
          answer: "Yes, we have mobile apps for both iOS and Android that allow you to manage shipments, track deliveries, and communicate with partners on the go."
        },
        {
          question: "Is there an API available?",
          answer: "Yes, our Professional and Enterprise plans include API access for integrating CoPallet with your existing systems and workflows."
        },
        {
          question: "How secure is my data?",
          answer: "We use enterprise-grade security including SSL encryption, secure data centers, and compliance with GDPR and other data protection regulations."
        }
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Find answers to common questions about CoPallet and our services
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.category}</h2>
              <div className="space-y-4">
                {category.questions.map((item, itemIndex) => {
                  const globalIndex = categoryIndex * 100 + itemIndex;
                  const isOpen = openItems.includes(globalIndex);
                  
                  return (
                    <div key={itemIndex} className="bg-white rounded-xl shadow-sm">
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 rounded-xl transition-colors"
                      >
                        <span className="font-semibold text-gray-900">{item.question}</span>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors inline-flex items-center justify-center"
            >
              Contact Support
            </a>
            <a
              href="/signup"
              className="border-2 border-blue-600 hover:bg-blue-600 text-blue-600 hover:text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors inline-flex items-center justify-center"
            >
              Get Started Free
            </a>
          </div>
        </div>
      </section>

      <CompanyFooter />
    </div>
  );
};

export default FAQ;
