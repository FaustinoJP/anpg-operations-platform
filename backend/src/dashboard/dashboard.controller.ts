import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('general')
  @ApiOperation({ summary: 'Resumo executivo consolidado da plataforma' })
  general(@Query() query: Record<string, string>) {
    return this.dashboardService.general(query);
  }

  @Get('operational')
  @ApiOperation({ summary: 'Indicadores e gráficos do dashboard operacional' })
  operational(@Query() query: Record<string, string>) {
    return this.dashboardService.operational(query);
  }

  @Get('market')
  @ApiOperation({ summary: 'Indicadores e gráficos de análise de mercado' })
  market(@Query() query: Record<string, string>) {
    return this.dashboardService.market(query);
  }

  @Get('stock')
  @ApiOperation({ summary: 'Indicadores e gráficos de stock OCTG' })
  stock(@Query() query: Record<string, string>) {
    return this.dashboardService.stock(query);
  }
}
