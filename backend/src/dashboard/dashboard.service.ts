import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type DashboardFilters = Record<string, string | undefined>;

const MONTH_LABELS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function number(value: unknown) {
  if (value === null || value === undefined) return 0;
  return Number(value);
}

function percent(part: number, total: number) {
  if (!total) return 0;
  return Math.round((part / total) * 1000) / 10;
}

function monthLabel(date: Date) {
  return `${MONTH_LABELS[date.getMonth()]}/${String(date.getFullYear()).slice(2)}`;
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function diffDays(start?: Date | null, end?: Date | null) {
  if (!start || !end) return null;
  return Math.max(1, Math.round((end.getTime() - start.getTime()) / 86_400_000));
}

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  private buildOperationWhere(filters: DashboardFilters): Prisma.OperationWhereInput {
    const where: Prisma.OperationWhereInput = {};

    if (filters.operatorId) where.operatorId = filters.operatorId;
    if (filters.blockId) where.blockId = filters.blockId;
    if (filters.wellId) where.wellId = filters.wellId;
    if (filters.rigId) where.rigId = filters.rigId;
    if (filters.status) where.status = filters.status as any;
    if (filters.operationType) where.type = filters.operationType as any;

    if (filters.operator) {
      where.operator = { name: { contains: filters.operator, mode: 'insensitive' } };
    }

    if (filters.block) {
      where.block = { code: { equals: filters.block, mode: 'insensitive' } };
    }

    if (filters.rig) {
      where.rig = { code: { equals: filters.rig, mode: 'insensitive' } };
    }

    if (filters.well) {
      where.well = { code: { equals: filters.well, mode: 'insensitive' } };
    }

    const periodStart = filters.periodStart ? new Date(filters.periodStart) : null;
    const periodEnd = filters.periodEnd ? new Date(filters.periodEnd) : null;
    if (periodStart || periodEnd) {
      where.OR = [
        { actualStartDate: { gte: periodStart ?? undefined, lte: periodEnd ?? undefined } },
        { plannedStartDate: { gte: periodStart ?? undefined, lte: periodEnd ?? undefined } },
      ];
    }

    return where;
  }

  private buildContractWhere(filters: DashboardFilters): Prisma.ContractWhereInput {
    const where: Prisma.ContractWhereInput = {};
    if (filters.operatorId) where.operatorId = filters.operatorId;
    if (filters.blockId) where.blockId = filters.blockId;
    if (filters.contractType) where.type = filters.contractType as any;
    if (filters.status) where.status = filters.status as any;
    if (filters.operator) where.operator = { name: { contains: filters.operator, mode: 'insensitive' } };
    if (filters.block) where.block = { code: { equals: filters.block, mode: 'insensitive' } };
    if (filters.basin) where.block = { basin: { contains: filters.basin, mode: 'insensitive' } };
    return where;
  }

  private buildStockWhere(filters: DashboardFilters): Prisma.StockItemWhereInput {
    const where: Prisma.StockItemWhereInput = {};
    if (filters.operatorId) where.operatorId = filters.operatorId;
    if (filters.status) where.status = filters.status as any;
    if (filters.operator) where.operator = { name: { contains: filters.operator, mode: 'insensitive' } };
    if (filters.category) where.category = { contains: filters.category, mode: 'insensitive' };
    if (filters.location) where.location = { contains: filters.location, mode: 'insensitive' };
    if (filters.specification) where.specification = { contains: filters.specification, mode: 'insensitive' };
    return where;
  }

  async general(filters: DashboardFilters = {}) {
    const operationWhere = this.buildOperationWhere(filters);
    const [
      operationsTotal,
      operationsInProgress,
      wellsIntervened,
      activeContracts,
      criticalStock,
      pendingSubmissions,
      criticalIssues,
      approvedSubmissions,
      totalSubmissions,
      activeOperators,
      stockMovements,
    ] = await Promise.all([
      this.prisma.operation.count({ where: operationWhere }),
      this.prisma.operation.count({ where: { ...operationWhere, status: 'IN_PROGRESS' } }),
      this.prisma.well.count(),
      this.prisma.contract.count({ where: { status: 'ACTIVE' } }),
      this.prisma.stockItem.count({ where: { status: { in: ['CRITICAL', 'ALERT'] } } }),
      this.prisma.submission.count({ where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'CORRECTION_REQUESTED'] } } }),
      this.prisma.operation.count({ where: { ...operationWhere, criticalIssue: { not: null } } }),
      this.prisma.submission.count({ where: { status: 'APPROVED' } }),
      this.prisma.submission.count(),
      this.prisma.operator.count({ where: { status: 'ACTIVE' } }),
      this.prisma.stockMovement.count(),
    ]);

    const readinessIndex = Math.min(98, Math.round(62 + percent(approvedSubmissions, totalSubmissions) / 3 + activeOperators));
    const approvalRate = percent(approvedSubmissions, totalSubmissions);

    return {
      filters,
      readinessIndex,
      kpis: {
        operationsTotal,
        operationsInProgress,
        wellsIntervened,
        activeContracts,
        criticalStock,
        pendingSubmissions,
        criticalIssues,
        approvalRate,
        activeOperators,
        stockMovements,
      },
      executiveRibbon: {
        operational: `${operationsInProgress} operações em curso · ${wellsIntervened} poços registados`,
        market: `${activeContracts} contratos activos · ${activeOperators} operadores activos`,
        stock: `${criticalStock} itens em alerta/crítico · ${stockMovements} movimentos`,
        submissions: `${totalSubmissions} recebidas · ${approvedSubmissions} aprovadas · ${pendingSubmissions} pendentes`,
      },
      executiveAlerts: await this.getExecutiveAlerts(),
      priorities: [
        ['Validar submissões pendentes', 'Direcção Técnica / 24h', pendingSubmissions > 0 ? 'Alta' : 'Normal'],
        ['Rever stock OCTG crítico', 'Logística / 48h', criticalStock > 0 ? 'Crítica' : 'Normal'],
        ['Confirmar custos realizados', 'Planeamento / 72h', criticalIssues > 0 ? 'Média' : 'Normal'],
      ],
    };
  }

  private async getExecutiveAlerts() {
    const [criticalStock, criticalOps, pending] = await Promise.all([
      this.prisma.stockItem.count({ where: { status: { in: ['CRITICAL', 'ALERT'] } } }),
      this.prisma.operation.count({ where: { criticalIssue: { not: null } } }),
      this.prisma.submission.count({ where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'CORRECTION_REQUESTED'] } } }),
    ]);

    return [
      ['Stock OCTG', `${criticalStock} item(ns) em estado crítico ou alerta.`, criticalStock ? 'Crítica' : 'Normal'],
      ['Operações', `${criticalOps} operação(ões) com problema crítico registado.`, criticalOps ? 'Alta' : 'Normal'],
      ['Submissões', `${pending} submissão(ões) aguardam validação ANPG.`, pending ? 'Média' : 'Normal'],
    ];
  }

  async operational(filters: DashboardFilters) {
    const where = this.buildOperationWhere(filters);

    const [operations, byType, byStatus, byOperator] = await Promise.all([
      this.prisma.operation.findMany({
        where,
        include: { operator: true, block: true, well: true, rig: true },
        orderBy: [{ actualStartDate: 'asc' }, { plannedStartDate: 'asc' }],
      }),
      this.prisma.operation.groupBy({ by: ['type'], where, _count: { _all: true } }),
      this.prisma.operation.groupBy({ by: ['status'], where, _count: { _all: true } }),
      this.prisma.operation.groupBy({ by: ['operatorId'], where, _count: { _all: true } }),
    ]);

    const total = operations.length;
    const inProgress = operations.filter((op) => op.status === 'IN_PROGRESS').length;
    const completed = operations.filter((op) => op.status === 'COMPLETED').length;
    const criticalIssues = operations.filter((op) => op.criticalIssue).length;
    const plannedCostUsd = operations.reduce((sum, op) => sum + number(op.plannedCostUsd), 0);
    const actualCostUsd = operations.reduce((sum, op) => sum + number(op.actualCostUsd), 0);
    const durations = operations.map((op) => diffDays(op.actualStartDate ?? op.plannedStartDate, op.actualEndDate ?? op.plannedEndDate)).filter((v): v is number => Boolean(v));
    const averageDurationDays = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

    const operatorMap = new Map((await this.prisma.operator.findMany()).map((op) => [op.id, op.name]));
    const costByMonth = new Map<string, { label: string; planned: number; actual: number }>();
    for (const op of operations) {
      const date = op.actualStartDate ?? op.plannedStartDate ?? op.createdAt;
      const key = monthKey(date);
      const current = costByMonth.get(key) ?? { label: monthLabel(date), planned: 0, actual: 0 };
      current.planned += number(op.plannedCostUsd) / 1_000_000;
      current.actual += number(op.actualCostUsd) / 1_000_000;
      costByMonth.set(key, current);
    }

    const rigDurations = new Map<string, number[]>();
    for (const op of operations) {
      const days = diffDays(op.actualStartDate ?? op.plannedStartDate, op.actualEndDate ?? op.plannedEndDate);
      const rig = op.rig?.code || 'Sem sonda';
      if (days) rigDurations.set(rig, [...(rigDurations.get(rig) ?? []), days]);
    }

    return {
      filters,
      kpis: {
        totalOperations: total,
        inProgress,
        completed,
        wellsIntervened: new Set(operations.map((op) => op.wellId)).size,
        criticalIssues,
        plannedCostUsd,
        actualCostUsd,
        costDeviationPercent: plannedCostUsd ? Math.round(((actualCostUsd - plannedCostUsd) / plannedCostUsd) * 1000) / 10 : 0,
        averageDurationDays,
      },
      charts: {
        costPlannedVsActual: Array.from(costByMonth.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([, value]) => ({ ...value, planned: Number(value.planned.toFixed(1)), actual: Number(value.actual.toFixed(1)) })),
        operationsByType: byType.map((x) => ({ label: x.type, value: x._count._all })),
        operationsByStatus: byStatus.map((x) => ({ label: x.status, value: x._count._all, percent: percent(x._count._all, total) })),
        operationsByOperator: byOperator.map((x) => ({ label: operatorMap.get(x.operatorId) ?? x.operatorId, value: x._count._all })).sort((a, b) => b.value - a.value),
        averageDurationByRig: Array.from(rigDurations.entries()).map(([label, values]) => ({ label, value: Math.round(values.reduce((a, b) => a + b, 0) / values.length) })).sort((a, b) => a.value - b.value),
      },
      criticalIssues: operations.filter((op) => op.criticalIssue).slice(0, 10).map((op) => ({
        well: op.well.code,
        operator: op.operator.name,
        severity: op.status === 'SUSPENDED' ? 'Crítica' : 'Alta',
        status: op.status,
        issue: op.criticalIssue,
      })),
    };
  }

  async market(filters: DashboardFilters) {
    const where = this.buildContractWhere(filters);
    const contracts = await this.prisma.contract.findMany({ where, include: { operator: true, block: true }, orderBy: { startDate: 'asc' } });
    const totalValue = contracts.reduce((sum, c) => sum + number(c.valueUsd), 0);
    const activeContracts = contracts.filter((c) => c.status === 'ACTIVE').length;
    const operatorValues = new Map<string, number>();
    const blockCounts = new Map<string, Record<string, number>>();

    for (const contract of contracts) {
      operatorValues.set(contract.operator.name, (operatorValues.get(contract.operator.name) ?? 0) + number(contract.valueUsd));
      const byBlock = blockCounts.get(contract.block.code) ?? { PRODUCTION: 0, DEVELOPMENT: 0, EXPLORATION: 0, SERVICE: 0 };
      byBlock[contract.type] = (byBlock[contract.type] ?? 0) + 1;
      blockCounts.set(contract.block.code, byBlock);
    }

    const marketShare = Array.from(operatorValues.entries()).map(([operator, valueUsd]) => ({
      operator,
      valueUsd,
      share: percent(valueUsd, totalValue),
    })).sort((a, b) => b.valueUsd - a.valueUsd);

    const monthly = new Map<string, number>();
    for (const contract of contracts) {
      const date = contract.startDate ?? contract.createdAt;
      const key = monthKey(date);
      monthly.set(key, (monthly.get(key) ?? 0) + 1);
    }

    return {
      filters,
      kpis: {
        activeOperators: new Set(contracts.map((c) => c.operatorId)).size,
        activeContracts,
        leaderMarketShare: marketShare[0]?.share ?? 0,
        leaderOperator: marketShare[0]?.operator ?? 'N/D',
        totalContractedValueUsd: totalValue,
        quarterlyGrowthPercent: 12,
        activeBlocks: new Set(contracts.map((c) => c.blockId)).size,
        renewalRate: 82,
        newContracts: contracts.filter((c) => (c.startDate?.getFullYear() ?? c.createdAt.getFullYear()) >= 2025).length,
      },
      marketShare,
      monthlyContracts: Array.from(monthly.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([key, count]) => {
        const [year, month] = key.split('-').map(Number);
        return { label: `${MONTH_LABELS[month - 1]}/${String(year).slice(2)}`, value: count };
      }),
      ranking: marketShare.map((x) => ({ label: x.operator, value: Number((x.valueUsd / 1_000_000).toFixed(1)) })),
      contractsByBlock: Array.from(blockCounts.entries()).map(([block, counts]) => ({ block, ...counts })),
      contracts: contracts.slice(0, 10).map((c) => ({
        operator: c.operator.name,
        block: c.block.code,
        type: c.type,
        valueMUsd: Number((number(c.valueUsd) / 1_000_000).toFixed(1)),
        status: c.status,
      })),
    };
  }

  async stock(filters: DashboardFilters) {
    const where = this.buildStockWhere(filters);
    const [items, movements] = await Promise.all([
      this.prisma.stockItem.findMany({ where, include: { operator: true }, orderBy: { updatedAt: 'desc' } }),
      this.prisma.stockMovement.findMany({ include: { stockItem: true, operator: true, well: true }, orderBy: { occurredAt: 'desc' }, take: 20 }),
    ]);

    const totalItems = items.reduce((sum, item) => sum + item.quantityAvailable, 0);
    const minimumTotal = items.reduce((sum, item) => sum + item.minimumQuantity, 0);
    const criticalStock = items.filter((item) => ['CRITICAL', 'ALERT'].includes(item.status)).length;
    const monthlyIn = movements.filter((m) => m.type === 'IN').reduce((sum, m) => sum + m.quantity, 0);
    const monthlyOut = movements.filter((m) => m.type === 'OUT').reduce((sum, m) => sum + m.quantity, 0);

    const byCategory = new Map<string, number>();
    const consumptionByOperator = new Map<string, number>();
    const stockByOperator = new Map<string, number>();
    for (const item of items) {
      byCategory.set(item.category, (byCategory.get(item.category) ?? 0) + item.quantityAvailable);
      stockByOperator.set(item.operator.name, (stockByOperator.get(item.operator.name) ?? 0) + item.quantityAvailable);
    }
    for (const movement of movements.filter((m) => m.type === 'OUT')) {
      consumptionByOperator.set(movement.operator.name, (consumptionByOperator.get(movement.operator.name) ?? 0) + movement.quantity);
    }

    return {
      filters,
      kpis: {
        totalItems,
        criticalStock,
        monthlyIn,
        monthlyOut,
        ruptureForecastCategories: items.filter((item) => item.quantityAvailable < item.minimumQuantity).length,
        inventoryValueUsd: totalItems * 16_000,
        utilizationRate: totalItems ? Math.round((monthlyOut / Math.max(totalItems + monthlyOut, 1)) * 100) : 0,
        averageCoverageDays: monthlyOut ? Math.max(1, Math.round((totalItems / monthlyOut) * 30)) : 0,
        minimumTotal,
      },
      stockByCategory: Array.from(byCategory.entries()).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value),
      consumptionByOperator: Array.from(consumptionByOperator.entries()).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value),
      stockByOperator: Array.from(stockByOperator.entries()).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value),
      criticalCategories: Array.from(byCategory.entries()).map(([category]) => ({
        category,
        items: items.filter((item) => item.category === category && ['CRITICAL', 'ALERT', 'ATTENTION'].includes(item.status)).length,
        status: items.some((item) => item.category === category && item.status === 'CRITICAL') ? 'CRITICAL' : 'ALERT',
      })).filter((x) => x.items > 0),
      criticalItems: items.filter((item) => ['CRITICAL', 'ALERT'].includes(item.status)).slice(0, 10).map((item) => ({
        itemName: item.itemName,
        category: item.category,
        quantityAvailable: item.quantityAvailable,
        minimumQuantity: item.minimumQuantity,
        status: item.status,
      })),
      movements: movements.slice(0, 10).map((m) => ({
        occurredAt: m.occurredAt,
        type: m.type,
        item: m.stockItem.itemName,
        quantity: m.quantity,
        originDestination: m.originDestination ?? m.well?.code ?? 'N/D',
      })),
    };
  }
}
