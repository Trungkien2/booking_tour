import {
  Controller,
  Headers,
  HttpCode,
  Logger,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Request } from 'express';
import { Public } from '../auth/auth.decorators';
import { StripeService } from './stripe.service';
import { PaymentsService } from './payments.service';

@ApiTags('webhooks')
@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private readonly stripeService: StripeService,
    private readonly paymentsService: PaymentsService,
  ) {}

  @Post('stripe')
  @Public()
  @HttpCode(200)
  @ApiExcludeEndpoint()
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    let event;

    try {
      event = this.stripeService.verifyWebhookSignature(
        req.rawBody!,
        signature,
      );
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      return { received: false };
    }

    await this.paymentsService.handleWebhook(event);

    return { received: true };
  }
}
