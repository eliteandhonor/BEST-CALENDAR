import React, { useState } from 'react';
import { Search, Filter, Globe, Clock, Sun } from 'lucide-react';
import { Country } from '../types';
import { TimeZoneInfo } from './TimeZoneInfo';
import { TIMEZONE_GROUPS, getAllTimezones } from '../services/timezone';

interface TimeZoneListProps {
  countries: Country[];
}

type TimezoneGroup = 'all' | 'utc' | 'africa' | 'america' | 'antarctica' | 'arctic' | 'asia' | 'atlantic' | 'australia' | 'europe' | 'indian' | 'pacific';
type DSTFilter = 'all' | 'dst' | 'no-dst';

export const TimeZoneList: React.FC<TimeZoneListProps> = ({ countries }) => {
  const [search, setSearch] = useState('');
  const [dstFilter, setDSTFilter] = useState<DSTFilter>('all');
  const [groupFilter, setGroupFilter] = useState<TimezoneGroup>('all');

  const getGroupTimezones = (group: TimezoneGroup): string[] => {
    if (group === 'all') return getAllTimezones();
    
    switch (group) {
      case 'utc':
        return TIMEZONE_GROUPS.UTC;
      case 'africa':
        return TIMEZONE_GROUPS.Africa;
      case 'america':
        return [
          ...TIMEZONE_GROUPS.America.North,
          ...TIMEZONE_GROUPS.America.Central,
          ...TIMEZONE_GROUPS.America.South,
          ...TIMEZONE_GROUPS.America.Caribbean
        ];
      case 'antarctica':
        return TIMEZONE_GROUPS.Antarctica;
      case 'arctic':
        return TIMEZONE_GROUPS.Arctic;
      case 'asia':
        return [
          ...TIMEZONE_GROUPS.Asia.Central,
          ...TIMEZONE_GROUPS.Asia.Eastern,
          ...TIMEZONE_GROUPS.Asia.Southern,
          ...TIMEZONE_GROUPS.Asia.Western,
          ...TIMEZONE_GROUPS.Asia.Pacific
        ];
      case 'atlantic':
        return TIMEZONE_GROUPS.Atlantic;
      case 'australia':
        return TIMEZONE_GROUPS.Australia;
      case 'europe':
        return [
          ...TIMEZONE_GROUPS.Europe.Central,
          ...TIMEZONE_GROUPS.Europe.Eastern,
          ...TIMEZONE_GROUPS.Europe.Western,
          ...TIMEZONE_GROUPS.Europe.Russia
        ];
      case 'indian':
        return TIMEZONE_GROUPS.Indian;
      case 'pacific':
        return TIMEZONE_GROUPS.Pacific;
      default:
        return [];
    }
  };

  const timeZoneButtons = [
    { id: 'all', label: 'All Zones', icon: <Globe className="w-4 h-4" /> },
    { id: 'utc', label: 'UTC/GMT', icon: <Clock className="w-4 h-4" /> },
    { id: 'america', label: 'Americas', icon: <Sun className="w-4 h-4" /> },
    { id: 'europe', label: 'Europe' },
    { id: 'africa', label: 'Africa' },
    { id: 'asia', label: 'Asia' },
    { id: 'pacific', label: 'Pacific' },
    { id: 'australia', label: 'Australia' },
    { id: 'atlantic', label: 'Atlantic' },
    { id: 'indian', label: 'Indian' },
    { id: 'antarctica', label: 'Antarctica' },
    { id: 'arctic', label: 'Arctic' }
  ];

  const filteredCountries = countries.filter(country => {
    const matchesSearch = country.name.toLowerCase().includes(search.toLowerCase()) ||
                         country.timezone.toLowerCase().includes(search.toLowerCase());

    if (groupFilter !== 'all') {
      const groupTimezones = getGroupTimezones(groupFilter);
      if (!groupTimezones.includes(country.timezone)) return false;
    }

    return matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search countries or timezones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {timeZoneButtons.map(button => (
            <button
              key={button.id}
              onClick={() => setGroupFilter(button.id as TimezoneGroup)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                groupFilter === button.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {button.icon}
              {button.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1 w-fit">
          <button
            onClick={() => setDSTFilter('all')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              dstFilter === 'all'
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setDSTFilter('dst')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              dstFilter === 'dst'
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            DST
          </button>
          <button
            onClick={() => setDSTFilter('no-dst')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              dstFilter === 'no-dst'
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            No DST
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {filteredCountries.map(country => (
          <TimeZoneInfo key={country.code} country={country} />
        ))}
      </div>

      {filteredCountries.length === 0 && (
        <div className="text-center py-12">
          <Filter className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400">No results found</h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};