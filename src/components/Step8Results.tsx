import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Brain, Target, TrendingUp, Clock, Star, Download, Home, CheckCircle2, XCircle, SkipForward, AlertCircle } from 'lucide-react';

interface Step8ResultsProps {
  onRestart: () => void;
  candidateId?: string;
}

interface QALogItem {
  question_id: string;
  user_answer: string;
  question: string;
  expected_answer: string;
  is_correct: boolean;
  similarity: number;
  scores: {
    correctness: number;
    relevance: number;
    communication: number;
    confidence: number;
  };
  overall_score: number;
  answer_type: string;
  feedback: string;
  marked_for_review: boolean;
  skipped: boolean;
  edited: boolean;
}

interface ReportData {
  candidate_id: string;
  qa_log: QALogItem[];
}

export function Step8Results({ onRestart, candidateId = "CAND-450a2b8f" }: Step8ResultsProps) {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, [candidateId]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const API_BASE = import.meta.env.VITE_API_BASE_URL;
      const storedCandidateId = localStorage.getItem("candidate_id") || candidateId;
      
      const response = await fetch(`${API_BASE}/report/qa_logs/${storedCandidateId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch report data');
      }

      const data = await response.json();

      if (data?.status_code === 200 && data?.data?.length > 0) {
        setReportData(data.data[0]);
      } else {
        throw new Error('Invalid data format');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch report:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground">Failed to load report data</p>
        </div>
      </div>
    );
  }

  const qaLog = reportData.qa_log;
  const totalQuestions = qaLog.length;
  const correct = qaLog.filter(q => q.is_correct).length;
  const incorrect = qaLog.filter(q => !q.is_correct && !q.skipped).length;
  const skipped = qaLog.filter(q => q.skipped).length;
  const totalScore = qaLog.reduce((sum, q) => sum + q.overall_score, 0);
  const averageScore = totalQuestions > 0 ? (totalScore / totalQuestions).toFixed(1) : 0;
  const accuracy = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;

  const metrics = [
    {
      icon: Trophy,
      label: "Overall Score",
      value: `${averageScore}/10`,
      color: "text-primary",
    },
    {
      icon: Brain,
      label: "Correct Answers",
      value: correct,
      color: "text-green-500",
    },
    {
      icon: Target,
      label: "Total Questions",
      value: totalQuestions,
      color: "text-secondary",
    },
    {
      icon: TrendingUp,
      label: "Accuracy",
      value: `${accuracy}%`,
      color: "text-blue-500",
    },
  ];

  const detailedScores = [
    {
      category: "Accuracy",
      score: accuracy,
      total: 100,
    },
    {
      category: "Average Correctness",
      score: Math.round((qaLog.reduce((sum, q) => sum + q.scores.correctness, 0) / totalQuestions) * 10),
      total: 100,
    },
    {
      category: "Communication",
      score: Math.round((qaLog.reduce((sum, q) => sum + q.scores.communication, 0) / totalQuestions) * 10),
      total: 100,
    },
    {
      category: "Relevance",
      score: Math.round((qaLog.reduce((sum, q) => sum + q.scores.relevance, 0) / totalQuestions) * 10),
      total: 100,
    },
  ];

  const strengths = correct > 0 
    ? ["Shows effort in attempting all questions", "Consistent engagement throughout interview"]
    : ["Completed all questions", "Showed persistence"];

  const improvements = [
    "Focus on understanding core concepts thoroughly",
    "Provide more detailed and structured answers",
    "Review fundamental topics before interviews"
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6"
          >
            <Trophy className="w-10 h-10 text-primary" strokeWidth={1.5} />
          </motion.div>
          <h1 className="text-4xl mb-3">Interview Results</h1>
          <p className="text-lg text-muted-foreground">Here's your comprehensive performance analysis</p>
        </motion.div>

        {/* Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className={`w-6 h-6 ${metric.color}`} strokeWidth={1.5} />
                  </div>
                </div>
                <p className="text-3xl mb-2">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Detailed Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-8"
          >
            <h3 className="text-xl mb-6 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" strokeWidth={1.5} />
              Detailed Breakdown
            </h3>

            <div className="space-y-5">
              {detailedScores.map((item, index) => (
                <motion.div
                  key={item.category}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">{item.category}</span>
                    <span className="text-sm text-primary">{item.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* AI Analysis */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-8"
          >
            <h3 className="text-xl mb-6 flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" strokeWidth={1.5} />
              AI Analysis
            </h3>

            <div className="space-y-6">
              {/* Strengths */}
              <div>
                <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Key Strengths
                </p>
                <div className="space-y-2">
                  {strengths.map((strength, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-start gap-2 text-sm pl-4"
                    >
                      <span className="text-green-500 mt-1">•</span>
                      <span>{strength}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Improvements */}
              <div>
                <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  Areas for Growth
                </p>
                <div className="space-y-2">
                  {improvements.map((improvement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-start gap-2 text-sm pl-4"
                    >
                      <span className="text-orange-500 mt-1">•</span>
                      <span>{improvement}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Stats Summary */}
              <div className="pt-4 border-t border-border space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Correct</span>
                  </div>
                  <span>{correct}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span>Incorrect</span>
                  </div>
                  <span>{incorrect}</span>
                </div>
                {skipped > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <SkipForward className="w-4 h-4 text-yellow-500" />
                      <span>Skipped</span>
                    </div>
                    <span>{skipped}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Question-wise Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card rounded-2xl p-8 mb-8"
        >
          <h3 className="text-xl mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" strokeWidth={1.5} />
            Question-wise Performance
          </h3>

          <div className="space-y-4">
            {qaLog.map((item, index) => (
              <motion.div
                key={item.question_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                className="border border-border rounded-xl p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                    item.is_correct ? 'bg-green-500/10 text-green-500' : 
                    item.skipped ? 'bg-yellow-500/10 text-yellow-500' : 
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {item.is_correct ? <CheckCircle2 className="w-5 h-5" /> : 
                     item.skipped ? <SkipForward className="w-5 h-5" /> :
                     <XCircle className="w-5 h-5" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h4 className="text-sm font-medium">Q{index + 1}: {item.question}</h4>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        Score: {item.overall_score}/10
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Your Answer: </span>
                        <span className="text-foreground">{item.user_answer}</span>
                      </div>
                      
                      {item.feedback && (
                        <div className="bg-muted/30 rounded-lg p-3 mt-2">
                          <span className="text-muted-foreground text-xs">Feedback: </span>
                          <span className="text-foreground text-xs">{item.feedback}</span>
                        </div>
                      )}
                      
                      <div className="flex gap-4 mt-2">
                        <div className="text-xs">
                          <span className="text-muted-foreground">Correctness: </span>
                          <span className="text-primary">{item.scores.correctness}/10</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground">Relevance: </span>
                          <span className="text-primary">{item.scores.relevance}/10</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground">Communication: </span>
                          <span className="text-primary">{item.scores.communication}/10</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground">Confidence: </span>
                          <span className="text-primary">{item.scores.confidence}/10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl border border-border bg-accent/30 hover:border-primary/50 hover:bg-accent/50 transition-all"
          >
            <Home className="w-5 h-5" strokeWidth={1.5} />
            <span>New Interview</span>
          </button>

          <button className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all">
            <Download className="w-5 h-5" strokeWidth={1.5} />
            <span>Download Report</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}