import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './layout/Header';
import Home from './pages/Home';
import PersonPage from './pages/PersonPage';

function App() {
  const basename = import.meta.env.PROD ? '/christmas-list' : '/';
  
  return (
    <BrowserRouter basename={basename}>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/person/:id" element={<PersonPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
