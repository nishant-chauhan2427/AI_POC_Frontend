import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { StepIndicator } from "./components/StepIndicator";
import { Step1Welcome } from "./components/Step1Welcome";
import {
  Step2UserDetails,
  type UserDetails,
} from "./components/Step2UserDetails";
import { Step3JobRole } from "./components/Step3JobRole";
import { Step4Experience } from "./components/Step4Experience";
import { Step5Preferences } from "./components/Step5Preferences";
import { Step6SystemCheck } from "./components/Step6SystemCheck";
import { Step7Question, type QuestionData } from "./components/Step7Question";
import { Step8Completion } from "./components/Step8Completion";
import { Step9Results } from "./components/Step9Results";
import { Step10ThankYou } from "./components/Step10ThankYou";

// Mock questions for different roles
const mockQuestions: Record<string, QuestionData[]> = {
  "software-engineer": [
    {
      id: "1",
      text: "What is your experience with React and modern frontend frameworks?",
      type: "multiple-choice",
      options: [
        "Expert - 5+ years with production applications",
        "Advanced - 2-5 years with multiple projects",
        "Intermediate - 1-2 years with some projects",
        "Beginner - Less than 1 year or learning",
      ],
    },
    {
      id: "2",
      text: "Describe a challenging technical problem you solved recently and your approach to solving it.",
      type: "open-ended",
    },
    {
      id: "3",
      text: "How do you ensure code quality in your projects?",
      type: "multiple-choice",
      options: [
        "Unit tests, code reviews, and automated CI/CD",
        "Manual testing and peer reviews",
        "Automated testing only",
        "Code reviews only",
      ],
    },
  ],
  "product-manager": [
    {
      id: "1",
      text: "How do you prioritize features in a product roadmap?",
      type: "multiple-choice",
      options: [
        "User impact, business value, and technical feasibility",
        "Business requirements only",
        "User requests and feedback",
        "Technical team recommendations",
      ],
    },
    {
      id: "2",
      text: "Describe a time when you had to make a difficult product decision with limited data.",
      type: "open-ended",
    },
    {
      id: "3",
      text: "What metrics do you track to measure product success?",
      type: "open-ended",
    },
  ],
  default: [
    {
      id: "1",
      text: "Tell us about your professional background and experience.",
      type: "open-ended",
    },
    {
      id: "2",
      text: "What motivates you in your work?",
      type: "multiple-choice",
      options: [
        "Solving challenging problems",
        "Working with great teams",
        "Making an impact",
        "Learning and growth",
      ],
    },
    {
      id: "3",
      text: "Where do you see yourself in 5 years?",
      type: "open-ended",
    },
  ],
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [jobRole, setJobRole] = useState<string>("");
  const [experienceLevel, setExperienceLevel] = useState<string>("");
  const [preferences, setPreferences] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<
    Array<{ question: string; answer: string; time: number }>
  >([]);

  const totalSteps = 10;

  const questions = mockQuestions[jobRole] || mockQuestions["default"];

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleUserDetails = (data: UserDetails) => {
    setUserDetails(data);
    handleNext();
  };

  const handleJobRole = (role: string) => {
    setJobRole(role);
    handleNext();
  };

  const handleExperience = (level: string) => {
    setExperienceLevel(level);
    handleNext();
  };

  const handlePreferences = (prefs: string[]) => {
    setPreferences(prefs);
    handleNext();
  };

  const handleAnswer = (answer: string, timeSpent: number) => {
    const question = questions[currentQuestionIndex];
    setAnswers((prev) => [
      ...prev,
      { question: question.text, answer, time: timeSpent },
    ]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      handleNext();
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setUserDetails(null);
    setJobRole("");
    setExperienceLevel("");
    setPreferences([]);
    setCurrentQuestionIndex(0);
    setAnswers([]);
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Step1Welcome onNext={handleNext} />
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <Step2UserDetails onNext={handleUserDetails} />
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <Step3JobRole onNext={handleJobRole} />
          </motion.div>
        )}

        {currentStep === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <Step4Experience onNext={handleExperience} />
          </motion.div>
        )}

        {currentStep === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <Step5Preferences onNext={handlePreferences} />
          </motion.div>
        )}

        {currentStep === 6 && (
          <motion.div
            key="step6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <Step6SystemCheck onNext={handleNext} />
          </motion.div>
        )}

        {currentStep === 7 && (
          <motion.div
            key={`step7-${currentQuestionIndex}`}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <Step7Question
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              question={questions[currentQuestionIndex]}
              onAnswer={handleAnswer}
            />
          </motion.div>
        )}

        {currentStep === 8 && (
          <motion.div
            key="step8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Step8Completion onNext={handleNext} />
          </motion.div>
        )}

        {currentStep === 9 && (
          <motion.div
            key="step9"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Step9Results onRestart={() => setCurrentStep(10)} />
          </motion.div>
        )}

        {currentStep === 10 && (
          <motion.div
            key="step10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Step10ThankYou onRestart={handleRestart} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import InterviewLayout from "./components/layout/InterviewLayout";
// import { Step1Welcome } from "./components/Step1Welcome";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route element={<InterviewLayout />}>
//           <Route path="/:emailid/:testid" element={<Step1Welcome />} />
//           <Route path="/step-2/:emailid/:testid" element={<div>Step 2</div>} />
//           <Route path="step-3" element={<div>Step 3</div>} />
//           <Route path="step-4" element={<div>Step 4</div>} />
//           <Route path="step-5" element={<div>Step 5</div>} />
//           <Route path="step-6" element={<div>Step 6</div>} />
//           <Route path="step-7" element={<div>Step 7</div>} />
//           <Route path="step-8" element={<div>Step 8</div>} />
//           <Route path="step-9" element={<div>Step 9</div>} />
//           <Route path="step-10" element={<div>Step 10</div>} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
