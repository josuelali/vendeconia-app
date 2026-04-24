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

  const STRIPE_LINKS: Record<string, string> = {
    pro: "https://buy.stripe.com/3cI4gzd7x1kxe6f3lRabK07",
    business: "https://buy.stripe.com/eVq14n3wX6ER9PZ9KfabK0a",
    agency: "https://buy.stripe.com/00w7sL5F5aV7aU3f4zabK09",
  };

  // ESTA ES LA FUNCIÓN QUE CORRIGE TODO
  const handlePlanSelection = (planId: string) => {
    // 1. Si es el plan gratis
    if (planId === 'free') {
      window.location.href = isAuthenticated ? '/dashboard' : '/api/login';
      return;
    }

    // 2. Si es un plan de pago, verificar autenticación
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

    // 3. Redirigir a Stripe según el ID
    const stripeUrl = STRIPE_LINKS[planId];
    if (stripeUrl) {
      window.location.href = stripeUrl;
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Enlace de pago no encontrado.",
      });
    }
  };

  const defaultPlans = [
    {
      id: "free",
      name: "Gratis",
      price: 0,
      interval: "mes",
      features: ["2 productos con análisis al mes", "5 sugerencias de nichos", "Generador básico de textos", "Plantillas estándar"],
      icon: <Zap className="h-6 w-6" />,
      cta: "Empezar Gratis"
    },
    {
      id: "pro",
      name: "Pro",
      price: 19,
      interval: "mes",
      yearlyPrice: 190,
      features: ["Productos ilimitados", "20 sugerencias", "Generador avanzado", "Shopify Sync", "Soporte prioritario"],
      icon: <Crown className="h-6 w-6" />,
      popular: true,
      cta: "Probar Pro 7 días gratis"
    },
    {
      id: "business",
      name: "Business",
      price: 49,
      interval: "mes",
      features: ["Todo lo de Pro", "5 usuarios", "API", "Análisis avanzados", "Soporte 24/7"],
      icon: <Building className="h-6 w-6" />,
      cta: "Probar Business 7 días gratis"
    },
    {
      id: "agency",
      name: "Agencia",
      price: 97,
      interval: "mes",
      yearlyPrice: 970,
      features: ["Todo lo de Business", "White-label", "10 clientes", "Panel Admin", "Facturación auto"],
      icon: <Star className="h-6 w-6" />,
      isAgency: true,
      cta: "Hablar con Ventas →"
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
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Descubre Productos Virales y Crea Contenido que Vende
          </h1>
          <p className="text-xl text-slate-400">Convierte tendencias en ingresos con IA</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plansToDisplay.map((plan: any) => (
            <Card 
              key={plan.id} 
              className={`relative transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-amber-500 scale-105 bg-slate-800' : 'bg-slate-800/60'
              } border-slate-700`}
            >
              {plan.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500">🔥 RECOMENDADO</Badge>}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4 text-amber-400">{plan.icon || <Zap />}</div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">€{plan.price}</span>
                  <span className="text-slate-400">/{plan.interval}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((f: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                      <Check className="h-4 w-4 text-green-400" /> {f}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${plan.popular ? 'bg-amber-500 text-slate-900' : 'bg-slate-700'}`}
                  // AQUÍ ESTÁ EL CAMBIO CLAVE:
                  onClick={() => handlePlanSelection(plan.id)}
                  disabled={user?.subscriptionPlan === plan.id}
                >
                  {user?.subscriptionPlan === plan.id ? 'Plan Actual' : (plan.cta || 'Elegir Plan')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}