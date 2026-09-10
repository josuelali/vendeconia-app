import type { Express } from "express";
import Stripe from "stripe";

const STORE_PRODUCTS: Record<string, { name: string; unitAmount: number }> = {
  "guante-quitapelos": {
    name: "Guante Quitapelos Reutilizable para Mascotas",
    unitAmount: 1499,
  },
  "kit-limpieza-7-en-1": {
    name: "Kit de Limpieza 7 en 1 para Electrónica",
    unitAmount: 1699,
  },
  "soporte-coche-360": {
    name: "Soporte 360° para Teléfono o Tablet en Coche",
    unitAmount: 2499,
  },
};

function storefrontBaseUrl(req: any): string {
  const configured = String(process.env.STOREFRONT_BASE_URL || "").trim();
  if (configured) return configured.replace(/\/$/, "");

  const origin = String(req.headers?.origin || "").trim();
  if (origin && /^https?:\/\//i.test(origin)) return origin.replace(/\/$/, "");

  return "https://vendeconia.org";
}

export function registerStoreRoutes(app: Express) {
  app.get("/api/store/products", (_req, res) => {
    res.json({
      ok: true,
      products: Object.entries(STORE_PRODUCTS).map(([slug, product]) => ({
        slug,
        name: product.name,
        price: product.unitAmount / 100,
      })),
    });
  });

  app.post("/api/store/checkout", async (req: any, res) => {
    try {
      const secretKey = String(process.env.STRIPE_SECRET_KEY || "").trim();
      if (!secretKey) {
        return res.status(503).json({
          ok: false,
          error: "El pago no está disponible temporalmente",
        });
      }

      const slug = String(req.body?.slug || "").trim();
      const product = STORE_PRODUCTS[slug];
      if (!product) {
        return res.status(400).json({ ok: false, error: "Producto no válido" });
      }

      const stripe = new Stripe(secretKey);
      const baseUrl = storefrontBaseUrl(req);

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "eur",
              unit_amount: product.unitAmount,
              product_data: {
                name: product.name,
                description: "Envío incluido a España",
              },
            },
          },
        ],
        customer_creation: "always",
        billing_address_collection: "auto",
        shipping_address_collection: {
          allowed_countries: ["ES"],
        },
        phone_number_collection: { enabled: true },
        metadata: {
          storefront: "vendeconia",
          product_slug: slug,
          fulfillment: "manual_dropship_v1",
        },
        payment_intent_data: {
          metadata: {
            storefront: "vendeconia",
            product_slug: slug,
            fulfillment: "manual_dropship_v1",
          },
        },
        success_url: `${baseUrl}/tienda/gracias?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/tienda/${slug}?checkout=cancelled`,
      });

      if (!session.url) {
        throw new Error("Stripe no devolvió una URL de checkout");
      }

      return res.status(201).json({ ok: true, url: session.url });
    } catch (err: any) {
      console.error("STOREFRONT_CHECKOUT_ERROR:", {
        message: err?.message || "unknown",
        type: err?.type || null,
      });

      return res.status(500).json({
        ok: false,
        error: "No se pudo iniciar el pago. Inténtalo de nuevo.",
      });
    }
  });
}
