import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({ children, className = '', onClick, hover = false }: CardProps) {
  const baseClasses = 'rounded-2xl bg-gray-900/60 backdrop-blur shadow-md transition-all duration-300 ease-out';

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


