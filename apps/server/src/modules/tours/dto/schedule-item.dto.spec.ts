import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ScheduleItemDto } from './schedule-item.dto';

describe('ScheduleItemDto', () => {
  function toDto(data: Record<string, unknown>): ScheduleItemDto {
    return plainToInstance(ScheduleItemDto, data);
  }

  it('should pass with valid future date and capacity', async () => {
    const dto = toDto({ startDate: '2099-01-01', maxCapacity: 20 });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should reject startDate in the past', async () => {
    const dto = toDto({ startDate: '2020-01-01', maxCapacity: 20 });
    const errors = await validate(dto);
    const startDateErrors = errors.find((e) => e.property === 'startDate');
    expect(startDateErrors).toBeDefined();
    expect(
      Object.values(startDateErrors!.constraints || {}).some((msg) =>
        msg.includes('today or later'),
      ),
    ).toBe(true);
  });

  it('should reject invalid date string', async () => {
    const dto = toDto({ startDate: 'not-a-date', maxCapacity: 20 });
    const errors = await validate(dto);
    const startDateErrors = errors.find((e) => e.property === 'startDate');
    expect(startDateErrors).toBeDefined();
  });

  it('should reject maxCapacity of 0', async () => {
    const dto = toDto({ startDate: '2099-01-01', maxCapacity: 0 });
    const errors = await validate(dto);
    const capacityErrors = errors.find((e) => e.property === 'maxCapacity');
    expect(capacityErrors).toBeDefined();
    expect(
      Object.values(capacityErrors!.constraints || {}).some((msg) =>
        msg.includes('at least 1'),
      ),
    ).toBe(true);
  });

  it('should reject negative maxCapacity', async () => {
    const dto = toDto({ startDate: '2099-01-01', maxCapacity: -5 });
    const errors = await validate(dto);
    const capacityErrors = errors.find((e) => e.property === 'maxCapacity');
    expect(capacityErrors).toBeDefined();
  });

  it('should reject non-integer maxCapacity', async () => {
    const dto = toDto({ startDate: '2099-01-01', maxCapacity: 10.5 });
    const errors = await validate(dto);
    const capacityErrors = errors.find((e) => e.property === 'maxCapacity');
    expect(capacityErrors).toBeDefined();
  });
});
