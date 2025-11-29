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
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        w-full rounded-xl
        py-3 sm:py-4
        text-base sm:text-lg
        font-semibold
        bg-gradient-to-r from-red-500 to-green-500
        hover:from-red-600 hover:to-green-600
        text-white
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


