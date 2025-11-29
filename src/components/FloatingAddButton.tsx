import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

interface FloatingAddButtonProps {
  onClick: () => void;
}

export default function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when scrolled down more than 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 md:hidden animate-fade-in">
      <button
        onClick={onClick}
        className="
          w-14 h-14
          bg-gradient-to-r from-red-500 to-green-500
          hover:from-red-600 hover:to-green-600
          text-white
          rounded-full
          shadow-lg
          hover:shadow-xl
          hover:shadow-green-500/30
          transition-all duration-300 ease-out
          transform hover:scale-110
          flex items-center justify-center
        "
        aria-label="Add wish item"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}


