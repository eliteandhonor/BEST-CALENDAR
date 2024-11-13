import React, { useState, useEffect } from 'react';
import { Clock, Sun, Moon, ArrowUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { Country } from '../types';
import { getTimezoneForCountry, getCurrentTime, getUTCOffset, hasDST } from '../services/timezone';

interface TimeZoneInfoProps {
  country: Country;
}

export const TimeZoneInfo: React.FC<TimeZoneInfoProps> = ({ country }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [currentTime, setCurrentTime] = useState('--:--');
  const [offset, setOffset] = useState('');
  const [isDST, setIsDST] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const timezone = getTimezoneForCountry(country);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const [time, utcOffset, dst] = await Promise.all([
          getCurrentTime(timezone),
          getUTCOffset(timezone),
          hasDST(timezone)
        ]);

        if (mounted) {
          setCurrentTime(time);
          setOffset(utcOffset);
          setIsDST(dst);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch timezone data:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [timezone]);

  // Get current season (day/night)
  const isDaytime = (() => {
    try {
      const hour = new Date().getHours();
      return hour >= 6 && hour < 18;
    } catch {
      return true; // Default to daytime if calculation fails
    }
  })();

  return (
    <div className="bg-gray-800 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={country.flag}
            alt={`${country.name} flag`}
            className="w-8 h-6 object-cover rounded shadow-sm"
          />
          <h3 className="font-semibold text-white">{country.name}</h3>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ArrowUpDown className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2 text-gray-300">
          <Clock className="w-4 h-4" />
          {loading ? (
            <span className="animate-pulse">Loading...</span>
          ) : (
            currentTime
          )}
        </div>
        {isDaytime ? (
          <div className="flex items-center gap-2 text-yellow-400">
            <Sun className="w-4 h-4" />
            Day
          </div>
        ) : (
          <div className="flex items-center gap-2 text-blue-400">
            <Moon className="w-4 h-4" />
            Night
          </div>
        )}
      </div>

      {showDetails && (
        <div className="pt-3 border-t border-gray-700 space-y-2 text-sm">
          <div className="flex items-center justify-between text-gray-400">
            <span>Timezone:</span>
            <span className="text-gray-300">{timezone}</span>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span>UTC Offset:</span>
            <span className="text-gray-300">{loading ? '...' : offset}</span>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span>DST:</span>
            <span className={isDST ? 'text-green-400' : 'text-gray-300'}>
              {loading ? '...' : (isDST ? 'Observed' : 'Not Observed')}
            </span>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span>Current Date:</span>
            <span className="text-gray-300">
              {format(new Date(), 'MMMM d, yyyy')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};