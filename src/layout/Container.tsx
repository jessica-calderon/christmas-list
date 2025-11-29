import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return (
    <div className="relative px-4 sm:px-6 max-w-xl mx-auto space-y-4 sm:space-y-6">
      {children}
    </div>
  );
}

