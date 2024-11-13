import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import type { Country } from '../types';

interface CountryListProps {
  countries: Country[];
  selectedCountry: string | null;
  onSelectCountry: (code: string | null) => void;
}

export const CountryList: React.FC<CountryListProps> = ({
  countries,
  selectedCountry,
  onSelectCountry
}) => {
  const [search, setSearch] = useState('');

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(search.toLowerCase()) ||
    country.capital.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gray-900 rounded-xl shadow-xl h-[calc(100vh-8rem)] flex flex-col overflow-hidden">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Countries
          </h2>
          {selectedCountry && (
            <button
              onClick={() => onSelectCountry(null)}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear Selection
            </button>
          )}
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search countries or capitals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 grid gap-2">
          {filteredCountries.map((country) => (
            <button
              key={country.code}
              onClick={() => onSelectCountry(country.code)}
              className={`
                w-full flex items-center gap-4 p-4 rounded-lg transition-all duration-200
                ${country.code === selectedCountry 
                  ? 'bg-blue-500 hover:bg-blue-600' 
                  : 'bg-gray-800 hover:bg-gray-700'}
              `}
            >
              <img
                src={country.flag}
                alt={`${country.name} flag`}
                className="w-16 h-10 object-cover rounded shadow-sm"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">
                  {country.name}
                </h3>
                <div className="text-sm text-gray-400 truncate">
                  {country.capital}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};