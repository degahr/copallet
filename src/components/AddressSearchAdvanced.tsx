import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2, X, Edit3, Check } from 'lucide-react';

interface AddressSuggestion {
  id: string;
  display_name: string;
  lat: string;
  lon: string;
  address: {
    house_number?: string;
    road?: string;
    city?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
    state?: string;
    county?: string;
  };
}

interface AddressData {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

interface AddressSearchProps {
  value: AddressData;
  onChange: (address: AddressData) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
  error?: string;
}

const AddressSearch: React.FC<AddressSearchProps> = ({
  value,
  onChange,
  placeholder = "Search for an address...",
  className = "",
  label,
  required = false,
  error
}) => {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [manualAddress, setManualAddress] = useState<AddressData>({
    street: '',
    city: '',
    postalCode: '',
    country: ''
  });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Initialize search query from value
  useEffect(() => {
    if (value.street && value.city) {
      setSearchQuery(`${value.street}, ${value.city}`);
    }
  }, []);

  // Debounced search function
  const searchAddresses = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Using Nominatim (OpenStreetMap) geocoding service
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=8&addressdetails=1&countrycodes=de,nl,be,fr,at,ch,it,es,pl,cz,dk,se,no,fi&extratags=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout for debounced search
    debounceRef.current = setTimeout(() => {
      searchAddresses(query);
    }, 300);

    setShowSuggestions(true);
    setSelectedIndex(-1);
    setIsManualEntry(false);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: AddressSuggestion) => {
    const addressData = parseAddressFromSuggestion(suggestion);
    onChange(addressData);
    setSearchQuery(formatAddressFromData(addressData));
    setShowSuggestions(false);
    setSuggestions([]);
    setIsManualEntry(false);
  };

  // Parse address from suggestion
  const parseAddressFromSuggestion = (suggestion: AddressSuggestion): AddressData => {
    const { address } = suggestion;
    
    let street = '';
    if (address.house_number && address.road) {
      street = `${address.road} ${address.house_number}`;
    } else if (address.road) {
      street = address.road;
    }

    return {
      street: street || '',
      city: address.city || address.county || '',
      postalCode: address.postcode || '',
      country: address.country || '',
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon)
    };
  };

  // Format address for display
  const formatAddressFromData = (address: AddressData): string => {
    const parts = [];
    if (address.street) parts.push(address.street);
    if (address.postalCode && address.city) {
      parts.push(`${address.postalCode} ${address.city}`);
    } else if (address.city) {
      parts.push(address.city);
    }
    if (address.country) parts.push(address.country);
    return parts.join(', ');
  };

  // Handle manual entry
  const handleManualEntry = () => {
    setIsManualEntry(true);
    setManualAddress({ ...value });
    setShowSuggestions(false);
  };

  // Handle manual address change
  const handleManualAddressChange = (field: keyof AddressData, newValue: string) => {
    setManualAddress(prev => ({
      ...prev,
      [field]: newValue
    }));
  };

  // Save manual address
  const saveManualAddress = () => {
    onChange(manualAddress);
    setSearchQuery(formatAddressFromData(manualAddress));
    setIsManualEntry(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isManualEntry) return;
    
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear suggestions when input is cleared
  useEffect(() => {
    if (!searchQuery) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  if (isManualEntry) {
    return (
      <div className={`space-y-4 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Street Address</label>
            <input
              type="text"
              value={manualAddress.street}
              onChange={(e) => handleManualAddressChange('street', e.target.value)}
              placeholder="Street name and number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">City</label>
              <input
                type="text"
                value={manualAddress.city}
                onChange={(e) => handleManualAddressChange('city', e.target.value)}
                placeholder="City"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Postal Code</label>
              <input
                type="text"
                value={manualAddress.postalCode}
                onChange={(e) => handleManualAddressChange('postalCode', e.target.value)}
                placeholder="Postal code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Country</label>
            <select
              value={manualAddress.country}
              onChange={(e) => handleManualAddressChange('country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select country</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Germany">Germany</option>
              <option value="Belgium">Belgium</option>
              <option value="France">France</option>
              <option value="Austria">Austria</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Italy">Italy</option>
              <option value="Spain">Spain</option>
              <option value="Poland">Poland</option>
              <option value="Czech Republic">Czech Republic</option>
              <option value="Denmark">Denmark</option>
              <option value="Sweden">Sweden</option>
              <option value="Norway">Norway</option>
              <option value="Finland">Finland</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsManualEntry(false)}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            ← Back to search
          </button>
          
          <button
            type="button"
            onClick={saveManualAddress}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <Check className="h-4 w-4 mr-1" />
            Save Address
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className={`block w-full pl-10 pr-20 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
          autoComplete="off"
        />
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-1">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                onChange({ street: '', city: '', postalCode: '', country: '' });
              }}
              className="h-5 w-5 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
          
          <button
            type="button"
            onClick={handleManualEntry}
            className="h-5 w-5 text-gray-400 hover:text-gray-600"
            title="Enter address manually"
          >
            <Edit3 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              onClick={() => handleSuggestionSelect(suggestion)}
              className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${
                index === selectedIndex ? 'bg-primary-50' : ''
              }`}
            >
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {formatAddressFromData(parseAddressFromSuggestion(suggestion))}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {suggestion.display_name}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && !isLoading && suggestions.length === 0 && searchQuery.length >= 3 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          <div className="text-center text-gray-500">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No addresses found</p>
            <p className="text-xs text-gray-400 mt-1">
              Try a different search term or enter the address manually
            </p>
            <button
              type="button"
              onClick={handleManualEntry}
              className="mt-2 text-xs text-primary-600 hover:text-primary-700"
            >
              Enter address manually
            </button>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {/* Help text */}
      <p className="mt-2 text-xs text-gray-500">
        Start typing to search for addresses. Use arrow keys to navigate suggestions or click the edit icon to enter manually.
      </p>
    </div>
  );
};

export default AddressSearch;
