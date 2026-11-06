import type { CSSProperties } from 'react';

type BrandLogoVariant = 'red' | 'white';
type BrandLogoLayout = 'horizontal' | 'stacked' | 'wide';

const logoMap: Record<BrandLogoVariant, Record<BrandLogoLayout, string>> = {
  red: {
    horizontal: '/logos/anpg-logo-horizontal.png',
    stacked: '/logos/anpg-logo-stacked.png',
    wide: '/logos/anpg-logo-horizontal.png'
  },
  white: {
    horizontal: '/logos/anpg-logo-horizontal-white.png',
    stacked: '/logos/anpg-logo-stacked-white.png',
    wide: '/logos/anpg-logo-wide-white.png'
  }
};

export function BrandLogo({
  variant = 'red',
  layout = 'horizontal',
  className = '',
  style,
  alt = 'ANPG — Agência Nacional de Petróleo, Gás e Biocombustíveis'
}: {
  variant?: BrandLogoVariant;
  layout?: BrandLogoLayout;
  className?: string;
  style?: CSSProperties;
  alt?: string;
}) {
  return (
    <img
      src={logoMap[variant][layout]}
      alt={alt}
      className={`brand-logo brand-logo-${variant} brand-logo-${layout} ${className}`.trim()}
      style={style}
    />
  );
}
