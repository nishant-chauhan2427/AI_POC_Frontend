import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Added useParams
import { postJSON } from "../utils/api";
import { decryptValue } from "../utils/decrypt";
import { SparklesCore } from "@/components/ui/sparkles";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import SparklesBackground from "../components/BackGround";
export default function Register() {
  const recaptcha_token = import.meta.env.VITE_RECAPTCHA_KEY;
  console.log(recaptcha_token);

  // Extract URL parameters
  const { testid, emailid } = useParams();
  const cleanTestId = testid?.replace("testid:", "") || "";
  const cleanEmailId = emailid?.replace("emailid:", "") || "";
  console.log(cleanEmailId, "cleanEmailId");
  const decryptTestId = decryptValue(cleanTestId);
  console.log(decryptTestId, "cleanEmailId1");
  const decryptEmailId = decryptValue(cleanEmailId);
  console.log(decryptEmailId, "decryptEmailId");

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

  const isFormValid =
    name.trim() !== "" && email.trim() !== "" && testId.trim() !== "";

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
              .then((token) => resolve(token))
              .catch((err) => reject(err));
          });
        } else {
          reject("reCAPTCHA not ready");
        }
      });
    };

    try {
      const roleResponse = await postJSON("/register/check-role", {
        email: email.trim(),
      });

      if (roleResponse?.status !== "success") {
        throw new Error(roleResponse?.message || "Invalid email");
      }

      if (roleResponse?.role === "admin") {
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
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A] px-4">
      <SparklesBackground />
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="/PRAGYAN.AI-logo-dark.svg"
            alt="PRAGYAN.AI Logo"
            className="h-28 object-contain"
          />
        </div>

        {/* Card */}

        <div className="relative rounded-2xl bg-white/15 border border-white/20 p-6 sm:p-8 ">
          {/* Header */}
          <GlowingEffect
            blur={0}
            borderWidth={4}
            spread={80}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <div className="border-animation"></div>
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white tracking-tight">
              AI Interview Registration
            </h2>
            <p className="mt-2 text-sm text-white">
              Provide your information to proceed with the AI-driven interview
              process
            </p>
          </div>

          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm text-white mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              placeholder="As per Aadhaar"
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5
                     text-sm text-white placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-[#2974C3]
                     disabled:opacity-60"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm text-white mb-2">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5
                     text-sm text-white "
            />
          </div>

          {/* Test ID */}
          <div className="mb-6">
            <label className="block text-sm text-white mb-2">Test ID</label>
            <input
              type="text"
              value={testId}
              disabled
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5
                     text-sm text-white "
            />
          </div>

          {/* Error */}
          {error && (
            <p className="mb-4 text-xs text-red-400 text-center">{error}</p>
          )}

          {/* Button */}
          <button
            onClick={handleRegister}
            disabled={!isFormValid || isLoading}
            className={`w-full rounded-lg py-2.5 text-sm font-medium transition-all
    ${
      !isFormValid || isLoading
        ? "bg-white/20 text-gray-400 cursor-not-allowed"
        : "gradient-primary text-white hover:shadow-lg cursor-pointer"
    }`}
          >
            {isLoading ? "Initializing AI Session..." : "Start Session"}
          </button>

          {/* Footer */}
          <p className="mt-4 text-[11px] text-center text-white">
            Candidate ID will be generated automatically
          </p>
        </div>

        {/* Brand hint */}
        <p className="mt-6 text-center text-[14px] text-gray-600 flex items-center justify-end gap-1">
          <span>Powered by</span>

          <span className="font-semibold text-gray-400 flex items-center gap-[0.5] ">
            <img src="/logo.png" alt="" className="size-3" />

            <span> PRAGYAN AI</span>
          </span>
        </p>
      </div>
    </div>
  );
}
