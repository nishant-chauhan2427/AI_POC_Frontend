import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Edit3,
  Eye,
  SkipForward,
  BarChart3,
  User,
  Calendar,
  Clock,
  Award,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { getJSON, postJSON } from "../utils/api";
import CandidateInfo from "../components/CandidateInfo";
import { useSearchParams } from "react-router-dom";
import SparklesBackground from "../components/BackGround";

export default function ReportAnalysis() {
  const [searchParams] = useSearchParams();
  const session_id = searchParams.get("session_id");

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [candidateId, setCandidateId] = useState(null);
  const [candidateName, setCandidateName] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    window.history.replaceState(null, "", window.location.href);
  }, []);

  useEffect(() => {
    const storedCandidateId = localStorage.getItem("candidate_id");
    const storedCandidateName = localStorage.getItem("candidate_name");
    setCandidateId(storedCandidateId || "Unknown Candidate Id");
    setCandidateName(storedCandidateName || "Unknown Candidate");
  }, []);
  useEffect(() => {
    if (!candidateId) return;

    const fetchReportData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching report for:", candidateId);
        const data = await getJSON(`/report/qa_logs/${candidateId}`);
        console.log("API Response:", data);

        // FIXED: Check for the correct API response format
        if (
          data &&
          data.status_code === 200 &&
          data.data &&
          data.data.length > 0
        ) {
          setReportData(data);
          console.log("✅ Data set successfully");
        } else {
          console.log("❌ Validation failed:", {
            hasData: !!data,
            statusCode: data?.status_code,
            hasDataArray: !!data?.data,
            dataLength: data?.data?.length,
          });
          throw new Error("Invalid response format from server");
        }
      } catch (err) {
        console.error("Error fetching report data:", err);
        setError(err.message || "Failed to load report data");
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [candidateId]);
  useEffect(() => {
    const generatePdf = async () => {
      if (!reportData || !candidateId || !candidateName) return;

      const qaLog = reportData.data[0]?.qa_log || [];
      if (!qaLog.length) return;

      const payload = {
        candidate_id: candidateId,
        candidate_name: candidateName,
        qa_log: qaLog.map((q) => ({
          question: q.question,
          answer: q.user_answer || q.answer || null,
          is_correct: Boolean(q.is_correct),
          skipped: Boolean(q.skipped),
          edited: Boolean(q.edited),
          marked_for_review: Boolean(q.marked_for_review),
        })),
      };

      try {
        const response = await postJSON(
          "/generatepdf/generate-question-analysis-pdf",
          payload
        );

        if (response?.pdf_url) {
          // ✅ generate silently
          setPdfUrl(response.pdf_url);
        }
      } catch (err) {
        console.error("PDF generation failed:", err);
      }
    };

    if (reportData?.data?.length > 0) {
      generatePdf();
    }
  }, [reportData, candidateId, candidateName]);

  // useEffect(() => {
  //   const generatePdf = async () => {
  //     if (!reportData || !candidateId || !candidateName) return;

  //     const qaLog = reportData.data[0]?.qa_log || [];
  //     if (!qaLog.length) return;

  //     const payload = {
  //       candidate_id: candidateId,
  //       candidate_name: candidateName,
  //       qa_log: qaLog.map(q => ({
  //         question: q.question,
  //         answer: q.user_answer || q.answer || null,
  //         is_correct: Boolean(q.is_correct),
  //         skipped: Boolean(q.skipped),
  //         edited: Boolean(q.edited),
  //         marked_for_review: Boolean(q.marked_for_review),
  //       })),
  //     };

  //     try {
  //       const response = await postJSON(
  //         "/generatepdf/generate-question-analysis-pdf",
  //         payload
  //       );

  //       if (response?.pdf_url) {
  //         window.open(response.pdf_url, "_blank");
  //       }
  //     } catch (err) {
  //       console.error("PDF generation failed:", err);
  //     }
  //   };

  //   if (reportData && reportData.data && reportData.data.length > 0) {
  //     generatePdf();
  //   }
  // }, [reportData, candidateId, candidateName]); // ✅ hooks at top

  const retryFetch = async () => {
    if (!candidateId) {
      setError("No candidate ID available for retry");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getJSON(`/report/qa_logs/${candidateId}`);
      if (
        data &&
        data.status_code === 200 &&
        data.data &&
        data.data.length > 0
      ) {
        setReportData(data);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      setError(err.message || "Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      width: "100vw",
      background:
        "linear-gradient(180deg, #0b1020 0%, #0b1426 40%, #0e182e 100%)",
      color: "#fff",
      position: "relative",
      overflow: "auto",
      padding: "24px",
    },
    glowA: {
      position: "absolute",
      top: -120,
      left: -80,
      width: 480,
      height: 480,
      borderRadius: "50%",
      filter: "blur(80px)",
      background:
        "radial-gradient(circle at 30% 30%, rgba(99,102,241,0.25), transparent 60%)",
      pointerEvents: "none",
    },
    glowB: {
      position: "absolute",
      top: -80,
      right: -120,
      width: 520,
      height: 520,
      borderRadius: "50%",
      filter: "blur(90px)",
      background:
        "radial-gradient(circle at 70% 30%, rgba(168,85,247,0.22), transparent 60%)",
      pointerEvents: "none",
    },
    glowC: {
      position: "absolute",
      bottom: -140,
      left: "20%",
      width: 600,
      height: 600,
      borderRadius: "50%",
      filter: "blur(100px)",
      background:
        "radial-gradient(circle at 50% 50%, rgba(59,130,246,0.18), transparent 60%)",
      pointerEvents: "none",
    },

    header: {
      padding: "16px 24px",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
    },
    backBtn: {
      padding: "12px",
      background: "rgba(255,255,255,0.1)",
      border: "1px solid rgba(255,255,255,0.2)",
      borderRadius: "12px",
      color: "#fff",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
    },
    title: {
      fontSize: "28px",
      fontWeight: "800",
      background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
    },
    content: {
      position: "relative",
      zIndex: 10,
      maxWidth: "1400px",
      margin: "0 auto",
    },
    loadingContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "400px",
      flexDirection: "column",
      gap: "16px",
    },
    spinner: {
      width: "40px",
      height: "40px",
      border: "4px solid rgba(255,255,255,0.2)",
      borderTop: "4px solid #6366f1",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    errorContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "400px",
      flexDirection: "column",
      gap: "16px",
    },
    errorCard: {
      background: "rgba(239,68,68,0.1)",
      border: "1px solid rgba(239,68,68,0.3)",
      borderRadius: "16px",
      padding: "24px",
      textAlign: "center",
      maxWidth: "500px",
    },
    retryBtn: {
      padding: "12px 24px",
      background: "rgba(99,102,241,0.2)",
      border: "1px solid rgba(99,102,241,0.4)",
      borderRadius: "8px",
      color: "#a78bfa",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "24px",
      marginBottom: "32px",
    },
    card: {
      background: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: "16px",
      padding: "24px",
      boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
    },
    cardTitle: {
      fontSize: "18px",
      fontWeight: "700",
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    cardContent: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    statRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 0",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
    },
    statLabel: {
      color: "rgba(255,255,255,0.8)",
      fontSize: "14px",
    },
    statValue: {
      fontWeight: "600",
      fontSize: "16px",
    },
    statSuccess: { color: "#4ade80" },
    statError: { color: "#f87171" },
    statWarning: { color: "#fbbf24" },
    questionsList: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      maxHeight: "400px",
      overflowY: "auto",
    },
    questionItem: {
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: "12px",
      padding: "16px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    questionInfo: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      flex: 1,
    },
    questionNumber: {
      background: "rgba(99,102,241,0.2)",
      color: "#a78bfa",
      padding: "6px 12px",
      borderRadius: "20px",
      fontSize: "14px",
      fontWeight: "600",
    },
    questionStatus: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    badge: {
      padding: "4px 8px",
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "600",
      display: "inline-flex",
      alignItems: "center",
    },
    headerBar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 800,
      letterSpacing: 0.4,
      background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
    },
    badgeCorrect: {
      background: "rgba(34,197,94,0.2)",
      color: "#4ade80",
    },
    badgeIncorrect: {
      background: "rgba(239,68,68,0.2)",
      color: "#f87171",
    },
    badgeSkipped: {
      background: "rgba(234,179,8,0.2)",
      color: "#fbbf24",
    },
    badgeEdited: {
      background: "rgba(168,85,247,0.2)",
      color: "#c084fc",
    },
    badgeReview: {
      background: "rgba(59,130,246,0.2)",
      color: "#60a5fa",
    },
    modal: {
      position: "fixed",
      inset: 0,
      zIndex: 50,
      background: "rgba(0,0,0,0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    },
    modalContent: {
      background: "rgba(15,23,42,0.95)",
      border: "1px solid rgba(255,255,255,0.2)",
      borderRadius: "16px",
      padding: "32px",
      maxWidth: "600px",
      width: "100%",
      maxHeight: "80vh",
      overflowY: "auto",
      backdropFilter: "blur(20px)",
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "24px",
    },
    modalTitle: {
      fontSize: "20px",
      fontWeight: "700",
    },
    closeBtn: {
      background: "none",
      border: "none",
      color: "#fff",
      fontSize: "24px",
      cursor: "pointer",
      padding: "4px",
      borderRadius: "4px",
      transition: "background 0.2s ease",
    },
    answerSection: {
      background: "rgba(255,255,255,0.05)",
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "16px",
    },
    answerLabel: {
      fontSize: "14px",
      color: "rgba(255,255,255,0.8)",
      marginBottom: "8px",
      fontWeight: "600",
    },
    answerText: {
      fontSize: "16px",
      lineHeight: "1.5",
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <SparklesBackground />
        <div style={styles.glowA} />
        <div style={styles.glowB} />
        <div style={styles.glowC} />
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Loading test report for {candidateId}...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.glowA} />
        <div style={styles.glowB} />
        <div style={styles.glowC} />
        <div style={styles.content}>
          <div style={styles.header}>
            <button
              style={styles.backBtn}
              onClick={() => navigate("/proctoring")}
            >
              <ArrowLeft size={15} />
            </button>
            <h2 style={styles.title}>Test Report</h2>
          </div>
          <div style={styles.errorContainer}>
            <div style={styles.errorCard}>
              <h3>Unable to Load Report</h3>
              <p>{error}</p>
              <button style={styles.retryBtn} onClick={retryFetch}>
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // FIXED: Check the correct data structure
  if (
    !reportData ||
    !reportData.data ||
    reportData.data.length === 0 ||
    !reportData.data[0].qa_log ||
    reportData.data[0].qa_log.length === 0
  ) {
    return (
      <div style={styles.container}>
        <div style={styles.glowA} />
        <div style={styles.glowB} />
        <div style={styles.glowC} />
        <div style={styles.content}>
          <div style={styles.header}>
            <button style={styles.backBtn}>
              <ArrowLeft size={20} />
            </button>
            <h1 style={styles.title}>Test Report</h1>
          </div>
          <div style={styles.card}>
            <p>No test data found.</p>
          </div>
        </div>
      </div>
    );
  }

  const candidateData = reportData.data[0];
  const qaLog = candidateData.qa_log || [];
  const totalQuestions = qaLog.length;
  const correctAnswers = qaLog.filter((q) => q.is_correct).length;
  const incorrectAnswers = qaLog.filter(
    (q) => !q.is_correct && !q.skipped
  ).length;
  const skippedQuestions = qaLog.filter((q) => q.skipped).length;
  const editedQuestions = qaLog.filter((q) => q.edited).length;
  const reviewedQuestions = qaLog.filter((q) => q.marked_for_review).length;
  const totalScore = qaLog.reduce((sum, q) => sum + (q.score || 0), 0);
  const accuracy =
    totalQuestions > 0
      ? ((correctAnswers / totalQuestions) * 100).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-[#0B0F1A]  px-4">
      <SparklesBackground />
      <div style={styles.content}>
        <header style={styles.header}>
          <div style={styles.headerBar}>
            {/* <h1 style={styles.headerTitle}>REX Dashboard</h1> */}
            <CandidateInfo name={candidateName} id={candidateId} />
          </div>
        </header>
        <h3 className=" text-xl py-4 font-semibold  text-white">
          {" "}
          Test Report
        </h3>
        <div style={styles.grid}>
          {/* Candidate Info */}
          <div
            className="
    rounded-2xl p-6
    bg-white/5 
    border border-white/10
    shadow-xl
    text-white
  "
          >
            {/* Card Title */}
            <div className="flex items-center gap-2 text-lg font-semibold mb-5">
              <User size={20} className="text-white/80" />
              Candidate Information
            </div>

            {/* Card Content */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60">Candidate ID</span>
                <span className="text-sm font-medium">
                  {candidateData.candidate_id}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60">Session ID</span>
                <span className="text-sm font-medium">
                  {candidateData._id?.slice(-8) || "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60">Test Date</span>
                <span className="text-sm font-medium">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div
            className="
    rounded-2xl p-6
    bg-white/5 
    border border-white/10
    shadow-xl
    text-white
  "
          >
            {/* Card Title */}
            <div className="flex items-center gap-2 text-lg font-semibold mb-5">
              <BarChart3 size={20} className="text-white/80" />
              Performance Overview
            </div>

            {/* Card Content */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60">Total Questions</span>
                <span className="text-sm font-medium">{totalQuestions}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60">Correct Answers</span>
                <span className="text-sm font-semibold text-green-400">
                  {correctAnswers}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60">Incorrect Answers</span>
                <span className="text-sm font-semibold text-red-400">
                  {incorrectAnswers}
                </span>
              </div>
              <hr className="opacity-75" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60">Accuracy</span>
                <span className="text-sm font-medium">{accuracy}%</span>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="rounded-2xl p-6 bg-white/5 border border-white/10 shadow-xl text-white">
            {/* Title */}
            <div className="flex items-center gap-2 text-lg font-semibold mb-5">
              <Award size={20} className="text-white/80" />
              Additional Statistics
            </div>

            {/* Content */}
            <div className="space-y-4">
              {/* Total Score */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60">Total Score</span>
                <span
                  className={`text-sm font-semibold ${
                    totalScore >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {totalScore}
                </span>
              </div>

              {/* Skipped Questions */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60">Skipped Questions</span>
                <span className="text-sm font-semibold text-yellow-400">
                  {skippedQuestions}
                </span>
              </div>

              {/* Edited Answers */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60">Edited Answers</span>
                <span className="text-sm font-medium">{editedQuestions}</span>
              </div>

              {/* Optional */}
              {/*
    <div className="flex justify-between items-center">
      <span className="text-sm text-white/60">Marked for Review</span>
      <span className="text-sm font-medium">{reviewedQuestions}</span>
    </div>
    */}
            </div>
          </div>
        </div>

        {/* Detailed Questions List */}
        <div className="rounded-2xl p-6 bg-white/5 border border-white/10 shadow-xl text-white">
          <div style={styles.cardTitle}>
            <Eye size={20} />
            Question-wise Analysis
          </div>
          <div style={styles.questionsList}>
            {qaLog.map((question, index) => (
              <div
                key={question.question_id}
                style={styles.questionItem}
                onClick={() => setSelectedQuestion(question)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div style={styles.questionInfo}>
                  <div style={styles.questionNumber}>Q{index + 1}</div>
                  <div style={styles.questionStatus}>
                    {question.is_correct ? (
                      <CheckCircle size={16} color="#4ade80" />
                    ) : question.skipped ? (
                      <SkipForward size={16} color="#fbbf24" />
                    ) : (
                      <XCircle size={16} color="#f87171" />
                    )}

                    <span style={styles.statValue}>
                      {question?.question || 0}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {question.is_correct && (
                    <span style={{ ...styles.badge, ...styles.badgeCorrect }}>
                      Correct
                    </span>
                  )}
                  {!question.is_correct && !question.skipped && (
                    <span style={{ ...styles.badge, ...styles.badgeIncorrect }}>
                      Incorrect
                    </span>
                  )}
                  {question.skipped && (
                    <span style={{ ...styles.badge, ...styles.badgeSkipped }}>
                      Skipped
                    </span>
                  )}
                  {question.edited && (
                    <span style={{ ...styles.badge, ...styles.badgeEdited }}>
                      <Edit3 size={12} style={{ marginRight: "4px" }} />
                      Edited
                    </span>
                  )}
                  {question.marked_for_review && (
                    <span style={{ ...styles.badge, ...styles.badgeReview }}>
                      Review
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Question Detail Modal */}
      {selectedQuestion && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedQuestion(null)}
        >
          {/* Modal */}
          <div
            className="
      w-full max-w-2xl
      rounded-2xl p-6
     
      border border-white/10
      shadow-2xl
      bg-white/10
      text-white
    "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Question Details</h3>
              <button
                onClick={() => setSelectedQuestion(null)}
                className="
          w-8 h-8 flex items-center justify-center
          rounded-full text-white/70
          hover:bg-white/10 hover:text-white
          transition
          cursor-pointer
        "
              >
                ×
              </button>
            </div>

            {/* Section */}
            <div className="space-y-5">
              {/* Question */}
              <div>
                <p className="text-sm text-white/60 mb-1">Question</p>
                <p className="text-sm leading-relaxed">
                  {selectedQuestion.question || "Not provided"}
                </p>
              </div>

              {/* Expected Answer */}
              <div>
                <p className="text-sm text-white/60 mb-1">Expected Answer</p>
                <p className="text-sm leading-relaxed">
                  {selectedQuestion.expected_answer || "Not provided"}
                </p>
              </div>

              {/* Your Answer */}
              <div>
                <p className="text-sm text-white/60 mb-1">Your Answer</p>
                <p className="text-sm leading-relaxed">
                  {selectedQuestion.user_answer || (
                    <em className="text-white/50">No answer provided</em>
                  )}
                </p>
              </div>

              {/* Status */}
              <div>
                <p className="text-sm text-white/60 mb-2">Status</p>
                <div className="flex flex-wrap gap-2">
                  {selectedQuestion.is_correct ? (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                      <CheckCircle size={14} />
                      Correct
                    </span>
                  ) : selectedQuestion.skipped ? (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                      <SkipForward size={14} />
                      Skipped
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                      <XCircle size={14} />
                      Incorrect
                    </span>
                  )}

                  {selectedQuestion.edited && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      <Edit3 size={14} />
                      Edited
                    </span>
                  )}

                  {selectedQuestion.marked_for_review && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                      <Eye size={14} />
                      Marked for Review
                    </span>
                  )}
                </div>
              </div>

              {/* Score */}
              <div>
                <p className="text-sm text-white/60 mb-1">Score</p>
                <p
                  className={`text-sm font-semibold ${
                    selectedQuestion.score > 0
                      ? "text-green-400"
                      : selectedQuestion.score < 0
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {selectedQuestion.score || 0} points
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
