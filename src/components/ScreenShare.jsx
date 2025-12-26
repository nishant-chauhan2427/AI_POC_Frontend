import {
  useState,
  useRef,
  useEffect,
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
    stopRecordingAsync,
  } = useScreenRecording();

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const chunksRef = useRef([]); // ✅ Use ref to store chunks immediately

  // ✅ Keep ref in sync with state
  useEffect(() => {
    chunksRef.current = recordedChunks;
    console.log("📝 Chunks updated in ref:", recordedChunks.length);
  }, [recordedChunks]);

  // ✅ Upload function
  const uploadRecording = useCallback(async (chunksToUpload) => {
    const chunks = chunksToUpload || chunksRef.current;
    
    console.log("🎥 uploadRecording called with", chunks.length, "chunks");
    
    if (!chunks || chunks.length === 0) {
      console.warn("❌ No chunks to upload");
      return { success: false, message: "No recording data" };
    }

    setIsUploading(true);
    setError("");

    try {
      console.log("🎥 Starting screen recording upload with", chunks.length, "chunks");
      const blob = new Blob(chunks, {
        type: "video/webm;codecs=vp9,opus",
      });

      console.log("📦 Blob size:", blob.size, "bytes");

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

      console.log("📤 Uploading to:", `${API_BASE}/frames/upload_screen_recording`);
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

      const result = await response.json().catch(() => ({ success: true }));
      console.log("✅ Screen recording uploaded successfully:", result);
      
      clearRecordedChunks();
      chunksRef.current = [];
      return result;
    } catch (err) {
      const msg =
        err.name === "AbortError"
          ? "Upload timed out. Please try again."
          : err.message || "Failed to upload recording";
      console.error("❌ Upload error:", msg);
      setError(msg);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [candidateId, clearRecordedChunks]);

  // ✅ Expose function to parent - AUTOMATIC UPLOAD ON FINISH TEST
  useImperativeHandle(ref, () => ({
    stopAndUpload: async () => {
      console.log("🛑 stopAndUpload called");
      console.log("isRecording:", isRecording);
      console.log("chunksRef.current.length:", chunksRef.current.length);
      
      // Stop recording if still recording
      if (isRecording) {
        console.log("⏹️ Stopping recording...");
        stopRecording();
        onRecordingStop?.();
        
        // Wait for MediaRecorder to finish and populate chunks
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log("✓ Recording stopped, chunksRef.current.length:", chunksRef.current.length);
      }

      // Upload the chunks automatically
      if (chunksRef.current.length > 0) {
        console.log("📤 Starting automatic upload with", chunksRef.current.length, "chunks");
        try {
          const result = await uploadRecording(chunksRef.current);
          console.log("✅ Automatic upload completed:", result);
          return result;
        } catch (uploadErr) {
          console.error("❌ Upload error in stopAndUpload:", uploadErr);
          throw uploadErr;
        }
      } else {
        console.log("⚠️ No chunks to upload");
        return { success: true, message: "No recording to upload" };
      }
    },
  }));

  const handleToggleRecording = () => {
    console.log("handleToggleRecording called, isRecording:", isRecording);
    
    if (isRecording) {
      console.log("🛑 Stopping recording from button click");
      stopRecording();
      onRecordingStop?.();
    } else {
      console.log("▶️ Starting recording from button click");
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