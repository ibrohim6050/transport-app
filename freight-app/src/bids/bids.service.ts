import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, Role } from '@prisma/client';

@Injectable()
export class BidsService {
  constructor(private prisma: PrismaService) {}

  async placeBid(user: any, orderId: string, price: number, note?: string) {
    if (user.role !== Role.DRIVER) throw new ForbiddenException('Only drivers can bid');
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.status !== OrderStatus.OPEN) throw new BadRequestException('Order not open');

    return this.prisma.bid.upsert({
      where: { orderId_driverId: { orderId, driverId: user.userId } },
      update: { price, note, status: 'PENDING' },
      create: { orderId, driverId: user.userId, price, note },
    });
  }

  async getMyBid(user: any, orderId: string) {
    if (user.role !== Role.DRIVER) throw new ForbiddenException();
    const bid = await this.prisma.bid.findUnique({ where: { orderId_driverId: { orderId, driverId: user.userId } } });
    if (!bid) throw new NotFoundException('No bid');
    return bid;
  }

  async listBidsForOrder(user: any, orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.customerId !== user.userId) throw new ForbiddenException('Only owner can view all bids');
    return this.prisma.bid.findMany({ where: { orderId }, orderBy: { createdAt: 'desc' } });
  }
}
