import { DateTime } from 'luxon';

// Predefined IANA timezone groups
const IANA_TIMEZONES = {
  Africa: [
    'Africa/Cairo', 'Africa/Casablanca', 'Africa/Johannesburg', 'Africa/Lagos',
    'Africa/Nairobi', 'Africa/Tunis'
  ],
  America: {
    North: [
      'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
      'America/Phoenix', 'America/Anchorage', 'America/Toronto', 'America/Vancouver'
    ],
    Central: [
      'America/Mexico_City', 'America/Panama', 'America/Costa_Rica', 'America/El_Salvador',
      'America/Guatemala', 'America/Managua', 'America/Tegucigalpa'
    ],
    South: [
      'America/Sao_Paulo', 'America/Buenos_Aires', 'America/Santiago', 'America/Lima',
      'America/Bogota', 'America/Caracas'
    ],
    Caribbean: [
      'America/Santo_Domingo', 'America/Port-au-Prince', 'America/Havana',
      'America/Jamaica', 'America/Puerto_Rico'
    ]
  },
  Antarctica: [
    'Antarctica/Casey', 'Antarctica/Davis', 'Antarctica/DumontDUrville',
    'Antarctica/Mawson', 'Antarctica/McMurdo', 'Antarctica/Palmer',
    'Antarctica/Rothera', 'Antarctica/Syowa', 'Antarctica/Troll', 'Antarctica/Vostok'
  ],
  Arctic: ['Arctic/Longyearbyen'],
  Asia: {
    Central: [
      'Asia/Almaty', 'Asia/Bishkek', 'Asia/Dhaka', 'Asia/Karachi',
      'Asia/Tashkent', 'Asia/Yekaterinburg'
    ],
    Eastern: [
      'Asia/Hong_Kong', 'Asia/Tokyo', 'Asia/Seoul', 'Asia/Shanghai',
      'Asia/Singapore', 'Asia/Taipei'
    ],
    Southern: [
      'Asia/Colombo', 'Asia/Kolkata', 'Asia/Mumbai', 'Asia/Kathmandu',
      'Asia/Thimphu'
    ],
    Western: [
      'Asia/Dubai', 'Asia/Baghdad', 'Asia/Jerusalem', 'Asia/Kuwait',
      'Asia/Riyadh', 'Asia/Tehran'
    ],
    Pacific: [
      'Asia/Vladivostok', 'Asia/Magadan', 'Asia/Kamchatka', 'Asia/Sakhalin'
    ]
  },
  Atlantic: [
    'Atlantic/Azores', 'Atlantic/Cape_Verde', 'Atlantic/South_Georgia',
    'Atlantic/Stanley', 'Atlantic/Reykjavik'
  ],
  Australia: [
    'Australia/Sydney', 'Australia/Melbourne', 'Australia/Brisbane',
    'Australia/Adelaide', 'Australia/Perth', 'Australia/Darwin'
  ],
  Europe: {
    Central: [
      'Europe/Amsterdam', 'Europe/Berlin', 'Europe/Brussels', 'Europe/Paris',
      'Europe/Rome', 'Europe/Vienna', 'Europe/Warsaw'
    ],
    Eastern: [
      'Europe/Athens', 'Europe/Bucharest', 'Europe/Helsinki', 'Europe/Kiev',
      'Europe/Riga', 'Europe/Sofia'
    ],
    Western: [
      'Europe/Dublin', 'Europe/Lisbon', 'Europe/London', 'Europe/Madrid'
    ],
    Russia: [
      'Europe/Moscow', 'Europe/Samara', 'Europe/Kaliningrad'
    ]
  },
  Indian: [
    'Indian/Maldives', 'Indian/Mauritius', 'Indian/Reunion',
    'Indian/Mahe', 'Indian/Kerguelen'
  ],
  Pacific: [
    'Pacific/Auckland', 'Pacific/Fiji', 'Pacific/Guam', 'Pacific/Honolulu',
    'Pacific/Samoa', 'Pacific/Tahiti'
  ]
};

// Get all timezones as a flat array
export const getAllTimezones = (): string[] => {
  const timezones = new Set<string>();
  
  Object.values(IANA_TIMEZONES).forEach(region => {
    if (Array.isArray(region)) {
      region.forEach(zone => timezones.add(zone));
    } else {
      Object.values(region).forEach(subRegion => {
        subRegion.forEach(zone => timezones.add(zone));
      });
    }
  });
  
  return Array.from(timezones).sort();
};

// Get timezone groups with their zones
export const getTimezoneGroups = () => IANA_TIMEZONES;

// Format time using Luxon with browser fallback
export const formatTime = (date: Date, timezone: string): string => {
  try {
    return DateTime.fromJSDate(date)
      .setZone(timezone)
      .toLocaleString(DateTime.TIME_SIMPLE);
  } catch (error) {
    console.error(`Failed to format time for timezone ${timezone}`);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
};

// Get current time for a timezone
export const getCurrentTime = (timezone: string): string => {
  try {
    return DateTime.now().setZone(timezone).toLocaleString(DateTime.TIME_SIMPLE);
  } catch (error) {
    console.error(`Failed to get current time for timezone ${timezone}:`, error);
    return '--:--';
  }
};

// Get UTC offset for a timezone
export const getUTCOffset = (timezone: string): string => {
  try {
    const offset = DateTime.now().setZone(timezone).toFormat('ZZ');
    return offset === '+00:00' ? '+0' : offset;
  } catch (error) {
    console.error(`Failed to get UTC offset for timezone ${timezone}:`, error);
    return '';
  }
};

// Check if a timezone has DST
export const hasDST = (timezone: string): boolean => {
  try {
    const june = DateTime.local(2024, 6, 1).setZone(timezone);
    const december = DateTime.local(2024, 12, 1).setZone(timezone);
    return june.offset !== december.offset;
  } catch (error) {
    console.error(`Failed to check DST for timezone ${timezone}:`, error);
    return false;
  }
};

// Get timezone for a country
export const getTimezoneForCountry = (country: Country): string => {
  const countryCode = country.code.split('-')[0];
  const allTimezones = getAllTimezones();
  
  const zonesForCountry = allTimezones.filter(zone => 
    zone.includes(countryCode) || 
    (country.capital && zone.includes(country.capital))
  );

  if (zonesForCountry.length > 0) {
    return zonesForCountry[0];
  }

  return country.timezone || 'UTC';
};

// Get all UTC offsets
export const getUTCOffsets = (): string[] => {
  const offsets = new Set<string>();
  for (let i = -12; i <= 14; i++) {
    const sign = i >= 0 ? '+' : '';
    offsets.add(`UTC${sign}${i}`);
  }
  return Array.from(offsets).sort((a, b) => {
    const numA = parseInt(a.replace('UTC', '')) || 0;
    const numB = parseInt(b.replace('UTC', '')) || 0;
    return numA - numB;
  });
};

// Get timezone information
export const getTimezoneInfo = (timezone: string) => {
  try {
    const now = DateTime.now().setZone(timezone);
    return {
      name: timezone,
      offset: now.toFormat('ZZ'),
      abbreviation: now.toFormat('ZZZZ'),
      isDST: now.isInDST,
      currentTime: now.toLocaleString(DateTime.TIME_SIMPLE),
    };
  } catch (error) {
    console.error(`Failed to get timezone info for ${timezone}:`, error);
    return null;
  }
};

// Export timezone constants
export const TIMEZONE_GROUPS = {
  UTC: getUTCOffsets(),
  ...IANA_TIMEZONES
};