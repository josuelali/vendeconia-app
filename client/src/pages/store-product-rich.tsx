import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Check, CreditCard, Info, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { STORE_PRODUCTS } from "@/pages/store";

type ExtraInfo = {
  intro: string;
  idealFor: string[];
  use: string[];
  notes?: string[];
};

const EXTRA: Record<string, ExtraInfo> = {
  "guante-quitapelos": {
    intro: "Una solución sencilla para retirar pelo suelto de perro y gato de superficies textiles sin depender de recambios o consumibles.",
    idealFor: ["Sofás y sillones", "Ropa y mantas", "Asientos del coche", "Hogares con perro o gato"],
    use: ["Pasa el guante por la superficie con movimientos firmes.", "Agrupa el pelo en una zona para retirarlo con facilidad.", "Repite en las áreas con más acumulación."],
  },
  "kit-limpieza-7-en-1": {
    intro: "Kit compacto pensado para mantener limpios varios dispositivos de uso diario con herramientas específicas para zonas pequeñas y de difícil acceso.",
    idealFor: ["Teclados", "Auriculares", "Móviles", "Cámaras y pequeños dispositivos"],
    use: ["Elige la herramienta adecuada para cada superficie.", "Trabaja con suavidad en ranuras y zonas delicadas.", "Guarda todas las piezas juntas después de usarlo."],
  },
  "soporte-coche-360": {
    intro: "Soporte manos libres con brazo flexible y clip ajustable para colocar el teléfono donde resulte más cómodo en casa o en el escritorio.",
    idealFor: ["Cama", "Escritorio", "Sofá", "Videollamadas o contenido"],
    use: ["Fija el clip a una superficie estable.", "Ajusta el brazo flexible hasta la posición deseada.", "Coloca el teléfono y comprueba la sujeción antes de usarlo."],
  },
  "correa-manos-libres-perro": {
    intro: "Correa elástica con cinturón ajustable para paseos activos, running o senderismo manteniendo las manos libres.",
    idealFor: ["Paseos diarios", "Running", "Senderismo", "Personas que quieren manos libres"],
    use: ["Ajusta el cinturón a la cintura.", "Conecta la correa al arnés o collar habitual.", "Comprueba el ajuste antes de comenzar la actividad."],
    notes: ["Disponible en varios colores. Selecciona uno antes de pagar."],
  },
  "disfraz-vaquero-mascota": {
    intro: "Disfraz visual tipo jinete vaquero pensado para fiestas, fotografías, vídeos y ocasiones especiales.",
    idealFor: ["Halloween", "Fiestas", "Fotos", "Contenido para redes"],
    use: ["Selecciona la talla disponible.", "Coloca el disfraz sin forzar movimientos.", "Supervisa siempre a la mascota mientras lo lleve puesto."],
    notes: ["Disponible en tallas S, M, L y XL."],
  },
  "disfraz-terror-mascota": {
    intro: "Disfraz temático de terror para perro, diseñado principalmente como accesorio visual para fiestas y sesiones de fotos.",
    idealFor: ["Halloween", "Fiestas temáticas", "Fotos", "Vídeos"],
    use: ["Selecciona la talla antes de comprar.", "Ajusta el disfraz sin apretar.", "Retíralo si la mascota muestra incomodidad."],
    notes: ["Disponible en tallas S, M y L."],
  },
  "gafas-inteligentes-bluetooth": {
    intro: "Gafas conectadas por Bluetooth orientadas a audio y llamadas en formato manos libres.",
    idealFor: ["Audio manos libres", "Llamadas", "Uso cotidiano", "Usuarios de gadgets"],
    use: ["Empareja las gafas con el teléfono por Bluetooth.", "Configura el audio desde el dispositivo conectado.", "Consulta las funciones disponibles en la unidad recibida."],
    notes: ["Las funciones exactas dependen de la variante suministrada. No se anuncian prestaciones no verificadas."],
  },
  "smartwatch-183": {
    intro: "Reloj inteligente con pantalla de 1,83 pulgadas y funciones conectadas para llamadas Bluetooth, música y actividad.",
    idealFor: ["Uso diario", "Llamadas Bluetooth", "Música", "Seguimiento de actividad"],
    use: ["Selecciona el color deseado.", "Carga el reloj antes del primer uso.", "Empareja el dispositivo siguiendo las instrucciones de la unidad recibida."],
    notes: ["Disponible en Negro, Beige, Rosa y Gris."],
  },
  "bola-premios-perro": {
    intro: "Bola de caucho flexible diseñada para introducir pequeños premios y convertir el juego en una actividad más entretenida.",
    idealFor: ["Juego con premios", "Perros pequeños o medianos según tamaño", "Entretenimiento", "Rutinas de juego"],
    use: ["Introduce premios de tamaño adecuado.", "Entrega la bola al perro bajo supervisión.", "Límpiala después del uso."],
    notes: ["Disponible en 5 cm y 7 cm."],
  },
  "limpiador-patas-mascota": {
    intro: "Accesorio compacto de silicona pensado para ayudar a limpiar las patas después del paseo y retirar suciedad superficial.",
    idealFor: ["Después del paseo", "Días de lluvia", "Perros y gatos", "Uso doméstico"],
    use: ["Introduce la pata con suavidad.", "Realiza movimientos suaves de limpieza.", "Aclara el accesorio después de usarlo."],
  },
  "comedero-interactivo-perro": {
    intro: "Juguete-comedero pensado para convertir parte de la alimentación en una actividad de juego y estimulación.",
    idealFor: ["Juego con alimento", "Estimulación", "Rutinas de entretenimiento", "Perros activos"],
    use: ["Introduce una cantidad adecuada de alimento o premios.", "Coloca el producto sobre una superficie estable.", "Supervisa las primeras sesiones de uso."],
  },
  "estuche-electronica-viaje": {
    intro: "Estuche compacto con cremallera para organizar cables, auriculares, cargadores y accesorios pequeños en casa o de viaje.",
    idealFor: ["Cables", "Auriculares", "Cargadores", "Viajes y mochila"],
    use: ["Distribuye los accesorios por tamaño.", "Evita forzar la cremallera con exceso de contenido.", "Llévalo en mochila, bolso o maleta."],
    notes: ["Disponible en Negro, Blanco, Azul, Rosa y Morado."],
  },
  "guante-masaje-quitapelos": {
    intro: "Guante de silicona para combinar cepillado, masaje y retirada de pelo suelto durante la rutina habitual de cuidado.",
    idealFor: ["Perros", "Gatos", "Cepillado habitual", "Masaje suave"],
    use: ["Coloca el guante en la mano seleccionada.", "Cepilla siguiendo el sentido del pelo.", "Retira el pelo acumulado del guante tras el uso."],
    notes: ["Disponible para mano derecha o izquierda."],
  },
  "pelota-automatica-perro": {
    intro: "Pelota interactiva recargable con movimiento automático para fomentar el juego y mantener al perro activo.",
    idealFor: ["Juego interactivo", "Actividad en casa", "Perros con energía", "Sesiones de entretenimiento"],
    use: ["Carga la pelota antes de usarla.", "Activa el movimiento automático.", "Supervisa al perro durante el juego y retírala si se daña."],
    notes: ["Disponible en Rojo y Verde."],
  },
  "gafas-inteligentes-camara": {
    intro: "Gafas conectadas con Bluetooth, cámara integrada y audio, presentadas únicamente con las funciones que tenemos confirmadas.",
    idealFor: ["Usuarios de gadgets", "Audio Bluetooth", "Captura con cámara integrada", "Uso manos libres"],
    use: ["Carga el dispositivo antes del primer uso.", "Empareja por Bluetooth cuando corresponda.", "Consulta las instrucciones de la unidad para las funciones de cámara."],
    notes: ["No se anuncian resoluciones, funciones de IA ni otras prestaciones no verificadas."],
  },
  "raton-inalambrico-rgb": {
    intro: "Ratón inalámbrico recargable con conexión Bluetooth/USB e iluminación RGB, pensado para uso cotidiano con equipos compatibles.",
    idealFor: ["Ordenador portátil", "PC", "Tablet compatible", "Escritorio"],
    use: ["Carga el ratón por USB antes del primer uso.", "Conéctalo por el modo inalámbrico compatible con tu dispositivo.", "Comprueba el funcionamiento y ajusta la posición de uso."],
  },
  "dedo-medio-caja": {
    intro: "Figura decorativa dorada presentada en caja, pensada como regalo de broma u objeto llamativo de escritorio.",
    idealFor: ["Regalo de broma", "Escritorio", "Decoración", "Detalle divertido"],
    use: ["Abre la caja y coloca la figura en una superficie estable.", "Úsala como objeto decorativo o regalo.", "Guárdala en la caja cuando no se utilice."],
  },
  "microfono-lavalier-usbc": {
    intro: "Micrófono Lavalier inalámbrico con receptor USB-C para grabación de voz en dispositivos compatibles.",
    idealFor: ["Vídeos", "Entrevistas", "Contenido para redes", "Dispositivos USB-C compatibles"],
    use: ["Conecta el receptor USB-C al dispositivo compatible.", "Enciende el micrófono y comprueba la conexión.", "Coloca el micrófono cerca de la voz antes de grabar."],
  },
  "tira-led-rgb-bluetooth-usb": {
    intro: "Tira LED RGB 5050 de 1 metro con alimentación USB y control Bluetooth/IR para iluminación ambiental.",
    idealFor: ["TV", "Escritorio", "Habitación", "Iluminación ambiental"],
    use: ["Limpia y seca la superficie antes de pegarla.", "Conecta la tira a una alimentación USB 5 V.", "Utiliza el control Bluetooth/IR compatible para ajustar la iluminación."],
  },
  "control-ir-tuya-wifi": {
    intro: "Control remoto universal WiFi IR Tuya para centralizar equipos compatibles por infrarrojos desde la app y asistentes compatibles.",
    idealFor: ["Aire acondicionado compatible", "Equipos con mando infrarrojo", "Hogar conectado", "Usuarios de Tuya/Smart Life"],
    use: ["Conecta el controlador a la red WiFi siguiendo la app compatible.", "Añade el equipo infrarrojo que quieras controlar.", "Configura Alexa o Google Home solo cuando el dispositivo y la app lo permitan."],
  },
  "auriculares-bluetooth-53": {
    intro: "Auriculares inalámbricos Bluetooth 5.3 en variante negra sin funciones de traducción IA, con estuche de carga e indicador LED.",
    idealFor: ["Música", "Audio inalámbrico", "Móvil", "Uso cotidiano"],
    use: ["Carga el estuche mediante USB Type-C.", "Empareja los auriculares por Bluetooth con el dispositivo.", "Utiliza los controles táctiles indicados en la ficha del producto."],
    notes: ["La variante seleccionada es BT5.3 BK No AI. No se anuncia traducción mediante IA."],
  },
};

function Money({ value }: { value: number }) {
  return <>{value.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}</>;
}

export default function StoreProductRich() {
  const [location] = useLocation();
  const slug = location.split("?")[0].split("/").filter(Boolean).pop() || "";
  const product = useMemo(() => STORE_PRODUCTS.find((item) => item.slug === slug), [slug]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [variant, setVariant] = useState("");

  if (!product) {
    return <main className="min-h-screen bg-white px-5 py-20 text-center"><h1 className="text-3xl font-black">Producto no encontrado</h1><Link href="/tienda" className="mt-6 inline-block underline">Volver a la tienda</Link></main>;
  }

  const extra = EXTRA[product.slug];
  const checkout = async () => {
    if (product.variants && !variant) {
      setError(`Selecciona ${product.variants.label.toLowerCase()}`);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/store/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: product.slug, variant }),
      });
      const data = await response.json();
      if (!response.ok || !data?.url) throw new Error(data?.error || "No se pudo iniciar el pago");
      window.location.assign(data.url);
    } catch (err: any) {
      setError(err?.message || "No se pudo iniciar el pago");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <div className="border-b-2 border-zinc-950 bg-[#E8FF00]">
        <div className="mx-auto max-w-7xl px-5 py-3 text-xs font-black uppercase tracking-widest">VendeConIA · envío incluido a España</div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8">
        <Link href="/tienda" className="inline-flex items-center gap-2 text-sm font-bold"><ArrowLeft className="h-4 w-4"/> Volver a la tienda</Link>

        <div className="mt-7 grid gap-10 lg:grid-cols-[1.08fr_.92fr]">
          <div className="overflow-hidden border-2 border-zinc-950 bg-zinc-100 shadow-[10px_10px_0_#E8FF00]">
            <img src={product.image} alt={product.imageAlt} className="aspect-square h-full w-full object-cover" />
          </div>

          <div className="lg:py-4">
            <span className="inline-block bg-red-600 px-3 py-2 text-xs font-black uppercase tracking-wider text-white">{product.badge}</span>
            <h1 className="mt-5 text-4xl font-black leading-none sm:text-5xl">{product.name}</h1>
            <p className="mt-5 text-lg leading-7 text-zinc-600">{product.description}</p>
            {extra?.intro && <p className="mt-3 text-base leading-7 text-zinc-700">{extra.intro}</p>}

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {product.benefits.map((benefit) => <li key={benefit} className="flex gap-2 border border-zinc-300 bg-zinc-50 p-3 text-sm font-bold"><Check className="h-4 w-4 shrink-0 text-red-600"/>{benefit}</li>)}
            </ul>

            {product.variants && <div className="mt-7"><p className="mb-2 text-sm font-black uppercase">{product.variants.label}</p><div className="flex flex-wrap gap-2">{product.variants.values.map((value) => <button key={value} type="button" onClick={() => setVariant(value)} className={`border-2 border-zinc-950 px-4 py-2 font-black ${variant === value ? "bg-[#E8FF00]" : "bg-white"}`}>{value}</button>)}</div></div>}

            <div className="mt-8 border-y-2 border-zinc-950 py-5">
              <strong className="text-5xl font-black"><Money value={product.price}/></strong>
              <p className="mt-1 text-sm font-bold text-zinc-500">Precio final · Envío incluido a España</p>
            </div>

            <button type="button" onClick={checkout} disabled={loading} className="mt-6 w-full bg-red-600 px-5 py-5 text-xl font-black uppercase text-white transition hover:-translate-y-1 hover:bg-zinc-950 hover:shadow-[0_7px_0_#E8FF00] disabled:opacity-60">
              {loading ? "Abriendo pago seguro…" : "Comprar ahora"}
            </button>
            {error && <p className="mt-3 border-2 border-red-600 bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-zinc-500"><ShieldCheck className="h-4 w-4"/> Pago procesado de forma segura por Stripe</div>
          </div>
        </div>

        <section className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="border-2 border-zinc-950 p-6 shadow-[6px_6px_0_#111]">
            <h2 className="flex items-center gap-2 text-xl font-black"><Info className="h-5 w-5 text-red-600"/> ¿Para quién es?</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-700">{extra?.idealFor.map((item) => <li key={item} className="flex gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-red-600"/>{item}</li>)}</ul>
          </div>
          <div className="border-2 border-zinc-950 p-6 shadow-[6px_6px_0_#E8FF00]">
            <h2 className="flex items-center gap-2 text-xl font-black"><PackageCheck className="h-5 w-5 text-red-600"/> Cómo usarlo</h2>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-zinc-700">{extra?.use.map((item, index) => <li key={item}><strong className="mr-2">{index + 1}.</strong>{item}</li>)}</ol>
          </div>
          <div className="border-2 border-zinc-950 p-6 shadow-[6px_6px_0_#111]">
            <h2 className="flex items-center gap-2 text-xl font-black"><Truck className="h-5 w-5 text-red-600"/> Envío y pedido</h2>
            <div className="mt-4 space-y-3 text-sm leading-6 text-zinc-700">
              <p><strong>Envío incluido a España.</strong> No añadimos un coste de envío adicional al llegar a Stripe.</p>
              <p>La dirección de entrega y el teléfono se recogen durante el checkout seguro.</p>
              <p>Cada pedido se gestiona individualmente para la dirección indicada por el comprador.</p>
            </div>
          </div>
        </section>

        <section className="mt-8 border-2 border-zinc-950 bg-zinc-950 p-6 text-white sm:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-black">Antes de comprar</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-300">Revisa el nombre del producto, la variante seleccionada y la dirección de envío antes de completar el pago. No añadimos especificaciones que no estén confirmadas para el producto.</p>
              {extra?.notes && <ul className="mt-4 space-y-2 text-sm text-[#E8FF00]">{extra.notes.map((note) => <li key={note}>• {note}</li>)}</ul>}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="border border-zinc-700 p-4"><CreditCard className="h-5 w-5 text-[#E8FF00]"/><strong className="mt-2 block">Pago seguro</strong><span className="mt-1 block text-xs text-zinc-400">Procesado por Stripe.</span></div>
              <div className="border border-zinc-700 p-4"><Truck className="h-5 w-5 text-[#E8FF00]"/><strong className="mt-2 block">Envío incluido</strong><span className="mt-1 block text-xs text-zinc-400">A direcciones en España.</span></div>
              <div className="border border-zinc-700 p-4"><PackageCheck className="h-5 w-5 text-[#E8FF00]"/><strong className="mt-2 block">Pedido individual</strong><span className="mt-1 block text-xs text-zinc-400">Preparado para el destinatario indicado.</span></div>
              <div className="border border-zinc-700 p-4"><ShieldCheck className="h-5 w-5 text-[#E8FF00]"/><strong className="mt-2 block">Datos de pago</strong><span className="mt-1 block text-xs text-zinc-400">Se introducen directamente en Stripe.</span></div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
