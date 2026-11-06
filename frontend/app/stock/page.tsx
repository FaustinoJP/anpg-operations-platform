'use client';

import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { stockFilters } from '@/data/mockData';
import { BarChart, Gauge, GroupedBarChart, HorizontalBarChart } from '@/components/charts';
import { Filters, FooterNote, KpiCard, KpiGrid, PageHeader, Panel, SimpleTable, StatusPill } from '@/components/ui';
import { dashboardApi, enumLabel, formatUsd, StockDashboard } from '@/lib/dashboardApi';

const STATUS_MAP: Record<string, string> = {
  Normal: 'NORMAL',
  Atenção: 'ATTENTION',
  Alerta: 'ALERT',
  Crítico: 'CRITICAL',
};

function toQuery(values: Record<string, string>) {
  return {
    operator: values['Operador'] && values['Operador'] !== 'Todos' ? values['Operador'] : undefined,
    location: values['Armazém'] && values['Armazém'] !== 'Todos' ? values['Armazém'] : undefined,
    category: values['Categoria'] && values['Categoria'] !== 'Todas' ? values['Categoria'] : undefined,
    specification: values['Especificação'] && values['Especificação'] !== 'Todas' ? values['Especificação'] : undefined,
    status: values['Estado do Stock'] ? STATUS_MAP[values['Estado do Stock']] : undefined,
  };
}

function pillColor(status: string) {
  if (status === 'CRITICAL') return 'red';
  if (status === 'ALERT') return 'orange';
  if (status === 'ATTENTION') return 'gold';
  return 'green';
}

export default function StockPage() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [data, setData] = useState<StockDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const query = useMemo(() => toQuery(filters), [filters]);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      setData(await dashboardApi.stock(query));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar stock OCTG.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, [JSON.stringify(query)]);

  const criticalRows = (data?.criticalItems ?? []).map((item) => [
    item.itemName,
    item.category,
    item.quantityAvailable.toLocaleString('pt-PT'),
    item.minimumQuantity.toLocaleString('pt-PT'),
    <StatusPill key="estado" color={pillColor(item.status) as any}>{enumLabel(item.status)}</StatusPill>
  ]);
  const movementRows = (data?.movements ?? []).map((item) => [
    new Date(item.occurredAt).toLocaleDateString('pt-PT'),
    <span key="tipo" style={{ color: item.type === 'IN' ? '#159947' : '#ed1f41', fontWeight: 800 }}>{item.type === 'IN' ? '↑ Entrada' : '↓ Saída'}</span>,
    item.item,
    item.quantity.toLocaleString('pt-PT'),
    item.originDestination
  ]);

  return (
    <AppShell>
      <div className="content">
        <PageHeader title="Gestão de Stock OCTG" subtitle="Inventário, consumo, alertas e previsão de ruptura com dados reais da API." />
        <Filters items={stockFilters} onChange={setFilters} />

        {loading && <div className="data-state">A carregar dados de stock...</div>}
        {error && <div className="data-state error">{error} <button onClick={loadData}>Tentar novamente</button></div>}
        {!loading && !error && data && (
          <>
            <KpiGrid>
              <KpiCard label="Total de Itens" value={data.kpis.totalItems.toLocaleString('pt-PT')} trend="Quantidade disponível" trendType="up" icon="box" />
              <KpiCard label="Stock Crítico" value={String(data.kpis.criticalStock)} trend="Itens em alerta/crítico" trendType="down" icon="warning" color="red" />
              <KpiCard label="Entradas do Mês" value={data.kpis.monthlyIn.toLocaleString('pt-PT')} trend="Movimentos IN" trendType="up" icon="download" />
              <KpiCard label="Saídas do Mês" value={data.kpis.monthlyOut.toLocaleString('pt-PT')} trend="Movimentos OUT" trendType="down" icon="arrowUp" color="gold" />
              <KpiCard label="Previsão de Ruptura" value={`${data.kpis.ruptureForecastCategories} categorias`} trend="Abaixo do mínimo" icon="warning" />
              <KpiCard label="Valor de Inventário" value={formatUsd(data.kpis.inventoryValueUsd)} trend="Estimativa demonstrativa" trendType="up" icon="money" color="green" />
              <KpiCard label="Taxa de Utilização" value={`${data.kpis.utilizationRate}%`} trend="Saídas vs disponibilidade" trendType="up" icon="pie" color="gold" />
              <KpiCard label="Cobertura Média" value={`${data.kpis.averageCoverageDays} dias`} trend="Baseado em consumo" trendType="down" icon="calendar" />
            </KpiGrid>

            <div className="panel-grid">
              <Panel title="Stock Disponível por Categoria" className="col-4" action={<span className="panel-action">API real</span>}>
                <BarChart labels={data.stockByCategory.map((x) => x.label)} values={data.stockByCategory.map((x) => x.value)} />
              </Panel>
              <Panel title="Entradas vs Saídas" className="col-4">
                <GroupedBarChart labels={['Período actual']} a={[data.kpis.monthlyIn]} b={[data.kpis.monthlyOut]} aLabel="Entradas (unid.)" bLabel="Saídas (unid.)" />
              </Panel>
              <Panel title="Consumo por Operador (unidades)" className="col-4" action={<span className="panel-action">Movimentos OUT</span>}>
                <HorizontalBarChart labels={data.consumptionByOperator.map((x) => x.label)} values={data.consumptionByOperator.map((x) => x.value)} maxValue={Math.max(...data.consumptionByOperator.map((x) => x.value), 1)} />
              </Panel>
              <Panel title={`Materiais Críticos ${data.kpis.criticalStock}`} className="col-3" action={<span className="link-action">API real</span>}>
                <SimpleTable headers={['Categoria','Itens em Risco','Estado']} rows={data.criticalCategories.map((x) => [x.category, String(x.items), <StatusPill key={x.category} color={pillColor(x.status) as any}>{enumLabel(x.status)}</StatusPill>])} />
              </Panel>
              <Panel title="Cobertura de Stock (dias)" className="col-2">
                <Gauge value={data.kpis.averageCoverageDays} label="dias" />
              </Panel>
              <Panel title="Itens Críticos" className="col-3" action={<span className="link-action">Ver todos →</span>}>
                <SimpleTable headers={['Item','Categoria','Quantidade','Mínimo','Estado']} rows={criticalRows} />
              </Panel>
              <Panel title="Últimos Movimentos" className="col-4" action={<span className="link-action">API real</span>}>
                <SimpleTable headers={['Data','Tipo','Item','Qtd.','Origem/Destino']} rows={movementRows} />
              </Panel>
            </div>
          </>
        )}
        <FooterNote />
      </div>
    </AppShell>
  );
}
