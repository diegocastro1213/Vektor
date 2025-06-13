import { useState } from "react";

const tonalidades = [
  "Breve y al grano",
  "Amable y amigable",
  "Formal empresarial",
  "Didáctico y explicativo"
];

export default function Funcionalidades() {
  const [tono, setTono] = useState(tonalidades[0]);
  const [imgActivo, setImgActivo] = useState(false);
  const [docActivo, setDocActivo] = useState(false);
  const [dbActivo, setDbActivo] = useState(false);
  const [promptImagen, setPromptImagen] = useState("");
  const [sqlConfig, setSqlConfig] = useState({
    user: "",
    password: "",
    server: "",
    port: "",
    database: "",
  });

  function handleSQLChange(e) {
    setSqlConfig({ ...sqlConfig, [e.target.name]: e.target.value });
  }

  function handleGuardar(e) {
    e.preventDefault();
    alert("Configuraciones guardadas!");
  }

  function handleCancelar() {
    window.history.back();
  }

 function Toggle({ value, setValue }) {
  return (
    <button
      type="button"
      onClick={() => setValue(v => !v)}
      className={`relative w-8 h-4 rounded-full transition-colors duration-200 outline-none 
        ${value ? "bg-indigo-400" : "bg-gray-300"}`}
      tabIndex={0}
    >
      <span
        className={`absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow transform transition-transform duration-200 
          ${value ? "translate-x-4" : ""}`}
      />
    </button>
  );
}


  // Clase base para fila: label a la izquierda, control a la derecha
  const filaClass = "flex items-center justify-between gap-4 mb-2";

  return (
    <form className="space-y-8" onSubmit={handleGuardar}>
      <section className="bg-white p-6 rounded-xl shadow-sm space-y-6">
        <h3 className="text-md font-semibold text-gray-800 mb-4">Funcionalidades</h3>

        {/* TEXTO - Label izquierda, dropdown derecha */}
        <div className={filaClass}>
          <label className="text-xs text-gray-600 font-medium">Tonalidad de conversación</label>
          <select
            className="input-base max-w-xs"
            value={tono}
            onChange={e => setTono(e.target.value)}
          >
            {tonalidades.map((op, i) => (
              <option key={i} value={op}>{op}</option>
            ))}
          </select>
        </div>
          {/* Divider */}
         <hr className="border-t border-gray-200 my-3" />

        {/* IMÁGENES */}
        <div>
          <div className={filaClass}>
            <label className="text-xs text-gray-600 font-medium">Análisis de imágenes</label>
            <Toggle value={imgActivo} setValue={setImgActivo} />
          </div>
          {imgActivo && (
            <div className="pl-2 mt-2">
              <div className={filaClass}>
                <label className="text-xs text-gray-600">Prompt base</label>
                <textarea
                  className="input-base flex-1 min-h-[56px] text-xs resize-vertical"
                  placeholder="Ejemplo: Analiza esta imagen y responde en lenguaje simple para un usuario no técnico..."
                  value={promptImagen}
                  onChange={e => setPromptImagen(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
        {/* Divider */}
         <hr className="border-t border-gray-200 my-3" />

        {/* DOCUMENTOS */}
        <div>
          <div className={filaClass}>
            <label className="text-xs text-gray-600 font-medium">Recepción de documentos</label>
            <Toggle value={docActivo} setValue={setDocActivo} />
          </div>
          {docActivo && (
            <div className="pl-2 mt-2">
              <p className="text-xs text-gray-500">Esta funcionalidad permitirá recibir documentos adjuntos de los usuarios.</p>
            </div>
          )}
        </div>
        {/* Divider */}
         <hr className="border-t border-gray-200 my-3" />

       {/* BASE DE DATOS */}
        <div>
        <div className="flex items-center justify-between gap-4 mb-2">
            {/* Usamos w-44 para todos los labels, incluso la cabecera para alineación */}
            <label className="w-44 text-xs text-gray-600 font-medium">
            Conexión a base de datos
            </label>
            <Toggle value={dbActivo} setValue={setDbActivo} />
        </div>
        {dbActivo && (
            <div className="mt-2 space-y-2">
            <div className="flex items-center gap-4">
                <label className="w-44 text-xs text-gray-600">Usuario</label>
                <input
                name="user"
                className="input-base flex-1"
                placeholder="Usuario"
                value={sqlConfig.user}
                onChange={handleSQLChange}
                />
            </div>
            <div className="flex items-center gap-4">
                <label className="w-44 text-xs text-gray-600">Contraseña</label>
                <input
                name="password"
                type="password"
                className="input-base flex-1"
                placeholder="Contraseña"
                value={sqlConfig.password}
                onChange={handleSQLChange}
                />
            </div>
            <div className="flex items-center gap-4">
                <label className="w-44 text-xs text-gray-600">Servidor</label>
                <input
                name="server"
                className="input-base flex-1"
                placeholder="Servidor"
                value={sqlConfig.server}
                onChange={handleSQLChange}
                />
            </div>
            <div className="flex items-center gap-4">
                <label className="w-44 text-xs text-gray-600">Puerto</label>
                <input
                name="port"
                className="input-base flex-1"
                placeholder="Puerto"
                value={sqlConfig.port}
                onChange={handleSQLChange}
                />
            </div>
            <div className="flex items-center gap-4">
                <label className="w-44 text-xs text-gray-600">Base de datos</label>
                <input
                name="database"
                className="input-base flex-1"
                placeholder="Base de datos"
                value={sqlConfig.database}
                onChange={handleSQLChange}
                />
            </div>
            </div>
        )}
        </div>

      </section>

      {/* Botones Guardar / Cancelar */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="mt-4 px-3 py-1.5 text-xs bg-gray-200 text-gray-700 rounded-md shadow hover:bg-gray-300 font-semibold transition"
          onClick={handleCancelar}
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
