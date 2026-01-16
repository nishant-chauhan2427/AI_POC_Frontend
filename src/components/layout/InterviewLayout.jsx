import { Outlet, useLocation } from "react-router-dom";
import { StepIndicator } from "../StepIndicator";

const stepMap = {
  "/": 1,
  "/step-2": 2,
  "/step-3": 3,
  "/step-4": 4,
  "/step-5": 5,
  "/step-6": 6,
  "/step-7": 7,
  "/step-8": 8,
  "/step-9": 9,
  "/step-10": 10,
};

export default function InterviewLayout() {
  const location = useLocation();
  const currentStep = stepMap[location.pathname] || 1;

  return (
    <div className="min-h-screen relative">
      {/* Sidebar Stepper */}
      <StepIndicator currentStep={currentStep} totalSteps={10} />

      {/* Page content */}
      <div className="lg:pl-32">
        <Outlet />
      </div>
    </div>
  );
}
