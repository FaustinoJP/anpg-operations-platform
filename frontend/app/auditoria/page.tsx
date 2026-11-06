import { AppShell } from '@/components/AppShell';
import { auditTrail } from '@/data/mockData';
import { Filters, FooterNote, KpiCard, KpiGrid, PageHeader, Panel, SimpleTable, StatusPill } from '@/components/ui';
import { BarChart, StatusList } from '@/components/charts';

export default function AuditoriaPage() {
  const rows = auditTrail.map((event) => [
    event.data,
    <span key={`${event.data}-${event.user}`} className="user-cell"><strong>{event.user}</strong><small>{event.perfil}</small></span>,
    event.modulo,
    event.action,
    event.target,
    <StatusPill key={event.result} color={event.result === 'Sucesso' ? 'green' : event.result === 'Bloqueado' ? 'red' : 'gold'}>{event.result}</StatusPill>
  ]);

  return (
    <AppShell>
      <div className="content">
        <PageHeader title="Auditoria" subtitle="Registos de actividade para rastreabilidade, conformidade, segurança e evidência institucional." />
        <Filters items={[
          { label: 'Utilizador', value: 'Todos', icon: 'users' },
          { label: 'Módulo', value: 'Todos', icon: 'dashboard' },
          { label: 'Acção', value: 'Todas', icon: 'edit' },
          { label: 'Resultado', value: 'Todos', icon: 'check' },
          { label: 'Período', value: 'Últimos 30 dias', icon: 'calendar' },
          { label: 'Severidade', value: 'Todas', icon: 'warning' }
        ]} />

        <KpiGrid>
          <KpiCard label="Eventos Registados" value="4.682" trend="Últimos 30 dias" icon="shield" />
          <KpiCard label="Acessos" value="1.204" trend="Sem anomalias críticas" trendType="up" icon="users" />
          <KpiCard label="Alterações" value="316" trend="Campos e indicadores" icon="edit" color="gold" />
          <KpiCard label="Importações" value="74" trend="DDR e Excel" icon="upload" />
          <KpiCard label="Alertas" value="12" trend="3 exigem análise" trendType="down" icon="warning" color="red" />
          <KpiCard label="Exportações" value="42" trend="Word · Excel · PPT" icon="file" />
          <KpiCard label="SLA Auditoria" value="100%" trend="Rastreabilidade activa" trendType="up" icon="check" color="green" />
          <KpiCard label="Retenção" value="5 anos" trend="Configurável" icon="database" />
        </KpiGrid>

        <div className="panel-grid">
          <Panel title="Registos Recentes" className="col-8" action={<span className="panel-action">Trilha imutável</span>}>
            <SimpleTable headers={['Data/Hora','Utilizador','Módulo','Acção','Objecto','Resultado']} rows={rows} />
          </Panel>

          <Panel title="Timeline de Eventos Críticos" className="col-4">
            <div className="audit-timeline">
              {auditTrail.slice(0, 5).map((event) => (
                <div className={`audit-event ${event.result.toLowerCase()}`} key={`${event.data}-${event.target}`}>
                  <i />
                  <div>
                    <strong>{event.action}</strong>
                    <span>{event.data} · {event.modulo}</span>
                    <p>{event.detalhe}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Eventos por Módulo" className="col-4" action={<span className="panel-action">30 dias</span>}>
            <BarChart labels={['Submissões','Operacional','Stock','Mercado','Relatórios','API']} values={[1380,920,740,610,420,612]} height={255} />
          </Panel>

          <Panel title="Estado de Conformidade" className="col-4">
            <StatusList items={[
              { name: 'Controlo de acesso por perfil', value: 100, percent: '100%', color: '#159947' },
              { name: 'Logs de importação', value: 100, percent: '100%', color: '#159947' },
              { name: 'Histórico de alterações', value: 96, percent: '96%', color: '#191b1f' },
              { name: 'Retenção documental', value: 92, percent: '92%', color: '#ff5b6f' },
              { name: 'Alertas pendentes', value: 12, percent: '12%', color: '#ed1f41' }
            ]} />
          </Panel>

          <Panel title="Modelo de Auditoria Proposto" className="col-4">
            <div className="cards-grid compact-cards">
              <div className="feature-card"><h3>Rastreabilidade</h3><p>Acessos, importações, edições, validações e exportações ficam registados com data, utilizador e objecto.</p></div>
              <div className="feature-card"><h3>Segurança</h3><p>Preparado para perfis, logs, histórico, evidência documental e análise de anomalias.</p></div>
              <div className="feature-card"><h3>Conformidade</h3><p>Base compatível com boas práticas de segurança da informação e ISO 27001 ou equivalente.</p></div>
            </div>
          </Panel>
        </div>
        <FooterNote />
      </div>
    </AppShell>
  );
}
