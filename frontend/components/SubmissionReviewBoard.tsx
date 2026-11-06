'use client';

import { useMemo, useState } from 'react';
import { Icon } from '@/components/icons';
import { StatusPill } from '@/components/ui';
import { submissionBoard, SubmissionRecord } from '@/data/mockData';

function statusColor(status: SubmissionRecord['estado']) {
  if (status === 'Aprovado') return 'green' as const;
  if (status === 'Pendente') return 'gold' as const;
  if (status === 'Rejeitado') return 'red' as const;
  if (status === 'Correção solicitada') return 'orange' as const;
  return 'blue' as const;
}

function priorityColor(priority: SubmissionRecord['prioridade']) {
  if (priority === 'Crítica') return 'red' as const;
  if (priority === 'Alta') return 'orange' as const;
  if (priority === 'Média') return 'gold' as const;
  return 'gray' as const;
}

export function SubmissionReviewBoard() {
  const [items, setItems] = useState<SubmissionRecord[]>(submissionBoard);
  const [selectedId, setSelectedId] = useState(submissionBoard[1]?.id ?? submissionBoard[0].id);
  const [message, setMessage] = useState('');
  const selected = useMemo(() => items.find((item) => item.id === selectedId) ?? items[0], [items, selectedId]);

  function updateStatus(status: SubmissionRecord['estado']) {
    setItems((current) => current.map((item) => item.id === selected.id ? {
      ...item,
      estado: status,
      validador: status === 'Aprovado' || status === 'Correção solicitada' || status === 'Rejeitado' ? 'Ana de Sousa' : item.validador
    } : item));
    setMessage(`${selected.id} actualizado para “${status}”. Esta acção fica registada na auditoria.`);
  }

  return (
    <div className="review-board">
      <div className="review-table-card">
        <div className="review-toolbar">
          <div>
            <strong>Fila de validação ANPG</strong>
            <span>{items.length} submissões · ordenadas por criticidade e data</span>
          </div>
          <button className="btn light" type="button"><Icon name="download" /> Exportar fila</button>
        </div>
        <div className="review-list">
          {items.map((item) => (
            <button
              type="button"
              key={item.id}
              className={`review-row ${item.id === selected.id ? 'selected' : ''}`}
              onClick={() => { setSelectedId(item.id); setMessage(''); }}
            >
              <span className="review-file">
                <b>{item.ficheiro}</b>
                <small>{item.id} · {item.operador}</small>
              </span>
              <span className="hide-sm"><StatusPill color={priorityColor(item.prioridade)}>{item.prioridade}</StatusPill></span>
              <span className="hide-md">{item.tipo}</span>
              <span className="hide-md">{item.data}</span>
              <span><StatusPill color={statusColor(item.estado)}>{item.estado}</StatusPill></span>
            </button>
          ))}
        </div>
      </div>

      <aside className="submission-detail">
        <div className="detail-header">
          <span className="detail-icon"><Icon name="file" /></span>
          <div>
            <strong>{selected.id}</strong>
            <small>{selected.ficheiro}</small>
          </div>
        </div>

        <div className="detail-summary">{selected.resumo}</div>

        <div className="detail-metrics">
          <div>
            <small>Completude</small>
            <strong>{selected.completude}%</strong>
            <span className="mini-progress"><span style={{ width: `${selected.completude}%` }} /></span>
          </div>
          <div>
            <small>Inconsistências</small>
            <strong>{selected.inconsistencias}</strong>
          </div>
          <div>
            <small>Origem</small>
            <strong>{selected.origem}</strong>
          </div>
          <div>
            <small>Validador</small>
            <strong>{selected.validador}</strong>
          </div>
        </div>

        <div className="validation-checks">
          <div className="check-row done"><Icon name="check" /> Estrutura do ficheiro reconhecida</div>
          <div className={selected.completude >= 90 ? 'check-row done' : 'check-row'}><Icon name="check" /> Campos obrigatórios verificados</div>
          <div className={selected.inconsistencias === 0 ? 'check-row done' : 'check-row'}><Icon name="warning" /> Consistência técnica</div>
          <div className="check-row done"><Icon name="lock" /> Rastreabilidade activada</div>
        </div>

        <div className="detail-actions">
          <button className="btn success" type="button" onClick={() => updateStatus('Aprovado')}><Icon name="check" /> Aprovar</button>
          <button className="btn gold" type="button" onClick={() => updateStatus('Correção solicitada')}><Icon name="edit" /> Solicitar correcção</button>
          <button className="btn danger" type="button" onClick={() => updateStatus('Rejeitado')}><Icon name="warning" /> Rejeitar</button>
        </div>

        {message && <div className="export-toast success-message"><Icon name="check" /> {message}</div>}
      </aside>
    </div>
  );
}
