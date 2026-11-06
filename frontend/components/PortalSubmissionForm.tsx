'use client';

import { useMemo, useState } from 'react';
import { Icon } from '@/components/icons';
import { StatusPill } from '@/components/ui';

const checks = [
  'Estrutura do ficheiro reconhecida',
  'Campos obrigatórios preenchidos',
  'Formato de data válido',
  'Operador e bloco identificados',
  'Pronto para validação ANPG'
];

export function PortalSubmissionForm() {
  const [fileName, setFileName] = useState('');
  const [validated, setValidated] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const progress = useMemo(() => {
    if (submitted) return 100;
    if (validated) return 82;
    if (fileName) return 46;
    return 20;
  }, [fileName, validated, submitted]);

  return (
    <div className="submission-demo">
      <div className="form-grid">
        <div className="form-group"><label>Operador</label><select className="form-control"><option>Sonangol P&P</option><option>TotalEnergies EP Angola</option><option>ExxonMobil Angola</option><option>Azule Energy</option></select></div>
        <div className="form-group"><label>Tipo de informação</label><select className="form-control"><option>Dados Operacionais DDR</option><option>Stock OCTG</option><option>Informação de Mercado</option></select></div>
        <div className="form-group"><label>Bloco</label><input className="form-control" defaultValue="15/06" /></div>
        <div className="form-group"><label>Poço / Referência</label><input className="form-control" defaultValue="15/06-A-12" /></div>
        <div className="form-group full">
          <label>Carregar ficheiro</label>
          <label className="upload-dropzone">
            <input type="file" onChange={(event) => setFileName(event.target.files?.[0]?.name ?? '')} />
            <span className="upload-dropzone-icon"><Icon name="upload" /></span>
            <strong>{fileName || 'Seleccione ou arraste o ficheiro'}</strong>
            <small>Excel, PDF, DDR ou ficheiro técnico do operador</small>
          </label>
        </div>
        <div className="form-group full"><label>Observações</label><textarea className="form-control" rows={4} defaultValue="Submissão mensal com dados operacionais, custos, tempo e estado das actividades." /></div>
      </div>

      <div className="validation-box">
        <div className="validation-head">
          <strong>Validação automática</strong>
          <StatusPill color={submitted ? 'green' : validated ? 'blue' : 'gold'}>{submitted ? 'Submetido' : validated ? 'Validado' : 'Em preparação'}</StatusPill>
        </div>
        <div className="progress-bar"><span style={{ width: `${progress}%` }} /></div>
        <div className="checklist">
          {checks.map((item, index) => {
            const done = submitted || validated || (fileName && index < 2);
            return <div className={done ? 'check-row done' : 'check-row'} key={item}><Icon name={done ? 'check' : 'clock'} /> {item}</div>;
          })}
        </div>
      </div>

      <div className="hero-actions" style={{ marginTop: 10 }}>
        <button className="btn gold" onClick={() => setValidated(true)}><Icon name="check" /> Simular validação</button>
        <button className="btn danger" onClick={() => { setValidated(true); setSubmitted(true); }}><Icon name="upload" /> Submeter para validação</button>
        <button className="btn light" onClick={() => { setFileName(''); setValidated(false); setSubmitted(false); }}><Icon name="refresh" /> Limpar</button>
      </div>

      {submitted && <div className="export-toast success-message"><Icon name="check" /> Submissão registada: aguardando revisão do engenheiro ANPG.</div>}
    </div>
  );
}
