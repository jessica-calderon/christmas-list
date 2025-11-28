import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {children}
    </div>
  );
}

