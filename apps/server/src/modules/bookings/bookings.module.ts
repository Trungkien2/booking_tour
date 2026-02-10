import { Module } from '@nestjs/common';
import { InventoryModule } from '../inventory/inventory.module';
import { BookingsService } from './bookings.service';
import { PriceCalculatorService } from './price-calculator.service';
import { CancellationService } from './cancellation.service';
import { BookingsController } from './bookings.controller';
import { BookingsAdminController } from './bookings-admin.controller';

@Module({
  imports: [InventoryModule],
  controllers: [BookingsController, BookingsAdminController],
  providers: [BookingsService, PriceCalculatorService, CancellationService],
  exports: [BookingsService, InventoryModule],
})
export class BookingsModule {}
