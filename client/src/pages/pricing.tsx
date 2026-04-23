import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Building, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Pricing() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: plans, isLoading } = useQuery({
    queryKey: ['/api/subscription-plans'],
    enabled: true,
  });

  // LINKS DIRECTOS DE STRIPE (tus links reales)
  const STRIPE_LINKS = {
    pro: "https://buy.stripe.com/3cI4gzd7x1kxe6f3lRabK07",
    business: "https://buy.stripe.com/eVq14n3wX6ER9PZ9KfabK0a",
    agency: "https://buy.stripe.com/00w7sL5F5aV7aU3f4zabK09",
  };

  const handleStripeCheckout = (planType: 'pro' | 'business' | 'agency') => {
    if (!isAuthenticated) {
      toast({
        title: "Inicia sesión",
        description: "Necesitas una cuenta para suscribirte. Redirigiendo...",
      });
      setTimeout(() => {
        window.location.href = '/api/login';
      }, 1500);
      return;
    }

    // Redirige directamente al checkout de Stripe
    window.location.href = STRIPE_LINKS[planType];
  };

  const defaultPlans = [
    {
      id: "free",
      name: "Gratis",
      price: 0,
      currency: "EUR",
      interval: "mes",
      features: [
        "2 productos con análisis al mes",
        "5 sugerencias de nichos",
        "Generador básico de textos",
        "Plantillas estándar"
      ],
      icon: <Zap className="h-6 w-6" />,
      popular: false,
      cta: "Empezar Gratis",
      action: () => {
        if (!isAuthenticated) {
          window.location.href = '/api/login';
        } else {
          window.location.href = '/dashboard';
        }
      }
    },
    {
      id: "pro",
      name: "Pro",
      price: 19,
      currency: "EUR",
      interval: "mes",
      yearlyPrice: 190,
      features: [
        "Productos ilimitados con análisis",
        "20 sugerencias de nichos mensuales",
        "Generador avanzado de textos y reels",
        "Plantillas exclusivas",
        "Conexión con Shopify",
        "Exportar a redes sociales",
        "Soporte prioritario"
      ],
      icon: <Crown className="h-6 w-6" />,
      popular: true,
      cta: "Probar Pro 7 días gratis",
      action: () => handleStripeCheckout('pro'),
      stripeLink: STRIPE_LINKS.pro
    },
    {
      id: "business",
      name: "Business",
      price: 49,
      currency: "EUR",
      interval: "mes",
      features: [
        "Todo lo de Pro",
        "5 usuarios del equipo",
        "API para integraciones",
        "Análisis avanzados",
        "Soporte 24/7",
        "Onboarding personalizado"
      ],
      icon: <Building className="h-6 w-6" />,
      popular: false,
      cta: "Probar Business 7 días gratis",
      action: () => handleStripeCheckout('business'),
      stripeLink: STRIPE_LINKS.business
    },
    {
      id: "agency",
      name: "Agencia",
      price: 97,
      currency: "EUR",
      interval: "mes",
      yearlyPrice: 970,
      features: [
        "Todo lo de Business",
        "White-label: tu logo, tu dominio",
        "Hasta 10 cuentas de cliente",
        "Panel de administración",
        "Facturación automática a clientes",
        "Soporte técnico prioritario",
        "Onboarding de 1 hora gratis"
      ],
      icon: <Star className="h-6 w-6" />,
      popular: false,
      cta: "Hablar con Ventas →",
      action: () => handleStripeCheckout('agency'),
      stripeLink: STRIPE_LINKS.agency,
      isAgency: true
    },
  ];

  const plansToDisplay = plans?.length > 0 ? plans : defaultPlans;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Descubre Productos Virales y Crea Contenido que Vende
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Convierte tendencias en ingresos con IA
          </p>
        </div>

        {/* PLANS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plansToDisplay.map((plan: any) => (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-300 hover:shadow-2xl ${
                plan.popular 
                  ? 'ring-2 ring-amber-500 scale-105 bg-slate-800/90' 
                  : plan.isAgency
                    ? 'ring-2 ring-amber-400 bg-gradient-to-br from-amber-900/20 to-orange-900/20'
                    : 'bg-slate-800/60 hover:bg-slate-800/80'
              } border-slate-700`}
            >
              {/* BADGES */}
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-slate-900 font-bold">
                  🔥 RECOMENDADO
                </Badge>
              )}
              {plan.isAgency && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-bold">
                  🏢 PARA AGENCIAS
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${
                    plan.popular 
                      ? 'bg-amber-500/20 text-amber-400' 
                      : plan.isAgency
                        ? 'bg-amber-400/20 text-amber-400'
                        : 'bg-slate-700 text-slate-400'
                  }`}>
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                <CardDescription className="text-lg mt-2">
                  <span className="text-4xl font-bold text-white">
                    €{plan.price}
                  </span>
                  <span className="text-slate-400">/{plan.interval}</span>
                </CardDescription>
                {plan.yearlyPrice && (
                  <p className="text-sm text-slate-500 mt-1">
                    o €{plan.yearlyPrice}/año (2 meses gratis)
                  </p>
                )}
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full font-semibold ${
                    plan.popular 
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-900' 
                      : plan.isAgency
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                  onClick={plan.action || (() => {})}
                  disabled={user?.subscriptionPlan === plan.id}
                >
                  {user?.subscriptionPlan === plan.id ? 'Plan Actual' : (plan.cta || 'Elegir Plan')}
                </Button>

                {plan.popular && (
                  <p className="text-xs text-center text-slate-500">
                    Sin tarjeta. Cancela cuando quieras.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ SECTION */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-12">
            Preguntas Frecuentes
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-slate-800/60 rounded-lg p-6 border border-slate-700">
              <h3 className="font-semibold text-amber-400 mb-2">
                ¿Puedo cancelar cuando quiera?
              </h3>
              <p className="text-slate-400 text-sm">
                Sí, sin permanencia ni penalizaciones. Cancelas desde tu cuenta y listo.
              </p>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-6 border border-slate-700">
              <h3 className="font-semibold text-amber-400 mb-2">
                ¿Necesito tarjeta para la prueba gratis?
              </h3>
              <p className="text-slate-400 text-sm">
                No, empiezas sin compromiso. Solo introduces datos de pago cuando decides quedarte.
              </p>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-6 border border-slate-700">
              <h3 className="font-semibold text-amber-400 mb-2">
                ¿Funciona para afiliados de Amazon?
              </h3>
              <p className="text-slate-400 text-sm">
                Sí, generamos contenido optimizado para cualquier plataforma de afiliados: Amazon, AliExpress, Shopify...
              </p>
            </div>
            <div className="bg-slate-800/60 rounded-lg p-6 border border-slate-700">
              <h3 className="font-semibold text-amber-400 mb-2">
                ¿Qué es el plan Agencia?
              </h3>
              <p className="text-slate-400 text-sm">
                Es para consultores y agencias que quieren ofrecer VendeConIA a sus clientes con su propia marca y precios.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}