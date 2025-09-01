import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail() email: string;
  @MinLength(6) password: string;
  @IsNotEmpty() name: string;
  @IsOptional() phone?: string;
  @IsEnum(['customer', 'driver', 'admin'] as any) role: 'customer' | 'driver' | 'admin';
}

export class LoginDto {
  @IsEmail() email: string;
  @MinLength(6) password: string;
}
