import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ExternalLink } from "lucide-react";

const PICTORY_AFFILIATE_URL = "https://pictory.ai?ref=joshue-cabello-rosa72";
const SISTEMA_MAESTRO_URL = "https://sistemamaestroia.com";

export default function VideoViral() {
  const [tema, setTema] = useState("");
  const [producto, setProducto] = useState("");
  const [publico, setPublico] = useState("");
  const [guion, setGuion] = useState("");

  const generarGuion = () => {
    const temaFinal = tema.trim() || "un producto con potencial";
    const productoFinal = producto.trim() || "un producto digital o físico";
    const publicoFinal = publico.trim() || "personas que quieren ahorrar tiempo y tomar mejores decisiones";

    const resultado = `
🎬 TÍTULO:
Cómo presentar ${productoFinal} para que parezca útil en menos de 30 segundos

🔥 HOOK:
Si estás vendiendo ${temaFinal} como todo el mundo, estás perdiendo clics.

📖 GUION POR ESCENAS:

0-3s:
Visual: Primer plano del producto o una pantalla mostrando el problema.
Voz: "Antes de comprar o promocionar esto, mira este detalle."
Texto en pantalla: "No vendas sin ángulo"

4-10s:
Visual: Enseña el uso principal o beneficio más claro.
Voz: "Lo importante no es solo qué hace, sino qué problema resuelve."
Texto en pantalla: "Problema → solución"

11-20s:
Visual: Comparación rápida antes/después o caso de uso.
Voz: "Para ${publicoFinal}, esto puede ahorrar tiempo, mejorar el resultado o simplificar una tarea."
Texto en pantalla: "Beneficio claro"

21-30s:
Visual: Cierre con producto, web o llamada a la acción.
Voz: "Guarda esta idea y úsala como base para tu próximo contenido."
Texto en pantalla: "Convierte ideas en contenido"

📱 CAPTION:
Una buena pieza no empieza con el producto. Empieza con el problema que resuelve. Usa este enfoque para convertir ${temaFinal} en contenido más claro, útil y orientado a conversión.

🏷️ HASHTAGS:
#ia #contenido #marketingdigital #afiliados #negociosonline #automatizacion #shorts

👉 CTA:
Prueba este enfoque con tu producto y conviértelo después en vídeo con una herramienta como Pictory o CapCut.

💰 SIGUIENTE PASO RECOMENDADO:
1. Revisa el guion.
2. Ajusta el hook.
3. Convierte el texto en vídeo.
4. Publica o reutiliza el contenido en tu ecosistema.
    `;

    setGuion(resultado.trim());
  };

  return (
    <div className="min-h-screen bg-[#050816] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <Link href="/">
          <a className="mb-6 inline-flex items-center text-sm font-semibold text-slate-300 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a VendeConIA
          </a>
        </Link>

        <div className="rounded-3xl border border-purple-500/30 bg-[#0B0F1A] p-8 shadow-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-purple-300">
            Paso previo antes de Pictory o CapCut
          </p>

          <h1 className="mb-4 text-3xl font-extrabold sm:text-5xl">
            Generar guion viral listo para redes
          </h1>

          <p className="mb-8 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            Prepare el hook, guion, caption, hashtags y CTA antes de producir el vídeo.
            Esta herramienta no sustituye a Pictory: prepara una base mejor para convertirla después en pieza visual.
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">
                Tema del vídeo
              </label>
              <input
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                placeholder="Ej: gadgets para trabajar mejor"
                className="w-full rounded-xl border border-slate-700 bg-[#050816] p-4 text-white outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">
                Producto o servicio
              </label>
              <input
                value={producto}
                onChange={(e) => setProducto(e.target.value)}
                placeholder="Ej: soporte para portátil"
                className="w-full rounded-xl border border-slate-700 bg-[#050816] p-4 text-white outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">
                Público objetivo
              </label>
              <input
                value={publico}
                onChange={(e) => setPublico(e.target.value)}
                placeholder="Ej: emprendedores, oficinas, creadores"
                className="w-full rounded-xl border border-slate-700 bg-[#050816] p-4 text-white outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <p className="mt-4 text-sm text-amber-300">
            Recomendación: genere primero el guion y después conviértalo en vídeo con Pictory.
          </p>

          <button
            onClick={generarGuion}
            className="mt-6 rounded-xl bg-purple-600 px-6 py-4 font-bold text-white transition hover:bg-purple-700"
          >
            Generar guion
          </button>
        </div>

        {guion && (
          <div className="mt-8 rounded-3xl border border-slate-800 bg-black p-6 shadow-2xl">
            <h2 className="mb-4 text-2xl font-extrabold">Guion generado</h2>

            <pre className="whitespace-pre-wrap rounded-2xl bg-[#050816] p-5 text-sm leading-7 text-slate-100">
              {guion}
            </pre>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <a
                href={PICTORY_AFFILIATE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-6 py-4 text-center font-bold text-white transition hover:bg-orange-600"
              >
                Convertir este guion en vídeo con Pictory
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>

              <a
                href={SISTEMA_MAESTRO_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-6 py-4 text-center font-bold text-white transition hover:bg-emerald-700"
              >
                Automatizar mi negocio con IA
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}