import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsersMeController } from './users-me.controller';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersMeController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
