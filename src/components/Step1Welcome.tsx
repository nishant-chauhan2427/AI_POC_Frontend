import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface Step1WelcomeProps {
  onNext: () => void;
}

export function Step1Welcome({ onNext }: Step1WelcomeProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-primary/10 mb-8 pulse-glow"
        >
          <Sparkles className="w-12 h-12 text-primary" strokeWidth={1.5} />
        </motion.div>

        <h1 className="text-5xl mb-6">
          Welcome to <br />RAPYD EXCHANGE
        </h1>

        <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto">
          Get ready for an intelligent, automated interview process powered by PRAGYAN AI.
          We'll assess your skills and provide instant feedback.
        </p>

        <motion.button
          onClick={onNext}
          className="pointer px-10 py-4 bg-primary text-primary-foreground rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Next
        </motion.button>
      </motion.div>
    </div>
  );
}
