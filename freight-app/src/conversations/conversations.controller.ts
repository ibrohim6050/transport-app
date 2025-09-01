import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ConversationsService } from './conversations.service';

@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationsController {
  constructor(private convs: ConversationsService) {}

  // Ensure or create a conversation between customer & driver for an order
  @Post('start')
  async start(@Body('orderId') orderId: string, @Body('customerId') customerId: string, @Body('driverId') driverId: string) {
    return this.convs.ensureConversation(orderId, customerId, driverId);
  }

  @Get('mine')
  async mine(@Req() req: any) {
    return this.convs.myConversations(req.user);
  }

  @Get(':id/messages')
  async listMessages(@Req() req: any, @Param('id') id: string) {
    return this.convs.messages(req.user, id);
  }

  @Post(':id/messages')
  async send(@Req() req: any, @Param('id') id: string, @Body('text') text: string) {
    return this.convs.sendMessage(req.user, id, text);
  }
}
