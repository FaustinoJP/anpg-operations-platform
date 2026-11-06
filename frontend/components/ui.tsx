'use client';

import type React from 'react';
import { useMemo, useState } from 'react';
import { Icon, IconName } from '@/components/icons';

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="page-head">
      <div className="page-title">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="last-update">
        <span>Última atualização: 20/05/2025 08:45</span>
        <Icon name="refresh" />
      </div>
    </div>
  );
}

type FilterItem = {
  label: string;
  value: string;
  icon?: IconName;
  options?: string[];
};

const DEFAULT_FILTER_OPTIONS: Record<string, string[]> = {
  Operador: ['Todos', 'Sonangol P&P', 'TotalEnergies EP Angola', 'ExxonMobil Angola', 'Azule Energy', 'Chevron Angola', 'ENI Angola', 'Equinor Angola', 'Etu Energias'],
  Bloco: ['Todos', '15/06', '32', '17', '31', '01/14', '02/14', '16/06', '10/11'],
  Poço: ['Todos', '15/06-A-12', '31/04-B-05', '17/03-A-02', '0/11-C-01', '7/23-B-07', '2/14-A-09'],
  Sonda: ['Todos', 'SON-07', 'SON-12', 'SON-03', 'SON-10', 'SON-02', 'SON-08', 'SON-05', 'SON-01'],
  'Tipo de Operação': ['Todos', 'Sondagem', 'Intervenção', 'Abandono', 'Workover Menor'],
  'Tipo de Contrato': ['Todos', 'Produção', 'Desenvolvimento', 'Exploração', 'Serviços Técnicos'],
  Período: ['01/04/2025 – 20/05/2025', 'Últimos 7 dias', 'Últimos 30 dias', 'Último trimestre', 'Ano 2025'],
  Bacia: ['Todas', 'Kwanza', 'Namibe', 'Congo', 'Benguela', 'Baixo Congo'],
  Estado: ['Todos', 'Activo', 'Em renovação', 'Suspenso', 'Encerrado'],
  Armazém: ['Todos', 'Luanda', 'Cabinda', 'Soyo', 'Lobito', 'Namibe'],
  Categoria: ['Todas', 'Tubos de Perfuração', 'Tubos de Revestimento', 'Tubos de Produção', 'Drill Collars', 'Conexões Premium', 'Heavy Weight Pipes'],
  Especificação: ['Todas', 'J-55 LTC', 'L-80 BTC', 'S-135', 'VAM TOP', 'Premium Connection'],
  'Estado do Stock': ['Todos', 'Normal', 'Atenção', 'Alerta', 'Crítico']
};

function getFilterOptions(item: FilterItem) {
  const base = item.options ?? DEFAULT_FILTER_OPTIONS[item.label] ?? [item.value];
  return Array.from(new Set([item.value, ...base]));
}

export function Filters({ items, onChange }: { items: FilterItem[]; onChange?: (values: Record<string, string>) => void }) {
  const [selected, setSelected] = useState<Record<string, string>>(() => Object.fromEntries(items.map((item) => [item.label, item.value])));
  const [openLabel, setOpenLabel] = useState<string | null>(null);

  const activeCount = useMemo(() => items.filter((item) => selected[item.label] !== item.value).length, [items, selected]);

  const resetFilters = () => {
    const next = Object.fromEntries(items.map((item) => [item.label, item.value]));
    setSelected(next);
    onChange?.(next);
    setOpenLabel(null);
  };

  return (
    <div className="filters-wrap">
      <div className="filters-grid">
        {items.map((item) => {
          const value = selected[item.label] ?? item.value;
          const isOpen = openLabel === item.label;
          const isActive = value !== item.value;
          const options = getFilterOptions(item);

          return (
            <div className="filter-control" key={item.label}>
              <button
                type="button"
                className={`filter-box ${isOpen ? 'open' : ''} ${isActive ? 'selected' : ''}`}
                onClick={() => setOpenLabel(isOpen ? null : item.label)}
                aria-expanded={isOpen}
              >
                <span className="filter-icon"><Icon name={item.icon ?? 'filter'} /></span>
                <span className="filter-text">
                  <strong>{item.label}</strong>
                  <small title={value}>{value}</small>
                </span>
                <span className="chevron">⌄</span>
              </button>
              {isOpen && (
                <div className="filter-menu" role="listbox">
                  {options.map((option) => (
                    <button
                      type="button"
                      key={option}
                      className={option === value ? 'active' : ''}
                      onClick={() => {
                        setSelected((current) => {
                          const next = { ...current, [item.label]: option };
                          onChange?.(next);
                          return next;
                        });
                        setOpenLabel(null);
                      }}
                    >
                      <span>{option}</span>
                      {option === value && <Icon name="check" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="filter-status">
        <span>{activeCount > 0 ? `${activeCount} filtro(s) aplicado(s)` : 'Filtros prontos para análise'}</span>
        {activeCount > 0 && <button type="button" onClick={resetFilters}>Limpar filtros</button>}
      </div>
    </div>
  );
}

export function KpiCard({ label, value, trend, trendType = 'neutral', icon = 'dashboard', color = 'navy' }: {
  label: string;
  value: string;
  trend: string;
  trendType?: 'up' | 'down' | 'neutral';
  icon?: IconName;
  color?: 'navy' | 'red' | 'gold' | 'green';
}) {
  return (
    <div className="kpi-card">
      <div className="kpi-top">
        <span className={`kpi-icon ${color}`}><Icon name={icon} /></span>
        <span className="kpi-copy">
          <label>{label}</label>
          <b>{value}</b>
        </span>
      </div>
      <div className={`trend ${trendType}`}>{trend}</div>
    </div>
  );
}

export function KpiGrid({ children }: { children: React.ReactNode }) {
  return <div className="kpi-grid">{children}</div>;
}

export function Panel({ title, action, className = '', children }: {
  title: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-head">
        <h2 className="panel-title">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function FooterNote() {
  return (
    <div className="footer-note">
      <span className="nav-icon" style={{ width: 18, height: 18 }}><Icon name="lock" /></span>
      <span>Dados confidenciais – Uso exclusivo autorizado. © ANPG 2025</span>
    </div>
  );
}

export function StatusPill({ children, color }: { children: React.ReactNode; color: 'red' | 'orange' | 'gold' | 'blue' | 'green' | 'gray' }) {
  return <span className={`pill ${color}`}>{children}</span>;
}

export function SimpleTable({ headers, rows }: { headers: string[]; rows: Array<Array<React.ReactNode>> }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>{row.map((cell, idx) => <td key={idx}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
