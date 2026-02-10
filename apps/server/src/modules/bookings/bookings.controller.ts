import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookingsService } from './bookings.service';
import { CancellationService } from './cancellation.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingQueryDto } from './dto/booking-query.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';

@ApiTags('bookings')
@ApiBearerAuth('access-token')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly cancellationService: CancellationService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created with price breakdown' })
  @ApiResponse({ status: 400, description: 'Validation error (no adults, schedule closed, etc.)' })
  @ApiResponse({ status: 409, description: 'Insufficient capacity or version conflict' })
  async createBooking(@Req() req, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(req.user.userId, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user bookings with tabs and pagination' })
  @ApiResponse({ status: 200, description: 'Paginated bookings list with tab counts' })
  async getUserBookings(@Req() req, @Query() query: BookingQueryDto) {
    return this.bookingsService.getUserBookings(req.user.userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking detail by ID' })
  @ApiResponse({ status: 200, description: 'Booking detail with travelers, payments, refunds' })
  @ApiResponse({ status: 403, description: 'Not the owner of this booking' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async getBookingDetail(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.bookingsService.getBookingDetail(id, req.user.userId);
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Get booking status with processing steps (for polling)' })
  @ApiResponse({ status: 200, description: 'Booking status with step indicators' })
  async getBookingStatus(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.bookingsService.getBookingStatus(id, req.user.userId);
  }

  @Get(':id/cancellation-preview')
  @ApiOperation({ summary: 'Preview cancellation refund details before confirming' })
  @ApiResponse({ status: 200, description: 'Cancellation preview with refund tier and amounts' })
  @ApiResponse({ status: 400, description: 'Booking cannot be cancelled' })
  async getCancellationPreview(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.cancellationService.getCancellationPreview(
      id,
      req.user.userId,
    );
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({ status: 200, description: 'Booking cancelled with refund info' })
  @ApiResponse({ status: 400, description: 'Cannot cancel (wrong status or confirmation required)' })
  async cancelBooking(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CancelBookingDto,
  ) {
    return this.bookingsService.cancelBooking(id, req.user.userId, dto);
  }
}
