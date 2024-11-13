import type { Event } from '../types';

const COLORS = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // yellow
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
];

export const fetchHolidays = async (year: number): Promise<Event[]> => {
  try {
    const countriesResponse = await fetch('https://date.nager.at/api/v3/AvailableCountries');
    if (!countriesResponse.ok) throw new Error('Failed to fetch available countries');
    const availableCountries = await countriesResponse.json();

    const holidaysPromises = availableCountries.map(async (country: any) => {
      try {
        const response = await fetch(
          `https://date.nager.at/api/v3/PublicHolidays/${year}/${country.countryCode}`
        );
        
        if (!response.ok) return [];
        
        const holidays = await response.json();
        return holidays.map((holiday: any, index: number) => ({
          id: `${holiday.date}-${country.countryCode}-${index}`,
          title: holiday.name,
          description: holiday.localName !== holiday.name ? holiday.localName : '',
          date: new Date(holiday.date),
          country: country.countryCode,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          category: 'holiday' as const,
          tags: ['holiday', holiday.types?.[0]?.toLowerCase() || 'public-holiday'].filter(Boolean),
          richContent: []
        }));
      } catch {
        return [];
      }
    });

    const results = await Promise.all(holidaysPromises);
    return results.flat();
  } catch (error) {
    console.error('Failed to fetch holidays:', error);
    return [];
  }
};