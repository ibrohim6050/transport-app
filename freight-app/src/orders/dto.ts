import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString() @IsNotEmpty() from: string;
  @IsString() @IsNotEmpty() to: string;
  @IsString() @IsNotEmpty() cargoType: string;
  @IsOptional() @IsNumber() weight?: number;
  @IsOptional() @IsNumber() volume?: number;
}
