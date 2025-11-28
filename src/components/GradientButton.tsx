import type { ReactNode } from 'react';

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function GradientButton({
  children,
  onClick,
  type = 'button',
  className = '',
  size = 'md',
}: GradientButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        bg-gradient-to-r from-red-500 to-green-500
        hover:from-red-600 hover:to-green-600
        text-white font-semibold
        rounded-xl
        shadow-md
        hover:shadow-lg
        hover:shadow-green-500/25
        transition-all duration-300 ease-out
        transform hover:scale-[1.02]
        ${className}
      `}
    >
      {children}
    </button>
  );
}

