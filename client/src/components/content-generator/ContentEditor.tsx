import { FormEvent, useState } from "react";
import { Clapperboard, Copy } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@shared/schema";

type ContentData = {
  title: string;
  description: string;
  music: string;
  animation: string;
  cta: string;
};

interface ContentEditorProps {
  products: Product[];
  selectedProduct: Product | null;
  onProductSelect: (product: Product) => void;
  contentData: ContentData;
  onContentChange: (data: Partial<ContentData>) => void;
  onVideoCreated?: (videoId: string) => void;
}

export default function ContentEditor({
  products,
  selectedProduct,
  onProductSelect,
  contentData,
  onContentChange,
  onVideoCreated,
}: ContentEditorProps) {
  const { toast } = useToast();

  const [projectUrl, setProjectUrl] = useState("");
  const [projectName, setProjectName] = useState("");
  const [videoType, setVideoType] = useState("anuncio corto");
  const [style, setStyle] = useState("tecnológico");
  const [duration, setDuration] = useState("15 segundos");
  const [isGenerating, setIsGenerating] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "";

  const handleCopyBriefing = (e: FormEvent) => {
    e.preventDefault();

    const briefing = `
🎬 BRIEFING DE VÍDEO PROMOCIONAL

Proyecto:
${projectName || "No indicado"}

URL del proyecto:
${projectUrl || "No indicada"}

Tipo de vídeo:
${videoType}

Título:
${contentData.title || "Sin título"}

Descripción:
${contentData.description || "Sin descripción"}

CTA:
${contentData.cta || "Sin CTA"}

Estilo:
${style}

Duración:
${duration}

Música:
${contentData.music || "No indicada"}

Animación:
${contentData.animation || "No indicada"}
    `.trim();

    navigator.clipboard.writeText(briefing);

    toast({
      title: "Briefing copiado",
      description: "Ya tienes el briefing listo para revisar o reutilizar.",
    });
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

    if (!projectUrl && !projectName) {
      toast({
        title: "Falta contexto",
        description: "Introduce al menos la URL o el nombre del proyecto.",
        variant: "destructive",
      });
      return;
    }

    if (!contentData.title || !contentData.description || !contentData.cta) {
      toast({
        title: "Faltan campos",
        description: "Completa título, descripción y CTA antes de generar.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsGenerating(true);

      const response = await fetch(`${API_URL}/api/video/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idea: `${projectName || "Proyecto digital"} - ${videoType} - ${style}`,
          titulo: contentData.title,
          descripcion: `
Proyecto: ${projectName || "No indicado"}
URL: ${projectUrl || "No indicada"}
Mensaje principal: ${contentData.description}
Tipo de vídeo: ${videoType}
Estilo: ${style}
Duración: ${duration}
Música: ${contentData.music}
Animación: ${contentData.animation}
          `.trim(),
          cta: contentData.cta,
          urlProyecto: projectUrl,
          nombreProyecto: projectName,
          tipoVideo: videoType,
          estilo: style,
          duracion: duration,
          musica: contentData.music,
          animacion: contentData.animation,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.videoId) {
        throw new Error(data?.error ? JSON.stringify(data.error) : "No se recibió videoId");
      }

      if (onVideoCreated) {
        onVideoCreated(data.videoId);
      }

      toast({
        title: "Vídeo lanzado",
        description: "La generación ha comenzado. Revisa la vista previa/estado.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error al generar vídeo",
        description: "No se pudo lanzar la generación. Revisa backend y modelo.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        Editor de contenido
      </h3>

      <p className="text-sm text-gray-600 mb-6">
        Genera vídeos promocionales para tus apps, webs y landings.
      </p>

      <form onSubmit={handleCopyBriefing} className="space-y-6">
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
            value={contentData.title}
            onChange={(e) => onContentChange({ title: e.target.value })}
            placeholder="Crea tu primer asistente IA sin ser técnico"
            maxLength={90}
          />
        </div>

        <div>
          <Label>Descripción</Label>
          <Textarea
            rows={4}
            value={contentData.description}
            onChange={(e) => onContentChange({ description: e.target.value })}
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
          <Select
            value={contentData.music}
            onValueChange={(value) => onContentChange({ music: value })}
          >
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
          <Select
            value={contentData.animation}
            onValueChange={(value) => onContentChange({ animation: value })}
          >
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
          <Label>CTA</Label>
          <Input
            value={contentData.cta}
            onChange={(e) => onContentChange({ cta: e.target.value })}
            placeholder="Entra ahora en app.abrochat.com"
            maxLength={120}
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

          <Button type="submit" variant="outline" className="w-full">
            <Copy className="h-4 w-4 mr-2" />
            Copiar briefing
          </Button>
        </div>
      </form>
    </div>
  );
}