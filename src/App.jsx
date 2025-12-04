import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Proctoring from "./pages/Proctoring";
import ReportAnalysis from "./pages/ReportAnalysis";
import CandidateSlotBooking from "./pages/SlotBooking"
import AadhaarCapture from "./pages/Aadhaarcard.jsx";
import CandidatePhotoCapture from "./pages/Candidatephoto.jsx";
import CandidateListingData from "./pages/candidatelisting.jsx";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/candidatedata" element={<CandidateListingData />} />
        <Route path="/" element={<Register />} />
        <Route path="/candidatephoto" element={<CandidatePhotoCapture />} />
        <Route path="/aadhaar" element={<AadhaarCapture />} />
        <Route path="/proctoring" element={<Proctoring />} />
        <Route path="/report" element={<ReportAnalysis />} />
        <Route path="/slot" element={<CandidateSlotBooking />} />
      </Routes>
    </Router>
  );
}

export default App;
