import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({ children, className = '', onClick, hover = false }: CardProps) {
  const baseClasses = `
    backdrop-blur-xl
    bg-white/70 dark:bg-slate-800/40
    ring-1 ring-white/20 dark:ring-white/10
    rounded-2xl
    shadow-[0_0_25px_rgba(0,0,0,0.15)] dark:shadow-[0_0_25px_rgba(0,0,0,0.4)]
    transition-all duration-300 ease-out
  `;

  const hoverClasses = hover
    ? 'hover:scale-[1.01] hover:shadow-lg hover:ring-green-400/20 dark:hover:ring-green-400/30 cursor-pointer'
    : '';

  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

