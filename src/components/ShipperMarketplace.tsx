import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Star,
  Truck,
  Clock,
  Euro,
  MessageSquare,
  CheckCircle,
  Users,
  Shield,
  Award
} from 'lucide-react';
import QuoteRequestModal from './QuoteRequestModal';
import ChatModal from './ChatModal';

interface Carrier {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  serviceAreas: string[];
  capabilities: {
    adr: boolean;
    tailLift: boolean;
    forklift: boolean;
    temperatureControlled: boolean;
    whiteGlove: boolean;
  };
  pricing: {
    baseRate: number;
    costPerKm: number;
    minOrder: number;
  };
  stats: {
    totalShipments: number;
    onTimeRate: number;
    responseTime: string;
  };
}

const ShipperMarketplace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minRating: 0,
    verifiedOnly: false,
    maxDistance: 100,
    capabilities: {
      adr: false,
      tailLift: false,
      forklift: false,
      temperatureControlled: false,
      whiteGlove: false
    }
  });
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  React.useEffect(() => {
    const fetchCarriers = async () => {
      try {
        // Mock carrier data - in real app, this would come from API
        const mockCarriers: Carrier[] = [
          {
            id: 'carrier1',
            name: 'John Smith',
            company: 'FastTrack Logistics',
            email: 'john@fasttrack.com',
            phone: '+31 6 1234 5678',
            rating: 4.8,
            reviewCount: 127,
            verified: true,
            serviceAreas: ['Amsterdam', 'Rotterdam', 'Utrecht', 'The Hague'],
            capabilities: {
              adr: true,
              tailLift: true,
              forklift: true,
              temperatureControlled: false,
              whiteGlove: true
            },
            pricing: {
              baseRate: 25,
              costPerKm: 0.15,
              minOrder: 50
            },
            stats: {
              totalShipments: 342,
              onTimeRate: 96,
              responseTime: '< 2 hours'
            }
          },
          {
            id: 'carrier2',
            name: 'Maria Garcia',
            company: 'EuroFreight Solutions',
            email: 'maria@eurofreight.com',
            phone: '+31 6 2345 6789',
            rating: 4.6,
            reviewCount: 89,
            verified: true,
            serviceAreas: ['Amsterdam', 'Eindhoven', 'Tilburg', 'Breda'],
            capabilities: {
              adr: false,
              tailLift: true,
              forklift: false,
              temperatureControlled: true,
              whiteGlove: false
            },
            pricing: {
              baseRate: 20,
              costPerKm: 0.12,
              minOrder: 40
            },
            stats: {
              totalShipments: 198,
              onTimeRate: 94,
              responseTime: '< 4 hours'
            }
          },
          {
            id: 'carrier3',
            name: 'David Johnson',
            company: 'Reliable Transport',
            email: 'david@reliable.com',
            phone: '+31 6 3456 7890',
            rating: 4.9,
            reviewCount: 203,
            verified: true,
            serviceAreas: ['Amsterdam', 'Rotterdam', 'Groningen', 'Maastricht'],
            capabilities: {
              adr: true,
              tailLift: false,
              forklift: true,
              temperatureControlled: true,
              whiteGlove: true
            },
            pricing: {
              baseRate: 30,
              costPerKm: 0.18,
              minOrder: 60
            },
            stats: {
              totalShipments: 456,
              onTimeRate: 98,
              responseTime: '< 1 hour'
            }
          }
        ];
        
        setCarriers(mockCarriers);
      } catch (error) {
        console.error('Failed to fetch carriers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarriers();
  }, []);

  const filteredCarriers = useMemo(() => {
    return carriers.filter(carrier => {
      const matchesSearch = 
        carrier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        carrier.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        carrier.serviceAreas.some(area => 
          area.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesRating = carrier.rating >= filters.minRating;
      const matchesVerification = !filters.verifiedOnly || carrier.verified;
      
      const matchesCapabilities = Object.entries(filters.capabilities).every(([capability, required]) => {
        if (!required) return true;
        return carrier.capabilities[capability as keyof typeof carrier.capabilities];
      });
      
      return matchesSearch && matchesRating && matchesVerification && matchesCapabilities;
    });
  }, [carriers, searchTerm, filters]);

  const handleRequestQuote = (carrier: Carrier) => {
    setSelectedCarrier(carrier);
    setShowQuoteModal(true);
  };

  const handleStartChat = (carrier: Carrier) => {
    setSelectedCarrier(carrier);
    setShowChatModal(true);
  };

  const handleQuoteSubmit = async (quoteData: any) => {
    // In a real app, this would send the quote request to the backend
    console.log('Quote request submitted:', quoteData);
    // You could show a success message here
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Carrier Marketplace</h2>
        <p className="text-gray-600">Find and connect with verified carriers for your shipments</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search carriers by name, company, or service area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.verifiedOnly}
                onChange={(e) => setFilters(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Verified Only</span>
            </label>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
              <select
                value={filters.minRating}
                onChange={(e) => setFilters(prev => ({ ...prev, minRating: parseFloat(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value={0}>Any Rating</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
                <option value={4.8}>4.8+ Stars</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Capabilities</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.capabilities.adr}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      capabilities: { ...prev.capabilities, adr: e.target.checked }
                    }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-xs text-gray-700">ADR</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.capabilities.tailLift}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      capabilities: { ...prev.capabilities, tailLift: e.target.checked }
                    }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-xs text-gray-700">Tail Lift</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">More Capabilities</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.capabilities.forklift}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      capabilities: { ...prev.capabilities, forklift: e.target.checked }
                    }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-xs text-gray-700">Forklift</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.capabilities.temperatureControlled}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      capabilities: { ...prev.capabilities, temperatureControlled: e.target.checked }
                    }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-xs text-gray-700">Temp Control</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Level</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.capabilities.whiteGlove}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      capabilities: { ...prev.capabilities, whiteGlove: e.target.checked }
                    }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-xs text-gray-700">White Glove</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {filteredCarriers.length} carrier{filteredCarriers.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Carriers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCarriers.length === 0 ? (
          <div className="col-span-2 bg-white rounded-lg shadow p-12 text-center">
            <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No carriers found</h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or check back later for new carriers.
            </p>
          </div>
        ) : (
          filteredCarriers.map((carrier) => (
            <div key={carrier.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <Truck className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{carrier.company}</h3>
                      <p className="text-sm text-gray-600">{carrier.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {carrier.verified && (
                      <div className="flex items-center text-green-600">
                        <Shield className="h-4 w-4 mr-1" />
                        <span className="text-xs font-medium">Verified</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium text-gray-900">{carrier.rating}</span>
                      <span className="ml-1 text-xs text-gray-500">({carrier.reviewCount})</span>
                    </div>
                  </div>
                </div>

                {/* Service Areas */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Service Areas</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {carrier.serviceAreas.map((area, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Capabilities */}
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Award className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700">Capabilities</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(carrier.capabilities).map(([capability, available]) => (
                      available && (
                        <span
                          key={capability}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {capability.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                      )
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{carrier.stats.totalShipments}</div>
                    <div className="text-xs text-gray-500">Shipments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{carrier.stats.onTimeRate}%</div>
                    <div className="text-xs text-gray-500">On Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{carrier.stats.responseTime}</div>
                    <div className="text-xs text-gray-500">Response</div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Starting from</span>
                    <span className="font-semibold text-gray-900">€{carrier.pricing.baseRate}/pallet</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600">Per km</span>
                    <span className="font-semibold text-gray-900">€{carrier.pricing.costPerKm}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Min order: €{carrier.pricing.minOrder}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleStartChat(carrier)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Chat
                    </button>
                    
                    <button 
                      onClick={() => handleRequestQuote(carrier)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                      <Euro className="h-4 w-4 mr-1" />
                      Request Quote
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      {selectedCarrier && (
        <>
          <QuoteRequestModal
            isOpen={showQuoteModal}
            onClose={() => setShowQuoteModal(false)}
            carrier={selectedCarrier}
            onSubmit={handleQuoteSubmit}
          />
          
          <ChatModal
            isOpen={showChatModal}
            onClose={() => setShowChatModal(false)}
            carrier={selectedCarrier}
          />
        </>
      )}
    </div>
  );
};

export default ShipperMarketplace;
