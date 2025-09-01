import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { BidsModule } from './bids/bids.module';
import { ConversationsModule } from './conversations/conversations.module';

@Module({
  imports: [AuthModule, OrdersModule, BidsModule, ConversationsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
