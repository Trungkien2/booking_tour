import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { WebhookController } from './webhook.controller';

@Module({
  controllers: [PaymentsController, WebhookController],
  providers: [StripeService, PaymentsService],
  exports: [PaymentsService, StripeService],
})
export class PaymentsModule {}
