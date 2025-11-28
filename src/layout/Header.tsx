import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-600 via-red-500 to-green-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-white hover:text-yellow-200 transition-colors"
          >
            <Home className="w-5 h-5" />
          </Link>
          <div className="flex-1"></div>
          <div className="w-7"></div>
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

