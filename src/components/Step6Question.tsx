import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Clock, Mic, MicOff, Video, AlertTriangle, Eye, Radio, Monitor } from 'lucide-react';
import { log } from 'console';

interface Step6QuestionProps {
  questionNumber: number;
  totalQuestions: number;
  question: QuestionData;
  onAnswer: (answer: string, timeSpent: number) => void;
  systemReady: boolean;
    cameraStream: MediaStream;
  screenStream: MediaStream;
}


export interface QuestionData {
  id: string;
  text: string;
  type: 'multiple-choice' | 'open-ended';
  options?: string[];
}

export function Step6Question({ questionNumber, totalQuestions, question, onAnswer, systemReady, cameraStream, screenStream }: Step6QuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showTabAlert, setShowTabAlert] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  // const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const recording = screenStream?.active;
  
// log(screenStream);
console.log(screenStream?.active);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
  if (videoRef.current && cameraStream) {
    videoRef.current.srcObject = cameraStream;
    videoRef.current.play().catch(() => {});
  }
}, [cameraStream]);




  // Simulate tab switch detection (just for UI demo)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setShowTabAlert(true);
        setTimeout(() => setShowTabAlert(false), 4000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    if (selectedAnswer || isRecording) {
      onAnswer(selectedAnswer, timeSpent);
    }
  };

  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Tab Switch Alert */}

      {recording && (
        <div className="fixed inset-0 border-[6px] border-red-500 pointer-events-none z-50" />
      )}
      <AnimatePresence>
        {showTabAlert && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-50 glass-card border-2 border-destructive rounded-2xl px-6 py-4 shadow-2xl shadow-destructive/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" strokeWidth={2} />
              </div>
              <div>
                <p className="font-medium text-destructive">Warning: Tab Switch Detected!</p>
                <p className="text-xs text-muted-foreground">This activity has been recorded</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recording Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-0 right-0 glass-card border-b border-border z-40"
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Recording Indicator */}
            <div className="flex items-center gap-2">
              <motion.div
                className="w-3 h-3 rounded-full bg-destructive"
                animate={{
                  opacity: [1, 0.3, 1],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <span className="text-sm font-medium text-destructive">REC</span>
            </div>

            {/* Status Badges */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                <Video className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
                <span className="text-xs text-primary">Camera</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                <Monitor className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
                <span className="text-xs text-primary">Screen</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                <Eye className="w-3.5 h-3.5 text-primary" strokeWidth={2} />
                <span className="text-xs text-primary">Monitoring</span>
              </div>
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            <span className="font-mono">{formatTime(timeSpent)}</span>
          </div>
        </div>
      </motion.div>

      {/* Split Screen Layout */}
      <div className="flex h-screen pt-[60px]">
        {/* Left Side - Camera View */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-[35%] p-6 border-r border-border"
        >
          <div className="h-full flex flex-col">
            {/* Camera Feed */}
            <div className="glass-card rounded-2xl overflow-hidden flex-1 relative border border-border">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Camera Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                    <p className="text-sm text-muted-foreground">Live Camera Feed</p>
                  </div>
                </div>

                {/* Scan line effect */}
                <div className="scan-line absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
              </div>

              {/* Camera Status Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg glass-card border border-border">
                <motion.div
                  className="w-2 h-2 rounded-full bg-[var(--status-ready)]"
                  animate={{
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                />
                <span className="text-xs">Live</span>
              </div>
            </div>

            {/* Info Panel */}
            <div className="mt-4 space-y-3">
              <div className="glass-card rounded-xl p-4 border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Progress</p>
                    <p className="text-sm font-medium">
                      Question {questionNumber} of {totalQuestions}
                    </p>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div className="glass-card rounded-xl p-3 border border-border">
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                  <p>Please stay in frame and avoid switching tabs during the interview</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Question Panel */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 p-6 overflow-y-auto"
        >
          <div className="max-w-3xl mx-auto h-full flex flex-col justify-center">
            {/* Question Card */}
            <div className="glass-card rounded-3xl p-10 border border-border">
              {/* Question Header */}
              <div className="flex items-start gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 pulse-glow">
                  <Brain className="w-6 h-6 text-primary" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-3 tracking-wider">AI INTERVIEWER</p>
                  <h2 className="text-2xl leading-relaxed">{question.text}</h2>
                </div>
              </div>

              {/* Answer Options */}
              {question.type === 'multiple-choice' && question.options && (
                <div className="space-y-3 mb-8">
                  {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === option;
                    const letter = String.fromCharCode(65 + index);

                    return (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedAnswer(option)}
                        className={`
                          w-full p-5 rounded-xl border transition-all text-left
                          ${isSelected
                            ? 'border-primary bg-primary/5 glow-border'
                            : 'border-border bg-accent/20 hover:border-primary/30'
                          }
                        `}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`
                            w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-all
                            ${isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted/30 text-muted-foreground'
                            }
                          `}>
                            {letter}
                          </div>
                          <span className="flex-1">{option}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Open-ended Response */}
              {question.type === 'open-ended' && (
                <div className="p-6 rounded-xl border border-border bg-accent/20 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-muted-foreground">Your Response</p>
                    {isRecording && (
                      <motion.div
                        className="flex items-center gap-2 text-[var(--status-processing)]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="w-2 h-2 rounded-full bg-[var(--status-processing)]"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                        <span className="text-xs font-medium">Recording...</span>
                      </motion.div>
                    )}
                  </div>

                  <div className="min-h-[120px] flex items-center justify-center mb-6">
                    {!isRecording ? (
                      <p className="text-sm text-muted-foreground/60 text-center">
                        Click the microphone button to start recording your answer
                      </p>
                    ) : (
                      <div className="w-full">
                        <motion.div className="flex items-center gap-2 justify-center">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-1 bg-primary rounded-full"
                              animate={{ height: [20, 40, 20] }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.1,
                              }}
                            />
                          ))}
                        </motion.div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <motion.button
                      onClick={() => {
                        setIsRecording(!isRecording);
                        if (!isRecording) setSelectedAnswer('recorded');
                      }}
                      className={`
                        w-14 h-14 rounded-full flex items-center justify-center transition-all
                        ${isRecording
                          ? 'bg-destructive text-destructive-foreground shadow-lg shadow-destructive/30'
                          : 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                        }
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isRecording ? (
                        <MicOff className="w-6 h-6" strokeWidth={2} />
                      ) : (
                        <Mic className="w-6 h-6" strokeWidth={2} />
                      )}
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className={`
                  w-full px-6 py-4 rounded-xl transition-all font-medium
                  ${selectedAnswer
                    ? 'bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20'
                    : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                  }
                `}
                whileHover={selectedAnswer ? { scale: 1.01 } : {}}
                whileTap={selectedAnswer ? { scale: 0.99 } : {}}
              >
                {questionNumber === totalQuestions ? 'Complete Interview' : 'Next Question'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
