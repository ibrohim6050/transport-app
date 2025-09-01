import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class ConversationsService {
  constructor(private prisma: PrismaService) {}

  async ensureConversation(orderId: string, customerId: string, driverId: string) {
    const conv = await this.prisma.conversation.findFirst({ where: { orderId, customerId, driverId } });
    if (conv) return conv;
    return this.prisma.conversation.create({ data: { orderId, customerId, driverId } });
  }

  async myConversations(user: any) {
    if (user.role === Role.CUSTOMER) {
      return this.prisma.conversation.findMany({
        where: { customerId: user.userId },
        include: { order: true, driver: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      });
    } else if (user.role === Role.DRIVER) {
      return this.prisma.conversation.findMany({
        where: { driverId: user.userId },
        include: { order: true, customer: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      return [];
    }
  }

  async getConversation(user: any, id: string) {
    const conv = await this.prisma.conversation.findUnique({ where: { id } });
    if (!conv) throw new NotFoundException('Conversation not found');
    if (conv.customerId !== user.userId && conv.driverId !== user.userId) throw new ForbiddenException();
    return conv;
  }

  async messages(user: any, conversationId: string) {
    await this.getConversation(user, conversationId);
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { timestamp: 'asc' },
    });
  }

  async sendMessage(user: any, conversationId: string, text: string) {
    const conv = await this.getConversation(user, conversationId);
    const msg = await this.prisma.message.create({
      data: { conversationId, senderId: user.userId, text },
    });
    await this.prisma.conversation.update({ where: { id: conv.id }, data: { lastMessageAt: new Date() } });
    return msg;
  }
}
