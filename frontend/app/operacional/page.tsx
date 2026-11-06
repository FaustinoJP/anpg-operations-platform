'use client';

import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { operationalFilters } from '@/data/mockData';
import { ComboBarLineChart, BarChart, DonutChart, HorizontalBarChart, StatusList } from '@/components/charts';
import { Filters, FooterNote, KpiCard, KpiGrid, PageHeader, Panel, SimpleTable, StatusPill } from '@/components/ui';
import { dashboardApi, enumLabel, formatUsd, OperationalDashboard } from '@/lib/dashboardApi';

const TYPE_MAP: Record<string, string> = {
  'Sondagem': 'DRILLING',
  'Intervenção': 'INTERVENTION',
  'Abandono': 'ABANDONMENT',
  'Workover Menor': 'WORKOVER',
};

function toQuery(values: Record<string, string>) {
  return {
    operator: values['Operador'] && values['Operador'] !== 'Todos' ? values['Operador'] : undefined,
    block: values['Bloco'] && values['Bloco'] !== 'Todos' ? values['Bloco'] : undefined,
    well: values['Poço'] && values['Poço'] !== 'Todos' ? values['Poço'] : undefined,
    rig: values['Sonda'] && values['Sonda'] !== 'Todos' ? values['Sonda'] : undefined,
    operationType: values['Tipo de Operação'] ? TYPE_MAP[values['Tipo de Operação']] : undefined,
  };
}

function statusColor(status: string) {
  if (status === 'SUSPENDED' || status === 'CANCELLED') return '#ed1f41';
  if (status === 'IN_PROGRESS') return '#159947';
  if (status === 'PLANNED') return '#191b1f';
  return '#ff5b6f';
}

export default function OperacionalPage() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [data, setData] = useState<OperationalDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const query = useMemo(() => toQuery(filters), [filters]);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      setData(await dashboardApi.operational(query));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dashboard operacional.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, [JSON.stringify(query)]);

  const issueRows = (data?.criticalIssues ?? []).map((item) => [
    item.well,
    item.operator,
    <StatusPill key="sev" color={item.severity === 'Crítica' ? 'red' : 'orange'}>{item.severity}</StatusPill>,
    <StatusPill key="estado" color={item.status === 'IN_PROGRESS' ? 'green' : item.status === 'SUSPENDED' ? 'red' : 'gray'}>{enumLabel(item.status)}</StatusPill>
  ]);

  const cost = data?.charts.costPlannedVsActual ?? [];
  const byType = data?.charts.operationsByType ?? [];
  const byOperator = data?.charts.operationsByOperator ?? [];
  const byRig = data?.charts.averageDurationByRig ?? [];
  const byStatus = data?.charts.operationsByStatus ?? [];

  return (
    <AppShell>
      <div className="content">
        <PageHeader title="Dashboard Operacional" subtitle="Dados operacionais carregados em tempo real do backend NestJS." />
        <Filters items={operationalFilters} onChange={setFilters} />

        {loading && <div className="data-state">A carregar dados operacionais...</div>}
        {error && <div className="data-state error">{error} <button onClick={loadData}>Tentar novamente</button></div>}
        {!loading && !error && data && (
          <>
            <KpiGrid>
              <KpiCard label="Operações Totais" value={String(data.kpis.totalOperations)} trend="API / PostgreSQL" trendType="up" icon="rig" />
              <KpiCard label="Em Curso" value={String(data.kpis.inProgress)} trend="Operações activas" trendType="up" icon="refresh" color="gold" />
              <KpiCard label="Poços Intervencionados" value={String(data.kpis.wellsIntervened)} trend="Poços únicos no período" trendType="up" icon="well" />
              <KpiCard label="Custo Previsto" value={formatUsd(data.kpis.plannedCostUsd)} trend="Somatório filtrado" icon="money" color="red" />
              <KpiCard label="Custo Realizado" value={formatUsd(data.kpis.actualCostUsd)} trend="Somatório filtrado" trendType={data.kpis.actualCostUsd > data.kpis.plannedCostUsd ? 'down' : 'up'} icon="money" color="red" />
              <KpiCard label="Desvio" value={`${data.kpis.costDeviationPercent}%`} trend="Realizado vs previsto" trendType={data.kpis.costDeviationPercent > 0 ? 'down' : 'up'} icon="trend" color="gold" />
              <KpiCard label="Tempo Médio" value={`${data.kpis.averageDurationDays} dias`} trend="Média das operações" trendType="up" icon="clock" />
              <KpiCard label="Problemas Críticos" value={String(data.kpis.criticalIssues)} trend="Registados no backend" trendType="down" icon="warning" color="red" />
            </KpiGrid>

            <div className="panel-grid">
              <Panel title="Custo Previsto vs Realizado (M USD)" className="col-5" action={<span className="panel-action">API real</span>}>
                <ComboBarLineChart labels={cost.map((x) => x.label)} bars={cost.map((x) => x.planned)} line={cost.map((x) => x.actual)} barLabel="Custo Previsto" lineLabel="Custo Realizado" />
              </Panel>
              <Panel title="Operações por Tipo" className="col-3">
                <DonutChart center={`${data.kpis.totalOperations}\nTotal`} items={byType.map((x, i) => ({ label: enumLabel(x.label), value: x.value, color: ['#191b1f','#ed1f41','#ff5b6f','#94a3b8'][i % 4], detail: `(${x.value})` }))} />
              </Panel>
              <Panel title="Operações por Operador" className="col-4" action={<span className="panel-action">Top {byOperator.length}</span>}>
                <HorizontalBarChart labels={byOperator.map((x) => x.label)} values={byOperator.map((x) => x.value)} maxValue={Math.max(...byOperator.map((x) => x.value), 1)} />
              </Panel>
              <Panel title="Tempo Médio de Execução por Sonda (dias)" className="col-5" action={<span className="panel-action">Dias</span>}>
                <BarChart labels={byRig.map((x) => x.label)} values={byRig.map((x) => x.value)} average={data.kpis.averageDurationDays} />
              </Panel>
              <Panel title="Estado das Operações" className="col-3">
                <StatusList items={byStatus.map((x) => ({ name: enumLabel(x.label), value: x.value, percent: `${x.percent}%`, color: statusColor(x.label) }))} />
              </Panel>
              <Panel title={`Problemas Críticos ${data.kpis.criticalIssues}`} className="col-4" action={<span className="link-action">API real</span>}>
                <SimpleTable headers={['Poço','Operador','Severidade','Estado']} rows={issueRows} />
              </Panel>
            </div>
          </>
        )}
        <FooterNote />
      </div>
    </AppShell>
  );
}
