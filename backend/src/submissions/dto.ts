import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubmissionStatus, SubmissionType } from '@prisma/client';
import { IsEnum, IsISO8601, IsOptional, IsString } from 'class-validator';

export class CreateSubmissionDto {
  @ApiProperty({ enum: SubmissionType, example: 'OPERATIONAL' })
  @IsEnum(SubmissionType)
  type: SubmissionType;

  @ApiProperty({ example: 'SONANGOL' })
  @IsString()
  operatorCode: string;

  @ApiPropertyOptional({ example: '2025-05-01' })
  @IsOptional()
  @IsISO8601()
  periodStart?: string;

  @ApiPropertyOptional({ example: '2025-05-31' })
  @IsOptional()
  @IsISO8601()
  periodEnd?: string;

  @ApiPropertyOptional({ example: 'Dados operacionais de Maio.' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateSubmissionStatusDto {
  @ApiProperty({ enum: SubmissionStatus, example: 'APPROVED' })
  @IsEnum(SubmissionStatus)
  status: SubmissionStatus;

  @ApiPropertyOptional({ example: 'Validado pela equipa técnica.' })
  @IsOptional()
  @IsString()
  notes?: string;
}
