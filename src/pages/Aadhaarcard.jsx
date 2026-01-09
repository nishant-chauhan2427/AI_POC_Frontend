import { useEffect, useRef, useState } from "react";
import { Camera, X, CheckCircle, RotateCw } from "lucide-react";
import { postForm } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

import SparklesBackground from "../components/BackGround";
export default function AadhaarCapture() {
  const [searchParams] = useSearchParams();
  const sessionid = searchParams.get("session_id");

  console.log("Session ID from URL:", sessionid);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [extractedData, setExtractedData] = useState(null);
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(5);
  const detectionIntervalRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const stableFrameCountRef = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    }

    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    stableFrameCountRef.current = 0;
    setTimer(5);
  };

  const startCamera = async () => {
    try {
      setError("");
      setShowModal(true);

      setTimer(5);
      // startTimer();
      setTimeout(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: 1280, height: 960 },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          startAutoDetect();
        }
      }, 100);
    } catch {
      setError("Unable to access camera.");
    }
  };

  const startTimer = () => {
    setTimer(5);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    timerIntervalRef.current = setInterval(() => {
      setTimer((prev) => {
        const newTimer = prev - 1;
        if (newTimer <= 1) {
          clearInterval(timerIntervalRef.current);

          setTimeout(() => {
            capturePhoto();
          }, (prev - 1) * 1000);
        }
        return newTimer;
      });
    }, 1000);
  };

  const startAutoDetect = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    detectionIntervalRef.current = setInterval(() => {
      const video = videoRef.current;
      if (!video.videoWidth) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0);

      const boxWidth = video.videoWidth * 0.7;
      const boxHeight = video.videoHeight * 0.55;
      const boxX = (video.videoWidth - boxWidth) / 2;
      const boxY = (video.videoHeight - boxHeight) / 2;

      const imageData = ctx.getImageData(boxX, boxY, boxWidth, boxHeight);
      const pixels = imageData.data;

      let brightness = 0;
      let edgeCount = 0;

      for (let i = 0; i < pixels.length; i += 4) {
        const gray = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
        brightness += gray;

        if (i > 4 && Math.abs(gray - pixels[i - 4]) > 25) {
          edgeCount++;
        }
      }

      brightness /= pixels.length / 4;

      const looksLikeDocument =
        brightness > 80 && brightness < 220 && edgeCount > 1200;

      if (looksLikeDocument) {
        stableFrameCountRef.current++;

        // Start timer only on first detection
        if (stableFrameCountRef.current === 1) {
          startTimer();
        }
      } else {
        stableFrameCountRef.current = 0;
        setTimer(5);
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
      }
    }, 500);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const image = canvas.toDataURL("image/jpeg");
    setCapturedImage(image);
    stopCamera();
    setShowModal(false);
  };

  const handleExtract = async () => {
    if (!capturedImage) {
      setError("Please capture an image first");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const candidate_id = localStorage.getItem("candidate_id");
      const candidate_name = localStorage.getItem("candidate_name");

      const blob = await (await fetch(capturedImage)).blob();
      const formData = new FormData();
      formData.append("file", blob, "aadhaar.jpg");
      formData.append("candidate_id", candidate_id);
      formData.append("candidate_name", candidate_name);

      const data = await postForm(
        "/aadhaarcard/extract-aadhaar-text/",
        formData
      );
      console.log(data, "data1234");

      setExtractedData(data.extracted_fields);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      // id=localStorage.getItem("session_id");
      localStorage.setItem("isaadhaarcard", "true");
      console.log(localStorage.getItem("session_id"), "session_id data");
      navigate(
        `/candidatephoto?session_id=${localStorage.getItem("session_id")}`
      );
      // navigate("/candidatephoto");
    } catch (err) {
      setError(err.message || "Failed to extract data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetake = async () => {
    setCapturedImage(null);
    await startCamera();
  };

  const getMostConfidentField = (fieldName) => {
    if (!extractedData) return null;
    const filtered = extractedData.filter((f) => f.field === fieldName);
    if (filtered.length === 0) return null;
    return filtered.reduce((prev, current) =>
      prev.confidence > current.confidence ? prev : current
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] flex flex-col items-center justify-center relative overflow-hidden px-4">
      <SparklesBackground />
      <img
        src="/PRAGYAN.AI-logo-dark.svg"
        height={140}
        width={280}
        alt="PRAGYAN.AI Logo"
        className="mb-4"
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20 p-6 shadow-xl">
        <div className="text-center mb-5">
          <h2 className="text-xl font-semibold text-white">
            Aadhaar Card Capture
          </h2>
          <p className=" text-yellow-400 mt-1">
            Take a clear photo of your Aadhaar card for verification
          </p>
        </div>

        {!capturedImage && (
          <canvas
            ref={canvasRef}
            className="w-full h-1 opacity-0 rounded-lg bg-black/40 border border-white/10 mb-4"
          />
        )}

        {!capturedImage && (
          <button
            onClick={startCamera}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg
              gradient-primary
               text-white font-medium  hover:shadow-lg transition cursor-pointer"
          >
            <Camera size={18} />
            Start Camera
          </button>
        )}

        {capturedImage && (
          <div>
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full rounded-lg border border-white/10 mb-3"
            />
            {success && (
              <div className="flex items-center gap-2 text-green-400 text-sm mb-3">
                <CheckCircle size={16} />
                Data extracted successfully!
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleExtract}
                disabled={isLoading}
                className="flex-1 py-2 rounded-lg gradient-primary cursor-pointer text-white font-medium
               "
              >
                ✨ Save Picture
              </button>

              <button
                onClick={handleRetake}
                disabled={isLoading}
                className="flex-1 py-2 cursor-pointer rounded-lg border border-white/20 text-white
               hover:bg-white/10 transition disabled:opacity-50"
              >
                <RotateCw size={16} className="inline mr-1" />
                Retake
              </button>
            </div>
          </div>
        )}

        {error && (
          <p className="text-red-400 text-sm text-center mt-3">
            Aadhaar card not verified
          </p>
        )}

        {isLoading && (
          <div className="flex items-center justify-center gap-2 mt-4 text-gray-300 text-sm">
            <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Uploading Aadhaar card...
          </div>
        )}

        {extractedData?.length > 0 && (
          <div className="mt-5 bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-sm font-bold text-white mb-3">
              ✅ Extracted Information
            </h3>

            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-400">Aadhaar Number</p>
                <p className="text-white">
                  {getMostConfidentField("Aadhaar Number")
                    ?.extracted_aadhaar_no || "Not found"}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Full Name</p>
                <p className="text-white">
                  {getMostConfidentField("Name")?.extracted_name || "Not found"}
                </p>
              </div>

              <div>
                <p className="text-gray-400">Date of Birth</p>
                <p className="text-white">
                  {getMostConfidentField("Date of Birth")?.extracted_dob ||
                    "Not found"}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-3">
              Please verify the extracted information for accuracy.
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed flex items-center justify-center z-50 px-4">
          <div className="md:w-[550px] w-full  bg-[#0B0F1A] rounded-2xl border border-white/20 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold text-xl">
                Adjust & Capture Aadhaar Image
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  stopCamera();
                }}
                className="text-white cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-white/10">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-96 object-cover scale-x-[-1]"
              />

              <div className="absolute inset-0 bg-black/30"></div>

              <div className="absolute inset-8 border-2 border-dashed border-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-yellow-400  font-semibold">
                  Place Aadhaar Card Here
                </span>
              </div>

              <div className="absolute top-3 right-3 font-bold bg-black/60 px-2 py-1 rounded text-yellow-400 text-sm">
                {timer}s
              </div>
            </div>

            <p className="text-white text-sm text-center mt-4">
              Position your Aadhaar card in the frame. Auto-capture in {timer}{" "}
              seconds
            </p>

            <button
              onClick={() => {
                setShowModal(false);
                stopCamera();
              }}
              className="mt-4 w-full py-2 rounded-lg  text-white bg-gradient-to-r from-[#7B56FF] via-[#AB47BC] to-[#FF4081] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
