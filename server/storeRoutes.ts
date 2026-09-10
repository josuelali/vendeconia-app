import type { Express } from "express";
import Stripe from "stripe";

type StoreProduct = { name: string; unitAmount: number; variants?: string[] };
const STORE_PRODUCTS: Record<string, StoreProduct> = {
  "guante-quitapelos": { name:"Guante Quitapelos Reutilizable para Mascotas", unitAmount:1499 },
  "kit-limpieza-7-en-1": { name:"Kit de Limpieza 7 en 1 para Electrónica", unitAmount:1699 },
  "soporte-coche-360": { name:"Soporte Flexible 360° para Teléfono", unitAmount:1499 },
  "correa-manos-libres-perro": { name:"Correa Manos Libres para Perro", unitAmount:2799, variants:["Naranja","Verde","Negro"] },
  "disfraz-vaquero-mascota": { name:"Disfraz Vaquero para Mascotas", unitAmount:2199, variants:["S","M","L","XL"] },
  "disfraz-terror-mascota": { name:"Disfraz de Terror para Perro", unitAmount:1999, variants:["S","M","L"] },
  "gafas-inteligentes-bluetooth": { name:"Gafas Inteligentes Bluetooth", unitAmount:2499 },
  "smartwatch-183": { name:"Smartwatch Deportivo 1,83 pulgadas", unitAmount:1999, variants:["Negro","Beige","Rosa","Gris"] },
  "bola-premios-perro": { name:"Bola Dispensadora de Premios para Perro", unitAmount:1299, variants:["5 cm","7 cm"] },
  "limpiador-patas-mascota": { name:"Limpiador de Patas de Silicona para Mascotas", unitAmount:1399 },
  "comedero-interactivo-perro": { name:"Comedero Interactivo para Perro", unitAmount:2199 },
  "estuche-electronica-viaje": { name:"Estuche Organizador para Cables y Electrónica", unitAmount:1399, variants:["Negro","Blanco","Azul","Rosa","Morado"] },
  "guante-masaje-quitapelos": { name:"Guante de Masaje Quitapelos para Perro y Gato", unitAmount:1399, variants:["Derecha","Izquierda"] },
  "pelota-automatica-perro": { name:"Pelota Interactiva Automática para Perro", unitAmount:1799, variants:["Rojo","Verde"] },
  "gafas-inteligentes-camara": { name:"Gafas Inteligentes Bluetooth con Cámara", unitAmount:2499 }
};

const AUCTION = {
  id: "bombilla-wifi-tuya-v1",
  name: "Bombilla LED WiFi Tuya",
  startAmount: 849,
  stepAmount: 50,
  durationMs: 5 * 60 * 1000,
  antiSnipeMs: 20 * 1000,
};

type AuctionState = { currentAmount: number; bidCount: number; endsAt: number };
let auctionState: AuctionState = { currentAmount: AUCTION.startAmount, bidCount: 0, endsAt: Date.now() + AUCTION.durationMs };

function resetAuction() {
  auctionState = { currentAmount: AUCTION.startAmount, bidCount: 0, endsAt: Date.now() + AUCTION.durationMs };
}

function auctionSnapshot() {
  const now = Date.now();
  if (now >= auctionState.endsAt && auctionState.bidCount === 0) resetAuction();
  const ended = Date.now() >= auctionState.endsAt && auctionState.bidCount > 0;
  const nextAmount = auctionState.bidCount === 0 ? AUCTION.startAmount : auctionState.currentAmount + AUCTION.stepAmount;
  return {
    ok: true,
    id: AUCTION.id,
    name: AUCTION.name,
    currentBid: auctionState.bidCount === 0 ? null : auctionState.currentAmount / 100,
    nextBid: nextAmount / 100,
    bidCount: auctionState.bidCount,
    endsAt: new Date(auctionState.endsAt).toISOString(),
    ended,
  };
}

function storefrontBaseUrl(req:any):string { const configured=String(process.env.STOREFRONT_BASE_URL||"").trim(); if(configured)return configured.replace(/\/$/,""); const origin=String(req.headers?.origin||"").trim(); if(origin&&/^https?:\/\//i.test(origin))return origin.replace(/\/$/,""); return "https://vendeconia.org"; }

export function registerStoreRoutes(app:Express){
  app.get("/api/store/products",(_req,res)=>res.json({ok:true,products:Object.entries(STORE_PRODUCTS).map(([slug,p])=>({slug,name:p.name,price:p.unitAmount/100,variants:p.variants||[]}))}));

  app.get("/api/store/auction",(_req,res)=>res.json(auctionSnapshot()));
  app.post("/api/store/auction/bid",(_req,res)=>{
    const now = Date.now();
    if (now >= auctionState.endsAt && auctionState.bidCount > 0) return res.status(409).json({ ...auctionSnapshot(), error:"La subasta ha terminado" });
    if (now >= auctionState.endsAt) resetAuction();
    const nextAmount = auctionState.bidCount === 0 ? AUCTION.startAmount : auctionState.currentAmount + AUCTION.stepAmount;
    auctionState.currentAmount = nextAmount;
    auctionState.bidCount += 1;
    if (auctionState.endsAt - now <= AUCTION.antiSnipeMs) auctionState.endsAt = now + AUCTION.antiSnipeMs;
    return res.status(201).json(auctionSnapshot());
  });

  app.post("/api/store/checkout",async(req:any,res)=>{try{const secretKey=String(process.env.STRIPE_SECRET_KEY||"").trim();if(!secretKey)return res.status(503).json({ok:false,error:"El pago no está disponible temporalmente"});const slug=String(req.body?.slug||"").trim();const variant=String(req.body?.variant||"").trim();const product=STORE_PRODUCTS[slug];if(!product)return res.status(400).json({ok:false,error:"Producto no válido"});if(product.variants?.length&&!product.variants.includes(variant))return res.status(400).json({ok:false,error:"Selecciona una opción válida"});const stripe=new Stripe(secretKey);const baseUrl=storefrontBaseUrl(req);const displayName=variant?`${product.name} — ${variant}`:product.name;const metadata={storefront:"vendeconia",product_slug:slug,variant:variant||"standard",fulfillment:"manual_dropship_v1"};const session=await stripe.checkout.sessions.create({mode:"payment",line_items:[{quantity:1,price_data:{currency:"eur",unit_amount:product.unitAmount,product_data:{name:displayName,description:"Envío incluido a España"}}}],customer_creation:"always",billing_address_collection:"auto",shipping_address_collection:{allowed_countries:["ES"]},phone_number_collection:{enabled:true},metadata,payment_intent_data:{metadata},success_url:`${baseUrl}/tienda/gracias?session_id={CHECKOUT_SESSION_ID}`,cancel_url:`${baseUrl}/tienda/${slug}?checkout=cancelled`});if(!session.url)throw new Error("Stripe no devolvió una URL de checkout");return res.status(201).json({ok:true,url:session.url});}catch(err:any){console.error("STOREFRONT_CHECKOUT_ERROR:",{message:err?.message||"unknown",type:err?.type||null});return res.status(500).json({ok:false,error:"No se pudo iniciar el pago. Inténtalo de nuevo."});}});

  app.get("/api/store/checkout/session", async (req:any,res) => {
    try {
      const secretKey=String(process.env.STRIPE_SECRET_KEY||"").trim();
      if(!secretKey)return res.status(503).json({ok:false,error:"El pago no está disponible temporalmente"});
      const sessionId=String(req.query?.session_id||"").trim();
      if(!/^cs_(test|live)_/.test(sessionId))return res.status(400).json({ok:false,error:"Sesión no válida"});
      const stripe=new Stripe(secretKey);
      const session=await stripe.checkout.sessions.retrieve(sessionId);
      const slug=String(session.metadata?.product_slug||"").trim();
      const product=STORE_PRODUCTS[slug];
      if(!product || session.metadata?.storefront!=="vendeconia")return res.status(404).json({ok:false,error:"Pedido no reconocido"});
      const paid=session.payment_status==="paid";
      return res.json({
        ok:true,
        paid,
        transactionId:session.id,
        currency:String(session.currency||"eur").toUpperCase(),
        value:typeof session.amount_total==="number"?session.amount_total/100:product.unitAmount/100,
        product:{slug,name:product.name,price:product.unitAmount/100,variant:String(session.metadata?.variant||"standard")}
      });
    } catch(err:any) {
      console.error("STOREFRONT_SESSION_VERIFY_ERROR:",{message:err?.message||"unknown",type:err?.type||null});
      return res.status(400).json({ok:false,error:"No se pudo verificar el pedido"});
    }
  });
}
