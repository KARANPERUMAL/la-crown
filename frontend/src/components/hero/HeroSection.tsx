import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { LacrownWordmark } from './LacrownWordmark';
import { HeroImageCollage } from './HeroImageCollage';
import { ClinicHeadline } from './ClinicHeadline';
import { HeroHeader } from '../ui/HeroHeader';
import { MenuDrawer } from '../ui/MenuDrawer';
import { WhatsAppModal } from '../ui/WhatsAppModal';
import { BookingModal } from '../ui/BookingModal';

export interface HeroSectionProps {
  onOpenBooking?: () => void;
  onOpenWhatsApp?: () => void;
  onOpenMenu?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBooking,
  onOpenWhatsApp,
  onOpenMenu,
}) => {
  const [internalMenuOpen, setInternalMenuOpen] = useState(false);
  const [internalWhatsAppOpen, setInternalWhatsAppOpen] = useState(false);
  const [internalBookingOpen, setInternalBookingOpen] = useState(false);
  const [animationKey] = useState(0);
  const [isPinkTheme, setIsPinkTheme] = useState(false);
  const [isBottomInteractive, setIsBottomInteractive] = useState(true);

  const handleOpenMenu = onOpenMenu || (() => setInternalMenuOpen(true));
  const handleOpenWhatsApp = onOpenWhatsApp || (() => setInternalWhatsAppOpen(true));
  const handleOpenBooking = onOpenBooking || (() => setInternalBookingOpen(true));

  const containerRef = useRef<HTMLDivElement>(null);

  // Master scrubbed scroll progress across the pinned hero + services track (680vh)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Seamless background interpolation:
  // 1. Off-white (#FFF8F6) during opening hero collage & collapse (0.00 to 0.14)
  // 2. Interpolates to vivid brand pink (#E63886) during reverse-carousel reveal (0.14 to 0.22)
  // 3. STABLE HOLD at vivid brand pink (#E63886) for video showcase (0.22 to 0.34)
  // 4. Handoff to deep forest green (#00552F) (Service 1: Hair Treatment) (0.36 to 0.52)
  // 5. Service 2: Skin Treatment (#F6D5DE) (0.57 to 0.62)
  // 6. Service 3: Facial (#FAF3ED) (0.67 to 0.72)
  // 7. Service 4: Anti-Ageing Treatment (#C56882) (0.77 to 0.82)
  // 8. Service 5: Slimming Treatment (#D1C4B5) (0.87 to 0.92)
  // 9. Service 6: Semi-Permanent Make Up (#E63886) (0.97 to 1.00)
  const backgroundColor = useTransform(
    scrollYProgress,
    [
      0.0,
      0.14,
      0.22,
      0.34,
      0.38, 0.52,
      0.57, 0.62,
      0.67, 0.72,
      0.77, 0.82,
      0.87, 0.92,
      0.97, 1.0,
    ],
    [
      '#FFF8F6', // 0.00: Hero off-white
      '#FFF8F6', // 0.14: Hero off-white hold
      '#E63886', // 0.22: Video arrives (vivid pink)
      '#E63886', // 0.34: Video showcase hold (vivid pink)
      '#00552F', '#00552F', // Service 0: Hair Treatment (deep forest green)
      '#F6D5DE', '#F6D5DE', // Service 1: Skin Treatment (soft blush pink)
      '#FAF3ED', '#FAF3ED', // Service 2: Facial (warm cream)
      '#C56882', '#C56882', // Service 3: Anti-Ageing (muted rose)
      '#D1C4B5', '#D1C4B5', // Service 4: Slimming (cashmere taupe)
      '#E63886', '#E63886', // Service 5: Semi-Permanent Makeup (brand pink)
    ]
  );

  // Stage C: Oversized LACROWN wordmark travels continuously UPWARD with the scroll
  // Exits naturally through the top of the viewport
  const wordmarkY = useTransform(scrollYProgress, [0.0, 0.18], ['0%', '-140%']);
  const wordmarkOpacity = useTransform(scrollYProgress, [0.0, 0.14, 0.18], [1, 1, 0]);

  // Stage C: Left-side headline & eyebrow travel continuously UPWARD through the viewport
  const headlineY = useTransform(scrollYProgress, [0.0, 0.18], [-100, -420]);
  const headlineOpacity = useTransform(scrollYProgress, [0.0, 0.14, 0.18], [1, 1, 0]);

  // Subtle vertical centering adjustment for collage as wordmark leaves, holding throughout showcase & all services
  const collageTranslateY = useTransform(
    scrollYProgress,
    [0.0, 0.18, 1.0],
    ['20px', '-20px', '-20px']
  );

  // Reactive listener to toggle header contrast buttons when on dark background stages:
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const isDark =
      (latest >= 0.20 && latest <= 0.54) ||
      (latest >= 0.74 && latest <= 0.84) ||
      (latest >= 0.94);
    setIsPinkTheme(isDark);
    setIsBottomInteractive(latest < 0.10);
  });

  return (
    <div ref={containerRef} className="relative w-full h-[850vh]">
      {/* PINNED HERO & SERVICES VIEWPORT: Sticky for the duration of the 680vh track */}
      <motion.section
        style={{ backgroundColor }}
        className="sticky top-0 w-full h-[100svh] min-h-[580px] max-h-[1100px] flex flex-col justify-between overflow-hidden select-none"
      >
        {/* Editorial background subtle grain texture */}
        <div className="absolute inset-0 editorial-texture opacity-30 pointer-events-none z-0" />

        {/* TOP HEADER CONTROLS (Menu on left, WhatsApp on right, contrast-aware across themes) */}
        <HeroHeader
          onOpenMenu={handleOpenMenu}
          onOpenWhatsApp={handleOpenWhatsApp}
          isPinkTheme={isPinkTheme}
        />

        {/* REFINED BRAND WORDMARK: Below header controls, animates upward in Stage C */}
        <motion.div
          style={{ y: wordmarkY, opacity: wordmarkOpacity }}
          className="absolute top-[64px] sm:top-[68px] md:top-[72px] left-0 right-0 w-full flex justify-center items-center pointer-events-none select-none z-10"
          aria-hidden="true"
        >
          <LacrownWordmark />
        </motion.div>

        {/* CENTER STAGE: Overlapping 3-Image Collage, Video Card & Continuous Services Carousel */}
        <motion.div
          style={{ y: collageTranslateY }}
          className="relative z-20 flex-1 flex items-center justify-center w-full px-4 my-auto"
        >
          <HeroImageCollage
            scrollYProgress={scrollYProgress}
            animationKey={animationKey}
            onOpenBooking={handleOpenBooking}
          />
        </motion.div>

        {/* BOTTOM REGION: Clinic Headline (Left) */}
        <div
          className={`relative z-[15] w-full px-6 pb-5 sm:px-8 sm:pb-6 md:px-12 md:pb-6 lg:pb-7 flex flex-col md:flex-row md:items-end justify-between ${
            isBottomInteractive ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          {/* Lower-Left Zone: Headline moves UPWARD as user scrolls downward */}
          <motion.div
            style={{ y: headlineY, opacity: headlineOpacity }}
            className="pointer-events-auto max-w-lg -translate-y-4 sm:-translate-y-5"
          >
            <ClinicHeadline onOpenBooking={handleOpenBooking} />
          </motion.div>
        </div>

        {/* Accessible Modals and Drawers (Rendered internally if not supplied by parent) */}
        {!onOpenBooking && (
          <>
            <MenuDrawer
              isOpen={internalMenuOpen}
              onClose={() => setInternalMenuOpen(false)}
              onOpenBooking={() => setInternalBookingOpen(true)}
              onOpenWhatsApp={() => setInternalWhatsAppOpen(true)}
            />

            <WhatsAppModal
              isOpen={internalWhatsAppOpen}
              onClose={() => setInternalWhatsAppOpen(false)}
            />

            <BookingModal
              isOpen={internalBookingOpen}
              onClose={() => setInternalBookingOpen(false)}
            />
          </>
        )}
      </motion.section>
    </div>
  );
};
