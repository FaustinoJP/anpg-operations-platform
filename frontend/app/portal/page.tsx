import { AppShell } from '@/components/AppShell';
import { FooterNote, KpiCard, KpiGrid, PageHeader, Panel, SimpleTable, StatusPill } from '@/components/ui';
import { Icon } from '@/components/icons';
import { PortalSubmissionForm } from '@/components/PortalSubmissionForm';

export default function PortalPage() {
  return (
    <AppShell>
      <div className="content">
        <PageHeader title="Portal dos Operadores" subtitle="Área dedicada para submissão estruturada de dados, carregamento de ficheiros e acompanhamento de validação." />
        <KpiGrid>
          <KpiCard label="Operadores Registados" value="8" trend="Todos activos" trendType="up" icon="users" />
          <KpiCard label="Ficheiros Recebidos" value="126" trend="↑ 18 no mês" trendType="up" icon="upload" color="gold" />
          <KpiCard label="Submissões Pendentes" value="11" trend="5 críticas" trendType="down" icon="warning" color="red" />
          <KpiCard label="Taxa de Aprovação" value="86%" trend="↑ 4 p.p." trendType="up" icon="check" color="green" />
          <KpiCard label="Tempo Médio Validação" value="2h40" trend="Dentro da meta" trendType="up" icon="clock" />
          <KpiCard label="Integrações Previstas" value="4" trend="SAP · WellView · Power BI · API" icon="globe" />
          <KpiCard label="DDR Importados" value="74" trend="↑ 21%" trendType="up" icon="file" />
          <KpiCard label="Campos Obrigatórios" value="32" trend="Modelo configurável" icon="settings" />
        </KpiGrid>

        <div className="panel-grid">
          <Panel title="Nova Submissão" className="col-5">
            <PortalSubmissionForm />
          </Panel>
          <Panel title="Fluxo de Validação" className="col-3">
            <div className="insight-list">
              {[
                ['Recepção','Operador submete Excel, PDF, DDR ou inserção directa.','upload','#191b1f'],
                ['Validação automática','Sistema verifica campos obrigatórios e consistência.','check','#159947'],
                ['Análise ANPG','Engenheiro confirma dados e solicita correcções.','edit','#ff5b6f'],
                ['Publicação','Dados aprovados alimentam dashboards e relatórios.','dashboard','#ed1f41']
              ].map(([title,text,icon,color]) => <div className="insight-item" key={title}><span className="insight-icon" style={{ background: color }}><Icon name={icon as any}/></span><div><strong>{title}</strong><p>{text}</p></div></div>)}
            </div>
          </Panel>
          <Panel title="Histórico Recente" className="col-4" action={<span className="link-action">Ver submissões →</span>}>
            <SimpleTable headers={['Ficheiro','Operador','Tipo','Estado']} rows={[
              ['DDR_15-06_A12_Maio.xlsx','Sonangol P&P','Operacional',<StatusPill key="1" color="green">Aprovado</StatusPill>],
              ['Stock_OCTG_Cabinda.pdf','TotalEnergies EP Angola','Stock OCTG',<StatusPill key="2" color="gold">Pendente</StatusPill>],
              ['Contratos_Kwanza.xlsx','Azule Energy','Mercado',<StatusPill key="3" color="red">Rejeitado</StatusPill>],
              ['DDR_17_03_A02.xlsx','ExxonMobil Angola','Operacional',<StatusPill key="4" color="blue">Em validação</StatusPill>]
            ]} />
          </Panel>
        </div>
        <FooterNote />
      </div>
    </AppShell>
  );
}
