import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, Play, X } from "lucide-react";

export type ProductMedia = { images?: string[]; video?: string };
type Props = { image: string; imageAlt: string; media?: ProductMedia };

export default function PremiumProductGallery({ image, imageAlt, media }: Props) {
  const images = Array.from(new Set([image, ...(media?.images || [])].filter(Boolean)));
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const previous = () => setActive((value) => (value - 1 + images.length) % images.length);
  const next = () => setActive((value) => (value + 1) % images.length);

  useEffect(() => {
    if (!lightbox) return;
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(false);
      if (event.key === "ArrowLeft" && images.length > 1) previous();
      if (event.key === "ArrowRight" && images.length > 1) next();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [lightbox, images.length]);
  return <div>
    <div className="relative overflow-hidden border-2 border-zinc-950 bg-white shadow-[10px_10px_0_#E8FF00]">
      <button type="button" onClick={() => setLightbox(true)} className="group block w-full cursor-zoom-in" aria-label="Ampliar imagen">
        <img src={images[active]} alt={imageAlt} className="aspect-square h-full w-full object-contain p-3 transition duration-300 group-hover:scale-[1.025] sm:p-6" />
      </button>
      <span className="pointer-events-none absolute right-3 top-3 flex items-center gap-2 border border-zinc-200 bg-white/95 px-3 py-2 text-xs font-black shadow"><Expand className="h-4 w-4"/> AMPLIAR</span>
      {images.length > 1 && <>
        <button type="button" onClick={previous} aria-label="Imagen anterior" className="absolute left-3 top-1/2 -translate-y-1/2 border-2 border-zinc-950 bg-white p-2 shadow"><ChevronLeft/></button>
        <button type="button" onClick={next} aria-label="Imagen siguiente" className="absolute right-3 top-1/2 -translate-y-1/2 border-2 border-zinc-950 bg-white p-2 shadow"><ChevronRight/></button>
      </>}
    </div>
    <div className="mt-4 flex snap-x gap-3 overflow-x-auto pb-2">
      {images.map((src, index) => <button key={`${src}-${index}`} type="button" onClick={() => setActive(index)} className={`h-20 w-20 shrink-0 snap-start overflow-hidden border-2 bg-white ${active === index ? "border-red-600 ring-2 ring-[#E8FF00]" : "border-zinc-300"}`}><img src={src} alt={`${imageAlt}, vista ${index + 1}`} className="h-full w-full object-contain p-1"/></button>)}
      {media?.video && <a href={media.video} target="_blank" rel="noreferrer" className="flex h-20 w-20 shrink-0 snap-start flex-col items-center justify-center border-2 border-zinc-950 bg-zinc-950 text-xs font-black text-white"><Play className="mb-1 h-5 w-5 text-[#E8FF00]"/>VÍDEO</a>}
    </div>
    <p className="mt-1 text-xs font-bold text-zinc-500">{images.length > 1 ? `${active + 1} de ${images.length} imágenes · pulsa para ampliar` : "Pulsa la imagen para ampliarla"}</p>
    {lightbox && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true">
      <button type="button" onClick={() => setLightbox(false)} aria-label="Cerrar" className="absolute right-5 top-5 bg-white p-3 text-zinc-950"><X/></button>
      {images.length > 1 && <button type="button" onClick={previous} aria-label="Imagen anterior" className="absolute left-4 top-1/2 -translate-y-1/2 bg-white p-3 text-zinc-950"><ChevronLeft/></button>}
      <img src={images[active]} alt={imageAlt} className="max-h-[90vh] max-w-[90vw] object-contain"/>
      {images.length > 1 && <button type="button" onClick={next} aria-label="Imagen siguiente" className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-3 text-zinc-950"><ChevronRight/></button>}
    </div>}
  </div>;
}
