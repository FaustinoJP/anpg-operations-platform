import { AppShell } from '@/components/AppShell';
import { FooterNote, KpiCard, KpiGrid, PageHeader, Panel, SimpleTable, StatusPill } from '@/components/ui';

export default function ConfiguracoesPage() {
  return (
    <AppShell>
      <div className="content">
        <PageHeader title="Configurações" subtitle="Parâmetros da plataforma, indicadores, integrações, modelos de relatório e regras de validação." />
        <KpiGrid>
          <KpiCard label="Indicadores" value="48" trend="Campos configuráveis" icon="settings" />
          <KpiCard label="Integrações" value="4" trend="API · SAP · WellView · Power BI" icon="globe" color="gold" />
          <KpiCard label="SLA Crítico" value="4h" trend="Conforme ITT" icon="clock" color="red" />
          <KpiCard label="Capacidade Inicial" value="1 TB" trend="Expansível" icon="database" />
          <KpiCard label="Utilizadores" value="50+" trend="Crescimento previsto" icon="users" />
          <KpiCard label="Idiomas" value="PT / EN" trend="Interface bilingue" icon="globe" />
          <KpiCard label="Backups" value="24/7" trend="Planeado" icon="shield" color="green" />
          <KpiCard label="Auditoria" value="Activa" trend="Rastreabilidade" icon="lock" />
        </KpiGrid>
        <div className="panel-grid">
          <Panel title="Parâmetros Gerais" className="col-5">
            <div className="form-grid">
              <div className="form-group"><label>Nome da plataforma</label><input className="form-control" defaultValue="ANPG Operations Intelligence Platform" /></div>
              <div className="form-group"><label>Idioma principal</label><select className="form-control"><option>Português</option><option>Inglês</option></select></div>
              <div className="form-group"><label>SLA incidentes críticos</label><input className="form-control" defaultValue="4 horas" /></div>
              <div className="form-group"><label>Retenção de auditoria</label><input className="form-control" defaultValue="5 anos" /></div>
              <div className="form-group full"><label>Mensagem de confidencialidade</label><input className="form-control" defaultValue="Dados confidenciais – Uso exclusivo autorizado. © ANPG 2025" /></div>
            </div>
            <button className="btn danger" style={{ marginTop: 8 }}>Guardar configurações</button>
          </Panel>
          <Panel title="Integrações Previstas" className="col-4">
            <SimpleTable headers={['Sistema','Objectivo','Estado']} rows={[
              ['SAP','Contratos, custos e dados financeiros',<StatusPill key="1" color="gold">Planeado</StatusPill>],
              ['WellView','Dados de operações e poços',<StatusPill key="2" color="gold">Planeado</StatusPill>],
              ['Power BI','Camada analítica externa',<StatusPill key="3" color="blue">Compatível</StatusPill>],
              ['API REST','Integração operadores',<StatusPill key="4" color="green">Preparado</StatusPill>]
            ]} />
          </Panel>
          <Panel title="Campos e Indicadores" className="col-3">
            <div className="cards-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="feature-card"><h3>Operacional</h3><p>Operador, bloco, poço, sonda, custo, tempo, estado, problema crítico.</p></div>
              <div className="feature-card"><h3>Mercado</h3><p>Contrato, operador, bloco, valor, bacia, tipo, estado e market share.</p></div>
              <div className="feature-card"><h3>Stock OCTG</h3><p>Categoria, especificação, quantidade, mínimo, armazém, entrada e saída.</p></div>
            </div>
          </Panel>
        </div>
        <FooterNote />
      </div>
    </AppShell>
  );
}
