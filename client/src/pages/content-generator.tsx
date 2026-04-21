import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { Clapperboard, Copy, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export default function ContentGenerator() {
  const { toast } = useToast();

  const [projectUrl, setProjectUrl] = useState("");
  const [projectName, setProjectName] = useState("");
  const [videoType, setVideoType] = useState("anuncio corto");
  const [style, setStyle] = useState("tecnológico");
  const [duration, setDuration] = useState("15 segundos");
  const [title, setTitle] = useState("TEST NUEVO CAMBIO 🔥");
  const [description, setDescription] = useState(
    "Descubre cómo usar inteligencia artificial para automatizar tareas, vender más y ahorrar tiempo sin complicarte con herramientas sueltas."
  );
  const [music, setMusic] = useState("electrónica");
  const [animation, setAnimation] = useState("zoom");
  const [ctaText, setCtaText] = useState("Entra ahora");
  const [ctaUrl, setCtaUrl] = useState("https://app.abrochat.com");

  useEffect(() => {
    document.title = "Generador de Contenido | VendeConIA";
  }, []);

  const publishText = useMemo(() => {
    return `${title}

${description}

👉 ${ctaText}: ${ctaUrl}

#ia #inteligenciaartificial #automatizacion #negociosdigitales #chatgpt`;
  }, [title, description, ctaText, ctaUrl]);

  const canPrepare = useMemo(() => {
    return Boolean((projectUrl || projectName) && title && description && ctaText && ctaUrl);
  }, [projectUrl, projectName, title, description, ctaText, ctaUrl]);

  const copyText = async (text: string, okTitle: string, okDescription: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: okTitle,
        description: okDescription,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "No se pudo copiar",
        description: "Copia manualmente el texto.",
        variant: "destructive",
      });
    }
  };

  const handleCopyBriefing = async () => {
    if (!canPrepare) {
      toast({
        title: "Faltan campos",
        description: "Completa URL o nombre del proyecto, título, descripción y CTA.",
        variant: "destructive",
      });
      return;
    }

    const briefing = `
🎬 BRIEFING DE VÍDEO PROMOCIONAL

Proyecto:
${projectName || "No indicado"}

URL del proyecto:
${projectUrl || "No indicada"}

Tipo de vídeo:
${videoType}

Título:
${title}

Descripción:
${description}

CTA:
${ctaText}

URL CTA:
${ctaUrl}

Estilo:
${style}

Duración:
${duration}

Música:
${music}

Animación:
${animation}

GUION BASE PROPUESTO:
1. Gancho inicial de 2-3 segundos
2. Problema o deseo principal del usuario
3. Presentación breve del proyecto
4. Beneficio principal
5. CTA final claro

TEXTO PROMOCIONAL:
${publishText}
    `.trim();

    await copyText(
      briefing,
      "Briefing copiado",
      "Ya tienes el briefing listo para reutilizar en ChatGPT, Pictory, CapCut o donde quieras producir el vídeo."
    );
  };

  const handlePrepareTikTok = async () => {
    await copyText(
      publishText,
      "Texto preparado para TikTok",
      "Se ha copiado el texto. Ahora se abrirá TikTok para subir el vídeo."
    );
    window.open("https://www.tiktok.com/upload", "_blank", "noopener,noreferrer");
  };

  const handlePrepareYouTube = async () => {
    const youtubeText = `${title}

${description}

🔗 ${ctaText}: ${ctaUrl}

#shorts #ia #automatizacion #negociosdigitales`;

    await copyText(
      youtubeText,
      "Texto preparado para YouTube",
      "Se ha copiado el texto. Ahora se abrirá YouTube Studio."
    );
    window.open("https://studio.youtube.com", "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-heading">
            Generador de Contenido
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Prepara el briefing y el texto base para crear vídeos promocionales de tus apps, webs y landings.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="mb-8 lg:mb-0">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Vista previa del flujo
              </h3>

              <Card className="bg-slate-950 rounded-xl aspect-[9/16] flex items-center justify-center">
                <CardContent className="p-6 text-center">
                  <Clapperboard className="h-10 w-10 text-white/70 mx-auto mb-4" />
                  <p className="text-white text-lg font-semibold mb-2">
                    Briefing listo para producir
                  </p>
                  <p className="text-white/70 text-sm max-w-xs mx-auto mb-4">
                    Completa el editor y pulsa <strong>Copiar briefing</strong> para llevarte la idea, el guion base y el CTA.
                  </p>
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Generación de vídeo real en revisión
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handlePrepareTikTok}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preparar TikTok
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handlePrepareYouTube}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preparar YouTube
                </Button>
              </div>

              <p className="text-center text-gray-500 text-sm mt-4">
                Usa esta pieza para promocionar tus proyectos y reutilizarla en redes o herramientas externas.
              </p>
            </div>
          </div>

          <div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Editor de contenido
              </h3>

              <p className="text-sm text-gray-600 mb-6">
                Este bloque prepara un briefing reutilizable para crear vídeos promocionales sin bloquearte con integraciones inestables.
              </p>

              <div className="space-y-6">
                <div>
                  <Label className="mb-2 block">URL del proyecto</Label>
                  <Input
                    placeholder="https://app.abrochat.com o https://sistemamaestroia.com"
                    value={projectUrl}
                    onChange={(e) => setProjectUrl(e.target.value)}
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Nombre del proyecto (opcional)</Label>
                  <Input
                    placeholder="AbroChat, SistemaMaestroIA, VendeConIA..."
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Tipo de vídeo</Label>
                  <Select value={videoType} onValueChange={setVideoType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tipo de vídeo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anuncio corto">Anuncio corto</SelectItem>
                      <SelectItem value="video promocional">Vídeo promocional</SelectItem>
                      <SelectItem value="video explicativo">Vídeo explicativo</SelectItem>
                      <SelectItem value="captacion de leads">Captación de leads</SelectItem>
                      <SelectItem value="demo de producto">Demo de producto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Título</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Crea tu primer asistente IA sin ser técnico"
                    maxLength={90}
                  />
                </div>

                <div>
                  <Label>Descripción</Label>
                  <Textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Explica qué hace tu app o web y por qué debería importarle al usuario."
                    maxLength={400}
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Estilo</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona estilo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tecnológico">Tecnológico</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="directo">Directo</SelectItem>
                      <SelectItem value="agresivo">Agresivo</SelectItem>
                      <SelectItem value="educativo">Educativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block">Duración</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona duración" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10 segundos">10 segundos</SelectItem>
                      <SelectItem value="15 segundos">15 segundos</SelectItem>
                      <SelectItem value="20 segundos">20 segundos</SelectItem>
                      <SelectItem value="30 segundos">30 segundos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Música</Label>
                  <Select value={music} onValueChange={setMusic}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona música" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upbeat tendencia">Upbeat tendencia</SelectItem>
                      <SelectItem value="electrónica">Electrónica</SelectItem>
                      <SelectItem value="cinemática">Cinemática</SelectItem>
                      <SelectItem value="corporativa">Corporativa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Animación</Label>
                  <Select value={animation} onValueChange={setAnimation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona animación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zoom">Zoom</SelectItem>
                      <SelectItem value="deslizar">Deslizar</SelectItem>
                      <SelectItem value="rebote">Rebote</SelectItem>
                      <SelectItem value="dinámica suave">Dinámica suave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Texto del CTA</Label>
                  <Input
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="Entra ahora"
                    maxLength={120}
                  />
                </div>

                <div>
                  <Label>URL del CTA</Label>
                  <Input
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    placeholder="https://app.abrochat.com"
                    maxLength={220}
                  />
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm font-medium text-amber-900 mb-1">
                    Generación real de vídeo
                  </p>
                  <p className="text-sm text-amber-800">
                    Esta función queda temporalmente en revisión. Mientras tanto, usa el briefing para producir el vídeo en herramientas externas sin bloquear el flujo.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full opacity-60 cursor-not-allowed"
                    disabled
                  >
                    <Clapperboard className="h-4 w-4 mr-2" />
                    Vídeo real próximamente
                  </Button>

                  <Button
                    type="button"
                    className="w-full bg-primary-500 hover:bg-primary-600"
                    onClick={handleCopyBriefing}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar briefing
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}