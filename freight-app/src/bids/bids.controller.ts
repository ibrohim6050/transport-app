import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { BidsService } from './bids.service';

@UseGuards(JwtAuthGuard)
@Controller('orders/:orderId')
export class BidsController {
  constructor(private bids: BidsService) {}

  @Post('bids')
  bid(@Req() req: any, @Param('orderId') orderId: string, @Body('price') price: number, @Body('note') note?: string) {
    return this.bids.placeBid(req.user, orderId, Number(price), note);
  }

  @Get('my-bid')
  myBid(@Req() req: any, @Param('orderId') orderId: string) {
    return this.bids.getMyBid(req.user, orderId);
  }

  @Get('bids')
  list(@Req() req: any, @Param('orderId') orderId: string) {
    return this.bids.listBidsForOrder(req.user, orderId);
  }
}
