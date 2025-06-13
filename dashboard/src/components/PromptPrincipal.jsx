import { useState } from "react";

export default function PromptPrincipal({ promptInicial = "" }) {
  const [prompt, setPrompt] = useState(promptInicial);

  function handleGuardar(e) {
    e.preventDefault();
    // Aquí lógica para guardar el prompt
    alert("Prompt guardado:\n\n" + prompt);
  }

  function handleCancelar() {
    // Puedes limpiar el campo o regresar a otra vista
    window.history.back();
  }

  return (
    <form className="space-y-8" onSubmit={handleGuardar}>
      <section className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-md font-semibold text-gray-800 mb-2">Prompt principal</h3>
        <p className="text-xs text-gray-500 mb-4">
          Define el prompt base que guiará el comportamiento del bot. Aquí puedes establecer el tono, instrucciones y restricciones que tendrá el asistente al iniciar una conversación.
        </p>
        <textarea
          className="w-full min-h-[340px] max-h-[1000px] px-3 py-2 rounded-md text-sm bg-gray-50 focus:outline-none border border-gray-200 resize-vertical"
          placeholder="Escribe aquí el prompt principal del bot..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
      </section>
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
