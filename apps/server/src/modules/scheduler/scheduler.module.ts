import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { InventoryModule } from '../inventory/inventory.module';
import { BookingSchedulerService } from './booking-scheduler.service';

@Module({
  imports: [ScheduleModule.forRoot(), InventoryModule],
  providers: [BookingSchedulerService],
})
export class SchedulerModule {}
