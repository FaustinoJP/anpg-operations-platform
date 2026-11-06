import { apiRequest } from './api';

export type DashboardFilters = Record<string, string | undefined>;

function toQueryString(filters: DashboardFilters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== 'Todos' && value !== 'Todas' && !value.includes('01/04/2025')) {
      params.set(key, value);
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export type GeneralDashboard = {
  readinessIndex: number;
  kpis: Record<string, number>;
  executiveRibbon: Record<string, string>;
  executiveAlerts: Array<[string, string, string]>;
  priorities: Array<[string, string, string]>;
};

export type OperationalDashboard = {
  kpis: {
    totalOperations: number;
    inProgress: number;
    completed: number;
    wellsIntervened: number;
    criticalIssues: number;
    plannedCostUsd: number;
    actualCostUsd: number;
    costDeviationPercent: number;
    averageDurationDays: number;
  };
  charts: {
    costPlannedVsActual: Array<{ label: string; planned: number; actual: number }>;
    operationsByType: Array<{ label: string; value: number }>;
    operationsByStatus: Array<{ label: string; value: number; percent: number }>;
    operationsByOperator: Array<{ label: string; value: number }>;
    averageDurationByRig: Array<{ label: string; value: number }>;
  };
  criticalIssues: Array<{ well: string; operator: string; severity: string; status: string; issue: string }>;
};

export type MarketDashboard = {
  kpis: {
    activeOperators: number;
    activeContracts: number;
    leaderMarketShare: number;
    leaderOperator: string;
    totalContractedValueUsd: number;
    quarterlyGrowthPercent: number;
    activeBlocks: number;
    renewalRate: number;
    newContracts: number;
  };
  marketShare: Array<{ operator: string; share: number; valueUsd: number }>;
  monthlyContracts: Array<{ label: string; value: number }>;
  ranking: Array<{ label: string; value: number }>;
  contractsByBlock: Array<Record<string, number | string>>;
  contracts: Array<{ operator: string; block: string; type: string; valueMUsd: number; status: string }>;
};

export type StockDashboard = {
  kpis: {
    totalItems: number;
    criticalStock: number;
    monthlyIn: number;
    monthlyOut: number;
    ruptureForecastCategories: number;
    inventoryValueUsd: number;
    utilizationRate: number;
    averageCoverageDays: number;
    minimumTotal: number;
  };
  stockByCategory: Array<{ label: string; value: number }>;
  consumptionByOperator: Array<{ label: string; value: number }>;
  stockByOperator: Array<{ label: string; value: number }>;
  criticalCategories: Array<{ category: string; items: number; status: string }>;
  criticalItems: Array<{ itemName: string; category: string; quantityAvailable: number; minimumQuantity: number; status: string }>;
  movements: Array<{ occurredAt: string; type: string; item: string; quantity: number; originDestination: string }>;
};

export const dashboardApi = {
  general: (filters?: DashboardFilters) => apiRequest<GeneralDashboard>(`/dashboard/general${toQueryString(filters)}`, { auth: true }),
  operational: (filters?: DashboardFilters) => apiRequest<OperationalDashboard>(`/dashboard/operational${toQueryString(filters)}`, { auth: true }),
  market: (filters?: DashboardFilters) => apiRequest<MarketDashboard>(`/dashboard/market${toQueryString(filters)}`, { auth: true }),
  stock: (filters?: DashboardFilters) => apiRequest<StockDashboard>(`/dashboard/stock${toQueryString(filters)}`, { auth: true }),
};

export function formatUsd(value: number) {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toLocaleString('pt-PT', { maximumFractionDigits: 1 })} M USD`;
  return `${value.toLocaleString('pt-PT')} USD`;
}

export function enumLabel(value: string) {
  const map: Record<string, string> = {
    DRILLING: 'Sondagem',
    INTERVENTION: 'Intervenção',
    ABANDONMENT: 'Abandono',
    WORKOVER: 'Workover',
    PLANNED: 'Planeadas',
    IN_PROGRESS: 'Em Curso',
    COMPLETED: 'Concluídas',
    SUSPENDED: 'Suspensas',
    CANCELLED: 'Canceladas',
    ACTIVE: 'Activo',
    CRITICAL: 'Crítico',
    ALERT: 'Alerta',
    ATTENTION: 'Atenção',
    NORMAL: 'Normal',
    PRODUCTION: 'Produção',
    DEVELOPMENT: 'Desenvolvimento',
    EXPLORATION: 'Exploração',
    SERVICE: 'Serviço',
    IN: 'Entrada',
    OUT: 'Saída',
    ADJUSTMENT: 'Ajuste',
  };
  return map[value] ?? value;
}
