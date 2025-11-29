import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
// import ThemeToggle from '../components/ThemeToggle';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-50
        bg-gradient-to-r from-red-500/90 via-red-400/85 to-green-500/90
        dark:from-red-600/90 dark:via-red-500/85 dark:to-green-600/90
        backdrop-blur-md
        shadow-lg
        transition-all duration-300 ease-out
        ${isScrolled ? 'py-2' : 'py-3'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-white hover:text-yellow-200 dark:hover:text-yellow-300 transition-colors relative z-10"
          >
            <Home className={`${isScrolled ? 'w-4 h-4' : 'w-5 h-5'} transition-all duration-300`} />
          </Link>
          <div className="flex-1"></div>
          {/* <div className="relative z-10">
            <ThemeToggle />
          </div> */}
        </div>
      </div>
      <div className="snowflakes">
        <div className="snowflake">❄</div>
        <div className="snowflake">❄</div>
        <div className="snowflake">❄</div>
        <div className="snowflake">❄</div>
        <div className="snowflake">❄</div>
        <div className="snowflake">❄</div>
      </div>
    </header>
  );
}

