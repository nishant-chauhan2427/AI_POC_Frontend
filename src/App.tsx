import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { StepIndicator } from './components/StepIndicator';
import { Step1Welcome } from './components/Step1Welcome';
import { Step2UserDetails, type UserDetails } from './components/Step2UserDetails';
import { Step3AadharVerification, type AadharData } from './components/Step3AadharVerification';
import { Step4PhotoCapture } from './components/Step4PhotoCapture';
import { Step4SystemCheck } from './components/Step4SystemCheck';
import { Step5InterviewReady } from './components/Step5InterviewReady';
import { Step6Question, type QuestionData } from './components/Step6Question';
import { Step7Completion } from './components/Step7Completion';
import { Step8Results } from './components/Step8Results';
import { Step9ThankYou } from './components/Step9ThankYou';

// Mock questions for different roles
const mockQuestions: Record<string, QuestionData[]> = {
  'software-engineer': [
    {
      id: '1',
      text: 'What is your experience with React and modern frontend frameworks?',
      type: 'multiple-choice',
      options: [
        'Expert - 5+ years with production applications',
        'Advanced - 2-5 years with multiple projects',
        'Intermediate - 1-2 years with some projects',
        'Beginner - Less than 1 year or learning',
      ],
    },
    {
      id: '2',
      text: 'Describe a challenging technical problem you solved recently and your approach to solving it.',
      type: 'open-ended',
    },
    {
      id: '3',
      text: 'How do you ensure code quality in your projects?',
      type: 'multiple-choice',
      options: [
        'Unit tests, code reviews, and automated CI/CD',
        'Manual testing and peer reviews',
        'Automated testing only',
        'Code reviews only',
      ],
    },
  ],
  'product-manager': [
    {
      id: '1',
      text: 'How do you prioritize features in a product roadmap?',
      type: 'multiple-choice',
      options: [
        'User impact, business value, and technical feasibility',
        'Business requirements only',
        'User requests and feedback',
        'Technical team recommendations',
      ],
    },
    {
      id: '2',
      text: 'Describe a time when you had to make a difficult product decision with limited data.',
      type: 'open-ended',
    },
    {
      id: '3',
      text: 'What metrics do you track to measure product success?',
      type: 'open-ended',
    },
  ],
  'default': [
    {
      id: '1',
      text: 'Tell us about your professional background and experience.',
      type: 'open-ended',
    },
    {
      id: '2',
      text: 'What motivates you in your work?',
      type: 'multiple-choice',
      options: [
        'Solving challenging problems',
        'Working with great teams',
        'Making an impact',
        'Learning and growth',
      ],
    },
    {
      id: '3',
      text: 'Where do you see yourself in 5 years?',
      type: 'open-ended',
    },
  ],
};

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [aadharData, setAadharData] = useState<AadharData | null>(null);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [jobRole, setJobRole] = useState<string>('');
  const [experienceLevel, setExperienceLevel] = useState<string>('');
  const [preferences, setPreferences] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<{ question: string; answer: string; time: number }>>([]);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
const [screenStream, setScreenStream] = useState<MediaStream | null>(null);

  const totalSteps = 10;

  const questions = mockQuestions[jobRole] || mockQuestions['default'];

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleUserDetails = (data: UserDetails) => {
    setUserDetails(data);
    handleNext();
  };

  const handleAadharVerification = (data: AadharData) => {
    setAadharData(data);
    handleNext();
  };

  const handlePhotoCapture = (photo: string) => {
    setPhotoData(photo);
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
    setAnswers(prev => [...prev, { question: question.text, answer, time: timeSpent }]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleNext();
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setUserDetails(null);
    setAadharData(null);
    setPhotoData(null);
    setJobRole('');
    setExperienceLevel('');
    setPreferences([]);
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

const startScreenShare = async () => {
  if (screenStream) return screenStream;

  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: false,
  });

  setScreenStream(stream);
  return stream;
};

  const goToStep4 = async () => {
    await startCamera(); // camera must already be live
    setCurrentStep(4);
  };

  const goToInterview = async () => {
    await startScreenShare(); // start screen before questions
    setCurrentStep(7);
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
            <Step3AadharVerification onNext={handleAadharVerification} />
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
            <Step4PhotoCapture
            cameraStream={cameraStream}
            onNext={() => setCurrentStep(5)}
          />
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
            <Step4SystemCheck onNext={() => setCurrentStep(6)} />
          </motion.div>
        )}

        {currentStep === 6 && (
          <motion.div
            key="step6"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <Step5InterviewReady onNext={goToInterview} />
          </motion.div>
        )}

        {currentStep === 7 && (
          <motion.div
            key="step7"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <Step6Question
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              question={questions[currentQuestionIndex]}
              onAnswer={handleAnswer}
              cameraStream={cameraStream}
            screenStream={screenStream}
            />

        
          </motion.div>
        )}

        {currentStep === 8 && (
          <motion.div
            key="step8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <Step7Completion onNext={handleNext} />
          </motion.div>
        )}

        {currentStep === 9 && (
          <motion.div
            key="step9"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Step8Results onRestart={() => setCurrentStep(9)} />
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
            <Step9ThankYou onRestart={handleRestart} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}