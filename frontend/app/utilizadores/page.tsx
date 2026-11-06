import { AppShell } from '@/components/AppShell';
import { FooterNote, KpiCard, KpiGrid, PageHeader, Panel, SimpleTable, StatusPill } from '@/components/ui';

export default function UtilizadoresPage() {
  return (
    <AppShell>
      <div className="content">
        <PageHeader title="Utilizadores" subtitle="Gestão de perfis, permissões e acessos para ANPG, operadores e equipas técnicas." />
        <KpiGrid>
          <KpiCard label="Utilizadores" value="58" trend="Activos na plataforma" trendType="up" icon="users" />
          <KpiCard label="Administradores" value="6" trend="ANPG" icon="shield" color="red" />
          <KpiCard label="Engenheiros/Gestores" value="22" trend="Consulta e validação" icon="rig" />
          <KpiCard label="Operadores" value="30" trend="Submissão de dados" icon="upload" color="gold" />
          <KpiCard label="Perfis" value="5" trend="RBAC configurável" icon="settings" />
          <KpiCard label="Sessões Hoje" value="41" trend="Sem bloqueios" trendType="up" icon="globe" />
          <KpiCard label="Bloqueados" value="2" trend="Por revisão" trendType="down" icon="warning" color="red" />
          <KpiCard label="MFA" value="Planeado" trend="Fase 2" icon="lock" />
        </KpiGrid>
        <div className="panel-grid">
          <Panel title="Novo Utilizador" className="col-4">
            <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="form-group"><label>Nome completo</label><input className="form-control" defaultValue="Carlos Manuel" /></div>
              <div className="form-group"><label>Email</label><input className="form-control" defaultValue="carlos.manuel@operador.co.ao" /></div>
              <div className="form-group"><label>Perfil</label><select className="form-control"><option>Operador</option><option>Administrador ANPG</option><option>Engenheiro ANPG</option><option>Gestor ANPG</option></select></div>
              <div className="form-group"><label>Operador associado</label><select className="form-control"><option>Sonangol P&P</option><option>TotalEnergies EP Angola</option><option>ExxonMobil Angola</option></select></div>
            </div>
            <button className="btn danger" style={{ marginTop: 8 }}>Criar utilizador</button>
          </Panel>
          <Panel title="Lista de Utilizadores" className="col-8">
            <SimpleTable headers={['Nome','Email','Perfil','Organização','Estado']} rows={[
              ['Ana de Sousa','ana.sousa@anpg.ao','Administrador','ANPG',<StatusPill key="1" color="green">Activo</StatusPill>],
              ['Manuel Pedro','manuel.pedro@anpg.ao','Engenheiro','ANPG',<StatusPill key="2" color="green">Activo</StatusPill>],
              ['João Mateus','joao.mateus@sonangol.co.ao','Operador','Sonangol P&P',<StatusPill key="3" color="green">Activo</StatusPill>],
              ['Maria Costa','maria.costa@totalenergies.com','Operador','TotalEnergies EP Angola',<StatusPill key="4" color="blue">Convite enviado</StatusPill>],
              ['Pedro Silva','pedro.silva@azule-energy.com','Operador','Azule Energy',<StatusPill key="5" color="gray">Inactivo</StatusPill>]
            ]} />
          </Panel>
          <Panel title="Perfis de Acesso" className="col-12">
            <div className="cards-grid">
              <div className="feature-card"><h3>Administrador ANPG</h3><p>Configura plataforma, indicadores, utilizadores, modelos, validações e auditoria.</p></div>
              <div className="feature-card"><h3>Engenheiro/Gestor ANPG</h3><p>Consulta dashboards, valida submissões, analisa desvios e gera relatórios técnicos.</p></div>
              <div className="feature-card"><h3>Operador</h3><p>Submete ficheiros, corrige dados rejeitados e acompanha estado de validação.</p></div>
            </div>
          </Panel>
        </div>
        <FooterNote />
      </div>
    </AppShell>
  );
}
