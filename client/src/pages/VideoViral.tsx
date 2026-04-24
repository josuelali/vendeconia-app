import { useState } from "react";

export default function VideoViral() {
  const [tema, setTema] = useState("");
  const [guion, setGuion] = useState("");

  const generarGuion = () => {
    const resultado = `
HOOK:
¿Sabías que puedes ganar dinero con IA sin experiencia?

CUERPO:
Hoy te enseño cómo usar herramientas gratis para crear ingresos automáticos desde casa.

CIERRE:
Sígueme para más ideas y empieza hoy mismo.
    `;
    setGuion(resultado);
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl mb-4">Crear vídeo viral</h1>

      <input
        value={tema}
        onChange={(e) => setTema(e.target.value)}
        placeholder="Tema del vídeo..."
        className="w-full p-3 rounded bg-[#0B0F1A] border border-gray-700 mb-4"
      />

      <button
        onClick={generarGuion}
        className="bg-purple-600 px-4 py-2 rounded"
      >
        Generar guion
      </button>

      {guion && (
        <pre className="mt-6 bg-black p-4 rounded">
          {guion}
        </pre>
      )}
    </div>
  );
}