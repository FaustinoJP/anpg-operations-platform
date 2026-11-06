const NAVY = '#191b1f';
const BLUE = '#3f4650';
const RED = '#ed1f41';
const GOLD = '#ff5b6f';
const GREEN = '#159947';
const GRAY = '#94a3b8';
const LIGHT = '#e2e8f0';

function niceMax(value: number) {
  if (!Number.isFinite(value) || value <= 0) return 10;
  return Math.ceil(value / 10) * 10;
}

export function ComboBarLineChart({
  labels = [],
  bars = [],
  line = [],
  barLabel = 'Previsto',
  lineLabel = 'Realizado',
  height = 255
}: {
  labels: string[];
  bars: number[];
  line: number[];
  barLabel?: string;
  lineLabel?: string;
  height?: number;
}) {
  const safeLabels = Array.isArray(labels) && labels.length ? labels : ['Sem dados'];
  const safeBars = safeLabels.map((_, i) => Number(bars[i] ?? 0));
  const safeLine = safeLabels.map((_, i) => Number(line[i] ?? 0));
  const width = 740;
  const margin = { top: 24, right: 24, bottom: 38, left: 42 };
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;
  const max = niceMax(Math.max(...safeBars, ...safeLine) + 8);
  const step = plotW / safeLabels.length;
  const x = (i: number) => margin.left + step * i + step / 2;
  const y = (v: number) => margin.top + plotH - (v / max) * plotH;
  const barW = Math.min(38, step * 0.42);
  const points = safeLine.map((v, i) => `${x(i)},${y(v)}`).join(' ');

  return (
    <>
      <div className="chart-legend" style={{ marginBottom: 5 }}>
        <span className="legend-item"><span className="legend-line" style={{ background: NAVY }} />{barLabel}</span>
        <span className="legend-item"><span className="legend-line" style={{ background: RED }} />{lineLabel}</span>
      </div>
      <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} role="img">
        {[0, .25, .5, .75, 1].map((t) => {
          const yy = margin.top + plotH * t;
          const val = Math.round(max * (1 - t));
          return <g key={t}><line x1={margin.left} y1={yy} x2={width - margin.right} y2={yy} stroke={LIGHT} /><text x={8} y={yy + 4} fontSize="11" fill="#64748b">{val}</text></g>;
        })}
        {safeBars.map((v, i) => {
          const barH = Math.max(0, plotH - (y(v) - margin.top));
          return <g key={`${safeLabels[i]}-${i}`}><rect x={x(i) - barW / 2} y={y(v)} width={barW} height={barH} rx="6" fill={NAVY} /><text x={x(i)} y={y(v) - 7} textAnchor="middle" fontSize="12" fontWeight="700" fill={NAVY}>{v.toLocaleString('pt-PT')}</text><text x={x(i)} y={height - 12} textAnchor="middle" fontSize="12" fill="#475569">{safeLabels[i]}</text></g>;
        })}
        <polyline points={points} fill="none" stroke={RED} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {safeLine.map((v, i) => <g key={i}><circle cx={x(i)} cy={y(v)} r="5" fill={RED} stroke="white" strokeWidth="2" /><text x={x(i)} y={y(v) - 12} textAnchor="middle" fontSize="12" fontWeight="800" fill={RED}>{v.toLocaleString('pt-PT')}</text></g>)}
      </svg>
    </>
  );
}

export function BarChart({ labels = [], values = [], color = NAVY, height = 255, average }: { labels: string[]; values: number[]; color?: string; height?: number; average?: number }) {
  const safeLabels = Array.isArray(labels) && labels.length ? labels : ['Sem dados'];
  const safeValues = safeLabels.map((_, i) => Number(values[i] ?? 0));
  const width = 660;
  const margin = { top: 22, right: 22, bottom: 44, left: 42 };
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;
  const max = niceMax(Math.max(...safeValues, average ?? 0) + 5);
  const step = plotW / safeLabels.length;
  const x = (i: number) => margin.left + step * i + step / 2;
  const y = (v: number) => margin.top + plotH - (v / max) * plotH;
  const barW = Math.min(36, step * 0.46);

  return (
    <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`}>
      {[0, .25, .5, .75, 1].map((t) => {
        const yy = margin.top + plotH * t;
        const val = Math.round(max * (1 - t));
        return <g key={t}><line x1={margin.left} y1={yy} x2={width - margin.right} y2={yy} stroke={LIGHT} /><text x={8} y={yy + 4} fontSize="11" fill="#64748b">{val}</text></g>;
      })}
      {typeof average === 'number' && <><line x1={margin.left} x2={width - margin.right} y1={y(average)} y2={y(average)} stroke={GOLD} strokeDasharray="6 6" strokeWidth="2"/><text x={width - margin.right - 10} y={y(average) - 7} textAnchor="end" fontSize="12" fill={GOLD} fontWeight="800">Média Geral: {average} dias</text></>}
      {safeValues.map((v, i) => {
        const barH = Math.max(0, plotH - (y(v) - margin.top));
        const label = safeLabels[i].includes(' ') ? safeLabels[i].split(' ') : [safeLabels[i]];
        return <g key={`${safeLabels[i]}-${i}`}><rect x={x(i) - barW / 2} y={y(v)} width={barW} height={barH} rx="5" fill={color} /><text x={x(i)} y={y(v) - 7} textAnchor="middle" fontSize="12" fontWeight="800" fill={NAVY}>{v.toLocaleString('pt-PT')}</text>{label.map((part, idx) => <text key={idx} x={x(i)} y={height - 22 + idx * 13} textAnchor="middle" fontSize="10.5" fill="#475569">{part}</text>)}</g>;
      })}
    </svg>
  );
}

export function GroupedBarChart({ labels = [], a = [], b = [], aLabel = 'Entradas', bLabel = 'Saídas' }: { labels: string[]; a: number[]; b: number[]; aLabel?: string; bLabel?: string }) {
  const safeLabels = Array.isArray(labels) && labels.length ? labels : ['Sem dados'];
  const safeA = safeLabels.map((_, i) => Number(a[i] ?? 0));
  const safeB = safeLabels.map((_, i) => Number(b[i] ?? 0));
  const width = 660, height = 255;
  const margin = { top: 25, right: 18, bottom: 42, left: 48 };
  const plotW = width - margin.left - margin.right, plotH = height - margin.top - margin.bottom;
  const max = niceMax(Math.max(...safeA, ...safeB) + 120);
  const groupW = plotW / safeLabels.length;
  const y = (v: number) => margin.top + plotH - (v / max) * plotH;
  return <>
    <div className="chart-legend" style={{ marginBottom: 4 }}><span className="legend-item"><span className="legend-line" style={{ background: NAVY }} />{aLabel}</span><span className="legend-item"><span className="legend-line" style={{ background: RED }} />{bLabel}</span></div>
    <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`}>
      {[0, .25, .5, .75, 1].map((t) => <g key={t}><line x1={margin.left} y1={margin.top + plotH * t} x2={width - margin.right} y2={margin.top + plotH * t} stroke={LIGHT}/><text x="8" y={margin.top + plotH * t + 4} fontSize="11" fill="#64748b">{Math.round(max * (1 - t)).toLocaleString('pt-PT')}</text></g>)}
      {safeLabels.map((label, i) => {
        const cx = margin.left + groupW * i + groupW / 2;
        const bw = Math.min(30, groupW * .26);
        const av = safeA[i];
        const bv = safeB[i];
        return <g key={`${label}-${i}`}>
          <rect x={cx - bw - 3} y={y(av)} width={bw} height={Math.max(0, plotH - (y(av) - margin.top))} rx="4" fill={NAVY}/>
          <rect x={cx + 3} y={y(bv)} width={bw} height={Math.max(0, plotH - (y(bv) - margin.top))} rx="4" fill={RED}/>
          <text x={cx - bw/2 - 3} y={y(av) - 6} textAnchor="middle" fontSize="11" fontWeight="800" fill={NAVY}>{av.toLocaleString('pt-PT')}</text>
          <text x={cx + bw/2 + 3} y={y(bv) - 6} textAnchor="middle" fontSize="11" fontWeight="800" fill={RED}>{bv.toLocaleString('pt-PT')}</text>
          <text x={cx} y={height - 14} textAnchor="middle" fontSize="12" fill="#475569">{label}</text>
        </g>;
      })}
    </svg>
  </>;
}

export function HorizontalBarChart({ labels = [], values = [], suffix = '', maxValue }: { labels: string[]; values: number[]; suffix?: string; maxValue?: number }) {
  const safeLabels = Array.isArray(labels) && labels.length ? labels : ['Sem dados'];
  const safeValues = safeLabels.map((_, i) => Number(values[i] ?? 0));
  const max = Math.max(maxValue ?? 0, ...safeValues, 1);
  return (
    <div className="hbar-chart">
      {safeLabels.map((label, i) => (
        <div key={`${label}-${i}`} className="hbar-row">
          <span className="hbar-label" title={label}>{label}</span>
          <span className="hbar-track"><span style={{ width: `${Math.min((safeValues[i] / max) * 100, 100)}%`, background: NAVY }} /></span>
          <strong className="hbar-value">{safeValues[i].toLocaleString('pt-PT')}{suffix}</strong>
        </div>
      ))}
    </div>
  );
}

export function DonutChart({ center, items = [] }: { center: string; items?: Array<{ label: string; value: number; color: string; detail?: string }> }) {
  const safeItems = items.length ? items : [{ label: 'Sem dados', value: 1, color: '#e2e8f0', detail: '(0)' }];
  const total = safeItems.reduce((sum, x) => sum + x.value, 0);
  let acc = 0;
  const r = 78;
  const c = 100;
  const circumference = 2 * Math.PI * r;
  const [primary, secondary = 'Total'] = center.split('\n');
  const primaryFont = primary.length > 8 ? 18 : primary.length > 4 ? 22 : 26;

  return (
    <div className="donut-chart">
      <svg viewBox="0 0 200 200" className="donut-svg" role="img" aria-label={center.replace('\n', ' ')}>
        <circle cx={c} cy={c} r={r} fill="none" stroke="#eef2f7" strokeWidth="32" />
        {safeItems.map((item) => {
          const frac = item.value / total;
          const dash = frac * circumference;
          const offset = circumference * (1 - acc);
          acc += frac;
          return <circle key={item.label} cx={c} cy={c} r={r} fill="none" stroke={item.color} strokeWidth="32" strokeDasharray={`${dash} ${circumference - dash}`} strokeDashoffset={offset} transform={`rotate(-90 ${c} ${c})`} strokeLinecap="butt" />;
        })}
        <circle cx={c} cy={c} r="54" fill="white" />
        <text x="100" y="94" textAnchor="middle" fontSize={primaryFont} fontWeight="900" fill={NAVY}>{primary}</text>
        <text x="100" y="116" textAnchor="middle" fontSize="11" fontWeight="750" fill="#64748b">{secondary}</text>
      </svg>
      <div className="donut-legend">
        {safeItems.map((item) => (
          <div key={item.label} className="donut-legend-row">
            <span className="legend-dot" style={{ background: item.color }} />
            <span className="donut-label" title={item.label}>{item.label}</span>
            <strong>{item.value.toLocaleString('pt-PT')}{item.detail ? ` ${item.detail}` : ''}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LineAreaChart({ labels = [], values = [] }: { labels?: string[]; values?: number[] }) {
  const safeLabels = Array.isArray(labels) && labels.length ? labels : ['Sem dados'];
  const safeValues = Array.isArray(values) && values.length ? values : [0];
  const width = 720, height = 255;
  const margin = { top: 22, right: 22, bottom: 40, left: 42 };
  const plotW = width - margin.left - margin.right, plotH = height - margin.top - margin.bottom;
  const max = niceMax(Math.max(...safeValues) + 6);
  const min = Math.min(...safeValues) - 4;
  const range = max - min || 1;
  const x = (i: number) => safeLabels.length === 1 ? margin.left + plotW / 2 : margin.left + (plotW / (safeLabels.length - 1)) * i;
  const y = (v: number) => margin.top + plotH - ((v - min) / range) * plotH;
  const points = safeValues.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const area = `${margin.left},${margin.top + plotH} ${points} ${width - margin.right},${margin.top + plotH}`;
  return <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`}>
    {[0,.25,.5,.75,1].map(t => <line key={t} x1={margin.left} x2={width-margin.right} y1={margin.top+plotH*t} y2={margin.top+plotH*t} stroke={LIGHT}/>) }
    <polygon points={area} fill="rgba(11,54,125,.10)" />
    <polyline points={points} fill="none" stroke={NAVY} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    {safeValues.map((v,i) => <g key={i}><circle cx={x(i)} cy={y(v)} r="4.5" fill={NAVY} stroke="white" strokeWidth="2"/><text x={x(i)} y={y(v)-10} textAnchor="middle" fontSize="11" fontWeight="800" fill={NAVY}>{v}</text><text x={x(i)} y={height-12} textAnchor="middle" fontSize="11" fill="#64748b">{safeLabels[i]}</text></g>)}
  </svg>;
}

export function StackedBarChart({ labels = [], series = [] }: { labels?: string[]; series?: Array<{ name: string; values: number[]; color: string }> }) {
  const safeLabels = Array.isArray(labels) && labels.length ? labels : ['Sem dados'];
  const safeSeries = series.length ? series : [{ name: 'Sem dados', values: [0], color: '#e2e8f0' }];
  const width = 630, height = 255;
  const margin = { top: 24, right: 18, bottom: 42, left: 42 };
  const totals = safeLabels.map((_, i) => safeSeries.reduce((sum, s) => sum + (s.values[i] ?? 0), 0));
  const max = niceMax(Math.max(...totals) + 2);
  const plotW = width - margin.left - margin.right, plotH = height - margin.top - margin.bottom;
  const x = (i: number) => margin.left + (plotW / safeLabels.length) * i + plotW / safeLabels.length / 2;
  const y = (v: number) => margin.top + plotH - (v / max) * plotH;
  const bw = Math.min(34, plotW / safeLabels.length * .42);
  return <>
    <div className="chart-legend" style={{ marginBottom: 8 }}>{safeSeries.map(s => <span className="legend-item" key={s.name}><span className="legend-dot" style={{ background: s.color }} />{s.name}</span>)}</div>
    <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`}>
      {[0,.25,.5,.75,1].map(t => <g key={t}><line x1={margin.left} x2={width-margin.right} y1={margin.top+plotH*t} y2={margin.top+plotH*t} stroke={LIGHT}/><text x="8" y={margin.top+plotH*t+4} fontSize="11" fill="#64748b">{Math.round(max*(1-t))}</text></g>)}
      {safeLabels.map((label, i) => {
        let cumulative = 0;
        return <g key={label}>
          {safeSeries.map(s => {
            const current = s.values[i] ?? 0;
            const h = (current / max) * plotH;
            const rectY = y(cumulative + current);
            cumulative += current;
            return <rect key={s.name} x={x(i)-bw/2} y={rectY} width={bw} height={h} fill={s.color} rx="2"/>;
          })}
          <text x={x(i)} y={y(totals[i])-7} textAnchor="middle" fontSize="12" fontWeight="800" fill={NAVY}>{totals[i]}</text>
          <text x={x(i)} y={height-13} textAnchor="middle" fontSize="11" fill="#475569">{label}</text>
        </g>;
      })}
    </svg>
  </>;
}

export function StatusList({ items }: { items: Array<{ name: string; value: number; percent: string; color: string }> }) {
  return <div className="status-list">{items.map(item => <div className="status-row" key={item.name}><span className="status-name"><span className="status-dot" style={{ background: item.color }} />{item.name}</span><strong>{item.value}</strong><span className="progress"><span style={{ width: item.percent, background: item.color }} /></span><span>{item.percent}</span></div>)}</div>;
}

export function Gauge({ value, label }: { value: number; label: string }) {
  const angle = -90 + (value / 90) * 180;
  return <div style={{ display: 'grid', placeItems: 'center', gap: 4 }}>
    <svg viewBox="0 0 220 140" style={{ width: '100%', maxWidth: 230 }}>
      <path d="M30 110a80 80 0 0 1 160 0" fill="none" stroke="#e2e8f0" strokeWidth="24" strokeLinecap="round" />
      <path d="M30 110a80 80 0 0 1 37-67" fill="none" stroke={RED} strokeWidth="24" strokeLinecap="round" />
      <path d="M67 43a80 80 0 0 1 72-8" fill="none" stroke={GOLD} strokeWidth="24" strokeLinecap="round" />
      <path d="M139 35a80 80 0 0 1 51 75" fill="none" stroke={GREEN} strokeWidth="24" strokeLinecap="round" />
      <line x1="110" y1="110" x2="110" y2="42" stroke={NAVY} strokeWidth="4" strokeLinecap="round" transform={`rotate(${angle} 110 110)`}/>
      <circle cx="110" cy="110" r="7" fill={NAVY}/>
      <text x="110" y="132" textAnchor="middle" fontSize="13" fill="#64748b">0 · 45 · 90</text>
    </svg>
    <strong style={{ fontSize: 34, color: NAVY, letterSpacing: '-.05em' }}>{value}</strong>
    <span style={{ color: '#64748b', fontWeight: 800 }}>{label}</span>
    <div style={{ padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: 14, color: GREEN, fontWeight: 850, background: '#f8fafc' }}>Meta definida: ≥ 45 dias<br/>Acima da meta</div>
  </div>;
}
