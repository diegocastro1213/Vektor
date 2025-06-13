import { useState } from "react";

export default function AjustesGenerales({ botId }) {
  const [activo, setActivo] = useState(true);
  const [telefono, setTelefono] = useState("");
  const [codigo, setCodigo] = useState("+503");

  function handleTelefonoChange(e) {
    const val = e.target.value.replace(/[^0-9 ]/g, "");
    setTelefono(val);
  }

  function handleGuardar(e) {
    e.preventDefault();
    alert("¡Configuración guardada!");
  }

  return (
    <form className="space-y-8" onSubmit={handleGuardar}>
      <section className="bg-white p-6 rounded-xl">
        <h3 className="text-md font-semibold text-gray-800 mb-6">Información General</h3>
        <div className="space-y-4">
          {/* Teléfono y Estado */}
          <div className="flex items-center gap-4">
            <label className="w-32 text-sm text-gray-600">Teléfono</label>
            <div className="flex flex-1 gap-2">
              <select
                className="input-base px-2 py-2 text-gray-500"
                value={codigo}
                onChange={e => setCodigo(e.target.value)}
                style={{ minWidth: 95 }}
              >
                <option value="+503">+503 (SV)</option>
                <option value="+1">+1 (US)</option>
              </select>
              <input
                type="tel"
                className="input-base flex-1"
                placeholder="Número"
                value={telefono}
                onChange={handleTelefonoChange}
                maxLength={12}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Estado</label>
              <button
                type="button"
                onClick={() => setActivo(a => !a)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 outline-none
                  ${activo ? "bg-indigo-400" : "bg-gray-300"}`}
              >
                <span
                  className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200
                    ${activo ? "translate-x-5" : ""}`}
                />
              </button>
              <span className={`ml-2 text-xs font-semibold ${activo ? "text-indigo-400" : "text-gray-400"}`}>
                {activo ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>
          {/* Rol */}
          <div className="flex items-center gap-4">
            <label className="w-32 text-sm text-gray-600">Rol</label>
            <select className="input-base flex-1">
              <option>Agente de ventas</option>
              <option>Gestor de cobranzas</option>
              <option>Soporte y atención al cliente</option>
            </select>
          </div>
          {/* Nombre del bot */}
          <div className="flex items-center gap-4">
            <label className="w-32 text-sm text-gray-600">Nombre del bot</label>
            <input type="text" className="input-base flex-1" />
          </div>
          {/* Área */}
          <div className="flex items-center gap-4">
            <label className="w-32 text-sm text-gray-600">Área</label>
            <input type="text" className="input-base flex-1" />
          </div>
        </div>
      </section>

      {/* OpenAI */}
      <section className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-md font-semibold text-gray-800 mb-6">OpenAI</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="w-48 text-sm text-gray-600">Modelo</label>
            <select className="input-base flex-1">
              <option>gpt-4o</option>
              <option>gpt-4</option>
              <option>gpt-3.5</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-48 text-sm text-gray-600">API Token</label>
            <input type="text" className="input-base flex-1" />
          </div>
        </div>
      </section>

      {/* Meta Business */}
      <section className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-md font-semibold text-gray-800 mb-6">Meta Business</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="w-48 text-sm text-gray-600">WhatsApp Token</label>
            <input type="text" className="input-base flex-1" />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-48 text-sm text-gray-600">WhatsApp Token URL</label>
            <input type="text" className="input-base flex-1" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-gray-700">Webhook activo</span>
            <button type="button" className="text-xs text-indigo-600 hover:underline">Copiar URL</button>
          </div>
        </div>
      </section>

      {/* Ajustes de Conversación */}
      <section className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-md font-semibold text-gray-800 mb-6">Ajustes de Conversación</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="w-48 text-sm text-gray-600">MongoDB URI</label>
            <input type="text" className="input-base flex-1" />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-48 text-sm text-gray-600">Expiración sesión (min)</label>
            <input type="number" className="input-base flex-1" />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-48 text-sm text-gray-600">Mensajes en historial</label>
            <input type="number" className="input-base flex-1" />
          </div>
        </div>
      </section>

      {/* Botones Guardar y Cancelar */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          className="mt-4 px-3 py-1.5 text-xs bg-gray-200 text-gray-700 rounded-md shadow hover:bg-gray-300 font-semibold transition"
          onClick={() => window.history.back()}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="mt-4 px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 font-semibold transition"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
