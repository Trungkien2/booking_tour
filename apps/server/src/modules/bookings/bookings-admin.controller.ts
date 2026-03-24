import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/auth.decorators';
import { BookingsService } from './bookings.service';
import { AdminBookingQueryDto } from './dto/admin-booking-query.dto';
import { AdminUpdateStatusDto } from './dto/admin-update-status.dto';
import { AdminRefundDto } from './dto/admin-refund.dto';

@ApiTags('admin/bookings')
@ApiBearerAuth('access-token')
@Controller('api/admin/bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class BookingsAdminController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiOperation({ summary: 'List all bookings (admin)' })
  @ApiResponse({ status: 200, description: 'Paginated list of all bookings' })
  async getAdminBookings(@Query() query: AdminBookingQueryDto) {
    return this.bookingsService.getAdminBookings(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking detail (admin)' })
  @ApiResponse({
    status: 200,
    description: 'Full booking detail including user info',
  })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async getAdminBookingDetail(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.getAdminBookingDetail(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update booking status (admin override)' })
  @ApiResponse({ status: 200, description: 'Booking status updated' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdminUpdateStatusDto,
  ) {
    return this.bookingsService.adminUpdateStatus(id, dto);
  }

  @Post(':id/refund')
  @ApiOperation({ summary: 'Create manual refund (admin)' })
  @ApiResponse({ status: 201, description: 'Refund created' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async createRefund(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdminRefundDto,
  ) {
    return this.bookingsService.adminCreateRefund(id, dto);
  }
}

@ApiTags('admin/refunds')
@ApiBearerAuth('access-token')
@Controller('api/admin/refunds')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class RefundsAdminController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get()
  @ApiOperation({ summary: 'List all refunds (admin)' })
  @ApiResponse({ status: 200, description: 'Paginated list of refunds with stats' })
  async getRefunds(
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.bookingsService.getAdminRefunds({
      status,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Post(':id/process')
  @ApiOperation({ summary: 'Process a pending/failed refund through Stripe' })
  @ApiResponse({ status: 200, description: 'Refund processed' })
  @ApiResponse({ status: 404, description: 'Refund not found' })
  async processRefund(@Param('id', ParseIntPipe) id: number) {
    return this.bookingsService.processAdminRefund(id);
  }
}
