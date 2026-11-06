export const operationalFilters = [
  { label: 'Operador', value: 'Todos', icon: 'users' as const },
  { label: 'Bloco', value: 'Todos', icon: 'filter' as const },
  { label: 'Poço', value: 'Todos', icon: 'well' as const },
  { label: 'Sonda', value: 'Todos', icon: 'rig' as const },
  { label: 'Tipo de Operação', value: 'Todos', icon: 'contract' as const },
  { label: 'Período', value: '01/04/2025 – 20/05/2025', icon: 'calendar' as const }
];

export const marketFilters = [
  { label: 'Operador', value: 'Todos', icon: 'users' as const },
  { label: 'Bloco', value: 'Todos', icon: 'filter' as const },
  { label: 'Tipo de Contrato', value: 'Todos', icon: 'contract' as const },
  { label: 'Período', value: '01/04/2025 – 20/05/2025', icon: 'calendar' as const },
  { label: 'Bacia', value: 'Todas', icon: 'rig' as const },
  { label: 'Estado', value: 'Todos', icon: 'check' as const }
];

export const stockFilters = [
  { label: 'Operador', value: 'Todos', icon: 'users' as const },
  { label: 'Armazém', value: 'Todos', icon: 'warehouse' as const },
  { label: 'Categoria', value: 'Todas', icon: 'contract' as const },
  { label: 'Especificação', value: 'Todas', icon: 'filter' as const },
  { label: 'Período', value: '01/04/2025 – 20/05/2025', icon: 'calendar' as const },
  { label: 'Estado do Stock', value: 'Todos', icon: 'database' as const }
];

export const operationalIssues = [
  ['15/06-A-12', 'Sonangol P&P', 'Crítica', 'Em Curso'],
  ['31/04-B-05', 'TotalEnergies EP Angola', 'Crítica', 'Em Curso'],
  ['17/03-A-02', 'ExxonMobil Angola', 'Crítica', 'Em Curso'],
  ['0/11-C-01', 'Azule Energy', 'Alta', 'Identificado'],
  ['7/23-B-07', 'Chevron Angola', 'Alta', 'Identificado'],
  ['2/14-A-09', 'Sonangol P&P', 'Alta', 'Pendente']
];

export const contracts = [
  ['Sonangol P&P', '15/06', 'Produção', '45,0', 'Activo'],
  ['TotalEnergies EP Angola', '32', 'Produção', '38,0', 'Activo'],
  ['ExxonMobil Angola', '17', 'Desenvolvimento', '28,5', 'Activo'],
  ['Chevron Angola', '31', 'Desenvolvimento', '22,0', 'Activo'],
  ['Azule Energy', '01/14', 'Exploração', '15,0', 'Activo']
];

export const criticalItems = [
  ['Tubos 9 5/8” J-55 LTC', 'Tubos de Revestimento', '45', '120', 'Crítico'],
  ['Tubos 7” L-80 BTC', 'Tubos de Produção', '30', '80', 'Crítico'],
  ['Conexão 9 5/8” VAM TOP', 'Conexões Premium', '18', '40', 'Alerta'],
  ['Drill Collar 6 3/4” S-135', 'Drill Collars', '12', '30', 'Alerta'],
  ['HWP 5” S-135', 'Heavy Weight Pipes', '8', '20', 'Atenção']
];

export const movements = [
  ['20/05/2025 08:32', '↓ Saída', 'Tubos 7” L-80 BTC', '-40', 'Poço 15/06-A-12'],
  ['20/05/2025 07:45', '↑ Entrada', 'Tubos 9 5/8” J-55', '+120', 'Armazém Luanda'],
  ['19/05/2025 16:20', '↓ Saída', 'Conexão 9 5/8” VAM', '-16', 'Poço 31/04-B-05'],
  ['19/05/2025 11:08', '↑ Entrada', 'Drill Collar 6 3/4”', '+24', 'Armazém Cabinda'],
  ['19/05/2025 09:15', '↓ Saída', 'HWP 5” S-135', '-12', 'Poço 17/03-A-02']
];

export const submissions = [
  ['DDR_15-06_A12_Maio.xlsx', 'Sonangol P&P', 'Operacional', '20/05/2025 08:32', 'Aprovado'],
  ['Stock_OCTG_Cabinda.pdf', 'TotalEnergies EP Angola', 'Stock OCTG', '20/05/2025 07:45', 'Pendente'],
  ['Contratos_Bacia_Kwanza.xlsx', 'Azule Energy', 'Mercado', '19/05/2025 16:20', 'Rejeitado'],
  ['DDR_17_03_A02.xlsx', 'ExxonMobil Angola', 'Operacional', '19/05/2025 11:08', 'Em validação']
];

export type SubmissionRecord = {
  id: string;
  ficheiro: string;
  operador: string;
  tipo: 'Operacional' | 'Stock OCTG' | 'Mercado' | 'DDR';
  data: string;
  estado: 'Aprovado' | 'Pendente' | 'Rejeitado' | 'Em validação' | 'Correção solicitada';
  prioridade: 'Crítica' | 'Alta' | 'Média' | 'Baixa';
  validador: string;
  completude: number;
  inconsistencias: number;
  origem: 'Portal' | 'Email' | 'API';
  resumo: string;
};

export const submissionBoard: SubmissionRecord[] = [
  {
    id: 'SUB-2025-0581',
    ficheiro: 'DDR_15-06_A12_Maio.xlsx',
    operador: 'Sonangol P&P',
    tipo: 'DDR',
    data: '20/05/2025 08:32',
    estado: 'Aprovado',
    prioridade: 'Alta',
    validador: 'Ana de Sousa',
    completude: 98,
    inconsistencias: 0,
    origem: 'Portal',
    resumo: 'Dados operacionais completos para sondagem no poço 15/06-A-12. Integração validada com custos, tempo e sonda.'
  },
  {
    id: 'SUB-2025-0580',
    ficheiro: 'Stock_OCTG_Cabinda.pdf',
    operador: 'TotalEnergies EP Angola',
    tipo: 'Stock OCTG',
    data: '20/05/2025 07:45',
    estado: 'Pendente',
    prioridade: 'Crítica',
    validador: '—',
    completude: 82,
    inconsistencias: 2,
    origem: 'Portal',
    resumo: 'Mapa de stock OCTG do armazém Cabinda com itens críticos e divergências entre entradas e saídas.'
  },
  {
    id: 'SUB-2025-0579',
    ficheiro: 'Contratos_Bacia_Kwanza.xlsx',
    operador: 'Azule Energy',
    tipo: 'Mercado',
    data: '19/05/2025 16:20',
    estado: 'Rejeitado',
    prioridade: 'Média',
    validador: 'Manuel Pedro',
    completude: 64,
    inconsistencias: 5,
    origem: 'Email',
    resumo: 'Ficheiro de contratos contém campos obrigatórios em falta para bloco, bacia e período de vigência.'
  },
  {
    id: 'SUB-2025-0578',
    ficheiro: 'DDR_17_03_A02.xlsx',
    operador: 'ExxonMobil Angola',
    tipo: 'Operacional',
    data: '19/05/2025 11:08',
    estado: 'Em validação',
    prioridade: 'Alta',
    validador: 'João Miguel',
    completude: 91,
    inconsistencias: 1,
    origem: 'API',
    resumo: 'Operação de intervenção com uma inconsistência no tempo realizado versus data de encerramento reportada.'
  },
  {
    id: 'SUB-2025-0577',
    ficheiro: 'MarketShare_Abril_Operadores.xlsx',
    operador: 'Chevron Angola',
    tipo: 'Mercado',
    data: '18/05/2025 14:12',
    estado: 'Correção solicitada',
    prioridade: 'Média',
    validador: 'Ana de Sousa',
    completude: 76,
    inconsistencias: 3,
    origem: 'Portal',
    resumo: 'Market share submetido sem evidência documental para dois contratos renovados no trimestre.'
  },
  {
    id: 'SUB-2025-0576',
    ficheiro: 'Inventario_OCTG_Luanda.xlsx',
    operador: 'Etu Energias',
    tipo: 'Stock OCTG',
    data: '18/05/2025 09:25',
    estado: 'Aprovado',
    prioridade: 'Baixa',
    validador: 'Sistema',
    completude: 100,
    inconsistencias: 0,
    origem: 'API',
    resumo: 'Actualização automática de inventário OCTG validada sem divergências.'
  }
];

export const auditLogs = [
  ['20/05/2025 08:47', 'Ana de Sousa', 'Aprovou submissão', 'DDR_15-06_A12_Maio.xlsx', 'Sucesso'],
  ['20/05/2025 08:41', 'Sistema', 'Importou dados', 'Operações – Maio/2025', 'Sucesso'],
  ['19/05/2025 17:03', 'Manuel Pedro', 'Alterou indicador', 'Market Share por Operador', 'Sucesso'],
  ['19/05/2025 16:30', 'Sistema', 'Detectou inconsistência', 'Contratos_Bacia_Kwanza.xlsx', 'Atenção']
];

export type AuditEvent = {
  data: string;
  user: string;
  perfil: string;
  modulo: string;
  action: string;
  target: string;
  result: 'Sucesso' | 'Atenção' | 'Bloqueado';
  severity: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  ip: string;
  detalhe: string;
};

export const auditTrail: AuditEvent[] = [
  {
    data: '20/05/2025 08:47',
    user: 'Ana de Sousa',
    perfil: 'Administrador ANPG',
    modulo: 'Submissões',
    action: 'Aprovou submissão',
    target: 'DDR_15-06_A12_Maio.xlsx',
    result: 'Sucesso',
    severity: 'Baixa',
    ip: '10.20.4.18',
    detalhe: 'Validação técnica concluída e dados integrados no Dashboard Operacional.'
  },
  {
    data: '20/05/2025 08:41',
    user: 'Sistema',
    perfil: 'Serviço automático',
    modulo: 'Integração',
    action: 'Importou dados',
    target: 'Operações – Maio/2025',
    result: 'Sucesso',
    severity: 'Baixa',
    ip: '127.0.0.1',
    detalhe: 'Rotina automática de importação executada sem erros.'
  },
  {
    data: '20/05/2025 07:48',
    user: 'Sistema',
    perfil: 'Serviço automático',
    modulo: 'Stock OCTG',
    action: 'Detectou divergência',
    target: 'Stock_OCTG_Cabinda.pdf',
    result: 'Atenção',
    severity: 'Alta',
    ip: '127.0.0.1',
    detalhe: 'Foram encontradas duas divergências entre stock mínimo e consumo previsto.'
  },
  {
    data: '19/05/2025 17:03',
    user: 'Manuel Pedro',
    perfil: 'Gestor ANPG',
    modulo: 'Mercado',
    action: 'Alterou indicador',
    target: 'Market Share por Operador',
    result: 'Sucesso',
    severity: 'Média',
    ip: '10.20.5.31',
    detalhe: 'Alteração registada com versão anterior preservada para rastreabilidade.'
  },
  {
    data: '19/05/2025 16:30',
    user: 'Sistema',
    perfil: 'Serviço automático',
    modulo: 'Submissões',
    action: 'Bloqueou integração',
    target: 'Contratos_Bacia_Kwanza.xlsx',
    result: 'Bloqueado',
    severity: 'Crítica',
    ip: '127.0.0.1',
    detalhe: 'Campos obrigatórios em falta: bloco, bacia, tipo de contrato e vigência.'
  },
  {
    data: '18/05/2025 09:25',
    user: 'API Operador',
    perfil: 'Operador',
    modulo: 'API',
    action: 'Actualizou inventário',
    target: 'Inventario_OCTG_Luanda.xlsx',
    result: 'Sucesso',
    severity: 'Baixa',
    ip: '10.35.2.88',
    detalhe: 'Actualização via API autenticada com token válido e assinatura de origem.'
  }
];

export const executiveAlerts = [
  ['Stock crítico', 'Tubos de Revestimento abaixo do mínimo em Cabinda', 'Crítica'],
  ['Operação em risco', 'Poço 31/04-B-05 com desvio de custo acima de 8%', 'Alta'],
  ['Validação pendente', '5 submissões aguardam validação técnica', 'Média'],
  ['Mercado', '3 operadores concentram 69% do valor contratado', 'Informativo']
];

export const executivePriorities = [
  ['Validar stock OCTG Cabinda', 'Responsável: Eng. Stock · Prazo: hoje 15:00', 'Crítica'],
  ['Rever contratos Bacia Kwanza', 'Responsável: Mercado · Prazo: 24h', 'Alta'],
  ['Emitir relatório semanal', 'Word, Excel e PowerPoint para Direcção', 'Média'],
  ['Preparar integração SAP/WellView', 'Levantamento técnico com operadores', 'Planeado']
];
