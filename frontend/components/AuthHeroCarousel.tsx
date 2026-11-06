'use client';

import { useEffect, useState } from 'react';
import { BrandLogo } from '@/components/BrandLogo';

const slides = [
  {
    image: '/images/fpso-hero-1.png',
    title: 'Inteligência operacional offshore',
    description: 'Monitorização integrada de operações, custos, prazos, poços, sondas e desempenho dos operadores.'
  },
  {
    image: '/images/fpso-hero-2.png',
    title: 'Dados centralizados e rastreáveis',
    description: 'Submissão estruturada, validação, aprovação ANPG e histórico auditável de cada actualização.'
  },
  {
    image: '/images/fpso-hero-3.png',
    title: 'Dashboards executivos em tempo útil',
    description: 'Visão consolidada para mercado, contratos, stock OCTG, relatórios e decisões estratégicas.'
  }
];

export function AuthHeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="auth-hero-carousel" aria-label="Imagens institucionais ANPG">
      {slides.map((slide, index) => (
        <div
          key={slide.image}
          className={`auth-hero-slide ${index === activeIndex ? 'active' : ''}`}
          style={{ backgroundImage: `linear-gradient(120deg, rgba(31, 35, 40, 0.92), rgba(76, 105, 113, 0.74), rgba(237, 31, 65, 0.35)), url(${slide.image})` }}
          aria-hidden={index !== activeIndex}
        />
      ))}

      <div className="auth-hero-content">
        <BrandLogo variant="white" layout="wide" className="auth-hero-logo" />
        <div className="auth-hero-copy">
          <span className="hero-kicker">ANPG Operations Intelligence Platform</span>
          <h1>{slides[activeIndex].title}</h1>
          <p>{slides[activeIndex].description}</p>
        </div>
        <div className="auth-hero-dots" role="tablist" aria-label="Seleccionar imagem de destaque">
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              className={index === activeIndex ? 'active' : ''}
              aria-label={`Mostrar slide ${index + 1}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
