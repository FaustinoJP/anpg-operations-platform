'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BrandLogo } from '@/components/BrandLogo';

const heroSlides = [
  '/images/fpso-hero-1.png',
  '/images/fpso-hero-2.png',
  '/images/fpso-hero-3.png'
];

export function DashboardHero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="dashboard-hero-carousel">
      {heroSlides.map((image, index) => (
        <div
          key={image}
          className={`dashboard-hero-slide ${index === activeIndex ? 'active' : ''}`}
          style={{ backgroundImage: `linear-gradient(120deg, rgba(25, 27, 31, 0.88), rgba(76, 105, 113, 0.72), rgba(237, 31, 65, 0.32)), url(${image})` }}
          aria-hidden={index !== activeIndex}
        />
      ))}

      <div className="dashboard-hero-content">
        <div className="dashboard-hero-main">
          <BrandLogo variant="white" layout="wide" className="dashboard-hero-logo" />
          <span className="eyebrow light">Centro executivo de inteligência operacional</span>
          <h1>Operations Intelligence Platform</h1>
          <p>
            Visão única para operações de sondagem, intervenção, abandono de poços, mercado,
            contratos, stock OCTG, submissões dos operadores, relatórios e auditoria institucional.
          </p>
          <div className="hero-actions">
            <Link className="btn primary" href="/operacional">Abrir Operacional</Link>
            <Link className="btn secondary" href="/submissoes">Validar Submissões</Link>
            <Link className="btn secondary" href="/auditoria">Ver Auditoria</Link>
          </div>
        </div>

        <div className="dashboard-hero-score">
          <strong>Índice de prontidão</strong>
          <b>87%</b>
          <span>Base demonstrável preparada para integração real com operadores, SAP, WellView e Power BI.</span>
          <div className="score-bars">
            <i style={{ width: '92%' }} />
            <i style={{ width: '84%' }} />
            <i style={{ width: '76%' }} />
          </div>
        </div>
      </div>

      <div className="dashboard-hero-dots" aria-hidden="true">
        {heroSlides.map((image, index) => <i key={image} className={index === activeIndex ? 'active' : ''} />)}
      </div>
    </div>
  );
}
