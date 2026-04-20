import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Clapperboard, Loader2, PlayCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface VideoPreviewProps {
  videoId?: string | null;
}

type VideoStatus = "idle" | "queued" | "processing" | "completed" | "failed";

export default function VideoPreview({ videoId }: VideoPreviewProps) {
  const [status, setStatus] = useState<VideoStatus>("idle");
  const [videoUrl, setVideoUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "";

  const isGenerating = useMemo(() => {
    return status === "queued" || status === "processing";
  }, [status]);

  useEffect(() => {
    if (!videoId) {
      setStatus("idle");
      setVideoUrl("");
      setErrorMessage("");
      return;
    }

    if (!API_URL) {
      setStatus("failed");
      setErrorMessage("Falta VITE_API_URL en el frontend.");
      return;
    }

    let cancelled = false;
    let timeoutId: number | undefined;

    const pollStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/api/video/${videoId}/status`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "No se pudo consultar el estado del vídeo.");
        }

        if (cancelled) return;

        const nextStatus = (data?.status || "processing") as VideoStatus;
        setStatus(nextStatus);

        if (nextStatus === "completed") {
          setVideoUrl(`${API_URL}/api/video/${videoId}/content`);
          return;
        }

        if (nextStatus === "failed") {
          setErrorMessage("La generación del vídeo ha fallado.");
          return;
        }

        timeoutId = window.setTimeout(() => {
          if (!cancelled) {
            void pollStatus();
          }
        }, 4000);
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setStatus("failed");
          setErrorMessage("Error consultando el estado del vídeo.");
        }
      }
    };

    setStatus("queued");
    setVideoUrl("");
    setErrorMessage("");
    void pollStatus();

    return () => {
      cancelled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [videoId, API_URL]);

  if (!videoId) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Vista previa de vídeo
        </h3>

        <Card className="bg-slate-950 rounded-xl aspect-[9/16] flex items-center justify-center">
          <div className="text-center p-6">
            <Clapperboard className="h-10 w-10 text-white/70 mx-auto mb-4" />
            <p className="text-white text-lg font-semibold mb-2">
              Sin vídeo generado aún
            </p>
            <p className="text-white/70 text-sm max-w-xs mx-auto">
              Completa el editor y pulsa <strong>Generar vídeo real</strong>.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Vista previa de vídeo
        </h3>

        <Card className="bg-slate-950 rounded-xl aspect-[9/16] flex items-center justify-center">
          <div className="text-center p-6">
            <Loader2 className="h-10 w-10 text-cyan-400 animate-spin mx-auto mb-4" />
            <p className="text-white text-lg font-semibold mb-2">
              Generando vídeo...
            </p>
            <p className="text-white/70 text-sm max-w-xs mx-auto">
              Estado actual: {status}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Vista previa de vídeo
        </h3>

        <Card className="bg-slate-950 rounded-xl aspect-[9/16] flex items-center justify-center">
          <div className="text-center p-6">
            <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-4" />
            <p className="text-white text-lg font-semibold mb-2">
              Error al generar
            </p>
            <p className="text-white/70 text-sm max-w-xs mx-auto">
              {errorMessage || "No se pudo completar la generación."}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-6">
        Vídeo generado
      </h3>

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

      <p className="text-center text-gray-500 text-sm mt-4">
        Ya puedes revisarlo y reutilizarlo para redes.
      </p>
    </div>
  );
}