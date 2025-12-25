// import { useEffect, useState, useRef, useCallback } from "react";
import useScreenRecording from "../hooks/useScreenRecording";
// const API_BASE=import.meta.env.VITE_API_BASE_URL
import {
  useState,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle
} from "react";
import useScreenRecording from "../hooks/useScreenRecording";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const ScreenShare = forwardRef(function ScreenShare(
  { candidateId, onRecordingStart, onRecordingStop },
  ref
) {
  const styles = {
    card: {
      background: "rgba(255,255,255,0.10)",
      borderRadius: 12,
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      color: "#fff",
      overflow: "hidden",
    },
    error: {
      color: "rgb(252,165,165)",
      background: "rgba(239,68,68,0.12)",
      border: "1px solid rgba(248,113,113,0.35)",
      borderRadius: 10,
      padding: "8px 12px",
      marginBottom: 12,
    },
    button: (recording) => ({
      width: "100%",
      padding: "10px 14px",
      fontWeight: 800,
      borderRadius: 10,
      color: "#fff",
      border: "none",
      cursor: "pointer",
      boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
      background: recording
        ? "linear-gradient(135deg, #ef4444, #dc2626)"
        : "linear-gradient(135deg, #3b82f6, #2563eb)",
    }),
    uploading: {
      color: "rgba(255,255,255,0.85)",
      textAlign: "center",
      marginTop: 10,
    },
  };

  const {
    isRecording,
    recordedChunks,
    error: recordingError,
    startRecording,
    stopRecording,
    clearRecordedChunks,
  } = useScreenRecording();

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadRecording = useCallback(async () => {
    if (recordedChunks.length === 0) return;

    setIsUploading(true);
    setError("");

    try {
      const blob = new Blob(recordedChunks, {
        type: "video/webm;codecs=vp9,opus",
      });

      const formData = new FormData();
      formData.append("candidate_id", candidateId);

      const filename = `recording-${candidateId}-${Date.now()}.webm`;
      formData.append(
        "recording",
        new File([blob], filename, {
          type: "video/webm;codecs=vp9,opus",
        })
      );

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000);

      const response = await fetch(
        `${API_BASE}/frames/upload_screen_recording`,
        {
          method: "POST",
          body: formData,
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || "Upload failed");
      }

      clearRecordedChunks();
      return await response.json().catch(() => ({ success: true }));
    } catch (err) {
      const msg =
        err.name === "AbortError"
          ? "Upload timed out. Please try again."
          : err.message || "Failed to upload recording";
      setError(msg);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [candidateId, recordedChunks, clearRecordedChunks]);

  // 🔑 Expose function to parent (Finish Test)
  useImperativeHandle(ref, () => ({
    stopAndUpload: async () => {
      if (isRecording) {
        stopRecording();
        onRecordingStop?.();
      }
      await uploadRecording();
    },
  }));

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
      onRecordingStop?.();
    } else {
      startRecording();
      onRecordingStart?.();
    }
  };

  return (
    <div style={styles.card}>
      {(error || recordingError) && (
        <div style={styles.error}>{error || recordingError}</div>
      )}

      <button
        onClick={handleToggleRecording}
        disabled={isUploading}
        style={styles.button(isRecording)}
      >
        {isRecording ? "Stop Recording" : "Start Screen & Audio Recording"}
      </button>

      {isUploading && (
        <p style={styles.uploading}>Uploading recording…</p>
      )}
    </div>
  );
});

export default ScreenShare;

// export default function ScreenShare({ candidateId, onRecordingStart, onRecordingStop }) {
//   const styles = {
//     card: { background: 'rgba(255,255,255,0.10)', borderRadius: 12, padding: '24px 24px 24px', display: 'flex', flexDirection: 'column', color: '#fff', overflow: 'hidden' },
//     title: { fontSize: 18, fontWeight: 700 },
//     preview: { width: '100%', height: 176, background: 'rgba(0,0,0,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' },
//     hint: { color: 'rgba(255,255,255,0.7)' },
//     error: { color: 'rgb(252,165,165)', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(248,113,113,0.35)', borderRadius: 10, padding: '8px 12px' },
//     button: (recording) => ({ width: '100%', padding: '10px 14px', fontWeight: 800, borderRadius: 10, color: '#fff', border: 'none', cursor: 'pointer', boxShadow: '0 8px 18px rgba(0,0,0,0.25)', background: recording ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #3b82f6, #2563eb)', fontFamily: "Inter, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif" }),
//     uploading: { color: 'rgba(255,255,255,0.85)', textAlign: 'center' }
//   };
  
//   const { 
//     isRecording, 
//     recordedChunks, 
//     error: recordingError, 
//     startRecording, 
//     stopRecording,
//     clearRecordedChunks 
//   } = useScreenRecording();
  
//   const [isUploading, setIsUploading] = useState(false);

//   const [error, setError] = useState('');
//   const videoRef = useRef(null);

//   useEffect(() => {
//     if (recordedChunks.length > 0) {
//       uploadRecording().catch(() => {});
//     }
//   }, [recordedChunks]);

//   async function handleToggleRecording() {
//     if (isRecording) {
//       stopRecording();
//       onRecordingStop?.();
//     } else {
//       startRecording();
//       onRecordingStart?.();
//     }
//   }

//   const uploadRecording = useCallback(async () => {
//     if (recordedChunks.length === 0) {
//       setError('No recording data to upload');
//       return;
//     }

//     setIsUploading(true);
//     setError(null);
    
//     try {
//       const blob = new Blob(recordedChunks, { 
//         type: 'video/webm;codecs=vp9,opus' 
//       });
      
//       const formData = new FormData();
//       formData.append('candidate_id', candidateId);
      
//       const filename = `recording-${candidateId}-${Date.now()}.webm`;
//       formData.append('recording', new File([blob], filename, { 
//         type: 'video/webm;codecs=vp9,opus' 
//       }));

//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 90000);
      
//       const response = await fetch(`${API_BASE}/frames/upload_screen_recording`, {
//         method: 'POST',
//         body: formData,
//         signal: controller.signal,
//       });
      
//       clearTimeout(timeoutId);
      
//       if (!response.ok) {
//         const error = await response.json().catch(() => ({}));
//         throw new Error(error.detail || 'Upload failed');
//       }
      
//       clearRecordedChunks();
      
//       try {
//         return await response.json();
//       } catch (e) {
//         console.error('Failed to parse JSON response:', e);
//         return { success: true };
//       }
      
//     } catch (err) {
//       const errorMessage = err.name === 'AbortError' 
//         ? 'Upload timed out. Please try again.'
//         : err.message || 'Failed to upload recording';
      
//       setError(errorMessage);
//       throw err;
//     } finally {
//       setIsUploading(false);
//     }
//   }, [candidateId, recordedChunks, clearRecordedChunks]);

//   return (
//     <div style={styles.card}>
//       {(error || recordingError) && (
//         <div style={styles.error}>
//           {error || recordingError}
//         </div>
//       )}
//       <button 
//         onClick={handleToggleRecording} 
//         disabled={isUploading}
//         style={styles.button(isRecording)}>
//         {isRecording ? "Stop Recording" : "Start Screen & Audio Recording"}
//       </button>
//       {isUploading && <p style={styles.uploading}>Uploading recording...</p>}
//     </div>
//   );
// }
