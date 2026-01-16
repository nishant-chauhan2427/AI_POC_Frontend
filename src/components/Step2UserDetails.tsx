import { useState } from 'react';
import { motion } from 'motion/react';
import { User } from 'lucide-react';

interface Step2UserDetailsProps {
  onNext: (data: UserDetails) => void;
}

export interface UserDetails {
  name: string;
  email: string;
  phone: string;
  location: string;
}

export function Step2UserDetails({ onNext }: Step2UserDetailsProps) {
  const [formData, setFormData] = useState<UserDetails>({
    name: '',
    email: '',
    phone: '',
    location: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      onNext(formData);
    }
  };

  const handleChange = (field: keyof UserDetails, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-xl w-full"
      >
        <div className="glass-card rounded-3xl p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-2xl">Basic Details</h2>
              <p className="text-sm text-muted-foreground">Tell us about yourself</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full px-4 py-3 rounded-xl bg-input-background border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="your.email@example.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-input-background border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 rounded-xl bg-input-background border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="City, Country"
                className="w-full px-4 py-3 rounded-xl bg-input-background border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <motion.button
              type="submit"
              className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all mt-8"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Next
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
