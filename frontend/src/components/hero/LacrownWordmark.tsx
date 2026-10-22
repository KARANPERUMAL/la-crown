import React from 'react';
import { motion } from 'framer-motion';
import iconL from '../../assets/font-icons/L_cropped.png';
import iconN from '../../assets/font-icons/N_cropped.png';

interface LacrownWordmarkProps {
  className?: string;
}

export const LacrownWordmark: React.FC<LacrownWordmarkProps> = ({ className = '' }) => {
  const letters = ['A', 'C', 'R', 'O', 'W'];

  return (
    <div
      className={`relative z-10 w-full flex items-center justify-center select-none pointer-events-none px-4 sm:px-6 overflow-visible ${className}`}
      aria-label="LACROWN"
    >
      <motion.div
        initial={{ opacity: 0, y: -36, scale: 0.98 }}
        animate={{ opacity: 1, y: -36, scale: 1 }}
        transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex items-center justify-center text-[#00552F] gap-[12px] sm:gap-[18px] md:gap-[24px]"
        style={{
          // Perfectly proportional wordmark spanning ~76-82% of viewport without overflow
          fontSize: 'clamp(3.0rem, 14.5vw, 13.2rem)',
          lineHeight: 0.85,
        }}
      >
        {/* L ICON: Custom ornamental letter L with reduced gap to letter A (~60% reduction) */}
        <div
          className="relative inline-flex items-center justify-center shrink-0 translate-y-[0.02em] -mr-[8px] sm:-mr-[12px] md:-mr-[17px]"
          style={{
            height: '0.94em',
            width: '0.76em',
          }}
        >
          <img
            src={iconL}
            alt="L"
            className="w-full h-full object-contain pointer-events-none"
            loading="eager"
            draggable={false}
          />
        </div>

        {/* ACROW: Each letter spaced with 28px gap */}
        <div className="inline-flex items-center gap-[16px] sm:gap-[22px] md:gap-[28px]">
          {letters.map((letter) => (
            <span
              key={letter}
              className="brand-condensed-acrow inline-block select-none"
              style={{
                letterSpacing: 0,
                WebkitTextStroke: '0.015em #00552F',
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* N ICON: Custom ornamental letter N */}
        <div
          className="relative inline-flex items-center justify-center shrink-0 translate-y-[0.01em]"
          style={{
            height: '0.94em',
            width: '0.98em',
          }}
        >
          <img
            src={iconN}
            alt="N"
            className="w-full h-full object-contain pointer-events-none"
            loading="eager"
            draggable={false}
          />
        </div>
      </motion.div>
    </div>
  );
};
