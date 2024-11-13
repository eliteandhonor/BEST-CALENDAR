import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { Country } from '../types';

interface CountryFilterProps {
  countries: Country[];
  selectedCountries: string[];
  onSelectCountry: (code: string) => void;
  onClose: () => void;
}

export const CountryFilter: React.FC<CountryFilterProps> = ({
  countries,
  selectedCountries,
  onSelectCountry,
  onClose,
}) => {
  const [search, setSearch] = useState('');

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-end p-4 z-50">
      <div className="bg-gray-900 w-full max-w-md rounded-xl shadow-xl">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Filter Calendar</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search countries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          
          <div className="space-y-2 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
            {filteredCountries.map((country) => (
              <button
                key={country.code}
                onClick={() => onSelectCountry(country.code)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg transition-colors
                  ${selectedCountries.includes(country.code)
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-gray-800 hover:bg-gray-700'}
                `}
              >
                <img
                  src={country.flag}
                  alt={`${country.name} flag`}
                  className="w-8 h-6 object-cover rounded"
                />
                <span className="flex-1 text-left text-white font-medium">
                  {country.name}
                </span>
                {selectedCountries.includes(country.code) && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};