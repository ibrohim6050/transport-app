import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(data: { email: string; password: string; name: string; phone?: string; role: string }) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new BadRequestException('Email already registered');
    const hash = await bcrypt.hash(data.password, 10);

    const roleMap: Record<string, Role> = { customer: Role.CUSTOMER, driver: Role.DRIVER, admin: Role.ADMIN };
    const role = roleMap[data.role?.toLowerCase()] ?? Role.CUSTOMER;

    const user = await this.prisma.user.create({
      data: { email: data.email, password: hash, name: data.name, phone: data.phone, role },
      select: { id: true, email: true, name: true, role: true }
    });

    const token = await this.sign(user.id, user.email, user.role);
    return { user, accessToken: token };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(data.password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const token = await this.sign(user.id, user.email, user.role);
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, accessToken: token };
  }

  private async sign(sub: string, email: string, role: Role) {
    return this.jwt.signAsync({ sub, email, role });
  }
}
