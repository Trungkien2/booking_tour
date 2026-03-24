import { Module } from '@nestjs/common';
import { InventoryModule } from '../inventory/inventory.module';
import { PaymentsModule } from '../payments/payments.module';
import { BookingsService } from './bookings.service';
import { PriceCalculatorService } from './price-calculator.service';
import { CancellationService } from './cancellation.service';
import { BookingsController } from './bookings.controller';
import {
  BookingsAdminController,
  RefundsAdminController,
} from './bookings-admin.controller';

@Module({
  imports: [InventoryModule, PaymentsModule],
  controllers: [BookingsController, BookingsAdminController, RefundsAdminController],
  providers: [BookingsService, PriceCalculatorService, CancellationService],
  exports: [BookingsService, InventoryModule],
})
export class BookingsModule {}
