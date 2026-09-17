import type { ProductMedia } from "@/components/PremiumProductGallery";

// Arquitectura preparada para los 30 productos. En fase piloto solo se activa uno.
export const PREMIUM_PRODUCT_MEDIA: Record<string, ProductMedia> = {
  "luz-led-sensor-movimiento": { images: ["/store/products/premium/luz-led-sensor-movimiento/01.jpg", "/store/products/premium/luz-led-sensor-movimiento/02.jpg", "/store/products/premium/luz-led-sensor-movimiento/03.jpg", "/store/products/premium/luz-led-sensor-movimiento/04.jpg", "/store/products/premium/luz-led-sensor-movimiento/05.jpg"] },
  "impresora-termica-portatil-58mm": { images: ["/store/products/premium/impresora-termica-portatil-58mm/01.jpg", "https://a.allegroimg.com/original/11720b/fde1c0114443b58fa8c3f5688b4e/Aibecy-58HB6-Mini-Bluetooth-Drukarka-termiczna", "https://static-01.daraz.com.np/p/681896c2644237c2ee9168e0c0276ab6.jpg", "https://i.ebayimg.com/images/g/ieIAAOSwnmJiwrTF/s-l1200.jpg"] },
  "bascula-digital-equipaje": {
    images: [
      "/store/products/premium/bascula-digital-equipaje/02.jpg",
      "/store/products/premium/bascula-digital-equipaje/03.jpg",
      "/store/products/premium/bascula-digital-equipaje/04.jpg",
      "/store/products/premium/bascula-digital-equipaje/05.jpg",
      "/store/products/premium/bascula-digital-equipaje/06.jpg",
    ],
  },
  "soporte-portatil-aluminio": { images: ["/store/products/premium/soporte-portatil-aluminio/01.jpg", "/store/products/premium/soporte-portatil-aluminio/02.jpg", "/store/products/premium/soporte-portatil-aluminio/03.jpg"] },
  "correa-manos-libres-perro": { images: ["/store/products/premium/correa-manos-libres-perro/01.jpg", "/store/products/premium/correa-manos-libres-perro/02.jpg", "/store/products/premium/correa-manos-libres-perro/03.jpg", "/store/products/premium/correa-manos-libres-perro/04.jpg"] },
  "auriculares-bluetooth-53": { images: ["/store/products/nuevos/auriculares-bt53-alternativa.avif"] },
  "control-ir-tuya-wifi": { images: ["/store/products/nuevos/control-ir-tuya-alternativa.avif"] },
  "dedo-medio-caja": { images: ["/store/products/nuevos/dedo-medio-caja-alternativa.avif"] },
  "raton-inalambrico-rgb": { images: ["/store/products/nuevos/raton-rgb-alternativa.avif"] },
};
