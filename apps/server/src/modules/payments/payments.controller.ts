import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@ApiTags('payments')
@ApiBearerAuth('access-token')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':id/payment')
  @ApiOperation({ summary: 'Create payment checkout session for a booking' })
  @ApiResponse({
    status: 201,
    description: 'Payment created with checkout URL',
  })
  @ApiResponse({
    status: 400,
    description: 'Booking not in PENDING status or expired',
  })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async createPayment(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreatePaymentDto,
  ) {
    return this.paymentsService.createPayment(
      id,
      req.user.userId,
      dto.provider || 'stripe',
      dto.returnUrl,
    );
  }

  @Post(':id/payment/verify')
  @ApiOperation({ summary: 'Verify payment status (fallback polling)' })
  @ApiResponse({ status: 200, description: 'Payment and booking status' })
  @ApiResponse({ status: 404, description: 'Booking or payment not found' })
  async verifyPayment(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.verifyPayment(id, req.user.userId);
  }
}
