import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const addDays = (date: string, days: number) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

async function main() {
  const roles = [
    ['ADMIN_ANPG', 'Administrador ANPG com acesso total.'],
    ['GESTOR_ANPG', 'Gestor ANPG para validação e dashboards.'],
    ['ENGENHEIRO_ANALISTA', 'Engenheiro ou analista técnico.'],
    ['OPERADOR', 'Utilizador de operador externo.'],
    ['AUDITOR', 'Perfil de auditoria e rastreabilidade.'],
  ];

  for (const [name, description] of roles) {
    await prisma.role.upsert({ where: { name }, update: { description }, create: { name, description } });
  }

  const operators = [
    ['SONANGOL', 'Sonangol P&P'],
    ['TOTALENERGIES', 'TotalEnergies EP Angola'],
    ['EXXONMOBIL', 'ExxonMobil Angola'],
    ['AZULE', 'Azule Energy'],
    ['CHEVRON', 'Chevron Angola'],
    ['EQUINOR', 'Equinor Angola'],
    ['ENI', 'ENI Angola'],
    ['ETU', 'Etu Energias'],
  ];

  for (const [code, name] of operators) {
    await prisma.operator.upsert({ where: { code }, update: { name, status: 'ACTIVE' }, create: { code, name, status: 'ACTIVE' } });
  }

  const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: 'ADMIN_ANPG' } });
  const operatorRole = await prisma.role.findUniqueOrThrow({ where: { name: 'OPERADOR' } });
  const sonangol = await prisma.operator.findUniqueOrThrow({ where: { code: 'SONANGOL' } });

  const adminPasswordHash = await bcrypt.hash('anpg2025', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@anpg.ao' },
    update: { passwordHash: adminPasswordHash, roleId: adminRole.id, status: 'ACTIVE' },
    create: { name: 'Administrador ANPG', email: 'admin@anpg.ao', passwordHash: adminPasswordHash, roleId: adminRole.id },
  });

  const operatorPasswordHash = await bcrypt.hash('operador2025', 10);
  const operatorUser = await prisma.user.upsert({
    where: { email: 'operador@sonangol.co.ao' },
    update: { passwordHash: operatorPasswordHash, roleId: operatorRole.id, operatorId: sonangol.id, status: 'ACTIVE' },
    create: { name: 'Operador Sonangol', email: 'operador@sonangol.co.ao', passwordHash: operatorPasswordHash, roleId: operatorRole.id, operatorId: sonangol.id },
  });

  // Recria dados operacionais demonstrativos para manter o seed idempotente.
  await prisma.auditLog.deleteMany();
  await prisma.validationResult.deleteMany();
  await prisma.submissionFile.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.report.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.stockItem.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.operation.deleteMany();
  await prisma.rig.deleteMany();
  await prisma.well.deleteMany();
  await prisma.block.deleteMany();

  const blockSeeds = [
    { code: '15/06', basin: 'Baixo Congo', operatorCode: 'SONANGOL' },
    { code: '32', basin: 'Baixo Congo', operatorCode: 'TOTALENERGIES' },
    { code: '17', basin: 'Baixo Congo', operatorCode: 'EXXONMOBIL' },
    { code: '31', basin: 'Baixo Congo', operatorCode: 'AZULE' },
    { code: '01/14', basin: 'Kwanza', operatorCode: 'CHEVRON' },
    { code: '02/14', basin: 'Kwanza', operatorCode: 'ENI' },
    { code: '16/06', basin: 'Baixo Congo', operatorCode: 'EQUINOR' },
    { code: '10/11', basin: 'Benguela', operatorCode: 'ETU' },
  ];

  const blockByCode = new Map<string, string>();
  for (const item of blockSeeds) {
    const operator = await prisma.operator.findUniqueOrThrow({ where: { code: item.operatorCode } });
    const block = await prisma.block.create({ data: { code: item.code, name: `Bloco ${item.code}`, basin: item.basin, operatorId: operator.id } });
    blockByCode.set(item.code, block.id);
  }

  const wells: Array<{ code: string; block: string; type: string; status: string }> = [
    { code: '15/06-A-12', block: '15/06', type: 'Produção', status: 'Activo' },
    { code: '15/06-B-04', block: '15/06', type: 'Injecção', status: 'Activo' },
    { code: '32-C-09', block: '32', type: 'Produção', status: 'Activo' },
    { code: '17-D-02', block: '17', type: 'Exploração', status: 'Planeado' },
    { code: '31-E-07', block: '31', type: 'Produção', status: 'Activo' },
    { code: '01/14-F-11', block: '01/14', type: 'Produção', status: 'Activo' },
    { code: '02/14-G-05', block: '02/14', type: 'Exploração', status: 'Planeado' },
    { code: '16/06-H-03', block: '16/06', type: 'Produção', status: 'Activo' },
    { code: '10/11-I-08', block: '10/11', type: 'Abandono', status: 'Suspenso' },
  ];

  const wellByCode = new Map<string, string>();
  for (const item of wells) {
    const well = await prisma.well.create({ data: { code: item.code, name: `Poço ${item.code}`, blockId: blockByCode.get(item.block)!, wellType: item.type, status: item.status } });
    wellByCode.set(item.code, well.id);
  }

  const rigs = [
    ['SON-07', 'Sonda SON-07', 'SONANGOL'], ['SON-12', 'Sonda SON-12', 'SONANGOL'], ['TEN-03', 'Sonda TEN-03', 'TOTALENERGIES'],
    ['EXX-10', 'Sonda EXX-10', 'EXXONMOBIL'], ['AZU-02', 'Sonda AZU-02', 'AZULE'], ['CHV-08', 'Sonda CHV-08', 'CHEVRON'],
    ['ENI-05', 'Sonda ENI-05', 'ENI'], ['EQN-01', 'Sonda EQN-01', 'EQUINOR'],
  ];
  const rigByCode = new Map<string, string>();
  for (const [code, name, operatorCode] of rigs) {
    const operator = await prisma.operator.findUniqueOrThrow({ where: { code: operatorCode } });
    const rig = await prisma.rig.create({ data: { code, name, operatorId: operator.id, status: 'ACTIVE' } });
    rigByCode.set(code, rig.id);
  }

  const operationSeeds = [
    ['SONANGOL', '15/06', '15/06-A-12', 'SON-07', 'INTERVENTION', 'IN_PROGRESS', '2025-01-05', 17, 2500000, 2750000, 'Atraso por indisponibilidade de material OCTG.'],
    ['SONANGOL', '15/06', '15/06-B-04', 'SON-12', 'DRILLING', 'COMPLETED', '2025-01-20', 21, 5200000, 5100000, null],
    ['TOTALENERGIES', '32', '32-C-09', 'TEN-03', 'DRILLING', 'COMPLETED', '2025-02-03', 24, 7400000, 7850000, null],
    ['EXXONMOBIL', '17', '17-D-02', 'EXX-10', 'INTERVENTION', 'SUSPENDED', '2025-02-18', 18, 3100000, 3900000, 'Operação suspensa por falha em equipamento de controlo.'],
    ['AZULE', '31', '31-E-07', 'AZU-02', 'WORKOVER', 'IN_PROGRESS', '2025-03-04', 14, 2200000, 2400000, 'Desvio de prazo em mobilização da equipa.'],
    ['CHEVRON', '01/14', '01/14-F-11', 'CHV-08', 'ABANDONMENT', 'PLANNED', '2025-03-16', 28, 6300000, 0, null],
    ['ENI', '02/14', '02/14-G-05', 'ENI-05', 'DRILLING', 'COMPLETED', '2025-04-02', 20, 6800000, 7000000, null],
    ['EQUINOR', '16/06', '16/06-H-03', 'EQN-01', 'INTERVENTION', 'COMPLETED', '2025-04-19', 12, 1900000, 1850000, null],
    ['ETU', '10/11', '10/11-I-08', 'SON-07', 'ABANDONMENT', 'SUSPENDED', '2025-05-05', 30, 4500000, 5100000, 'Necessária revisão do plano de abandono e stock.'],
    ['SONANGOL', '15/06', '15/06-A-12', 'SON-12', 'WORKOVER', 'COMPLETED', '2025-05-12', 11, 1600000, 1580000, null],
    ['TOTALENERGIES', '32', '32-C-09', 'TEN-03', 'INTERVENTION', 'IN_PROGRESS', '2025-05-18', 16, 2800000, 3050000, 'Aguardando confirmação de peças sobressalentes.'],
    ['AZULE', '31', '31-E-07', 'AZU-02', 'DRILLING', 'PLANNED', '2025-06-02', 23, 5900000, 0, null],
  ] as const;

  for (const [operatorCode, blockCode, wellCode, rigCode, type, status, start, duration, planned, actual, issue] of operationSeeds) {
    const operator = await prisma.operator.findUniqueOrThrow({ where: { code: operatorCode } });
    const plannedStartDate = new Date(start);
    const actualStartDate = status === 'PLANNED' ? null : addDays(start, status === 'IN_PROGRESS' ? 1 : 0);
    const plannedEndDate = addDays(start, duration);
    const actualEndDate = status === 'PLANNED' || status === 'IN_PROGRESS' ? null : addDays(start, duration + (actual > planned ? 2 : -1));
    await prisma.operation.create({
      data: {
        operatorId: operator.id,
        blockId: blockByCode.get(blockCode)!,
        wellId: wellByCode.get(wellCode)!,
        rigId: rigByCode.get(rigCode)!,
        type,
        status,
        plannedStartDate,
        actualStartDate,
        plannedEndDate,
        actualEndDate,
        plannedCostUsd: planned,
        actualCostUsd: actual,
        criticalIssue: issue,
      },
    });
  }

  const contractSeeds = [
    ['SONANGOL', '15/06', 'PRODUCTION', 74400000, 'ACTIVE', '2025-01-01'],
    ['TOTALENERGIES', '32', 'DEVELOPMENT', 52800000, 'ACTIVE', '2025-01-15'],
    ['EXXONMOBIL', '17', 'PRODUCTION', 38400000, 'ACTIVE', '2025-02-01'],
    ['CHEVRON', '01/14', 'EXPLORATION', 28800000, 'ACTIVE', '2025-02-20'],
    ['AZULE', '31', 'SERVICE', 21600000, 'ACTIVE', '2025-03-05'],
    ['ENI', '02/14', 'DEVELOPMENT', 14400000, 'ACTIVE', '2025-03-22'],
    ['EQUINOR', '16/06', 'SERVICE', 6000000, 'ACTIVE', '2025-04-10'],
    ['ETU', '10/11', 'EXPLORATION', 3600000, 'SUSPENDED', '2025-04-29'],
  ] as const;

  for (const [operatorCode, blockCode, type, value, status, startDate] of contractSeeds) {
    const operator = await prisma.operator.findUniqueOrThrow({ where: { code: operatorCode } });
    await prisma.contract.create({ data: { operatorId: operator.id, blockId: blockByCode.get(blockCode)!, type, valueUsd: value, status, startDate: new Date(startDate), endDate: new Date('2026-12-31') } });
  }

  const stockSeeds = [
    ['SONANGOL', 'Tubos de Revestimento', 'Tubos 9 5/8" J-55 LTC', '9 5/8" J-55 LTC', 45, 120, 'Luanda', 'CRITICAL'],
    ['SONANGOL', 'Tubos de Produção', 'Tubos 7" L-80 BTC', '7" L-80 BTC', 30, 80, 'Cabinda', 'CRITICAL'],
    ['TOTALENERGIES', 'Drill Collars', 'Drill Collar 6 3/4" S-135', '6 3/4" S-135', 65, 40, 'Luanda', 'NORMAL'],
    ['EXXONMOBIL', 'Conexões Premium', 'VAM TOP Premium Connection', 'VAM TOP', 80, 100, 'Soyo', 'ALERT'],
    ['AZULE', 'Heavy Weight Pipes', 'HWDP 5"', 'S-135', 140, 90, 'Luanda', 'NORMAL'],
    ['CHEVRON', 'Tubos de Perfuração', 'Drill Pipe 5"', '5" S-135', 260, 150, 'Lobito', 'NORMAL'],
    ['ENI', 'Tubos de Revestimento', 'Casing 13 3/8"', '13 3/8" J-55', 90, 120, 'Namibe', 'ATTENTION'],
    ['EQUINOR', 'Conexões Premium', 'Premium Connection XT', 'XT', 55, 70, 'Soyo', 'ALERT'],
  ] as const;

  const stockIds: string[] = [];
  for (const [operatorCode, category, itemName, specification, qty, min, location, status] of stockSeeds) {
    const operator = await prisma.operator.findUniqueOrThrow({ where: { code: operatorCode } });
    const item = await prisma.stockItem.create({ data: { operatorId: operator.id, category, itemName, specification, quantityAvailable: qty, minimumQuantity: min, location, status } });
    stockIds.push(item.id);
  }

  for (let i = 0; i < stockIds.length; i++) {
    const item = await prisma.stockItem.findUniqueOrThrow({ where: { id: stockIds[i] } });
    await prisma.stockMovement.create({ data: { stockItemId: item.id, operatorId: item.operatorId, wellId: i % 2 === 0 ? wellByCode.get('15/06-A-12') : wellByCode.get('32-C-09'), type: i % 3 === 0 ? 'IN' : 'OUT', quantity: i % 3 === 0 ? 180 + i * 20 : 55 + i * 12, originDestination: i % 3 === 0 ? 'Recepção Armazém' : 'Consumo em operação', occurredAt: addDays('2025-05-01', i * 3) } });
  }

  const submissions = [
    ['SUB-2025-DEMO01', 'SONANGOL', 'OPERATIONAL', 'UNDER_REVIEW', 82, 2, 'Submissão operacional de Maio.'],
    ['SUB-2025-MKT02', 'TOTALENERGIES', 'MARKET', 'APPROVED', 100, 0, 'Relatório de contratos aprovado.'],
    ['SUB-2025-STK03', 'EXXONMOBIL', 'STOCK', 'CORRECTION_REQUESTED', 76, 3, 'Stock OCTG com divergências.'],
    ['SUB-2025-MIX04', 'AZULE', 'MIXED', 'SUBMITTED', 91, 1, 'Pacote integrado submetido.'],
  ] as const;

  for (const [reference, operatorCode, type, status, completenessPercent, inconsistencyCount, notes] of submissions) {
    const operator = await prisma.operator.findUniqueOrThrow({ where: { code: operatorCode } });
    const submission = await prisma.submission.create({ data: { reference, operatorId: operator.id, submittedById: operatorUser.id, type, status, periodStart: new Date('2025-05-01'), periodEnd: new Date('2025-05-31'), completenessPercent, inconsistencyCount, notes } });
    if (inconsistencyCount > 0) {
      await prisma.validationResult.createMany({ data: [
        { submissionId: submission.id, field: 'well_code', severity: 'WARNING', message: 'Confirmar códigos de poço em linhas seleccionadas.' },
        { submissionId: submission.id, field: 'actual_cost', severity: 'ERROR', message: 'Custo realizado em falta numa operação.' },
      ] });
    }
  }

  await prisma.auditLog.createMany({ data: [
    { actorId: adminUser.id, action: 'SEED_DATABASE', module: 'SYSTEM', entityType: 'Database', metadata: { message: 'Dados de demonstração inseridos.' } },
    { actorId: operatorUser.id, action: 'SUBMISSION_CREATED', module: 'SUBMISSIONS', entityType: 'Submission', metadata: { reference: 'SUB-2025-DEMO01' } },
    { actorId: adminUser.id, action: 'DASHBOARD_VIEWED', module: 'DASHBOARD', entityType: 'Dashboard', metadata: { name: 'Dashboard Geral' } },
  ] });

  console.log('Seed concluído.');
  console.log('Admin: admin@anpg.ao / anpg2025');
  console.log('Operador: operador@sonangol.co.ao / operador2025');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
