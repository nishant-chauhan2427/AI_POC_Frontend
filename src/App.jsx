import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Proctoring from "./pages/Proctoring";
import ReportAnalysis from "./pages/ReportAnalysis";
import CandidateSlotBooking from "./pages/SlotBooking"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/proctoring" element={<Proctoring />} />
        <Route path="/report" element={<ReportAnalysis />} />
        <Route path="/slot" element={<CandidateSlotBooking />} />
      </Routes>
    </Router>
  );
}

export default App;
