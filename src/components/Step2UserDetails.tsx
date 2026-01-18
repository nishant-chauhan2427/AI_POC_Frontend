import { useState } from "react";
import type { FormEvent } from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";

interface Step2UserDetailsProps {
  initialData: {
    name: string;
    email: string;
    testId: string;
  };
  onNext: (data: {
    name: string;
    email: string;
    testId: string;
  }) => void;
}

export function Step2UserDetails({
  initialData,
  onNext,
}: Step2UserDetailsProps) {
  /* ---------------- STATE ---------------- */
  const [isLoading, setIsLoading] = useState(false);

  const name = initialData.name || "";
  const email = initialData.email || "";
  const testId = initialData.testId || "";

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !email || !testId) return;

    setIsLoading(true);

    /* ✅ Save to localStorage */
    localStorage.setItem("candidate_name", name);
    localStorage.setItem("candidate_email", email);
    localStorage.setItem("test_id", testId);

    /* ✅ Move to next step */
    onNext({
      name,
      email,
      testId,
    });

    setIsLoading(false);
  };

  /* ---------------- UI (UNCHANGED) ---------------- */
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-xl w-full"
      >
        <div className="glass-card rounded-3xl p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-2xl">Basic Details</h2>
              <p className="text-sm text-muted-foreground">
                Here you can check your details
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                disabled
                className="w-full px-4 py-3 rounded-lg bg-input-background border border-border"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 rounded-lg bg-input-background border border-border"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Test ID
              </label>
              <input
                type="text"
                value={testId}
                disabled
                className="w-full px-4 py-3 rounded-lg bg-input-background border border-border"
              />
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? "Saving details..." : "Next"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
