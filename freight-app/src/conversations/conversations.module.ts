import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [PrismaService, ConversationsService],
  controllers: [ConversationsController],
})
export class ConversationsModule {}
