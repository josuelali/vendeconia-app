import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Check, PackageCheck, ShieldCheck, ShoppingBag, Truck } from "lucide-react";

export type StoreProduct = {
  slug: string;
  name: string;
  shortName: string;
  price: number;
  tagline: string;
  description: string;
  benefits: string[];
  badge: string;
  image: string;
  imageAlt: string;
  variants?: { label: string; values: string[] };
};

export const STORE_PRODUCTS: StoreProduct[] = [
  {
    slug: "guante-quitapelos",
    name: "Guante Quitapelos Reutilizable para Mascotas",
    shortName: "Guante Quitapelos",
    price: 14.99,
    tagline: "Adiós a los pelos del sofá, la ropa y el coche.",
    description: "Guante reutilizable para recoger pelo de perro y gato en textiles, tapicerías y asientos sin pilas ni recambios.",
    benefits: ["Reutilizable", "Apto para sofá, ropa y coche", "Sin consumibles", "Envío incluido a España"],
    badge: "TOP MASCOTAS",
    image: "https://p16-oec-general-useast5.ttcdn-us.com/tos-useast5-i-omjb5zjo8w-tx/aeaca1a2a7674e2c823efb660b297dda~tplv-fhlh96nyum-resize-jpeg%3A800%3A800.jpeg?dr=12186&from=1826719393&idc=useast5&ps=933b5bde&shcp=e1be8f53&shp=6ce186a1&t=555f072d",
    imageAlt: "Guante quitapelos negro para mascotas",
  },
  {
    slug: "kit-limpieza-7-en-1",
    name: "Kit de Limpieza 7 en 1 para Electrónica",
    shortName: "Kit Limpieza 7 en 1",
    price: 16.99,
    tagline: "Teclado, auriculares y pantalla limpios con un solo kit.",
    description: "Kit compacto con varias herramientas para limpiar teclados, auriculares, móviles, cámaras y pequeños dispositivos.",
    benefits: ["7 herramientas", "Extractor de teclas", "Cepillos de precisión", "Envío incluido a España"],
    badge: "GADGET ÚTIL",
    image: "https://http2.mlstatic.com/D_NQ_NP_697835-MLA76332998652_052024-O.webp",
    imageAlt: "Kit de limpieza 7 en 1 para electrónica",
  },
  {
    slug: "soporte-coche-360",
    name: "Soporte Kouwolsen H02 360° para Móvil o Tablet",
    shortName: "Soporte Coche 360°",
    price: 24.99,
    tagline: "Pantalla estable para los pasajeros en cualquier trayecto.",
    description: "Soporte de reposacabezas Kouwolsen H02 con giro de 360° para teléfonos y tablets.",
    benefits: ["Rotación 360°", "Para móvil o tablet", "Instalación rápida", "Envío incluido a España"],
    badge: "VIAJES",
    image: "https://kwsen.cn/static/upload/image/20250213/1739376865975602.jpg",
    imageAlt: "Soporte Kouwolsen H02 para móvil y tablet en coche",
  },
  {
    slug: "correa-manos-libres-perro",
    name: "Correa Manos Libres para Perro",
    shortName: "Correa Manos Libres",
    price: 27.99,
    tagline: "Camina o corre con las manos libres.",
    description: "Correa elástica con cinturón ajustable para paseo, running y senderismo con tu perro.",
    benefits: ["Cinturón ajustable", "Sistema elástico", "Ideal para running", "Envío incluido a España"],
    badge: "MASCOTAS ACTIVE",
    image: "https://image.ceneostatic.pl/data/products/162370238/p-mawe-pas-biodrowy-smycz-dla-psa-do-biegania-psa-2-1-m.jpg",
    imageAlt: "Correa manos libres naranja para correr con perro",
    variants: { label: "Color", values: ["Naranja", "Verde", "Negro"] },
  },
  {
    slug: "disfraz-vaquero-mascota",
    name: "Disfraz Vaquero para Mascotas",
    shortName: "Disfraz Vaquero Mascota",
    price: 21.99,
    tagline: "El disfraz que convierte cualquier paseo en contenido viral.",
    description: "Disfraz tipo jinete vaquero para perros y otras mascotas, pensado para fiestas, Halloween, fotos y vídeos.",
    benefits: ["Tallas S a XL", "Muy visual en foto y vídeo", "Ideal para Halloween", "Envío incluido a España"],
    badge: "VIRAL PET",
    image: "https://images-na.ssl-images-amazon.com/images/I/61jmLlGkQ2L.jpg",
    imageAlt: "Perro con disfraz de jinete vaquero",
    variants: { label: "Talla", values: ["S", "M", "L", "XL"] },
  },
];

function Money({ value }: { value: number }) {
  return <>{value.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</>;
}

export function Storefront() {
  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <header className="sticky top-0 z-20 border-b-2 border-zinc-950 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="text-2xl font-black tracking-tight">VendeCon<span className="text-red-600">IA</span></Link>
          <div className="flex items-center gap-2 rounded-full bg-[#E8FF00] px-4 py-2 text-sm font-black"><ShieldCheck className="h-4 w-4" /> PAGO SEGURO</div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b-2 border-zinc-950 bg-red-600 px-5 py-16 text-white">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#E8FF00] opacity-90" />
        <div className="relative mx-auto max-w-7xl">
          <span className="inline-block rotate-[-2deg] bg-[#E8FF00] px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-zinc-950">Selección VendeConIA</span>
          <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[.95] tracking-tight sm:text-7xl">PRODUCTOS QUE<br/><span className="text-[#E8FF00]">MERECEN LA PENA.</span></h1>
          <p className="mt-6 max-w-2xl text-lg font-medium text-red-50">Pocos productos, bien elegidos. Precio claro, envío incluido a España y compra directa.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-7 px-5 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {STORE_PRODUCTS.map((product, index) => (
          <article key={product.slug} className="group overflow-hidden border-2 border-zinc-950 bg-white shadow-[8px_8px_0_#111] transition hover:-translate-y-1 hover:shadow-[12px_12px_0_#E8FF00]">
            <div className="relative aspect-square overflow-hidden bg-zinc-100">
              <img src={product.image} alt={product.imageAlt} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <span className="absolute left-3 top-3 bg-zinc-950 px-3 py-2 text-xs font-black uppercase tracking-wider text-[#E8FF00]">{product.badge}</span>
              <span className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-sm font-black text-white">0{index + 1}</span>
            </div>
            <div className="p-5">
              <h2 className="text-2xl font-black leading-tight">{product.shortName}</h2>
              <p className="mt-2 min-h-12 text-sm leading-6 text-zinc-600">{product.tagline}</p>
              <div className="mt-5 flex items-end justify-between gap-3 border-t-2 border-zinc-950 pt-4">
                <strong className="text-3xl font-black"><Money value={product.price} /></strong>
                <span className="text-right text-[11px] font-bold uppercase text-zinc-500">Envío incluido<br/>España</span>
              </div>
              <Link href={`/tienda/${product.slug}`} className="mt-5 flex w-full items-center justify-center gap-2 bg-red-600 px-4 py-4 font-black uppercase text-white transition hover:bg-zinc-950">Ver producto <ShoppingBag className="h-4 w-4" /></Link>
            </div>
          </article>
        ))}
      </section>

      <section className="border-y-2 border-zinc-950 bg-[#E8FF00]">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 text-sm font-bold md:grid-cols-3">
          <div className="flex gap-3"><Truck className="h-5 w-5"/><div><strong className="block text-base">Envío incluido</strong>Sin costes sorpresa al pagar.</div></div>
          <div className="flex gap-3"><ShieldCheck className="h-5 w-5"/><div><strong className="block text-base">Pago seguro</strong>Checkout protegido por Stripe.</div></div>
          <div className="flex gap-3"><PackageCheck className="h-5 w-5"/><div><strong className="block text-base">Pedido individual</strong>Cada pedido se gestiona para su destinatario.</div></div>
        </div>
      </section>
    </main>
  );
}

export function StoreProductPage() {
  const [location] = useLocation();
  const slug = location.split("?")[0].split("/").filter(Boolean).pop() || "";
  const product = useMemo(() => STORE_PRODUCTS.find((item) => item.slug === slug), [slug]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [variant, setVariant] = useState("");

  if (!product) return <main className="min-h-screen bg-white px-5 py-20 text-center"><h1 className="text-3xl font-black">Producto no encontrado</h1><Link href="/tienda" className="mt-6 inline-block underline">Volver a la tienda</Link></main>;

  const checkout = async () => {
    if (product.variants && !variant) { setError(`Selecciona ${product.variants.label.toLowerCase()}`); return; }
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/store/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug: product.slug, variant }) });
      const data = await response.json();
      if (!response.ok || !data?.url) throw new Error(data?.error || "No se pudo iniciar el pago");
      window.location.assign(data.url);
    } catch (err: any) { setError(err?.message || "No se pudo iniciar el pago"); setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <div className="border-b-2 border-zinc-950 bg-[#E8FF00]"><div className="mx-auto max-w-7xl px-5 py-3 text-xs font-black uppercase tracking-widest">VendeConIA · envío incluido a España</div></div>
      <div className="mx-auto max-w-7xl px-5 py-8">
        <Link href="/tienda" className="inline-flex items-center gap-2 text-sm font-bold"><ArrowLeft className="h-4 w-4"/> Volver a la tienda</Link>
        <div className="mt-7 grid gap-10 lg:grid-cols-[1.08fr_.92fr]">
          <div className="overflow-hidden border-2 border-zinc-950 bg-zinc-100 shadow-[10px_10px_0_#E8FF00]"><img src={product.image} alt={product.imageAlt} className="aspect-square h-full w-full object-cover" /></div>
          <div className="lg:py-4">
            <span className="inline-block bg-red-600 px-3 py-2 text-xs font-black uppercase tracking-wider text-white">{product.badge}</span>
            <h1 className="mt-5 text-4xl font-black leading-none sm:text-5xl">{product.name}</h1>
            <p className="mt-5 text-lg leading-7 text-zinc-600">{product.description}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">{product.benefits.map((benefit)=><li key={benefit} className="flex gap-2 border border-zinc-300 bg-zinc-50 p-3 text-sm font-bold"><Check className="h-4 w-4 shrink-0 text-red-600"/>{benefit}</li>)}</ul>
            {product.variants && <div className="mt-7"><p className="mb-2 text-sm font-black uppercase">{product.variants.label}</p><div className="flex flex-wrap gap-2">{product.variants.values.map((value)=><button key={value} type="button" onClick={()=>setVariant(value)} className={`border-2 border-zinc-950 px-4 py-2 font-black ${variant===value?"bg-[#E8FF00]":"bg-white"}`}>{value}</button>)}</div></div>}
            <div className="mt-8 border-y-2 border-zinc-950 py-5"><strong className="text-5xl font-black"><Money value={product.price}/></strong><p className="mt-1 text-sm font-bold text-zinc-500">Precio final · Envío incluido a España</p></div>
            <button type="button" onClick={checkout} disabled={loading} className="mt-6 w-full bg-red-600 px-5 py-5 text-xl font-black uppercase text-white hover:bg-zinc-950 disabled:opacity-60">{loading?"Abriendo pago seguro…":"Comprar ahora"}</button>
            {error && <p className="mt-3 border-2 border-red-600 bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-zinc-500"><ShieldCheck className="h-4 w-4"/> Pago procesado de forma segura por Stripe</div>
          </div>
        </div>
      </div>
    </main>
  );
}

export function StoreThanks() {
  return <main className="min-h-screen bg-red-600 px-5 py-24 text-center text-white"><div className="mx-auto max-w-xl border-2 border-zinc-950 bg-white p-10 text-zinc-950 shadow-[12px_12px_0_#E8FF00]"><PackageCheck className="mx-auto h-16 w-16 text-red-600"/><h1 className="mt-5 text-4xl font-black">Pedido recibido</h1><p className="mt-4 leading-7 text-zinc-600">El pago se ha completado. Conserva el correo de confirmación de Stripe como justificante del pedido.</p><Link href="/tienda" className="mt-7 inline-flex bg-zinc-950 px-5 py-3 font-black uppercase text-[#E8FF00]">Volver a la tienda</Link></div></main>;
}
