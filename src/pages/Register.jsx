import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Added useParams
import { postJSON } from "../utils/api";
import {decryptValue} from "../utils/decrypt"

export default function Register() {
  const styles = {
    page: {
      minHeight: '100vh',    
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      background: 'radial-gradient(1200px 600px at 10% 10%, rgba(99,102,241,0.18), transparent),\n                  radial-gradient(1200px 600px at 90% 20%, rgba(168,85,247,0.15), transparent),\n                  radial-gradient(1200px 600px at 10% 90%, rgba(59,130,246,0.12), transparent),\n                  #0b1020',
      color: '#fff',
      position: 'relative'
    },
    logo: {
      position: 'absolute',
      top: 1,
      left: 20,
      zIndex: 10 
    },
    card: {
      width: '100%',
      maxWidth: 540,
      background: 'rgba(255,255,255,0.08)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderRadius: 16,
      padding: 24,
      boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: 16
    },
    header: { marginBottom: 0 },
    title: { fontSize: 24, fontWeight: 800, marginBottom: 6 },
    subtitle: { color: 'rgba(255,255,255,0.85)' },
    inputWrap: { },
    label: { display: 'block', marginBottom: 8, fontWeight: 700 },
    input: {
      width: '100%',
      padding: '12px 14px',
      borderRadius: 10,
      border: '1px solid rgba(255,255,255,0.25)',
      background: 'rgba(0,0,0,0.25)',
      color: '#fff',
      outline: 'none',
      boxSizing: 'border-box'
    },
    autoFillInput: { // New style for auto-filled field
      ...{
        width: '100%',
        padding: '12px 14px',
        borderRadius: 10,
        border: '2px solid rgba(34, 197, 94, 0.5)',
        background: 'rgba(34, 197, 94, 0.1)',
        color: '#22c55e',
        fontWeight: 600,
        outline: 'none',
        boxSizing: 'border-box'
      }
    },
    error: {
      color: 'rgb(252,165,165)',
      background: 'rgba(239,68,68,0.12)',
      border: '1px solid rgba(248,113,113,0.35)',
      borderRadius: 10,
      padding: '8px 12px',
      marginTop: 0
    },
    button: {
      width: '100%',
      marginTop: 4,
      padding: '12px 16px',
      fontWeight: 800,
      borderRadius: 10,
      color: '#fff',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #3b82f6)',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 10px 20px rgba(0,0,0,0.25)'
    },
    buttonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed'
    },
    footer: { marginTop: 8, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },
    infoText: { 
      background: 'rgba(34, 197, 94, 0.15)', 
      border: '1px solid rgba(34, 197, 94, 0.3)', 
      borderRadius: 8, 
      padding: 12, 
      marginBottom: 16,
      color: '#22c55e',
      fontWeight: 500
    }
  };

  const recaptcha_token = import.meta.env.VITE_RECAPTCHA_KEY;
  console.log(recaptcha_token);
  
  // Extract URL parameters
  const { testid,emailid } = useParams();
  const cleanTestId = testid?.replace("testid:", "") || "";
  const cleanEmailId = emailid?.replace("emailid:", "") || "";
  console.log(cleanEmailId,"cleanEmailId");
  const decryptTestId = decryptValue(cleanTestId)
  console.log(decryptTestId,"cleanEmailId1");
  const decryptEmailId = decryptValue(cleanEmailId)
  console.log(decryptEmailId,"decryptEmailId");

  const [name, setName] = useState("");
  const [email, setEmail] = useState(decryptEmailId || "");
  const [testId, setTestId] = useState(decryptTestId || "");
  // const [bookingId, setBookingId] = useState(decryptBooking || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.grecaptcha) {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${recaptcha_token}`;
      script.async = true;
      document.body.appendChild(script);
    }
  }, [recaptcha_token]);

  const isFormValid = name.trim() !== "" && email.trim() !== "" && testId.trim() !== "";

  async function handleRegister() {
    if (!name.trim()) return setError("Please enter your name");
    if (!testId.trim()) return setError("Please enter your test ID");
    if (!email.trim()) return setError("Please enter your email ID");
  
    setError("");
    setIsLoading(true);

    const executeRecaptcha = async () => {
      return new Promise((resolve, reject) => {
        if (window.grecaptcha) {
          window.grecaptcha.ready(() => {
            window.grecaptcha
              .execute(recaptcha_token, { action: "submit" })
              .then(token => resolve(token))
              .catch(err => reject(err));
          });
        } else {
          reject("reCAPTCHA not ready");
        }
      });
    };
    
    try {
      const roleResponse = await postJSON("/register/check-role/", { 
        email: email.trim(),
      });
      
      if (roleResponse?.status !== "success") {
        throw new Error(roleResponse?.message || "Invalid email");
      }

      if(roleResponse?.role === "admin") {
        navigate("/candidatedata");
      } else {
        const token = await executeRecaptcha();

        const regResponse = await postJSON("/register/", { 
          name: name.trim(),
          test_id: testId.trim(),
          email: email.trim(),
          recaptcha_token: token,
          // slot_id: bookingId // Added slot_id to backend payload
        });
        
        localStorage.setItem("candidate_name", regResponse.name);
        localStorage.setItem("candidate_id", regResponse.candidate_id);
        localStorage.setItem("test_id", regResponse.test_id);
        localStorage.setItem("session_id", regResponse.session_id);
        // localStorage.setItem("bookingId", bookingId); // Store slot_id
        
        navigate(`/aadhaar?session_id=${regResponse.session_id}`);
      } 
    } catch (err) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <img 
        src="/PRAGYAN.AI-logo-dark.svg" 
        height={140} 
        width={280} 
        style={styles.logo}
        alt="PRAGYAN.AI Logo"
      />
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Candidate Registration</h2>
          <p style={styles.subtitle}>
             Please enter your full name to start your proctoring session
          </p>
        </div>

        {/* Show Test ID info when auto-filled */}
        {/* {testId && (
          <div style={styles.infoText}>
            ✅ Test ID: <strong>{testId}</strong> {slotId && `| Slot ID: ${slotId}`}
          </div>
        )} */}

        <div style={styles.inputWrap}>
          <label>
            <span style={styles.label}>Full Name</span>
            <input
              style={styles.input}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name as per aadhaar card"
              disabled={isLoading}
            />
          </label>
        </div>

        <div style={styles.inputWrap}>
          <label>
            <span style={styles.label}>Enter Email</span>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email id"
              disabled={true}
            />
          </label>
        </div>
        
          <div style={styles.inputWrap}>
            <label>
              <span style={styles.label}>Test ID</span>
              <input
                style={styles.input}
                type="text"
                value={testId}
                onChange={(e) => setTestId(e.target.value)}
                placeholder="Enter your test ID"
                disabled={true}
              />
            </label>
          </div>
        

        {error && <p style={styles.error}>{error}</p>}

        <button 
          onClick={handleRegister} 
          style={{ ...styles.button, ...((!isFormValid || isLoading) ? styles.buttonDisabled : {}) }} 
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? "Registering..." : "Start Session"}
        </button>
        
        <p style={styles.footer}>
         Your candidate ID will be generated automatically.
        </p>
      </div>
    </div>
  );
}
