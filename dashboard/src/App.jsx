
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Bots from './pages/Bots';
import ConfiguracionBot from './pages/ConfigBot';

export default function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-slate-50">
        <Routes>
          <Route path="/" element={<Bots />} />
          <Route path="/configuracion/:id" element={<ConfiguracionBot />} />
        </Routes>
      </div>
    </div>
  );
}

