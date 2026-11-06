import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@anpg.ao' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'anpg2025' })
  @IsString()
  @MinLength(6)
  password: string;
}
