import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Clock, Mic, MicOff } from 'lucide-react';

interface Step7QuestionProps {
  questionNumber: number;
  totalQuestions: number;
  question: QuestionData;
  onAnswer: (answer: string, timeSpent: number) => void;
}

export interface QuestionData {
  id: string;
  text: string;
  type: 'multiple-choice' | 'open-ended';
  options?: string[];
}

export function Step7Question({ questionNumber, totalQuestions, question, onAnswer }: Step7QuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    if (selectedAnswer || isRecording) {
      setShowFeedback(true);
      setTimeout(() => {
        onAnswer(selectedAnswer, timeSpent);
      }, 2000);
    }
  };

  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl px-6 py-4 mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-primary" strokeWidth={1.5} />
              <span className="text-sm">
                Question {questionNumber} of {totalQuestions}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" strokeWidth={1.5} />
              <span>{formatTime(timeSpent)}</span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          {!showFeedback ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="glass-card rounded-3xl p-10"
            >
              {/* Question Text */}
              <div className="mb-8">
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 pulse-glow">
                    <Brain className="w-6 h-6 text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-3">AI INTERVIEWER</p>
                    <h2 className="text-2xl leading-relaxed">{question.text}</h2>
                  </div>
                </div>

                {/* Answer Options */}
                {question.type === 'multiple-choice' && question.options && (
                  <div className="space-y-3">
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
                              w-10 h-10 rounded-lg flex items-center justify-center transition-all
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
                  <div className="p-6 rounded-xl border border-border bg-accent/20">
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
                          <span className="text-xs">Recording...</span>
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
                          <motion.div className="flex items-center gap-2 justify-center mb-4">
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
              </div>

              {/* Submit Button */}
              <motion.button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className={`
                  w-full px-6 py-4 rounded-xl transition-all
                  ${selectedAnswer
                    ? 'bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20'
                    : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                  }
                `}
                whileHover={selectedAnswer ? { scale: 1.01 } : {}}
                whileTap={selectedAnswer ? { scale: 0.99 } : {}}
              >
                Submit Answer
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-3xl p-10 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[var(--status-ready)]/10 mb-6 pulse-glow"
              >
                <svg className="w-10 h-10 text-[var(--status-ready)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h3 className="text-xl mb-2">Answer Recorded</h3>
              <p className="text-muted-foreground">AI is analyzing your response...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
