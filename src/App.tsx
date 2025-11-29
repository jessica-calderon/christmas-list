import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './layout/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import PersonPage from './pages/PersonPage';
import SnowOverlay from './components/SnowOverlay';

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white min-h-screen transition-colors flex flex-col">
      <Header />
      <div className="flex-1">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/person/:id" element={<PersonPage />} />
        </Routes>
      </div>
      <Footer />
      <SnowOverlay />
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
