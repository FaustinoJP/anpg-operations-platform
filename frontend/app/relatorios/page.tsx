import { AppShell } from '@/components/AppShell';
import { FooterNote, KpiCard, KpiGrid, PageHeader, Panel, SimpleTable, StatusPill } from '@/components/ui';
import { ReportExportActions } from '@/components/ReportExportActions';

export default function RelatoriosPage() {
  return (
    <AppShell>
      <div className="content">
        <PageHeader title="Relatórios" subtitle="Geração automatizada de relatórios em Word, Excel e PowerPoint com modelos institucionais." />
        <KpiGrid>
          <KpiCard label="Relatórios Gerados" value="42" trend="↑ 9 no mês" trendType="up" icon="file" />
          <KpiCard label="Exportações Excel" value="18" trend="Dados estruturados" icon="database" color="green" />
          <KpiCard label="Exportações Word" value="14" trend="Relatórios técnicos" icon="file" />
          <KpiCard label="PowerPoint" value="10" trend="Apresentações executivas" icon="contract" color="gold" />
          <KpiCard label="Modelos Activos" value="7" trend="Institucionais" icon="settings" />
          <KpiCard label="Relatórios Pendentes" value="5" trend="Aguardam validação" icon="clock" color="gold" />
          <KpiCard label="Automáticos" value="12" trend="Mensais e trimestrais" icon="refresh" />
          <KpiCard label="Última Geração" value="08:45" trend="20/05/2025" icon="calendar" />
        </KpiGrid>
        <ReportExportActions />
        <div className="panel-grid">
          <Panel title="Gerar Relatório Técnico" className="col-5">
            <div className="form-grid">
              <div className="form-group"><label>Tipo de relatório</label><select className="form-control"><option>Operacional</option><option>Análise de Mercado</option><option>Stock OCTG</option><option>Consolidado Executivo</option></select></div>
              <div className="form-group"><label>Periodicidade</label><select className="form-control"><option>Mensal</option><option>Trimestral</option><option>Anual</option><option>Mediante solicitação</option></select></div>
              <div className="form-group"><label>Período</label><input className="form-control" defaultValue="01/04/2025 – 20/05/2025" /></div>
              <div className="form-group"><label>Operador</label><select className="form-control"><option>Todos</option><option>Sonangol P&P</option><option>TotalEnergies EP Angola</option></select></div>
              <div className="form-group full"><label>Formato de saída</label><select className="form-control"><option>Word + Excel + PowerPoint</option><option>Apenas Word</option><option>Apenas Excel</option><option>Apenas PowerPoint</option></select></div>
            </div>
            <div className="hero-actions" style={{ marginTop: 10 }}><button className="btn danger">Gerar relatório</button><button className="btn light">Pré-visualizar</button></div>
          </Panel>
          <Panel title="Modelos Disponíveis" className="col-3">
            <div className="cards-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="feature-card"><h3>Relatório Operacional</h3><p>Custos, tempos, poços, sondas, desvios e problemas críticos.</p></div>
              <div className="feature-card"><h3>Relatório de Mercado</h3><p>Market share, contratos activos, blocos e tendências.</p></div>
              <div className="feature-card"><h3>Relatório de Stock</h3><p>Inventário OCTG, consumo, ruptura e materiais críticos.</p></div>
            </div>
          </Panel>
          <Panel title="Histórico de Relatórios" className="col-4">
            <SimpleTable headers={['Relatório','Formato','Data','Estado']} rows={[
              ['Operacional – Maio/2025','Word · Excel', '20/05/2025', <StatusPill key="1" color="green">Gerado</StatusPill>],
              ['Mercado – Trimestre II','PowerPoint', '19/05/2025', <StatusPill key="2" color="green">Gerado</StatusPill>],
              ['Stock OCTG – Cabinda','Excel', '18/05/2025', <StatusPill key="3" color="gold">Pendente</StatusPill>],
              ['Consolidado Executivo','Word · PPT', '17/05/2025', <StatusPill key="4" color="blue">Em revisão</StatusPill>]
            ]} />
          </Panel>
        </div>
        <FooterNote />
      </div>
    </AppShell>
  );
}
