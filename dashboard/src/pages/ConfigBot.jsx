import { useParams } from 'react-router-dom';
import { useState } from 'react';
import AjustesGenerales from '../components/AjustesGenerales';
import PromptPrincipal from '../components/PromptPrincipal';
import Funcionalidades from '../components/Funcionalidades';
const botsMock = {
  '1': 'Jane Cooper',
  '2': 'Floyd Miles',
  '3': 'Ronald Richards',
};

const secciones = [
  'Ajustes generales',
  'Prompt principal',
  'Funcionalidades',
];

export default function ConfigBot() {
  const { id } = useParams();
  const [seccionActiva, setSeccionActiva] = useState(secciones[0]);
  const nombreBot = botsMock[id] || 'Bot desconocido';

  const renderContenido = () => {
    switch (seccionActiva) {
      case 'Ajustes generales':
        return <AjustesGenerales botId={id} />;
      case 'Prompt principal':
        return <PromptPrincipal botId={id} />;
      case 'Funcionalidades':
        return <Funcionalidades />;
      default:
        return (
          <p className="text-sm text-gray-600">
            Aquí puedes configurar todo lo relacionado con <strong>{seccionActiva.toLowerCase()}</strong> del bot <strong>{nombreBot}</strong>.
          </p>
        );
    }

  };

  return (
    <div className=" min-h-screen p-4 sm:p-6 font-sans">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold text-gray-700">Configuración del Bot</h1>
        <p className="text-base text-gray-400 mt-1">{nombreBot}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 border-b border-gray-200 mb-8">
        {secciones.map((nombre) => (
          <button
            key={nombre}
            onClick={() => setSeccionActiva(nombre)}
            className={`pb-3 text-sm font-medium transition-all ${
              seccionActiva === nombre
                ? 'text-indigo-700 border-b-2 border-indigo-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {nombre}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto">
        {renderContenido()}
      </div>
    </div>
  );
}