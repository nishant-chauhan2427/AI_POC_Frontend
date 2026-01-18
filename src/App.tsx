import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { decryptValue } from "./utils/decrypt";

import { StepIndicator } from "./components/StepIndicator";
import { Step1Welcome } from "./components/Step1Welcome";
import { Step2UserDetails } from "./components/Step2UserDetails";
import { Step3AadharVerification } from "./components/Step3AadharVerification";
import { Step4PhotoCapture } from "./components/Step4PhotoCapture";
import { Step4SystemCheck } from "./components/Step4SystemCheck";
import { Step5InterviewReady } from "./components/Step5InterviewReady";
import { Step6Question } from "./components/Step6Question";
import { Step7Completion } from "./components/Step7Completion";
import { Step8Results } from "./components/Step8Results";
import { Step9ThankYou } from "./components/Step9ThankYou";

/* ---------------- MOCK QUESTIONS ---------------- */
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
  const [currentStep, setCurrentStep] = useState(4);

  /* ---------------- URL DATA ---------------- */
  const [initialUserData, setInitialUserData] = useState(null);

  /* ---------------- FLOW STATE ---------------- */
  const [userDetails, setUserDetails] = useState(null);
  const [aadharData, setAadharData] = useState(null);
  const [photoData, setPhotoData] = useState(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  const [cameraStream, setCameraStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);

  const totalSteps = 10;
  const questions = mockQuestions.default;

  /* ---------------- PARSE URL ONCE ---------------- */
  useEffect(() => {
    const segments = window.location.pathname.split("/").filter(Boolean);

    let name = "";
    let email = "";
    let testId = "";

    segments.forEach((segment) => {
      if (segment.startsWith("name:")) {
        name = decryptValue(decodeURIComponent(segment.replace("name:", "")));
      }

      if (segment.startsWith("emailid:")) {
        email = decryptValue(
          decodeURIComponent(segment.replace("emailid:", "")),
        );
      }

      if (segment.startsWith("testid:")) {
        testId = decryptValue(
          decodeURIComponent(segment.replace("testid:", "")),
        );
      }
    });

    setInitialUserData({ name, email, testId });
  }, []);

  /* ---------------- HELPERS ---------------- */
  const handleNext = () => setCurrentStep((s) => s + 1);

  const handleUserDetails = (data) => {
    setUserDetails(data);
    handleNext();
  };

  const handleAadharVerification = async (data) => {
    setAadharData(data);
    await startCamera();
    handleNext();
  };

  const handleSystemCheckComplete = ({ camera, screen }) => {
    setCameraStream(camera);
    setScreenStream(screen);
    setCurrentStep(6);
  };

  const handlePhotoCapture = (photo) => {
    setPhotoData(photo);
    handleNext();
  };

  const handleAnswer = (answer, timeSpent) => {
    const question = questions[currentQuestionIndex];
    setAnswers((prev) => [
      ...prev,
      { question: question.text, answer, time: timeSpent },
    ]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
    } else {
      handleNext();
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setUserDetails(null);
    setAadharData(null);
    setPhotoData(null);
    setCurrentQuestionIndex(0);
    setAnswers([]);
  };

  const startCamera = async () => {
    if (cameraStream) return cameraStream;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    setCameraStream(stream);
    return stream;
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div key="step1">
            <Step1Welcome onNext={handleNext} />
          </motion.div>
        )}

        {currentStep === 2 && initialUserData && (
          <motion.div key="step2">
            <Step2UserDetails
              initialData={initialUserData}
              onNext={handleUserDetails}
            />
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div key="step3">
            <Step3AadharVerification onNext={handleAadharVerification} />
          </motion.div>
        )}

        {currentStep === 4 && (
          <motion.div key="step4">
            <Step4PhotoCapture
              cameraStream={cameraStream}
              onNext={handlePhotoCapture}
            />
          </motion.div>
        )}

        {currentStep === 5 && (
          <motion.div key="step5">
            <Step4SystemCheck onNext={handleSystemCheckComplete} />
          </motion.div>
        )}

        {currentStep === 6 && (
          <motion.div key="step6">
            <Step5InterviewReady onNext={() => setCurrentStep(7)} />
          </motion.div>
        )}

        {currentStep === 7 && (
          <motion.div key="step7">
            <Step6Question
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              question={questions[currentQuestionIndex]}
              onAnswer={handleAnswer}
              systemReady={true}
              cameraStream={cameraStream}
              screenStream={screenStream}
            />
          </motion.div>
        )}

        {currentStep === 8 && (
          <motion.div key="step8">
            <Step7Completion onNext={handleNext} />
          </motion.div>
        )}

        {currentStep === 9 && (
          <motion.div key="step9">
            <Step8Results onRestart={handleRestart} />
          </motion.div>
        )}

        {currentStep === 10 && (
          <motion.div key="step10">
            <Step9ThankYou onRestart={handleRestart} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
