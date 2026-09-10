import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, CarFront, Check, Keyboard, PackageCheck, PawPrint, ShieldCheck, ShoppingBag, Truck } from "lucide-react";

export type StoreProduct = {
  slug: string;
  name: string;
  shortName: string;
  price: number;
  tagline: string;
  description: string;
  benefits: string[];
  badge: string;
  icon: "pet" | "keyboard" | "car";
  variantLabel?: string;
  variants?: string[];
};

export const STORE_PRODUCTS: StoreProduct[] = [
  { slug: "guante-quitapelos", name: "Guante Quitapelos Reutilizable para Mascotas", shortName: "Guante Quitapelos", price: 14.99, tagline: "Retira pelos de sofá, ropa y textiles en segundos.", description: "Guante de limpieza reutilizable pensado para recoger pelo de mascotas de superficies textiles sin recambios ni consumibles.", benefits: ["Reutilizable y fácil de limpiar", "Útil en sofás, ropa, camas y asientos", "Sin pilas, cables ni consumibles", "Envío incluido a España"], badge: "Selección VendeConIA", icon: "pet" },
  { slug: "kit-limpieza-7-en-1", name: "Kit de Limpieza 7 en 1 para Electrónica", shortName: "Kit Limpieza 7 en 1", price: 16.99, tagline: "Un solo kit para teclado, auriculares y dispositivos.", description: "Kit compacto de limpieza para retirar polvo y suciedad de teclados, auriculares, pantallas y pequeños dispositivos electrónicos.", benefits: ["Siete herramientas en formato compacto", "Especialmente útil para teclados y auriculares", "Fácil de guardar y transportar", "Envío incluido a España"], badge: "Selección VendeConIA", icon: "keyboard" },
  { slug: "soporte-coche-360", name: "Soporte 360° para Teléfono o Tablet en Coche", shortName: "Soporte Coche 360°", price: 24.99, tagline: "Pantalla estable para los pasajeros de los asientos traseros.", description: "Soporte ajustable para reposacabezas con rotación de 360 grados, diseñado para sujetar teléfonos o tablets durante los trayectos.", benefits: ["Rotación de 360 grados", "Pensado para móvil o tablet", "Instalación sencilla en reposacabezas", "Envío incluido a España"], badge: "Selección VendeConIA", icon: "car" },
  { slug: "correa-manos-libres-perro", name: "Correa Manos Libres para Perro", shortName: "Correa Manos Libres", price: 27.99, tagline: "Camina o corre con tu perro sin llevar la correa en la mano.", description: "Correa ajustable para paseo y running con cinturón de cintura y sistema manos libres para moverte con mayor comodidad.", benefits: ["Diseñada para caminar, correr o trotar", "Sistema manos libres con cinturón ajustable", "Disponible en varios colores", "Envío incluido a España"], badge: "Mascotas", icon: "pet", variantLabel: "Color", variants: ["Naranja", "Verde", "Negro"] },
  { slug: "disfraz-vaquero-mascota", name: "Disfraz Vaquero para Mascotas", shortName: "Disfraz Vaquero Mascota", price: 21.99, tagline: "Un disfraz llamativo para fiestas, Halloween y sesiones de fotos.", description: "Disfraz tipo jinete vaquero para perros y otras mascotas, pensado para ocasiones especiales y contenido divertido en redes sociales.", benefits: ["Tallas S, M, L y XL", "Diseño visual y fácil de mostrar en vídeo", "Ideal para fiestas, Halloween y fotos", "Envío incluido a España"], badge: "Mascotas", icon: "pet", variantLabel: "Talla", variants: ["S", "M", "L", "XL"] },
];

function ProductIcon({ type, className = "h-20 w-20" }: { type: StoreProduct["icon"]; className?: string }) {
  if (type === "pet") return <PawPrint className={className} />;
  if (type === "keyboard") return <Keyboard className={className} />;
  return <CarFront className={className} />;
}

function Money({ value }: { value: number }) {
  return <>{value.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</>;
}

export function Storefront() {
  return <main className="min-h-screen bg-slate-950 text-white"><header className="border-b border-white/10 bg-slate-950/95"><div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5"><Link href="/" className="text-xl font-black tracking-tight">VendeConIA</Link><div className="flex items-center gap-2 text-sm text-slate-300"><ShieldCheck className="h-4 w-4" /> Pago seguro</div></div></header><section className="mx-auto max-w-6xl px-5 pb-10 pt-14 text-center"><span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">Selección VendeConIA</span><h1 className="mx-auto mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">Productos útiles. Sin catálogo infinito.</h1><p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">Una selección corta de productos prácticos, con precio final claro y envío incluido a España.</p></section><section className="mx-auto grid max-w-6xl gap-6 px-5 pb-16 sm:grid-cols-2 lg:grid-cols-3">{STORE_PRODUCTS.map((product)=><article key={product.slug} className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-xl"><div className="flex h-56 items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-cyan-300"><ProductIcon type={product.icon}/></div><div className="p-6"><span className="text-xs font-bold uppercase tracking-wider text-cyan-300">{product.badge}</span><h2 className="mt-2 text-xl font-bold">{product.shortName}</h2><p className="mt-2 min-h-12 text-sm leading-6 text-slate-300">{product.tagline}</p><div className="mt-5"><strong className="text-3xl"><Money value={product.price}/></strong></div><p className="mt-1 text-xs text-slate-400">Precio final mostrado · Envío incluido a España</p><Link href={`/tienda/${product.slug}`} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 font-bold text-slate-950 transition hover:bg-cyan-300">Ver producto <ShoppingBag className="h-4 w-4" /></Link></div></article>)}</section><section className="border-t border-white/10 bg-slate-900/50"><div className="mx-auto grid max-w-5xl gap-6 px-5 py-10 text-sm text-slate-300 md:grid-cols-3"><div className="flex gap-3"><Truck className="h-5 w-5 shrink-0 text-cyan-300"/><div><strong className="block text-white">Envío incluido</strong>Sin costes sorpresa al pagar.</div></div><div className="flex gap-3"><ShieldCheck className="h-5 w-5 shrink-0 text-cyan-300"/><div><strong className="block text-white">Pago seguro</strong>Checkout protegido por Stripe.</div></div><div className="flex gap-3"><PackageCheck className="h-5 w-5 shrink-0 text-cyan-300"/><div><strong className="block text-white">Pedido individual</strong>Cada pedido se gestiona para su destinatario.</div></div></div></section></main>;
}

export function StoreProductPage() {
  const [location] = useLocation();
  const slug = location.split("?")[0].split("/").filter(Boolean).pop() || "";
  const product = useMemo(() => STORE_PRODUCTS.find((item) => item.slug === slug), [slug]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [variant, setVariant] = useState("");

  if (!product) return <main className="min-h-screen bg-slate-950 px-5 py-20 text-center text-white"><h1 className="text-3xl font-bold">Producto no encontrado</h1><Link href="/tienda" className="mt-6 inline-block text-cyan-300 underline">Volver a la tienda</Link></main>;

  const checkout = async () => {
    if (product.variants?.length && !variant) { setError(`Selecciona ${product.variantLabel?.toLowerCase() || "una opción"} antes de comprar.`); return; }
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/store/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: product.slug, variant }) });
      const data = await response.json();
      if (!response.ok || !data?.url) throw new Error(data?.error || "No se pudo iniciar el pago");
      window.location.assign(data.url);
    } catch (err: any) { setError(err?.message || "No se pudo iniciar el pago"); setLoading(false); }
  };

  return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto max-w-5xl px-5 py-8"><Link href="/tienda" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"><ArrowLeft className="h-4 w-4"/> Volver a la tienda</Link><div className="mt-8 grid overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl md:grid-cols-2"><div className="flex min-h-96 items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-cyan-300"><ProductIcon type={product.icon} className="h-32 w-32"/></div><div className="p-7 sm:p-10"><span className="text-xs font-bold uppercase tracking-wider text-cyan-300">{product.badge}</span><h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{product.name}</h1><p className="mt-4 leading-7 text-slate-300">{product.description}</p><ul className="mt-6 space-y-3">{product.benefits.map((benefit)=><li key={benefit} className="flex gap-3 text-sm text-slate-200"><Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300"/> {benefit}</li>)}</ul>{product.variants?.length ? <div className="mt-7"><label className="mb-2 block text-sm font-bold text-white">{product.variantLabel}</label><select value={variant} onChange={(e)=>setVariant(e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white"><option value="">Seleccionar</option>{product.variants.map((item)=><option key={item} value={item}>{item}</option>)}</select></div> : null}<div className="mt-8"><strong className="text-4xl"><Money value={product.price}/></strong></div><p className="mt-2 text-xs text-slate-400">Precio final mostrado · Envío incluido a direcciones en España</p><button type="button" onClick={checkout} disabled={loading} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-4 text-lg font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-wait disabled:opacity-60">{loading ? "Abriendo pago seguro…" : "Comprar ahora"}</button>{error && <p className="mt-3 rounded-lg bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}<div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400"><ShieldCheck className="h-4 w-4"/> Pago procesado de forma segura por Stripe</div></div></div></div></main>;
}

export function StoreThanks() { return <main className="min-h-screen bg-slate-950 px-5 py-24 text-center text-white"><div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-slate-900 p-10"><PackageCheck className="mx-auto h-16 w-16 text-cyan-300"/><h1 className="mt-5 text-3xl font-black">Pedido recibido</h1><p className="mt-4 leading-7 text-slate-300">El pago se ha completado. Conserva el correo de confirmación de Stripe como justificante del pedido.</p><Link href="/tienda" className="mt-7 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950">Volver a la tienda</Link></div></main>; }
