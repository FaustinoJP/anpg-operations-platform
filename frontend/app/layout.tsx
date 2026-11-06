import type React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ANPG Operations Intelligence',
  description: 'Plataforma integrada de dashboards ANPG para operações, mercado, stock OCTG e submissões.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
