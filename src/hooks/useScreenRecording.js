import { useRef, useState, useCallback } from "react";

export default function useScreenRecording() {
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [error, setError] = useState(null);

  const startRecording = async () => {
    try {
      setError(null);

      // Get screen capture with system audio
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: 'screen',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });

      // Get microphone audio
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
        video: false
      });

      // Create audio context to merge audio streams
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Create destination for combined audio
      const audioDestination = audioContext.createMediaStreamDestination();

      // Add screen audio if available
      const screenAudioTracks = screenStream.getAudioTracks();
      if (screenAudioTracks.length > 0) {
        const screenSource = audioContext.createMediaStreamSource(
          new MediaStream(screenAudioTracks)
        );
        const screenGain = audioContext.createGain();
        screenGain.gain.value = 0.8; // Adjust screen audio volume
        screenSource.connect(screenGain).connect(audioDestination);
      }

      // Add microphone audio
      const micSource = audioContext.createMediaStreamSource(micStream);
      const micGain = audioContext.createGain();
      micGain.gain.value = 1.0; // Adjust microphone volume
      micSource.connect(micGain).connect(audioDestination);

      // Combine video from screen with merged audio
      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...audioDestination.stream.getAudioTracks()
      ]);

      streamRef.current = combinedStream;

      // Check for supported MIME type with audio codec
      let mimeType = 'video/webm';
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')) {
        mimeType = 'video/webm;codecs=vp9,opus';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')) {
        mimeType = 'video/webm;codecs=vp8,opus';
      }

      mediaRecorderRef.current = new MediaRecorder(combinedStream, {
        mimeType: mimeType,
        videoBitsPerSecond: 2500000, // 2.5 Mbps for good quality
        audioBitsPerSecond: 128000,  // 128 kbps for audio
      });

      const chunks = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          console.log('Received chunk of size:', event.data.size);
          chunks.push(event.data);
        } else {
          console.warn('Empty or invalid data received from MediaRecorder');
        }
      };

      mediaRecorderRef.current.onstop = () => {
        console.log('MediaRecorder stopped, total chunks:', chunks.length);
        console.log('Total size:', chunks.reduce((acc, chunk) => acc + chunk.size, 0), 'bytes');
        
        if (chunks.length > 0) {
          setRecordedChunks([...chunks]);
        } else {
          console.warn('No data chunks were recorded');
          setError('No recording data was captured');
        }

        // Clean up audio context and streams
        if (audioContextRef.current) {
          audioContextRef.current.close().catch(console.error);
        }
        if (screenStream) {
          screenStream.getTracks().forEach(track => track.stop());
        }
        if (micStream) {
          micStream.getTracks().forEach(track => track.stop());
        }
      };

      // Stop recording when screen share ends
      screenStream.getVideoTracks()[0].addEventListener('ended', () => {
        stopRecording();
      });

      mediaRecorderRef.current.start(1000); // Record in 1-second intervals
      setIsRecording(true);

    } catch (err) {
      console.error("Screen recording error:", err);
      
      let errorMessage = 'Failed to start recording';
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Permission denied. Please allow screen and microphone access.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No screen or microphone found.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage = 'Screen recording not supported in this browser.';
      }
      
      setError(errorMessage);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state !== 'inactive') {
      // Request final data before stopping
      mediaRecorderRef.current.requestData();
      
      // Small delay to ensure data is processed
      setTimeout(() => {
        mediaRecorderRef.current?.stop();
        
        // Stop all tracks in the combined stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        setIsRecording(false);
      }, 100);
    }
  };

  const downloadRecording = () => {
    if (recordedChunks.length === 0) return;
    
    // Use appropriate MIME type for the blob
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus') 
      ? 'video/webm;codecs=vp9,opus'
      : 'video/webm';
      
    const blob = new Blob(recordedChunks, { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `screen_recording_with_audio_${Date.now()}.webm`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearRecordedChunks = useCallback(() => {
    setRecordedChunks([]);
  }, []);

  return {
    isRecording,
    recordedChunks,
    error,
    startRecording,
    stopRecording,
    downloadRecording,
    clearRecordedChunks,
  };
}
