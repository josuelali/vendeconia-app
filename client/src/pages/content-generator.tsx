import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Clapperboard, Copy, Download, ExternalLink, PlayCircle, AlertCircle } from "lucide-react";
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

type VideoStatus = "idle" | "queued" | "processing" | "completed" | "failed";

export default function ContentGenerator() {
  const { toast } = useToast();

  const API_URL = import.meta.env.VITE_API_URL || "";

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

  const [isGenerating, setIsGenerating] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<VideoStatus>("idle");
  const [videoUrl, setVideoUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.title = "Generador de Contenido | VendeConIA";
  }, []);

  const publishText = useMemo(() => {
    return `${title}

${description}

👉 ${ctaText}: ${ctaUrl}

#ia #inteligenciaartificial #automatizacion #negociosdigitales #chatgpt`;
  }, [title, description, ctaText, ctaUrl]);

  const canGenerate = useMemo(() => {
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
    `.trim();

    await copyText(
      briefing,
      "Briefing copiado",
      "Ya tienes el briefing listo para reutilizar o revisar."
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

  const handleGenerateVideo = async () => {
    if (!API_URL) {
      toast({
        title: "Falta configuración",
        description: "No existe VITE_API_URL en el frontend.",
        variant: "destructive",
      });
      return;
    }

    if (!canGenerate) {
      toast({
        title: "Faltan campos",
        description: "Completa URL o nombre del proyecto, título, descripción y CTA.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);
      setVideoId(null);
      setVideoUrl("");
      setVideoStatus("queued");
      setErrorMessage("");

      const response = await fetch(`${API_URL}/api/video/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea: `${projectName || "Proyecto digital"} - ${videoType} - ${style}`,
          titulo: title,
          descripcion: `
Proyecto: ${projectName || "No indicado"}
URL: ${projectUrl || "No indicada"}
Mensaje principal: ${description}
Tipo de vídeo: ${videoType}
Estilo: ${style}
Duración: ${duration}
Música: ${music}
Animación: ${animation}
CTA: ${ctaText}
URL CTA: ${ctaUrl}
          `.trim(),
          cta: `${ctaText} - ${ctaUrl}`,
          urlProyecto: projectUrl,
          nombreProyecto: projectName,
          tipoVideo: videoType,
          estilo: style,
          duracion: duration,
          musica: music,
          animacion: animation,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.videoId) {
        throw new Error(
          data?.error ? JSON.stringify(data.error) : "No se recibió videoId"
        );
      }

      setVideoId(data.videoId);
      toast({
        title: "Generación iniciada",
        description: "El vídeo se está generando. Espera unos segundos.",
      });
    } catch (error) {
      console.error(error);
      setVideoStatus("failed");
      setErrorMessage("No se pudo iniciar la generación del vídeo.");
      toast({
        title: "Error al generar vídeo",
        description: "Revisa el backend o el modelo configurado.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!videoId || !API_URL) return;

    let cancelled = false;
    let timeoutId: number | undefined;

    const pollStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/api/video/${videoId}/status`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "No se pudo consultar el estado.");
        }

        if (cancelled) return;

        const nextStatus = (data?.status || "processing") as VideoStatus;
        setVideoStatus(nextStatus);

        if (nextStatus === "completed") {
          setVideoUrl(`${API_URL}/api/video/${videoId}/content`);
          return;
        }

        if (nextStatus === "failed") {
          setErrorMessage("La generación del vídeo ha fallado.");
          return;
        }

        timeoutId = window.setTimeout(() => {
          if (!cancelled) void pollStatus();
        }, 4000);
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setVideoStatus("failed");
          setErrorMessage("Error consultando el estado del vídeo.");
        }
      }
    };

    setVideoStatus("queued");
    void pollStatus();

    return () => {
      cancelled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [videoId, API_URL]);

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 font-heading">
            Generador de Contenido
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Crea vídeos promocionales para tus apps, webs y landings usando IA.
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="mb-8 lg:mb-0">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Vista previa de vídeo
              </h3>

              {!videoId && (
                <Card className="bg-slate-950 rounded-xl aspect-[9/16] flex items-center justify-center">
                  <CardContent className="p-6 text-center">
                    <Clapperboard className="h-10 w-10 text-white/70 mx-auto mb-4" />
                    <p className="text-white text-lg font-semibold mb-2">
                      Sin vídeo generado aún
                    </p>
                    <p className="text-white/70 text-sm max-w-xs mx-auto">
                      Completa el editor y pulsa <strong>Generar vídeo real</strong>.
                    </p>
                  </CardContent>
                </Card>
              )}

              {videoId && (videoStatus === "queued" || videoStatus === "processing") && (
                <Card className="bg-slate-950 rounded-xl aspect-[9/16] flex items-center justify-center">
                  <CardContent className="p-6 text-center">
                    <Loader2 className="h-10 w-10 text-cyan-400 animate-spin mx-auto mb-4" />
                    <p className="text-white text-lg font-semibold mb-2">
                      Generando vídeo...
                    </p>
                    <p className="text-white/70 text-sm max-w-xs mx-auto">
                      Estado actual: {videoStatus}
                    </p>
                  </CardContent>
                </Card>
              )}

              {videoId && videoStatus === "failed" && (
                <Card className="bg-slate-950 rounded-xl aspect-[9/16] flex items-center justify-center">
                  <CardContent className="p-6 text-center">
                    <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-4" />
                    <p className="text-white text-lg font-semibold mb-2">
                      Error al generar
                    </p>
                    <p className="text-white/70 text-sm max-w-xs mx-auto">
                      {errorMessage || "No se pudo completar la generación."}
                    </p>
                  </CardContent>
                </Card>
              )}

              {videoId && videoStatus === "completed" && videoUrl && (
                <>
                  <div className="bg-slate-950 rounded-xl overflow-hidden shadow-xl p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <PlayCircle className="h-5 w-5 text-cyan-400" />
                      <p className="text-white font-medium">Resultado final</p>
                    </div>

                    <video
                      src={videoUrl}
                      controls
                      playsInline
                      className="w-full max-w-[360px] mx-auto rounded-lg bg-black"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = videoUrl;
                        link.download = `${projectName || "video-generado"}.mp4`;
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar vídeo
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handlePrepareTikTok}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      TikTok
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handlePrepareYouTube}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      YouTube
                    </Button>
                  </div>
                </>
              )}

              <p className="text-center text-gray-500 text-sm mt-4">
                Usa esta pieza para promocionar tus proyectos y reutilizarla en redes.
              </p>
            </div>
          </div>

          <div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Editor de contenido
              </h3>

              <p className="text-sm text-gray-600 mb-6">
                Este bloque está pensado para crear vídeos promocionales para tus apps y webs.
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    type="button"
                    className="w-full bg-primary-500 hover:bg-primary-600"
                    onClick={handleGenerateVideo}
                    disabled={isGenerating}
                  >
                    <Clapperboard className="h-4 w-4 mr-2" />
                    {isGenerating ? "Generando..." : "Generar vídeo real"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
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