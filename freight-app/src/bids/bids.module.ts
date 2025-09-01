import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';

@Module({
  providers: [PrismaService, BidsService],
  controllers: [BidsController],
})
export class BidsModule {}
