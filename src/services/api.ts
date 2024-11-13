import type { Country } from '../types';

const COUNTRIES_API_BASE = 'https://restcountries.com/v3.1';

const fetchWithRetry = async (url: string, retries = 3, delay = 1000): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      
      if (response.status === 429) {
        await new Promise(resolve => setTimeout(resolve, delay * 2));
        continue;
      }
    } catch (error) {
      if (i === retries - 1) throw error;
    }
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  throw new Error(`Failed to fetch after ${retries} retries`);
};

export const fetchCountries = async (): Promise<Country[]> => {
  try {
    const response = await fetchWithRetry(`${COUNTRIES_API_BASE}/all`);
    const data = await response.json();
    
    return data
      .map((country: any) => ({
        code: country.cca2,
        name: country.name.common,
        flag: country.flags.svg,
        capital: country.capital?.[0] || 'N/A'
      }))
      .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Failed to fetch countries:', error);
    return [];
  }
};