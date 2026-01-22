import { Controller, Get } from '@nestjs/common';

/**
 * Controller for countries-related endpoints.
 * Provides static list of countries with dial codes for phone input.
 */
@Controller('api/countries')
export class CountriesController {
  /**
   * Get list of countries with country code, name, dial code, and flag.
   * @returns List of countries
   */
  @Get()
  getCountries() {
    return {
      success: true,
      data: [
        { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
        { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
        { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
        { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
        { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭' },
        { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
        { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
        { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
        { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
        { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
        { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿' },
        { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
        { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
        { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
        { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
        { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
        { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
        { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
        { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
        { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
      ],
    };
  }
}
