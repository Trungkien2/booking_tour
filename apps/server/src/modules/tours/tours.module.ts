import { Module } from '@nestjs/common';
import { ToursController } from './tours.controller';
import { ToursPublicController } from './tours-public.controller';
import { ToursService } from './tours.service';
import { ToursPublicService } from './tours-public.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ToursController, ToursPublicController],
  providers: [ToursService, ToursPublicService],
  exports: [ToursService, ToursPublicService],
})
export class ToursModule {}
