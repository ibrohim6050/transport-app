import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, Role } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: string, dto: any) {
    return this.prisma.order.create({
      data: {
        customerId: userId,
        from: dto.from,
        to: dto.to,
        cargoType: dto.cargoType,
        weight: dto.weight ?? null,
        volume: dto.volume ?? null,
      },
    });
  }

  async getOrders(user: any, status?: string, mine?: string) {
    const where: any = {};
    if (status) where.status = status.toUpperCase();
    if (mine === 'true') {
      where.customerId = user.userId;
    } else {
      if (user.role === Role.DRIVER) {
        // drivers see only OPEN orders by default unless querying specific
        if (!where.status) where.status = OrderStatus.OPEN;
      } else if (user.role === Role.CUSTOMER) {
        // customers see their own by default if mine not set: show all statuses for their own
        where.customerId = user.userId;
      }
    }
    return this.prisma.order.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async getOrderById(user: any, id: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    // Drivers can view OPEN orders or assigned to them; customers can view their orders
    if (user.role === Role.DRIVER) {
      if (order.status !== OrderStatus.OPEN && order.assignedDriverId !== user.userId) {
        throw new ForbiddenException();
      }
    } else if (user.role === Role.CUSTOMER) {
      if (order.customerId !== user.userId) throw new ForbiddenException();
    }
    return order;
  }

  async awardOrder(user: any, id: string, driverId: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order || order.customerId !== user.userId) throw new ForbiddenException();
    // Ensure bid exists
    const bid = await this.prisma.bid.findUnique({ where: { orderId_driverId: { orderId: id, driverId } } });
    if (!bid) throw new NotFoundException('Bid not found');

    // Update bids and order in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      await tx.bid.update({
        where: { id: bid.id },
        data: { status: 'SELECTED' },
      });
      await tx.bid.updateMany({
        where: { orderId: id, driverId: { not: driverId } },
        data: { status: 'REJECTED' },
      });
      const updated = await tx.order.update({
        where: { id },
        data: { status: 'ASSIGNED', assignedDriverId: driverId },
      });
      return updated;
    });
    return result;
  }
}
