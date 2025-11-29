import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  // Initialize state from DOM (which was set in main.tsx)
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true; // default to dark
  });

  // Sync with localStorage on mount
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    const htmlElement = document.documentElement;
    
    if (theme === 'light') {
      htmlElement.classList.remove('dark');
      setIsDark(false);
    } else {
      htmlElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const handleToggle = () => {
    const htmlElement = document.documentElement;
    htmlElement.classList.toggle('dark');
    const newIsDark = htmlElement.classList.contains('dark');
    
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    setIsDark(newIsDark);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="relative z-50 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 active:scale-95 cursor-pointer font-medium text-sm"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{ pointerEvents: 'auto' }}
    >
      {isDark ? (
        <>
          <Sun className="w-5 h-5" />
          <span className="hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-5 h-5" />
          <span className="hidden sm:inline">Dark</span>
        </>
      )}
    </button>
  );
}

