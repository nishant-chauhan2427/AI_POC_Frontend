import { useEffect, useRef, useState } from "react";
import { Camera, X, CheckCircle, RotateCw } from "lucide-react";
import  {postForm} from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function AadhaarCapture() {
  const styles = {
    page: {
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      background: 'radial-gradient(1200px 600px at 10% 10%, rgba(99,102,241,0.18), transparent),\n                  radial-gradient(1200px 600px at 90% 20%, rgba(168,85,247,0.15), transparent),\n                  radial-gradient(1200px 600px at 10% 90%, rgba(59,130,246,0.12), transparent),\n                  #0b1020',
      color: '#fff',
      position: 'relative',
      zIndex: 1
    },
    logo: {
      position: 'absolute',
      top: 20,
      left: 20,
      zIndex: 10
    },
    card: {
      width: '100%',
      maxWidth: 540,
      background: 'rgba(255,255,255,0.08)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: 16,
      padding: 24,
      boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: 16
    },
    header: { marginBottom: 8 },
    title: { fontSize: 24, fontWeight: 800, marginBottom: 6 },
    subtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 14 },
    preview: {
      width: '100%',
      borderRadius: 12,
      maxHeight: 300,
      objectFit: 'cover',
      border: '1px solid rgba(99,102,241,0.3)',
      marginBottom: 12
    },
    buttonGroup: {
      display: 'flex',
      gap: 12,
      marginTop: 8
    },
    button: {
      flex: 1,
      padding: '12px 16px',
      fontWeight: 800,
      borderRadius: 10,
      color: '#fff',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #3b82f6)',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 10px 20px rgba(0,0,0,0.25)',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8
    },
    buttonSecondary: {
      background: 'rgba(255,255,255,0.1)',
      border: '1px solid rgba(255,255,255,0.25)'
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    loading: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: 12,
      borderRadius: 10,
      background: 'rgba(99,102,241,0.15)',
      color: 'rgba(255,255,255,0.85)'
    },
    spinner: {
      width: 16,
      height: 16,
      border: '2px solid rgba(255,255,255,0.25)',
      borderTop: '2px solid #fff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    extractedFields: {
      marginTop: 12,
      padding: 16,
      borderRadius: 10,
      background: 'rgba(34,197,94,0.1)',
      border: '1px solid rgba(34,197,94,0.3)'
    },
    fieldItem: {
      marginBottom: 10,
      padding: 8,
      background: 'rgba(0,0,0,0.2)',
      borderRadius: 8,
      fontSize: 13
    },
    fieldLabel: {
      color: 'rgba(255,255,255,0.65)',
      fontWeight: 600,
      marginBottom: 2
    },
    fieldValue: {
      color: '#fff',
      fontWeight: 700
    },
    error: {
      color: 'rgb(252,165,165)',
      background: 'rgba(239,68,68,0.12)',
      border: '1px solid rgba(248,113,113,0.35)',
      borderRadius: 10,
      padding: '8px 12px',
      marginTop: 0,
      fontSize: 13
    },
    successMessage: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 12px',
      borderRadius: 10,
      background: 'rgba(34,197,94,0.15)',
      border: '1px solid rgba(34,197,94,0.4)',
      color: 'rgb(134,239,172)',
      fontWeight: 600,
      fontSize: 13
    },
    startButton: {
      width: '100%',
      padding: '14px 16px',
      fontWeight: 800,
      borderRadius: 10,
      color: '#fff',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #3b82f6)',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 10px 20px rgba(0,0,0,0.25)',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      fontSize: 16
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 16
    },
    modalContent: {
      background: 'rgba(11,16,32,0.95)',
      borderRadius: 20,
      padding: 24,
      maxWidth: 600,
      width: '100%',
      border: '2px solid rgba(99,102,241,0.3)',
      boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 800
    },
    closeButton: {
      background: 'none',
      border: 'none',
      color: '#fff',
      cursor: 'pointer',
      padding: 0,
      display: 'flex',
      alignItems: 'center'
    },
    cameraContainer: {
      position: 'relative',
      borderRadius: 12,
      overflow: 'hidden',
      border: '2px solid rgba(99,102,241,0.5)',
      background: '#000',
      aspectRatio: '4/3',
      marginBottom: 16
    },
    video: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    },
    canvas: {
      display: 'none'
    },
    guidingBox: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '85%',
      height: '75%',
      border: '3px dashed rgba(99,102,241,0.8)',
      borderRadius: 12,
      pointerEvents: 'none',
      boxShadow: 'inset 0 0 20px rgba(99,102,241,0.2)',
      zIndex: 2
    },
    guidingBoxLabel: {
      position: 'absolute',
      top: '-25px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(99,102,241,0.9)',
      padding: '4px 12px',
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 700,
      whiteSpace: 'nowrap',
      color: '#fff'
    },
    darkenOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'radial-gradient(ellipse 85% 75% at 50% 50%, transparent 0%, rgba(0,0,0,0.5) 100%)',
      pointerEvents: 'none',
      zIndex: 1
    },
    captureButton: {
      width: '100%',
      padding: '14px 16px',
      fontWeight: 800,
      borderRadius: 10,
      color: '#fff',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #3b82f6)',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 10px 20px rgba(0,0,0,0.25)',
      fontSize: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8
    },
    modalButtonGroup: {
      display: 'flex',
      gap: 12,
      marginTop: 12
    }
  };

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [extractedData, setExtractedData] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
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
              facingMode: 'environment',
              width: { ideal: 1280 },
              height: { ideal: 960 }
            }
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
      const context = canvasRef.current.getContext('2d');
      const video = videoRef.current;

      canvasRef.current.width = video.videoWidth;
      canvasRef.current.height = video.videoHeight;
      
      context.drawImage(video, 0, 0);
      const imageData = canvasRef.current.toDataURL('image/jpeg');
      
      setCapturedImage(imageData);
      stopCamera();
      setShowModal(false);
    } catch (err) {
      setError("Failed to capture photo. Please try again.");
    }
  };
  const handleExtract = async () => {
    if (!capturedImage) {
      setError("Please capture an image first");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const candidate_id = localStorage.getItem("candidate_id")
      const candidate_name = localStorage.getItem("candidate_name")
      
      const blob = await (await fetch(capturedImage)).blob();
      const formData = new FormData();
      formData.append("file", blob, "aadhaar.jpg");
      formData.append("candidate_id", candidate_id);
      formData.append("candidate_name", candidate_name);

      const data = await postForm("/aadhaarcard/extract-aadhaar-text", formData);
      console.log(data,"data1234");

      setExtractedData(data.extracted_fields);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      navigate("/candidatephoto");
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
    const filtered = extractedData.filter(f => f.field === fieldName);
    if (filtered.length === 0) return null;
    return filtered.reduce((prev, current) => 
      (prev.confidence > current.confidence) ? prev : current
    );
  };

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <img 
        src="/PRAGYAN.AI-logo-dark.svg" 
        height={140} 
        width={280} 
        style={styles.logo}
        alt="PRAGYAN.AI Logo"
      />

      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}> Aadhaar Card Capture</h2>
          <p style={styles.subtitle}>Take a clear photo of your Aadhaar card for verification</p>
        </div>

        <canvas ref={canvasRef} style={styles.canvas}></canvas>

        {!capturedImage && (
          <button style={styles.startButton} onClick={startCamera}>
            <Camera size={20} />
            Start Camera
          </button>
        )}

        {capturedImage && (
          <div>
            <img src={capturedImage} alt="Captured" style={styles.preview} />
            {success && (
              <div style={styles.successMessage}>
                <CheckCircle size={18} />
                Data extracted successfully!
              </div>
            )}
            <div style={styles.buttonGroup}>
              <button
                style={styles.button}
                onClick={handleExtract}
                disabled={isLoading}
              >
                ✨ Save Picture
              </button>
              <button
                style={{...styles.button, ...styles.buttonSecondary}}
                onClick={handleRetake}
                disabled={isLoading}
              >
                <RotateCw size={18} />
                Retake
              </button>
            </div>
          </div>
        )}
        
        {error && <p style={styles.error}>{"Aadhaar card not verified"}</p>}

        {isLoading && (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <span>Uploading aadhaar card..</span>
          </div>
        )}

        {extractedData && extractedData.length > 0 && (
          <div style={styles.extractedFields}>
            <h3 style={{ marginTop: 0, marginBottom: 12, fontSize: 16, fontWeight: 800 }}>
              ✅ Extracted Information
            </h3>
            {getMostConfidentField('Aadhaar Number') && (
              <div style={styles.fieldItem}>
                <div style={styles.fieldLabel}>Aadhaar Number</div>
                <div style={styles.fieldValue}>
                  {getMostConfidentField('Aadhaar Number').extracted_aadhaar_no || 'Not found'}
                </div>
              </div>
            )}
            {getMostConfidentField('Name') && (
              <div style={styles.fieldItem}>
                <div style={styles.fieldLabel}>Full Name</div>
                <div style={styles.fieldValue}>
                  {getMostConfidentField('Name').extracted_name || 'Not found'}
                </div>
              </div>
            )}
            {getMostConfidentField('Date of Birth') && (
              <div style={styles.fieldItem}>
                <div style={styles.fieldLabel}>Date of Birth</div>
                <div style={styles.fieldValue}>
                  {getMostConfidentField('Date of Birth').extracted_dob || 'Not found'}
                </div>
              </div>
            )}
            <p style={{ marginTop: 12, marginBottom: 0, fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>
              Please verify the extracted information for accuracy.
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}> Adjust & Capture Aadhaar Image</h3>
              <button
                style={styles.closeButton}
                onClick={() => {
                  setShowModal(false);
                  stopCamera();
                }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={styles.cameraContainer}>
              <video
                ref={videoRef}
                style={styles.video}
                autoPlay
                playsInline
                muted
              />
              <div style={styles.darkenOverlay}></div>
              <div style={styles.guidingBox}>
                <div style={styles.guidingBoxLabel}>Place Aadhaar Card Here</div>
              </div>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>
              Position your Aadhaar card in the frame and click "Click Image"
            </p>

            <button
              style={styles.captureButton}
              onClick={capturePhoto}
            >
              <Camera size={20} />
              Click Image
            </button>

            <div style={styles.modalButtonGroup}>
              <button
                style={{...styles.button, ...styles.buttonSecondary}}
                onClick={() => {
                  setShowModal(false);
                  stopCamera();
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
