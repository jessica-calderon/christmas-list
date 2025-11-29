import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './layout/Header';
import Home from './pages/Home';
import PersonPage from './pages/PersonPage';
import Toast from './components/Toast';

function AppContent() {
  const location = useLocation();
  const [toast, setToast] = useState<{ message: string; type?: 'error' | 'success' | 'info' } | null>(null);

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    // Check if Firebase is properly configured
    const checkFirebase = () => {
      const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
      if (!apiKey) {
        setToast({
          message: 'Firebase configuration missing. Some features may not work.',
          type: 'error',
        });
      }
    };

    checkFirebase();
  }, []);

  return (
    <div className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white min-h-screen transition-colors">
      <Header />
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/person/:id" element={<PersonPage />} />
      </Routes>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

function App() {
  const basename = import.meta.env.PROD ? '/christmas-list' : '/';
  
  return (
    <BrowserRouter basename={basename}>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
