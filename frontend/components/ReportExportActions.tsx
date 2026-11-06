'use client';

import { useState } from 'react';
import { Icon } from '@/components/icons';

type ExportType = 'word' | 'excel' | 'powerpoint' | 'technical';

const operationalRows = [
  ['Indicador', 'Valor', 'Comentário'],
  ['Operações Totais', '128', 'Sondagem, intervenção, abandono e workover menor'],
  ['Operações em Curso', '17', 'Acompanhamento operacional activo'],
  ['Poços Intervencionados', '42', 'Período 01/04/2025 – 20/05/2025'],
  ['Custo Previsto', '48,5 M USD', 'Planeamento consolidado'],
  ['Custo Realizado', '51,2 M USD', 'Desvio de +5,6%'],
  ['Problemas Críticos', '9', '3 críticos em curso'],
];

const stockRows = [
  ['Item', 'Categoria', 'Quantidade', 'Mínimo', 'Estado'],
  ['Tubos 9 5/8” J-55 LTC', 'Tubos de Revestimento', '45', '120', 'Crítico'],
  ['Tubos 7” L-80 BTC', 'Tubos de Produção', '30', '80', 'Crítico'],
  ['Conexão 9 5/8” VAM TOP', 'Conexões Premium', '18', '40', 'Alerta'],
  ['Drill Collar 6 3/4” S-135', 'Drill Collars', '12', '30', 'Alerta'],
];

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function toCsv(rows: string[][]) {
  return rows
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(';'))
    .join('\n');
}

function buildWordDocument() {
  return `
  <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8" />
      <title>Relatório Técnico Operacional ANPG</title>
      <style>
        body { font-family: Arial, sans-serif; color: #0f172a; }
        h1 { color: #191b1f; border-bottom: 3px solid #ed1f41; padding-bottom: 8px; }
        h2 { color: #191b1f; margin-top: 26px; }
        table { border-collapse: collapse; width: 100%; margin-top: 12px; }
        th { background: #191b1f; color: #fff; }
        th, td { border: 1px solid #cbd5e1; padding: 8px; font-size: 12px; }
        .note { color: #64748b; font-size: 11px; margin-top: 24px; }
      </style>
    </head>
    <body>
      <h1>Relatório Técnico Operacional</h1>
      <p><strong>Plataforma:</strong> ANPG Operations Intelligence Platform</p>
      <p><strong>Período:</strong> 01/04/2025 – 20/05/2025</p>
      <p><strong>Âmbito:</strong> Operações de sondagem, intervenção e abandono de poços.</p>
      <h2>Resumo Executivo</h2>
      <p>O período analisado apresenta 128 operações registadas, 17 em curso e 42 poços intervencionados. O custo realizado é de 51,2 M USD contra 48,5 M USD previstos, resultando num desvio de +5,6%.</p>
      <h2>Indicadores Operacionais</h2>
      <table>
        ${operationalRows.map((row, index) => `<tr>${row.map((cell) => index === 0 ? `<th>${cell}</th>` : `<td>${cell}</td>`).join('')}</tr>`).join('')}
      </table>
      <h2>Recomendações Técnicas</h2>
      <ul>
        <li>Priorizar o tratamento dos problemas críticos actualmente em curso.</li>
        <li>Reforçar o controlo de desvios de custos nas operações com maior exposição.</li>
        <li>Integrar submissões DDR e stock OCTG no fluxo de validação automática.</li>
      </ul>
      <p class="note">Dados confidenciais – Uso exclusivo autorizado. © ANPG 2025</p>
    </body>
  </html>`;
}

function buildExcelWorkbookHtml() {
  const sheet = (title: string, rows: string[][]) => `
    <h2>${title}</h2>
    <table>
      ${rows.map((row, i) => `<tr>${row.map((cell) => i === 0 ? `<th>${cell}</th>` : `<td>${cell}</td>`).join('')}</tr>`).join('')}
    </table>
  `;

  return `
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: Arial, sans-serif; }
        h1, h2 { color: #191b1f; }
        table { border-collapse: collapse; margin: 12px 0 28px; width: 100%; }
        th { background: #191b1f; color: #ffffff; }
        th, td { border: 1px solid #cbd5e1; padding: 8px; }
      </style>
    </head>
    <body>
      <h1>ANPG Operations Intelligence Platform</h1>
      ${sheet('Indicadores Operacionais', operationalRows)}
      ${sheet('Itens Críticos OCTG', stockRows)}
    </body>
  </html>`;
}

function buildPowerPointHtml() {
  return `
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Apresentação Executiva ANPG</title>
      <style>
        body { margin: 0; font-family: Arial, sans-serif; background: #f8fafc; color: #0f172a; }
        .slide { width: 960px; height: 540px; padding: 48px; box-sizing: border-box; page-break-after: always; background: white; border-bottom: 10px solid #191b1f; }
        .cover { background: linear-gradient(135deg, #191b1f, #111316); color: white; border-bottom-color: #ff5b6f; }
        h1 { font-size: 42px; margin: 0 0 18px; }
        h2 { color: #191b1f; font-size: 30px; margin: 0 0 22px; }
        .cover h2 { color: #ff5b6f; }
        .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .card { border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px; background: #f8fafc; }
        .card b { display: block; font-size: 30px; color: #191b1f; margin-top: 8px; }
        li { margin: 12px 0; font-size: 19px; }
      </style>
    </head>
    <body>
      <section class="slide cover">
        <h1>ANPG Operations Intelligence Platform</h1>
        <h2>Dashboards para operações, mercado e stock OCTG</h2>
        <p>Protótipo executivo para concurso — 2025</p>
      </section>
      <section class="slide">
        <h2>Dashboard Operacional</h2>
        <div class="grid">
          <div class="card">Operações Totais<b>128</b></div>
          <div class="card">Em Curso<b>17</b></div>
          <div class="card">Custo Realizado<b>51,2 M USD</b></div>
          <div class="card">Problemas Críticos<b>9</b></div>
        </div>
        <ul><li>Monitorização de custos, tempos, sondas e desvios.</li><li>Comparação entre previsto e realizado.</li><li>Rastreabilidade de problemas críticos.</li></ul>
      </section>
      <section class="slide">
        <h2>Análise de Mercado e Stock OCTG</h2>
        <div class="grid">
          <div class="card">Contratos Activos<b>34</b></div>
          <div class="card">Market Share Líder<b>31%</b></div>
          <div class="card">Itens OCTG<b>4.280</b></div>
          <div class="card">Stock Crítico<b>14</b></div>
        </div>
        <ul><li>Market share por operador, bloco e bacia.</li><li>Inventário, consumo, alertas e previsão de ruptura.</li><li>Relatórios técnicos automatizados.</li></ul>
      </section>
    </body>
  </html>`;
}

export function ReportExportActions() {
  const [lastExport, setLastExport] = useState<string>('');

  const handleExport = (type: ExportType) => {
    if (type === 'word') {
      downloadFile('relatorio-tecnico-operacional-anpg.doc', buildWordDocument(), 'application/msword;charset=utf-8');
      setLastExport('Relatório Word gerado com sucesso.');
      return;
    }

    if (type === 'excel') {
      downloadFile('indicadores-operacionais-stock-anpg.xls', buildExcelWorkbookHtml(), 'application/vnd.ms-excel;charset=utf-8');
      setLastExport('Ficheiro Excel gerado com sucesso.');
      return;
    }

    if (type === 'powerpoint') {
      downloadFile('apresentacao-executiva-anpg.ppt', buildPowerPointHtml(), 'application/vnd.ms-powerpoint;charset=utf-8');
      setLastExport('Apresentação PowerPoint gerada com sucesso.');
      return;
    }

    const csv = toCsv([...operationalRows, [], ...stockRows]);
    downloadFile('dados-tecnicos-anpg.csv', csv, 'text/csv;charset=utf-8');
    setLastExport('Base técnica CSV gerada com sucesso.');
  };

  return (
    <div className="export-actions-card">
      <div>
        <h3>Exportações funcionais do protótipo</h3>
        <p>Gere ficheiros de demonstração em Word, Excel, PowerPoint e CSV para validar o fluxo exigido no ITT.</p>
      </div>
      <div className="export-buttons">
        <button className="btn danger" onClick={() => handleExport('word')}><Icon name="file" /> Word</button>
        <button className="btn success" onClick={() => handleExport('excel')}><Icon name="database" /> Excel</button>
        <button className="btn gold" onClick={() => handleExport('powerpoint')}><Icon name="contract" /> PowerPoint</button>
        <button className="btn light" onClick={() => handleExport('technical')}><Icon name="download" /> CSV técnico</button>
      </div>
      {lastExport && <div className="export-toast"><Icon name="check" /> {lastExport}</div>}
    </div>
  );
}
