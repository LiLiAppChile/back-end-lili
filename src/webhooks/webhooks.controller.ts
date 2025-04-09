import { Controller, Post, Body } from '@nestjs/common';
import { JumpsellerWebhookDto } from './dto/jumpseller-webhook.dto';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('jumpseller')
  async handleJumpsellerWebhook(
    @Body() jumpsellerWebhookDto: JumpsellerWebhookDto,
  ) {
    return this.webhooksService.processJumpsellerWebhook(jumpsellerWebhookDto);
  }
}
