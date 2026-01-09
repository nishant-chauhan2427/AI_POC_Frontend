import { useEffect, useRef, useState } from "react";
import { Camera, X, CheckCircle, RotateCw } from "lucide-react";
import { postForm } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import SparklesBackground from "../components/BackGround";
export default function CandidatePhotoCapture() {
  const styles = {
    page: {
      minHeight: "100vh",
      width: "100vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      background:
        "radial-gradient(1200px 600px at 10% 10%, rgba(99,102,241,0.18), transparent),\n                  radial-gradient(1200px 600px at 90% 20%, rgba(168,85,247,0.15), transparent),\n                  radial-gradient(1200px 600px at 10% 90%, rgba(59,130,246,0.12), transparent),\n                  #0b1020",
      color: "#fff",
      position: "relative",
      zIndex: 1,
    },
    logo: {
      position: "absolute",
      top: 20,
      left: 20,
      zIndex: 10,
    },
    card: {
      width: "100%",
      maxWidth: 540,
      background: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      borderRadius: 16,
      padding: 24,
      boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      gap: 16,
    },
    header: { marginBottom: 8 },
    title: { fontSize: 24, fontWeight: 800, marginBottom: 6 },
    subtitle: { color: "rgba(255,255,255,0.85)", fontSize: 14 },
    preview: {
      width: 260,
      height: 260,
      borderRadius: "50%",
      objectFit: "cover",
      border: "3px solid rgba(99,102,241,0.8)",
      marginBottom: 12,
      backgroundColor: "#0b1020",
      display: "block",
      margin: "0 auto 12px auto",
    },
    buttonGroup: {
      display: "flex",
      gap: 12,
      marginTop: 8,
    },
    button: {
      flex: 1,
      padding: "12px 16px",
      fontWeight: 800,
      borderRadius: 10,
      color: "#fff",

      border: "none",
      cursor: "pointer",
      boxShadow: "0 10px 20px rgba(0,0,0,0.25)",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    buttonSecondary: {
      background: "rgba(255,255,255,0.1)",
      border: "1px solid rgba(255,255,255,0.25)",
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: "not-allowed",
    },
    loading: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: 12,
      borderRadius: 10,
      background: "rgba(99,102,241,0.15)",
      color: "rgba(255,255,255,0.85)",
    },
    spinner: {
      width: 16,
      height: 16,
      border: "2px solid rgba(255,255,255,0.25)",
      borderTop: "2px solid #fff",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    successMessage: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 12px",
      borderRadius: 10,
      background: "rgba(34,197,94,0.15)",
      border: "1px solid rgba(34,197,94,0.4)",
      color: "rgb(134,239,172)",
      fontWeight: 600,
      fontSize: 13,
    },
    startButton: {
      width: "100%",
      padding: "14px 16px",
      fontWeight: 800,
      borderRadius: 10,
      color: "#fff",

      border: "none",
      cursor: "pointer",
      boxShadow: "0 10px 20px rgba(0,0,0,0.25)",
      transition: "all 0.3s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      fontSize: 16,
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: 16,
    },
    modalContent: {
      background: "rgba(11,16,32,0.95)",
      borderRadius: 20,
      padding: 24,
      maxWidth: 600,
      width: "100%",
      border: "2px solid rgba(99,102,241,0.3)",
      boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
      maxHeight: "90vh",
      overflowY: "auto",
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 800,
    },
    closeButton: {
      background: "none",
      border: "none",
      color: "#fff",
      cursor: "pointer",
      padding: 0,
      display: "flex",
      alignItems: "center",
    },
    cameraContainer: {
      position: "relative",
      borderRadius: 12,
      overflow: "hidden",
      border: "2px solid rgba(99,102,241,0.5)",
      background: "#000",
      aspectRatio: "4/3",
      marginBottom: 16,
    },
    video: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    },
    canvas: {
      display: "none",
    },
    guidingCircle: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "50%",
      height: "80%",
      border: "3px dashed rgba(99,102,241,0.8)",
      borderRadius: "50%",
      pointerEvents: "none",
      boxShadow: "inset 0 0 20px rgba(99,102,241,0.2)",
      zIndex: 2,
    },
    guidingLabel: {
      position: "absolute",
      top: "10px",
      left: "50%",
      transform: "translateX(-50%)",
      background: "rgba(99,102,241,0.9)",
      padding: "4px 12px",
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 700,
      whiteSpace: "nowrap",
      color: "#fff",
    },
    darkenOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background:
        "radial-gradient(circle 35% at 50% 50%, transparent 0%, rgba(0,0,0,0.6) 100%)",
      pointerEvents: "none",
      zIndex: 1,
    },
    captureButton: {
      width: "100%",
      padding: "14px 16px",
      fontWeight: 800,
      borderRadius: 10,
      color: "#fff",

      border: "none",
      cursor: "pointer",
      boxShadow: "0 10px 20px rgba(0,0,0,0.25)",
      fontSize: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    modalButtonGroup: {
      display: "flex",
      gap: 12,
      marginTop: 12,
    },
    infoBox: {
      background: "rgba(99,102,241,0.1)",
      border: "1px solid rgba(99,102,241,0.3)",
      borderRadius: 10,
      padding: 12,
      marginTop: 12,
      fontSize: 12,
      color: "rgba(255,255,255,0.75)",
      lineHeight: 1.6,
    },
  };
  const [searchParams] = useSearchParams();
  const session_id = searchParams.get("session_id");
  console.log("Session ID from URL:", session_id);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const isAadhaarVerified = localStorage.getItem("isaadhaarcard"); // returns string or null [web:33]
    console.log(isAadhaarVerified, "isAadhaarVerified");
    if (isAadhaarVerified !== "true") {
      // not verified, redirect to Aadhaar capture
      navigate(`/aadhaar?session_id=${session_id}`);
      return;
    }

    return () => {
      stopCamera();
    };
  }, [navigate, session_id]);

  // useEffect(() => {
  //   return () => {
  //     stopCamera();
  //   };
  // }, []);

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const startCamera = async () => {
    try {
      setError("");
      setShowModal(true);

      setTimeout(async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "user",
              width: { ideal: 1280 },
              height: { ideal: 960 },
            },
          });

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          setError("Unable to access camera. Please check permissions.");
        }
      }, 100);
    } catch (err) {
      setError("Unable to access camera. Please check permissions.");
      setShowModal(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      const video = videoRef.current;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Set canvas to square (based on the guiding circle dimensions)
      const size = Math.min(videoWidth, videoHeight);

      // Calculate the center crop position
      const startX = (videoWidth - size) / 2;
      const startY = (videoHeight - size) / 2;

      // Create a temporary canvas for the circular image with transparency
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = size;
      tempCanvas.height = size;
      const tempContext = tempCanvas.getContext("2d", {
        willReadFrequently: true,
      });

      // Draw video frame
      tempContext.drawImage(
        video,
        startX,
        startY,
        size,
        size,
        0,
        0,
        size,
        size
      );

      // Create circular clipping and apply it
      const radius = size / 2;
      tempContext.save();
      tempContext.globalCompositeOperation = "destination-in";
      tempContext.beginPath();
      tempContext.arc(radius, radius, radius, 0, Math.PI * 2);
      tempContext.fill();
      tempContext.restore();

      // Create a new canvas with only the circular portion (cropped to circle bounds)
      const circleSize = Math.round(size * 0.95);
      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = circleSize;
      finalCanvas.height = circleSize;
      const finalContext = finalCanvas.getContext("2d");

      const offset = (size - circleSize) / 2;
      finalContext.drawImage(
        tempCanvas,
        offset,
        offset,
        circleSize,
        circleSize,
        0,
        0,
        circleSize,
        circleSize
      );

      // Convert to PNG to preserve transparency, but we'll convert to JPEG in handleSubmit with white background
      const imageData = finalCanvas.toDataURL("image/png");

      setCapturedImage(imageData);
      stopCamera();
      setShowModal(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to capture photo. Please try again.");
    }
  };

  const handleRetake = async () => {
    setCapturedImage(null);
    setError("");
    await startCamera();
  };

  const handleSubmit = async () => {
    if (!capturedImage) {
      setError("Please capture an image first");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const candidate_id = localStorage.getItem("candidate_id");
      const candidate_name = localStorage.getItem("candidate_name");

      // Convert PNG with transparency to circular JPEG
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        // Draw white background
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, img.width, img.height);

        // Draw the circular image on top
        ctx.drawImage(img, 0, 0);

        // Convert to blob and upload
        canvas.toBlob(
          async (blob) => {
            const formData = new FormData();
            formData.append("file", blob, "photo.jpg");
            formData.append("candidate_id", candidate_id);
            console.log(formData, "formDataformData");

            try {
              const data = await postForm(
                "/aadhaarcard/upload-candidate-image/",
                formData
              );
              setSuccess(true);
              setTimeout(() => setSuccess(false), 3000);
              localStorage.setItem("iscandidatephoto", "true");
              navigate(
                `/proctoring?session_id=${localStorage.getItem("session_id")}`
              );
              // navigate("/proctoring");
            } catch (err) {
              setError(
                err.message || "Failed to upload photo. Please try again."
              );
              setIsLoading(false);
            }
          },
          "image/jpeg",
          0.95
        );
      };
      img.src = capturedImage;
    } catch (err) {
      setError(err.message || "Failed to click photo. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="
   min-h-screen bg-[#0B0F1A] flex flex-col items-center justify-center relative overflow-hidden px-4"
    >
      <SparklesBackground />
      <img
        src="/PRAGYAN.AI-logo-dark.svg"
        height={140}
        width={280}
        alt="PRAGYAN.AI Logo"
        className="mb-4"
      />

      <div
        className="
    w-full max-w-[540px]
    bg-white/10   
    rounded-2xl p-6
     
    flex flex-col gap-4
  "
      >
        <div className="mb-2">
          <h2 className="text-2xl font-extrabold mb-1 text-white">
            Candidate Photo
          </h2>
          <p className="text-sm text-white/85">
            Capture a clear frontal photo for candidate verification
          </p>
        </div>

        <canvas ref={canvasRef} style={styles.canvas}></canvas>

        {!capturedImage && (
          <button
            style={styles.startButton}
            onClick={startCamera}
            className="gradient-primary"
          >
            <Camera size={20} />
            Capture Photo
          </button>
        )}

        {capturedImage && (
          <div>
            <img
              src={capturedImage}
              alt="Captured"
              className="
    w-[260px] h-[260px]
    rounded-full object-cover
    border-[3px] border-indigo-500
    bg-[#0b1020]
    mx-auto mb-3
  "
            />
            {success && (
              <div style={styles.successMessage}>
                <CheckCircle size={18} />
                Photo captured successfully!
              </div>
            )}
            <div style={styles.buttonGroup}>
              <button
                style={styles.button}
                onClick={handleSubmit}
                disabled={isLoading}
                className="gradient-primary"
              >
                {isLoading ? "⏳ Uploading..." : "✓ Confirm Photo"}
              </button>
              <button
                style={{ ...styles.button, ...styles.buttonSecondary }}
                onClick={handleRetake}
                disabled={isLoading}
              >
                <RotateCw size={18} />
                Retake
              </button>
            </div>
          </div>
        )}

        {error && (
          <div
            style={{
              color: "rgb(252,165,165)",
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(248,113,113,0.35)",
              borderRadius: 10,
              padding: "8px 12px",
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {isLoading && (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <span>Uploading photo...</span>
          </div>
        )}

        <div
          className="
    mt-4 rounded-xl
    bg-indigo-500/10
    border border-indigo-500/30
    p-4
    text-white/80
  "
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-indigo-400 text-sm font-semibold">
              Requirements
            </span>
          </div>

          <ul className="space-y-1 text-sm">
            {[
              "Clear frontal face photo",
              "Good lighting and no shadows",
              "Face should occupy at least 70% of the frame",
              "Neutral background preferred",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">✔</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[1000] bg-black/70 flex items-center justify-center p-4">
          {/* Modal Content */}
          <div
            className="
      w-full max-w-[600px]
      bg-white/10
      
      rounded-2xl p-6
      shadow-[0_25px_50px_rgba(0,0,0,0.5)]
      max-h-[90vh] overflow-y-auto
    "
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-extrabold text-white">
                Position Your Face
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  stopCamera();
                }}
                className="text-white/80 hover:text-white transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Camera Container */}
            <div
              className="
        relative aspect-[4/3]
        rounded-xl overflow-hidden
        border-2 border-indigo-500/50
        bg-black mb-4
      "
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />

              {/* Dark overlay */}
              <div
                className="
          absolute inset-0 z-10 pointer-events-none
           
        "
              />

              {/* Guiding Circle */}
              <div
                className="
          absolute top-1/2 left-1/2
          -translate-x-1/2 -translate-y-1/2
          w-1/2 h-[80%]
          rounded-full
          border-[3px] border-dashed border-yellow-600
           
          pointer-events-none z-20
        "
              >
                <div
                  className="
            absolute top-2 left-1/2 -translate-x-1/2
            bg-yellow-400
            px-3 py-1
            rounded-md
            text-xs font-bold text-white
            whitespace-nowrap
          "
                >
                  Position face here
                </div>
              </div>
            </div>

            {/* Instruction Text */}
            <p className="text-white/75 text-sm text-center mb-3">
              Look directly at the camera and click{" "}
              <span className="font-semibold">Capture Photo</span>
            </p>

            {/* Capture Button */}
            <button
              onClick={capturePhoto}
              className="
        w-full flex items-center justify-center gap-2
        px-4 py-3 rounded-sm
        font-extrabold text-white
        gradient-primary
        shadow-lg
        transition-all duration-300
        cursor-pointer
        active:scale-[0.97]
      "
            >
              <Camera size={20} />
              Capture Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
