import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, CheckCircle2, User, Phone, Sparkles } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    treatment: 'Facial Aesthetics & Glow',
    preferredDate: '',
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (!isOpen) setSubmitted(false);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/45 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-[#FFF8F6] rounded-2xl shadow-2xl p-6 sm:p-7 border border-[#F4DCE3] overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#F4DCE3]">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#E63886] font-semibold">
                  VIP Appointment
                </span>
                <h3 className="font-display font-extrabold text-[#00552F] text-2xl tracking-tight">
                  Consultation Request
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="w-9 h-9 rounded-full bg-[#FCE7EE] text-[#00552F] hover:bg-[#F9D0DF] transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#E63886]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-3"
              >
                <div className="w-16 h-16 rounded-full bg-[#00552F]/10 text-[#00552F] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9 text-[#00552F]" />
                </div>
                <h4 className="font-display font-bold text-xl text-[#00552F]">
                  Request Received
                </h4>
                <p className="text-sm text-[#666] max-w-xs mx-auto">
                  Our clinical concierge will contact you shortly to confirm your bespoke consultation time.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1A1A1A] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#E63886]" /> Full Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dr. Eleanor Vance"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8CCD5] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00552F] text-[#1A1A1A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#1A1A1A] flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#E63886]" /> Phone / WhatsApp
                  </label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 234-5678"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8CCD5] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00552F] text-[#1A1A1A]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1A1A1A] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#E63886]" /> Preferred Care
                    </label>
                    <select
                      value={formData.treatment}
                      onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8CCD5] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00552F] text-[#1A1A1A]"
                    >
                      <option>Facial Aesthetics & Glow</option>
                      <option>Medical Dermatology</option>
                      <option>Scalp & Hair Treatment</option>
                      <option>Nail Artistry & Wellness</option>
                      <option>Laser Rejuvenation</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#1A1A1A] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#E63886]" /> Date
                    </label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8CCD5] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00552F] text-[#1A1A1A]"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-[#8F7A82] pt-1">
                  Private consultations include in-depth 3D skin analysis and tailored dermatology guidance.
                </p>

                <button
                  type="submit"
                  className="w-full py-3 px-5 rounded-xl bg-[#00552F] hover:bg-[#003E22] text-white font-semibold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  Confirm Consultation Request
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
