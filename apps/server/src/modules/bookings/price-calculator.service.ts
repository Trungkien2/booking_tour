import { Injectable } from '@nestjs/common';
import { TAX_RATE } from './constants/booking.constants';
import { TravelerDto } from './dto/create-booking.dto';

export interface PriceBreakdown {
  travelerPrices: Array<TravelerDto & { price: number }>;
  adults: { count: number; unitPrice: number; total: number };
  children: { count: number; unitPrice: number; total: number };
  babies: { count: number };
  subtotal: number;
  taxes: number;
  total: number;
}

@Injectable()
export class PriceCalculatorService {
  /**
   * Calculate price breakdown for a booking.
   * Rules: P1 (age-based pricing), P3 (10% tax)
   */
  calculatePrice(
    tour: { priceAdult: number | { toNumber?: () => number }; priceChild: number | { toNumber?: () => number } },
    travelers: TravelerDto[],
  ): PriceBreakdown {
    const priceAdult = this.toNumber(tour.priceAdult);
    const priceChild = this.toNumber(tour.priceChild);

    let adultsCount = 0;
    let childrenCount = 0;
    let babiesCount = 0;
    let subtotal = 0;

    const travelerPrices = travelers.map((t) => {
      let price: number;
      switch (t.ageGroup) {
        case 'ADULT':
          price = priceAdult;
          adultsCount++;
          break;
        case 'CHILD':
          price = priceChild;
          childrenCount++;
          break;
        case 'BABY':
          price = 0;
          babiesCount++;
          break;
      }
      subtotal += price;
      return { ...t, price: Math.round(price * 100) / 100 };
    });

    const taxes = Math.round(subtotal * TAX_RATE * 100) / 100;
    const total = Math.round((subtotal + taxes) * 100) / 100;

    return {
      travelerPrices,
      adults: {
        count: adultsCount,
        unitPrice: priceAdult,
        total: Math.round(adultsCount * priceAdult * 100) / 100,
      },
      children: {
        count: childrenCount,
        unitPrice: priceChild,
        total: Math.round(childrenCount * priceChild * 100) / 100,
      },
      babies: { count: babiesCount },
      subtotal: Math.round(subtotal * 100) / 100,
      taxes,
      total,
    };
  }

  private toNumber(value: number | { toNumber?: () => number }): number {
    if (typeof value === 'number') return value;
    if (value && typeof value.toNumber === 'function') return value.toNumber();
    return Number(value);
  }
}
