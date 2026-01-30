const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

interface CountriesApiResponse {
  success: boolean;
  data: Country[];
}

/**
 * Fetches the list of countries from the API.
 * @returns Array of Country objects with code, name, dialCode, and flag
 * @throws Error if fetch fails
 */
export async function getCountries(): Promise<Country[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/countries`);

    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }

    const result: CountriesApiResponse = await response.json();
    return result.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error. Failed to load countries.');
  }
}
