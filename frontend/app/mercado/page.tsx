'use client';

import { useEffect, useMemo, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { marketFilters } from '@/data/mockData';
import { DonutChart, HorizontalBarChart, LineAreaChart, StackedBarChart } from '@/components/charts';
import { Filters, FooterNote, KpiCard, KpiGrid, PageHeader, Panel, SimpleTable, StatusPill } from '@/components/ui';
import { Icon } from '@/components/icons';
import { dashboardApi, enumLabel, formatUsd, MarketDashboard } from '@/lib/dashboardApi';

const TYPE_MAP: Record<string, string> = {
  'Produção': 'PRODUCTION',
  'Desenvolvimento': 'DEVELOPMENT',
  'Exploração': 'EXPLORATION',
  'Serviços Técnicos': 'SERVICE',
};

function toQuery(values: Record<string, string>) {
  return {
    operator: values['Operador'] && values['Operador'] !== 'Todos' ? values['Operador'] : undefined,
    block: values['Bloco'] && values['Bloco'] !== 'Todos' ? values['Bloco'] : undefined,
    basin: values['Bacia'] && values['Bacia'] !== 'Todas' ? values['Bacia'] : undefined,
    contractType: values['Tipo de Contrato'] ? TYPE_MAP[values['Tipo de Contrato']] : undefined,
  };
}

export default function MercadoPage() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [data, setData] = useState<MarketDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const query = useMemo(() => toQuery(filters), [filters]);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      setData(await dashboardApi.market(query));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar análise de mercado.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, [JSON.stringify(query)]);

  const contractRows = (data?.contracts ?? []).map((item) => [
    item.operator,
    item.block,
    enumLabel(item.type),
    `${item.valueMUsd.toLocaleString('pt-PT')} M USD`,
    <StatusPill key="estado" color={item.status === 'ACTIVE' ? 'green' : 'orange'}>● {enumLabel(item.status)}</StatusPill>
  ]);

  const blocks = data?.contractsByBlock ?? [];
  const blockLabels = blocks.map((x) => String(x.block));

  return (
    <AppShell>
      <div className="content">
        <PageHeader title="Análise de Mercado" subtitle="Quotas de mercado, contratos activos e tendências com dados vindos da API." />
        <Filters items={marketFilters} onChange={setFilters} />

        {loading && <div className="data-state">A carregar dados de mercado...</div>}
        {error && <div className="data-state error">{error} <button onClick={loadData}>Tentar novamente</button></div>}
        {!loading && !error && data && (
          <>
            <KpiGrid>
              <KpiCard label="Operadores Activos" value={String(data.kpis.activeOperators)} trend="Com contratos filtrados" trendType="up" icon="users" />
              <KpiCard label="Contratos Activos" value={String(data.kpis.activeContracts)} trend="Status activo" trendType="up" icon="contract" color="gold" />
              <KpiCard label="Market Share Líder" value={`${data.kpis.leaderMarketShare}%`} trend={data.kpis.leaderOperator} icon="crown" />
              <KpiCard label="Valor Total Contratado" value={formatUsd(data.kpis.totalContractedValueUsd)} trend="Somatório real" trendType="up" icon="money" color="red" />
              <KpiCard label="Crescimento Trimestral" value={`+${data.kpis.quarterlyGrowthPercent}%`} trend="Indicador executivo" trendType="up" icon="trend" color="gold" />
              <KpiCard label="Blocos em Actividade" value={String(data.kpis.activeBlocks)} trend="Blocos com contratos" trendType="up" icon="rig" />
              <KpiCard label="Taxa de Renovação" value={`${data.kpis.renewalRate}%`} trend="Indicador de demonstração" trendType="up" icon="refresh" color="red" />
              <KpiCard label="Novos Contratos" value={String(data.kpis.newContracts)} trend="Contratos iniciados em 2025" trendType="up" icon="file" color="gold" />
            </KpiGrid>

            <div className="panel-grid">
              <Panel title="Market Share por Operador" className="col-4" action={<span className="panel-action">Valor Contratado</span>}>
                <DonutChart center={`${formatUsd(data.kpis.totalContractedValueUsd)}\nTotal`} items={data.marketShare.map((x, i) => ({ label: x.operator, value: x.share, color: ['#191b1f','#ed1f41','#ff5b6f','#94a3b8','#0ea5e9','#159947','#7c3aed'][i % 7], detail: `(${formatUsd(x.valueUsd)})` }))} />
              </Panel>
              <Panel title="Evolução de Contratos Activos" className="col-5" action={<span className="panel-action">Por mês</span>}>
                <LineAreaChart labels={data.monthlyContracts.map((x) => x.label)} values={data.monthlyContracts.map((x) => x.value)} />
              </Panel>
              <Panel title="Ranking de Operadores por Valor Contratado" className="col-3" action={<span className="panel-action">M USD</span>}>
                <HorizontalBarChart labels={data.ranking.map((x) => x.label)} values={data.ranking.map((x) => x.value)} maxValue={Math.max(...data.ranking.map((x) => x.value), 1)} />
              </Panel>
              <Panel title="Contratos por Bloco" className="col-4">
                <StackedBarChart labels={blockLabels} series={[
                  { name: 'Produção', values: blocks.map((x) => Number(x.PRODUCTION ?? 0)), color: '#191b1f' },
                  { name: 'Desenvolvimento', values: blocks.map((x) => Number(x.DEVELOPMENT ?? 0)), color: '#ed1f41' },
                  { name: 'Exploração', values: blocks.map((x) => Number(x.EXPLORATION ?? 0)), color: '#ff5b6f' },
                ]} />
              </Panel>
              <Panel title="Principais Contratos" className="col-4" action={<span className="panel-action">API real</span>}>
                <SimpleTable headers={['Operador','Bloco','Tipo','Valor','Estado']} rows={contractRows} />
              </Panel>
              <Panel title="Tendências e Insights" className="col-4">
                <div className="insight-list">
                  {[
                    ['Crescimento Sustentado',`Existem ${data.kpis.activeContracts} contratos activos no conjunto filtrado.`,'trend','#191b1f'],
                    ['Concentração de Mercado',`${data.kpis.leaderOperator} lidera com ${data.kpis.leaderMarketShare}% de market share.`,'crown','#ff5b6f'],
                    ['Renovação em Alta',`Taxa de renovação executiva de ${data.kpis.renewalRate}%.`,'refresh','#ed1f41'],
                    ['Novas Oportunidades',`${data.kpis.newContracts} contratos iniciados em 2025.`,'globe','#159947']
                  ].map(([title, text, icon, color]) => <div className="insight-item" key={title}><span className="insight-icon" style={{ background: color }}><Icon name={icon as any} /></span><div><strong>{title}</strong><p>{text}</p></div></div>)}
                </div>
              </Panel>
            </div>
          </>
        )}
        <FooterNote />
      </div>
    </AppShell>
  );
}
