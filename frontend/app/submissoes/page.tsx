import { AppShell } from '@/components/AppShell';
import { SubmissionReviewBoard } from '@/components/SubmissionReviewBoard';
import { Filters, FooterNote, KpiCard, KpiGrid, PageHeader, Panel, StatusPill } from '@/components/ui';
import { StatusList } from '@/components/charts';

export default function SubmissoesPage() {
  return (
    <AppShell>
      <div className="content">
        <PageHeader title="Submissões" subtitle="Fila de validação dos operadores, aprovação técnica ANPG e controlo de qualidade dos dados." />
        <Filters items={[
          { label: 'Operador', value: 'Todos', icon: 'users' },
          { label: 'Tipo', value: 'DDR / Stock / Mercado', icon: 'file' },
          { label: 'Estado', value: 'Todos', icon: 'check' },
          { label: 'Período', value: 'Últimos 30 dias', icon: 'calendar' },
          { label: 'Origem', value: 'Portal / Email / API', icon: 'globe' },
          { label: 'Validador', value: 'Todos', icon: 'shield' }
        ]} />

        <KpiGrid>
          <KpiCard label="Total Recebido" value="126" trend="↑ 18 no mês" trendType="up" icon="upload" />
          <KpiCard label="Aprovadas" value="89" trend="70,6% do total" trendType="up" icon="check" color="green" />
          <KpiCard label="Pendentes" value="11" trend="5 críticas" trendType="down" icon="warning" color="gold" />
          <KpiCard label="Rejeitadas" value="6" trend="Exigem correcção" trendType="down" icon="warning" color="red" />
          <KpiCard label="Em Validação" value="20" trend="Dentro do SLA" trendType="up" icon="clock" />
          <KpiCard label="DDR" value="74" trend="Tipo mais frequente" icon="file" />
          <KpiCard label="Stock OCTG" value="28" trend="Actualização semanal" icon="database" />
          <KpiCard label="Mercado" value="24" trend="Contratos e indicadores" icon="pie" />
        </KpiGrid>

        <div className="panel-grid">
          <Panel title="Fila de Validação e Aprovação" className="col-12" action={<span className="panel-action">Simulação funcional</span>}>
            <SubmissionReviewBoard />
          </Panel>

          <Panel title="Pipeline de Estados" className="col-4">
            <StatusList items={[
              { name: 'Aprovadas', value: 89, percent: '70,6%', color: '#159947' },
              { name: 'Em Validação', value: 20, percent: '15,9%', color: '#191b1f' },
              { name: 'Pendentes', value: 11, percent: '8,7%', color: '#ff5b6f' },
              { name: 'Rejeitadas', value: 6, percent: '4,8%', color: '#ed1f41' }
            ]} />
          </Panel>

          <Panel title="Regras de Validação" className="col-4">
            <div className="rules-list">
              <div><StatusPill color="green">OK</StatusPill><span>Formato Excel/PDF/DDR reconhecido</span></div>
              <div><StatusPill color="green">OK</StatusPill><span>Operador e bloco obrigatórios</span></div>
              <div><StatusPill color="gold">Atenção</StatusPill><span>Comparação previsto vs realizado</span></div>
              <div><StatusPill color="red">Crítico</StatusPill><span>Stock abaixo do mínimo operacional</span></div>
              <div><StatusPill color="blue">Auditável</StatusPill><span>Histórico e evidência preservados</span></div>
            </div>
          </Panel>

          <Panel title="SLA de Validação" className="col-4">
            <div className="sla-box">
              <strong>3h12</strong>
              <span>Tempo médio actual de resposta</span>
              <div className="sla-track"><i style={{ width: '80%' }} /></div>
              <p>Meta do ITT: resposta até 4 horas para incidentes críticos. A fila actual está dentro do limite.</p>
            </div>
          </Panel>
        </div>
        <FooterNote />
      </div>
    </AppShell>
  );
}
