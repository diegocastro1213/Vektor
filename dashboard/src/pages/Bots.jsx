import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';

const botsMock = [
  { id: '1', nombre: 'Jane Cooper', area: 'Microsoft', telefono: '(503) 555-0111', rol: 'Ventas 1', activo: true },
  { id: '2', nombre: 'Floyd Miles', area: 'Google', telefono: '(503) 555-0112', rol: 'Ventas 2', activo: false },
  { id: '3', nombre: 'Ronald Richards', area: 'Amazon', telefono: '(503) 555-0113', rol: 'Ventas 3', activo: true },
];

export default function Bots() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 font-sans  min-h-screen p-6">
      {/* Título centrado */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-700">Bot</h1>
        <p className="text-base text-gray-400 mt-1">Bot activo</p>
      </div>

      <div className="overflow-x-auto bg-white shadow-sm rounded-xl">
        <table className="min-w-full text-sm text-gray-800">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 tracking-wide">
              <th className="px-6 py-4 text-left font-normal">Nombre</th>
              <th className="px-6 py-4 text-left font-normal">Área</th>
              <th className="px-6 py-4 text-left font-normal">Teléfono</th>
              <th className="px-6 py-4 text-left font-normal">Rol</th>
              <th className="px-6 py-4 text-right font-normal pr-6">Estado y Config</th>
            </tr>
          </thead>
          <tbody>
            {botsMock.map((bot, i) => (
              <tr key={bot.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 font-medium">{bot.nombre}</td>
                <td className="px-6 py-4">{bot.area}</td>
                <td className="px-6 py-4">{bot.telefono}</td>
                <td className="px-6 py-4">{bot.rol}</td>
                <td className="px-6 py-4 text-right pr-6">
                  <div className="flex justify-end items-center gap-3">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        bot.activo
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {bot.activo ? 'Activo' : 'Inactivo'}
                    </span>
                    <button
                      onClick={() => navigate(`/configuracion/${bot.id}`)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
