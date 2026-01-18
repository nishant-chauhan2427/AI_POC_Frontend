import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mic,
  Video,
  Volume2,
  CheckCircle2,
  XCircle,
  Monitor,
  AlertCircle,
} from "lucide-react";

interface Step4SystemCheckProps {
  onNext: (streams: { camera: MediaStream; screen: MediaStream }) => void;
}

type CheckStatus = "pending" | "checking" | "success" | "failed";

interface SystemCheck {
  id: "microphone" | "camera" | "audio" | "screen";
  label: string;
  icon: any;
  status: CheckStatus;
  errorMessage?: string;
}

export function Step4SystemCheck({ onNext }: Step4SystemCheckProps) {
  const [checks, setChecks] = useState<SystemCheck[]>([
    {
      id: "microphone",
      label: "Microphone Access",
      icon: Mic,
      status: "pending",
    },
    { id: "camera", label: "Camera Access", icon: Video, status: "pending" },
    { id: "audio", label: "Audio Output", icon: Volume2, status: "pending" },
    {
      id: "screen",
      label: "Screen Share (Entire Screen)",
      icon: Monitor,
      status: "pending",
    },
  ]);

  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [canProceed, setCanProceed] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  /* ---------------- UTIL ---------------- */

  const update = (
    id: SystemCheck["id"],
    status: CheckStatus,
    error?: string,
  ) => {
    setChecks((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status, errorMessage: error } : c,
      ),
    );
  };

  /* ---------------- CHECKS ---------------- */

  const checkMicrophone = async () => {
    update("microphone", "checking");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      update("microphone", "success");
    } catch {
      update("microphone", "failed", "Microphone permission denied");
    }
  };

  const checkCamera = async () => {
    update("camera", "checking");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 720 },
        audio: false,
      });

      setCameraStream(stream);
      update("camera", "success");
    } catch {
      update("camera", "failed", "Camera permission denied");
    }
  };

  const checkAudio = async () => {
    update("audio", "checking");
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const ok = devices.some((d) => d.kind === "audiooutput");
      ok
        ? update("audio", "success")
        : update("audio", "failed", "No audio output detected");
    } catch {
      update("audio", "failed", "Audio check failed");
    }
  };

  const checkScreen = async () => {
    update("screen", "checking");

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "monitor", cursor: "always" },
        audio: false,
      });

      setScreenStream(stream);
      setIsRecording(true);
      update("screen", "success");

      // 🔥 THIS IS THE KEY LINE
      requestAnimationFrame(() => {
        onNext({
          camera: cameraStream!,
          screen: stream,
        });
      });

      stream.getVideoTracks()[0].onended = () => {
        setIsRecording(false);
      };
    } catch {
      update("screen", "failed", 'Please select "Entire Screen"');
    }
  };

  /* ---------------- RUN CHECKS ---------------- */

  useEffect(() => {
    (async () => {
      await checkMicrophone();
      await checkCamera();
      await checkAudio();
      // await checkScreen();
    })();
  }, []);

  /* ---------------- VIDEO ATTACH ---------------- */

  useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraStream]);

  /* ---------------- PROCEED LOGIC ---------------- */

  useEffect(() => {
    const done = checks.every(
      (c) => c.status === "success" || c.status === "failed",
    );
    if (done) setCanProceed(true);
  }, [checks]);

  const handleContinue = () => {
    if (!cameraStream || !screenStream) return;

    onNext({
      camera: cameraStream,
      screen: screenStream,
    });
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {/* 🔴 RECORDING BORDER */}
      {isRecording && (
        <div className="fixed inset-0 border-[6px] border-red-500 pointer-events-none z-50" />
      )}

      <div className="max-w-2xl w-full glass-card rounded-3xl p-10">
        <h2 className="text-2xl text-center mb-8">System Check</h2>

        {/* CAMERA PREVIEW */}
        <div className="aspect-video rounded-xl overflow-hidden border mb-6">
          {cameraStream ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Waiting for camera…
            </div>
          )}
        </div>

        {/* CHECK LIST */}
        <div className="space-y-3 mb-6">
          {checks.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.id}
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  c.status === "failed"
                    ? "border-destructive/40 bg-destructive/5"
                    : "border-border bg-accent/20"
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon className="w-5 h-5" />
                  <span>{c.label}</span>
                </div>

                {c.status === "checking" && (
                  <motion.div
                    className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                )}
                {c.status === "success" && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
                {c.status === "failed" && (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            );
          })}
        </div>
        <motion.button
          onClick={checkScreen}
          disabled={checks.find((c) => c.id === "screen")?.status === "success"}
          className={`w-full py-4 rounded-xl font-medium ${
            checks.find((c) => c.id === "screen")?.status === "success"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground opacity-50"
          }`}
        >
          Start Screen Sharing & Continue to Interview
        </motion.button>

        {/* <motion.button
          onClick={handleContinue}
          disabled={!canProceed}
          className={`w-full py-4 rounded-xl font-medium ${
            canProceed
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground opacity-50"
          }`}
        >
          Continue to Interview
        </motion.button> */}
      </div>
    </div>
  );
}
