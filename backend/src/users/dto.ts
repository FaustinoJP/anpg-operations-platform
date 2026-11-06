import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Gestor ANPG' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'gestor@anpg.ao' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'anpg2025' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'GESTOR_ANPG' })
  @IsString()
  roleName: string;

  @ApiPropertyOptional({ example: 'SONANGOL' })
  @IsOptional()
  @IsString()
  operatorCode?: string;
}
