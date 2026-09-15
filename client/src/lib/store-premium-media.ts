import type { ProductMedia } from "@/components/PremiumProductGallery";

// Arquitectura preparada para los 30 productos. En fase piloto solo se activa uno.
export const PREMIUM_PRODUCT_MEDIA: Record<string, ProductMedia> = {
  "bascula-digital-equipaje": {
    images: [
      "/store/products/premium/bascula-digital-equipaje/02.jpg",
      "/store/products/premium/bascula-digital-equipaje/03.jpg",
      "/store/products/premium/bascula-digital-equipaje/04.jpg",
      "/store/products/premium/bascula-digital-equipaje/05.jpg",
      "/store/products/premium/bascula-digital-equipaje/06.jpg",
    ],
  },
  "correa-manos-libres-perro": { images: ["/store/products/premium/correa-manos-libres-perro/01.jpg", "/store/products/premium/correa-manos-libres-perro/02.jpg", "/store/products/premium/correa-manos-libres-perro/03.jpg", "/store/products/premium/correa-manos-libres-perro/04.jpg"] },
  "auriculares-bluetooth-53": { images: ["/store/products/nuevos/auriculares-bt53-alternativa.avif"] },
  "control-ir-tuya-wifi": { images: ["/store/products/nuevos/control-ir-tuya-alternativa.avif"] },
  "dedo-medio-caja": { images: ["/store/products/nuevos/dedo-medio-caja-alternativa.avif"] },
  "raton-inalambrico-rgb": { images: ["/store/products/nuevos/raton-rgb-alternativa.avif"] },
};
