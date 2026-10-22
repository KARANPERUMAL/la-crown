import React from 'react';
import { motion } from 'framer-motion';

interface ClinicHeadlineProps {
  onOpenBooking?: () => void;
}

export const ClinicHeadline: React.FC<ClinicHeadlineProps> = ({ onOpenBooking }) => {
  return (
    <div className="relative z-30 select-none max-w-2xl pointer-events-auto">
      {/* Eyebrow Label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="mb-1.5 sm:mb-2 flex items-center gap-2"
      >
        <span className="w-5 h-[1.5px] bg-[#A2697F]/60" />
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-semibold text-[#A2697F]">
          Dermatology & Aesthetic Care
        </span>
      </motion.div>

      {/* Main Two-Line Editorial Headline */}
      <div className="flex flex-col text-left">
        {/* Line 1: Dermatology strictly at 55px on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="pb-1"
        >
          <h1
            className="clinic-headline-1 font-extrabold tracking-[-0.035em] m-0 p-0"
            style={{
              fontSize: 'clamp(32px, 3.8vw, 55px)',
              lineHeight: 0.98,
            }}
          >
            Dermatology
          </h1>
        </motion.div>

        {/* Line 2: Aesthetic Clinic at 65px on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
          className="pb-1 mt-0.5 sm:mt-1"
        >
          <span
            className="clinic-headline-2 block font-extrabold tracking-[-0.035em] m-0 p-0"
            style={{
              fontSize: 'clamp(38px, 4.5vw, 65px)',
              lineHeight: 0.98,
            }}
          >
            Aesthetic Clinic
          </span>
        </motion.div>
      </div>

      {/* Subtle Micro-Tagline & Quick Consultation Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-3 sm:mt-4 flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#7A666D]"
      >
        <span className="inline-flex items-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E63886]" />
          Science-Backed Skin Rejuvenation
        </span>
        {onOpenBooking && (
          <button
            onClick={onOpenBooking}
            className="text-[#00552F] font-semibold hover:text-[#E63886] transition-colors underline underline-offset-4 cursor-pointer text-xs"
          >
            Book Consultation &rarr;
          </button>
        )}
      </motion.div>
    </div>
  );
};
