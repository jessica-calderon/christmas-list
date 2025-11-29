import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: (e?: React.MouseEvent) => void;
  hover?: boolean;
}

export default function Card({ children, className = '', onClick, hover = false }: CardProps) {
  const baseClasses = 'rounded-2xl bg-gray-900/60 backdrop-blur shadow-md transition-all duration-300 ease-out';

  const hoverClasses = hover
    ? 'hover:scale-[1.02] hover:shadow-xl hover:ring-2 hover:ring-green-400/30 dark:hover:ring-green-400/40 cursor-pointer active:scale-[0.98]'
    : '';

  const clickableClasses = onClick ? 'cursor-pointer active:scale-[0.98]' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={(e) => onClick?.(e)}
    >
      {children}
    </div>
  );
}


