import React from 'react';
import { motion } from 'framer-motion';

interface ClinicHeadlineProps {
  onOpenBooking?: () => void;
}

export const ClinicHeadline: React.FC<ClinicHeadlineProps> = () => {
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
    </div>
  );
};
