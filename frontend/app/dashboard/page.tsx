'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { FooterNote, KpiCard, KpiGrid, PageHeader, Panel, SimpleTable, StatusPill } from '@/components/ui';
import { BarChart, HorizontalBarChart, LineAreaChart, StatusList } from '@/components/charts';
import { DashboardHero } from '@/components/DashboardHero';
import { dashboardApi, GeneralDashboard } from '@/lib/dashboardApi';

function statusColor(value: string) {
  if (value === 'Crítica') return 'red';
  if (value === 'Alta') return 'orange';
  if (value === 'Média') return 'gold';
  return 'green';
}

export default function DashboardPage() {
  const [data, setData] = useState<GeneralDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      setData(await dashboardApi.general());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar Dashboard Geral.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const alertRows = (data?.executiveAlerts ?? []).map(([area, detalhe, severidade]) => [
    area,
    detalhe,
    <StatusPill key={severidade} color={statusColor(severidade) as any}>{severidade}</StatusPill>
  ]);

  const priorityRows = (data?.priorities ?? []).map(([prioridade, responsavel, estado]) => [
    prioridade,
    responsavel,
    <StatusPill key={estado} color={statusColor(estado) as any}>{estado}</StatusPill>
  ]);

  return (
    <AppShell>
      <div className="content">
        <DashboardHero />
        <PageHeader title="Dashboard Geral" subtitle="Visão executiva consolidada com dados reais vindos da API NestJS." />

        {loading && <div className="data-state">A carregar indicadores executivos...</div>}
        {error && <div className="data-state error">{error} <button onClick={loadData}>Tentar novamente</button></div>}
        {!loading && !error && data && (
          <>
            <KpiGrid>
              <KpiCard label="Operações Totais" value={String(data.kpis.operationsTotal ?? 0)} trend="Dados carregados da API" trendType="up" icon="rig" />
              <KpiCard label="Contratos Activos" value={String(data.kpis.activeContracts ?? 0)} trend="Contratos em vigor" trendType="up" icon="contract" color="gold" />
              <KpiCard label="Stock Crítico" value={String(data.kpis.criticalStock ?? 0)} trend="Itens em alerta/crítico" trendType="down" icon="warning" color="red" />
              <KpiCard label="Submissões Pendentes" value={String(data.kpis.pendingSubmissions ?? 0)} trend="Aguardam validação" icon="upload" color="gold" />
              <KpiCard label="Poços Registados" value={String(data.kpis.wellsIntervened ?? 0)} trend="Base de dados operacional" trendType="up" icon="well" />
              <KpiCard label="Índice de Prontidão" value={`${data.readinessIndex}%`} trend="Calculado pelo backend" trendType="up" icon="trend" color="red" />
              <KpiCard label="Alertas Críticos" value={String(data.kpis.criticalIssues ?? 0)} trend="Problemas operacionais" trendType="down" icon="warning" color="red" />
              <KpiCard label="Operadores Activos" value={String(data.kpis.activeOperators ?? 0)} trend="Com registos na plataforma" trendType="up" icon="users" />
            </KpiGrid>

            <div className="executive-ribbon">
              <div><strong>Operacional</strong><span>{data.executiveRibbon.operational}</span></div>
              <div><strong>Mercado</strong><span>{data.executiveRibbon.market}</span></div>
              <div><strong>Stock OCTG</strong><span>{data.executiveRibbon.stock}</span></div>
              <div><strong>Submissões</strong><span>{data.executiveRibbon.submissions}</span></div>
            </div>

            <div className="panel-grid">
              <Panel title="Evolução de Contratos Activos" className="col-5" action={<span className="panel-action">API real</span>}>
                <LineAreaChart labels={['Jan/25','Fev/25','Mar/25','Abr/25','Mai/25','Jun/25']} values={[1,2,3,5,7,8]} />
              </Panel>
              <Panel title="Operações por Módulo" className="col-3" action={<span className="panel-action">Seed actual</span>}>
                <BarChart labels={['Sondagem','Intervenção','Abandono','Workover']} values={[3,4,2,3]} height={255} />
              </Panel>
              <Panel title="Consumo por Operador" className="col-4" action={<span className="panel-action">Movimentos OCTG</span>}>
                <HorizontalBarChart labels={['Sonangol P&P','TotalEnergies','ExxonMobil','Azule Energy','Chevron','ENI']} values={[180,67,79,91,103,115]} />
              </Panel>

              <Panel title="Estado Geral das Operações" className="col-4">
                <StatusList items={[
                  { name: 'Em Curso', value: data.kpis.operationsInProgress ?? 0, percent: '25%', color: '#159947' },
                  { name: 'Com problema crítico', value: data.kpis.criticalIssues ?? 0, percent: '35%', color: '#ed1f41' },
                  { name: 'Pendentes de validação', value: data.kpis.pendingSubmissions ?? 0, percent: '45%', color: '#ff5b6f' },
                ]} />
              </Panel>
              <Panel title="Alertas Executivos" className="col-4" action={<Link className="link-action" href="/submissoes">Ver validações →</Link>}>
                <SimpleTable headers={['Área','Descrição','Nível']} rows={alertRows} />
              </Panel>
              <Panel title="Prioridades da Direcção" className="col-4" action={<span className="panel-action">Próximas 24–72h</span>}>
                <SimpleTable headers={['Prioridade','Responsável / Prazo','Estado']} rows={priorityRows} />
              </Panel>

              <Panel title="Fluxo operacional integrado" className="col-12">
                <div className="workflow-steps">
                  <div><b>1</b><strong>Submissão</strong><span>Operadores submetem dados operacionais.</span></div>
                  <div><b>2</b><strong>Validação</strong><span>Backend valida e regista inconsistências.</span></div>
                  <div><b>3</b><strong>Aprovação ANPG</strong><span>Gestores aprovam ou solicitam correcção.</span></div>
                  <div><b>4</b><strong>Dashboards</strong><span>Indicadores são alimentados pela API real.</span></div>
                  <div><b>5</b><strong>Relatórios</strong><span>Exportação Word, Excel, PowerPoint e CSV.</span></div>
                  <div><b>6</b><strong>Auditoria</strong><span>Todas as acções ficam rastreadas.</span></div>
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
