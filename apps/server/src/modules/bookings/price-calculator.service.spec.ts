import { PriceCalculatorService } from './price-calculator.service';

describe('PriceCalculatorService', () => {
  let service: PriceCalculatorService;

  const mockTour = {
    priceAdult: 200,
    priceChild: 100,
  };

  beforeEach(() => {
    service = new PriceCalculatorService();
  });

  it('should calculate price for adults correctly', () => {
    const result = service.calculatePrice(mockTour, [
      { fullName: 'John', ageGroup: 'ADULT' },
      { fullName: 'Jane', ageGroup: 'ADULT' },
    ]);

    expect(result.adults.count).toBe(2);
    expect(result.adults.unitPrice).toBe(200);
    expect(result.adults.total).toBe(400);
    expect(result.subtotal).toBe(400);
    expect(result.taxes).toBe(40); // 10% tax
    expect(result.total).toBe(440);
  });

  it('should calculate child pricing correctly', () => {
    const result = service.calculatePrice(mockTour, [
      { fullName: 'John', ageGroup: 'ADULT' },
      { fullName: 'Kid', ageGroup: 'CHILD' },
    ]);

    expect(result.adults.count).toBe(1);
    expect(result.children.count).toBe(1);
    expect(result.children.unitPrice).toBe(100);
    expect(result.subtotal).toBe(300);
    expect(result.taxes).toBe(30);
    expect(result.total).toBe(330);
  });

  it('should calculate baby as free', () => {
    const result = service.calculatePrice(mockTour, [
      { fullName: 'John', ageGroup: 'ADULT' },
      { fullName: 'Baby', ageGroup: 'BABY' },
    ]);

    expect(result.babies.count).toBe(1);
    expect(result.subtotal).toBe(200);
    expect(result.total).toBe(220);
  });

  it('should handle mixed travelers', () => {
    const result = service.calculatePrice(mockTour, [
      { fullName: 'Adult1', ageGroup: 'ADULT' },
      { fullName: 'Adult2', ageGroup: 'ADULT' },
      { fullName: 'Child1', ageGroup: 'CHILD' },
      { fullName: 'Baby1', ageGroup: 'BABY' },
    ]);

    expect(result.adults.count).toBe(2);
    expect(result.children.count).toBe(1);
    expect(result.babies.count).toBe(1);
    expect(result.subtotal).toBe(500); // 200+200+100+0
    expect(result.taxes).toBe(50);
    expect(result.total).toBe(550);
  });

  it('should store snapshot prices per traveler', () => {
    const result = service.calculatePrice(mockTour, [
      { fullName: 'Adult', ageGroup: 'ADULT' },
      { fullName: 'Child', ageGroup: 'CHILD' },
      { fullName: 'Baby', ageGroup: 'BABY' },
    ]);

    expect(result.travelerPrices[0].price).toBe(200);
    expect(result.travelerPrices[1].price).toBe(100);
    expect(result.travelerPrices[2].price).toBe(0);
  });

  it('should handle Decimal-like objects (Prisma)', () => {
    const prismaLikeTour = {
      priceAdult: { toNumber: () => 199.99 },
      priceChild: { toNumber: () => 99.99 },
    };

    const result = service.calculatePrice(prismaLikeTour, [
      { fullName: 'Adult', ageGroup: 'ADULT' },
    ]);

    expect(result.subtotal).toBe(199.99);
    expect(result.total).toBeCloseTo(219.99, 1);
  });

  it('should round correctly to avoid floating point issues', () => {
    const tour = { priceAdult: 33.33, priceChild: 16.67 };

    const result = service.calculatePrice(tour, [
      { fullName: 'A1', ageGroup: 'ADULT' },
      { fullName: 'A2', ageGroup: 'ADULT' },
      { fullName: 'C1', ageGroup: 'CHILD' },
    ]);

    // Check rounding is applied
    expect(Number.isFinite(result.total)).toBe(true);
    expect(result.subtotal.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
  });
});
