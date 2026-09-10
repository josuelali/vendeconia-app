(function(){
  const MEASUREMENT_ID='G-XBK5WGCDBQ';
  const PRODUCTS={
    'guante-quitapelos':{name:'Guante Quitapelos Reutilizable para Mascotas',price:14.99,category:'Mascotas'},
    'kit-limpieza-7-en-1':{name:'Kit de Limpieza 7 en 1 para Electrónica',price:16.99,category:'Gadgets'},
    'soporte-coche-360':{name:'Soporte Flexible 360° para Teléfono',price:14.99,category:'Hogar'},
    'correa-manos-libres-perro':{name:'Correa Manos Libres para Perro',price:27.99,category:'Mascotas'},
    'disfraz-vaquero-mascota':{name:'Disfraz Vaquero para Mascotas',price:21.99,category:'Mascotas'},
    'disfraz-terror-mascota':{name:'Disfraz de Terror para Perro',price:19.99,category:'Mascotas'},
    'gafas-inteligentes-bluetooth':{name:'Gafas Inteligentes Bluetooth',price:24.99,category:'Gadgets'},
    'smartwatch-183':{name:'Smartwatch Deportivo 1,83 pulgadas',price:19.99,category:'Gadgets'},
    'bola-premios-perro':{name:'Bola Dispensadora de Premios para Perro',price:12.99,category:'Mascotas'},
    'limpiador-patas-mascota':{name:'Limpiador de Patas de Silicona para Mascotas',price:13.99,category:'Mascotas'},
    'comedero-interactivo-perro':{name:'Comedero Interactivo para Perro',price:21.99,category:'Mascotas'},
    'estuche-electronica-viaje':{name:'Estuche Organizador para Cables y Electrónica',price:13.99,category:'Hogar'},
    'guante-masaje-quitapelos':{name:'Guante de Masaje Quitapelos para Perro y Gato',price:13.99,category:'Mascotas'},
    'pelota-automatica-perro':{name:'Pelota Interactiva Automática para Perro',price:17.99,category:'Mascotas'},
    'gafas-inteligentes-camara':{name:'Gafas Inteligentes Bluetooth con Cámara',price:24.99,category:'Gadgets'}
  };

  function ga(event,params){
    if(typeof window.gtag==='function') window.gtag('event',event,params||{});
    else {
      window.dataLayer=window.dataLayer||[];
      window.dataLayer.push({event:event,...(params||{})});
    }
  }

  function itemFor(slug,variant){
    const p=PRODUCTS[slug]; if(!p) return null;
    return {item_id:slug,item_name:p.name,item_category:p.category,item_variant:variant&&variant!=='standard'?variant:undefined,price:p.price,quantity:1};
  }

  function currentSlug(){
    const m=location.pathname.match(/^\/tienda\/([^/?#]+)$/);
    return m&&m[1]!=='gracias'?decodeURIComponent(m[1]):null;
  }

  let lastTrackedPath='';
  function trackRoute(){
    const key=location.pathname+location.search;
    if(key===lastTrackedPath)return;
    lastTrackedPath=key;
    const slug=currentSlug();
    if(slug&&PRODUCTS[slug]){
      const p=PRODUCTS[slug];
      ga('view_item',{currency:'EUR',value:p.price,items:[itemFor(slug)]});
    }
    if(location.pathname==='/tienda/gracias') verifyPurchase();
  }

  async function verifyPurchase(){
    const id=new URLSearchParams(location.search).get('session_id');
    if(!id||!/^cs_(test|live)_/.test(id))return;
    const storageKey='ga4_purchase_'+id;
    try{if(localStorage.getItem(storageKey)==='1')return;}catch{}
    try{
      const r=await fetch('/api/store/checkout/session?session_id='+encodeURIComponent(id),{credentials:'same-origin'});
      const d=await r.json();
      if(!r.ok||!d?.ok||!d?.paid||!d?.product)return;
      const item=itemFor(d.product.slug,d.product.variant);
      if(!item)return;
      item.price=Number(d.product.price||item.price);
      ga('purchase',{transaction_id:d.transactionId,value:Number(d.value||item.price),currency:d.currency||'EUR',items:[item]});
      try{localStorage.setItem(storageKey,'1');}catch{}
    }catch{}
  }

  const originalFetch=window.fetch.bind(window);
  window.fetch=async function(input,init){
    const url=typeof input==='string'?input:(input&&input.url)||'';
    let checkoutPayload=null;
    if(url.includes('/api/store/checkout')&&!url.includes('/api/store/checkout/session')&&String(init?.method||'GET').toUpperCase()==='POST'){
      try{checkoutPayload=JSON.parse(String(init?.body||'{}'));}catch{}
    }
    const response=await originalFetch(input,init);
    if(checkoutPayload&&response.ok){
      const p=PRODUCTS[checkoutPayload.slug];
      if(p){
        const item=itemFor(checkoutPayload.slug,checkoutPayload.variant);
        ga('begin_checkout',{currency:'EUR',value:p.price,items:[item]});
      }
    }
    return response;
  };

  const pushState=history.pushState.bind(history);
  history.pushState=function(){const r=pushState.apply(history,arguments);setTimeout(trackRoute,0);return r;};
  const replaceState=history.replaceState.bind(history);
  history.replaceState=function(){const r=replaceState.apply(history,arguments);setTimeout(trackRoute,0);return r;};
  addEventListener('popstate',trackRoute);
  addEventListener('DOMContentLoaded',trackRoute);
  setTimeout(trackRoute,0);
})();
