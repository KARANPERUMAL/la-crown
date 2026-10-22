import React, { useRef, useState, useEffect } from 'react';
import {
  motion,
  useTransform,
  useReducedMotion,
  useMotionValue,
  animate,
  useMotionValueEvent,
  MotionValue,
  AnimatePresence,
} from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, ArrowUpRight, Calendar, Sparkles } from 'lucide-react';
import { SERVICES_DATA, ServiceItem } from '../../data/servicesData';

interface HeroImageCollageProps {
  scrollYProgress: MotionValue<number>;
  animationKey?: number;
  onOpenBooking?: () => void;
}

interface ServiceStackCardProps {
  service: ServiceItem;
  index: number;
  trainPosition: MotionValue<number>;
  pitch: number;
  cardWidth: string;
  cardHeight: string;
  isFeatured: boolean;
  onOpenBooking?: () => void;
  isMobile?: boolean;
}

const ServiceStackCard: React.FC<ServiceStackCardProps> = ({
  service,
  index,
  trainPosition,
  pitch,
  cardWidth,
  cardHeight,
  isFeatured,
  onOpenBooking,
  isMobile = false,
}) => {
  // Clamped horizontal translation:
  // Glides in smoothly from the right, then clamps at 0px (exact center) permanently.
  // Each subsequent card stacks over previous center cards with ascending zIndex.
  const cardX = useTransform(trainPosition, (pos) => {
    const rawX = pos + index * pitch;
    return Math.max(0, rawX);
  });

  const cardZIndex = 15 + index * 5;

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: 0,
        x: cardX,
        zIndex: cardZIndex,
      }}
      className="will-change-transform flex items-center justify-center"
    >
      <div
        onClick={onOpenBooking}
        style={{
          width: cardWidth,
          height: cardHeight,
          transform: 'translateX(-50%)',
        }}
        className={`relative rounded-[16px] sm:rounded-[18px] overflow-hidden luxury-card-shadow border-2 group cursor-pointer select-none transition-all duration-300 ${
          isFeatured
            ? 'border-white/95 ring-2 ring-[#E63886]/50 shadow-2xl scale-[1.0]'
            : 'border-white/80 shadow-md'
        }`}
      >
        <img
          src={service.image}
          alt={`${service.title} at LACROWN`}
          className="w-full h-full object-cover object-center filter saturate-[1.06] contrast-[1.02] group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 pointer-events-none" />

        {/* Top Badge: Treatment Number & Clinical Indicator */}
        <div className="absolute top-2.5 left-2.5 right-2.5 sm:top-3 sm:left-3 sm:right-3 flex items-center justify-between pointer-events-none z-10">
          <div className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-black/45 backdrop-blur-md text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase text-white/95 border border-white/20">
            {service.number} &bull; {service.badgeText}
          </div>

          <div
            className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full backdrop-blur-md border border-white/40 flex items-center justify-center text-white transition-all ${
              isFeatured
                ? 'bg-[#E63886] border-[#E63886] scale-105 shadow-sm'
                : 'bg-white/20 group-hover:bg-[#E63886]'
            }`}
          >
            <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
        </div>

        {/* Bottom Card Content: Treatment Title always visible, extra details reveal smoothly when isFeatured */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3.5 sm:left-3.5 sm:right-3.5 text-left pointer-events-none z-10">
          {/* Treatment Name: Always visible editorial typography */}
          <h4
            className={`service-display-heading text-white leading-[0.88] tracking-tight drop-shadow-md ${
              isMobile ? 'text-xl' : 'text-[clamp(19px,2.1vw,30px)]'
            }`}
          >
            {service.title}
          </h4>

          {/* Full Details: Category, Tagline, Benefits - reveals smoothly only when isFeatured in center spotlight */}
          <div
            className={`transition-all duration-300 ease-out overflow-hidden ${
              isFeatured
                ? 'opacity-100 max-h-[140px] mt-1'
                : 'opacity-0 max-h-0 mt-0 pointer-events-none'
            }`}
          >
            <div className="text-[9px] sm:text-[10px] font-semibold text-[#F49AB9] tracking-wider uppercase mb-0.5">
              {service.category}
            </div>

            <p className="text-[10px] sm:text-[11px] text-white/90 line-clamp-2 leading-snug font-normal">
              {service.tagline}
            </p>

            <div className="mt-1.5 flex flex-wrap gap-1">
              {service.benefits.slice(0, 2).map((benefit) => (
                <span
                  key={benefit}
                  className="px-1.5 sm:px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-sm text-[8px] sm:text-[9px] text-white/95 font-medium"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const HeroImageCollage: React.FC<HeroImageCollageProps> = ({
  scrollYProgress,
  animationKey = 0,
  onOpenBooking,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasAutoplayTriggered, setHasAutoplayTriggered] = useState(false);
  const [isVideoDominant, setIsVideoDominant] = useState(false);

  // Active Service State & Scroll Direction for Left-Side Text Animation
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'down' | 'up'>('down');
  const [isServicesActive, setIsServicesActive] = useState(false);
  const prevProgress = useRef(0);

  // =========================================================================
  // STAGE B: INITIAL REVEAL (On Mount & Replay)
  //
  // Side images emerge from directly behind the center card (0%) outward
  // to their resting positions (-52% left, +52% right), where both side
  // cards are clearly visible behind the foreground center card.
  // =========================================================================
  const revealProgress = useMotionValue(1);

  useEffect(() => {
    if (scrollYProgress.get() < 0.05) {
      revealProgress.set(0);
      const controls = animate(revealProgress, 1, {
        duration: 1.6,
        ease: [0.16, 1, 0.3, 1],
      });
      return () => controls.stop();
    } else {
      revealProgress.set(1);
    }
  }, [animationKey]);

  // =========================================================================
  // STAGE C: SCROLL COLLAPSE (Scroll 0.00 to 0.18)
  //
  // Side cards collapse inward behind the center card without rushing.
  // =========================================================================
  const scrollCollapse = useTransform(scrollYProgress, [0.0, 0.18], [0, 1]);

  // LEFT CARD: hero-img2.jpg (Scalp & Hair)
  const leftCardX = useTransform([revealProgress, scrollCollapse], ([rev, col]) => {
    if (shouldReduceMotion) return '-52%';
    const val = (rev as number) * (1 - (col as number)) * -89;
    return `${val}%`;
  });

  const leftCardRotate = useTransform([revealProgress, scrollCollapse], ([rev, col]) => {
    if (shouldReduceMotion) return 0;
    return (rev as number) * (1 - (col as number)) * -4.2;
  });

  // RIGHT CARD: hero-img3.jpg (Nail Artistry)
  const rightCardX = useTransform([revealProgress, scrollCollapse], ([rev, col]) => {
    if (shouldReduceMotion) return '52%';
    const val = (rev as number) * (1 - (col as number)) * 89;
    return `${val}%`;
  });

  const rightCardRotate = useTransform([revealProgress, scrollCollapse], ([rev, col]) => {
    if (shouldReduceMotion) return 0;
    return (rev as number) * (1 - (col as number)) * 4.2;
  });

  const sideCardScale = useTransform(
    scrollYProgress,
    [0.0, 0.18],
    shouldReduceMotion ? [1, 1] : [1.0, 0.82]
  );

  const sideCardOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.13, 0.18],
    [1.0, 1.0, 0.0]
  );

  // =========================================================================
  // VIDEO CARD: REVERSE CAROUSEL REVEAL (0.14 to 0.24)
  // STAGE A: STABLE SHOWCASE HOLD (0.24 to 0.34)
  // STAGE B & C: REMAINS ANCHORED IN CENTER DURING HEADING EXIT & HANDOFF (0.34 to 0.48)
  // Covered completely by Service Card 1 at 0.48, then dissolves cleanly behind it
  // =========================================================================
  const videoCardX = useTransform(
    scrollYProgress,
    [0.14, 0.24, 0.52],
    shouldReduceMotion ? [0, 0, 0] : [80, 0, 0]
  );
  const videoCardY = useTransform(
    scrollYProgress,
    [0.14, 0.24, 0.52],
    shouldReduceMotion ? [0, 0, 0] : [35, 0, 0]
  );
  const videoCardRotate = useTransform(
    scrollYProgress,
    [0.14, 0.24, 0.52],
    shouldReduceMotion ? [0, 0, 0] : [4.5, 0, 0]
  );
  const videoCardScale = useTransform(
    scrollYProgress,
    [0.14, 0.24, 0.52],
    shouldReduceMotion ? [1, 1, 1] : [0.90, 1.0, 1.0]
  );
  const videoCardOpacity = useTransform(
    scrollYProgress,
    [0.13, 0.20, 0.54, 0.56],
    [0.0, 1.0, 1.0, 0.0]
  );

  // ORIGINAL CENTER STILL CARD (hero-img1.jpg - Facial Glow):
  // Peels away and dissolves as video card takes prominence
  const centerStillX = useTransform(
    scrollYProgress,
    [0.0, 0.16, 0.26],
    shouldReduceMotion ? [0, 0, 0] : [0, 0, -75]
  );
  const centerStillY = useTransform(
    scrollYProgress,
    [0.0, 0.16, 0.26],
    shouldReduceMotion ? [-25, -25, -25] : [-25, -25, -53]
  );
  const centerStillRotate = useTransform(
    scrollYProgress,
    [0.0, 0.16, 0.26],
    shouldReduceMotion ? [0, 0, 0] : [0, 0, -4.0]
  );
  const centerStillScale = useTransform(
    scrollYProgress,
    [0.0, 0.16, 0.26],
    shouldReduceMotion ? [1, 1, 1] : [1.0, 1.0, 1.03]
  );
  const centerStillOpacity = useTransform(
    scrollYProgress,
    [0.0, 0.16, 0.26],
    [1.0, 1.0, 0.0]
  );

  // Dynamic shadow elevation for video card
  const videoCardShadow = useTransform(
    scrollYProgress,
    [0.18, 0.28, 0.38],
    [
      '0 20px 40px -15px rgba(0, 0, 0, 0.25)',
      '0 28px 56px -12px rgba(0, 0, 0, 0.38), 0 12px 24px -6px rgba(230, 56, 134, 0.15)',
      '0 32px 64px -14px rgba(0, 0, 0, 0.45), 0 16px 32px -8px rgba(0, 0, 0, 0.25)',
    ]
  );

  // Video playback management:
  // Plays while video card is centered & holding (0.22 to 0.48), pauses outside
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setIsVideoDominant(latest >= 0.22 && latest <= 0.48);

    if (latest >= 0.22 && latest <= 0.48) {
      if (videoRef.current && videoRef.current.paused && !hasAutoplayTriggered) {
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setHasAutoplayTriggered(true);
          })
          .catch(() => {});
      }
    } else if (latest < 0.12 || latest > 0.52) {
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }

    // Determine scroll direction for text transition
    if (latest > prevProgress.current) {
      setSlideDirection('down');
    } else if (latest < prevProgress.current) {
      setSlideDirection('up');
    }
    prevProgress.current = latest;

    // Determine active service index (0 to 5) matching the stacked arrival keyframes
    let sIndex = 0;
    if (latest >= 0.985) sIndex = 5;
    else if (latest >= 0.915) sIndex = 4;
    else if (latest >= 0.815) sIndex = 3;
    else if (latest >= 0.70) sIndex = 2;
    else if (latest >= 0.57) sIndex = 1;
    else sIndex = 0;

    setActiveServiceIndex(sIndex);
    setIsServicesActive(latest >= 0.38);
  });

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  // =========================================================================
  // PINK SECTION SERVICE HEADINGS (Stage 2 Reveal, Stage 3 Hold, Exit)
  // Left:  ADVANCED HAIR SOLUTIONS (warm cream #FFF0E9)
  // Right: ADVANCED SEMI-PERMANENT MAKEUP (soft pink #F49AB9)
  // =========================================================================
  const serviceLeftY = useTransform(
    scrollYProgress,
    [0.14, 0.24, 0.34, 0.41],
    shouldReduceMotion ? [0, 0, 0, 0] : [160, 0, 0, -560]
  );
  const serviceLeftOpacity = useTransform(
    scrollYProgress,
    [0.14, 0.20, 0.39, 0.41],
    [0, 1, 1, 0]
  );
  const serviceLeftX = useTransform(
    scrollYProgress,
    [0.14, 0.24],
    shouldReduceMotion ? [0, 0] : [-25, 0]
  );

  const serviceRightY = useTransform(
    scrollYProgress,
    [0.16, 0.26, 0.34, 0.41],
    shouldReduceMotion ? [0, 0, 0, 0] : [160, 0, 0, -560]
  );
  const serviceRightOpacity = useTransform(
    scrollYProgress,
    [0.16, 0.22, 0.39, 0.41],
    [0, 1, 1, 0]
  );
  const serviceRightX = useTransform(
    scrollYProgress,
    [0.16, 0.26],
    shouldReduceMotion ? [0, 0] : [25, 0]
  );

  // Mobile vertical motion for pink headings (<1024px)
  const serviceMobileTopY = useTransform(
    scrollYProgress,
    [0.14, 0.24, 0.34, 0.41],
    shouldReduceMotion ? [0, 0, 0, 0] : [50, 0, 0, -320]
  );
  const serviceMobileBottomY = useTransform(
    scrollYProgress,
    [0.16, 0.26, 0.34, 0.41],
    shouldReduceMotion ? [0, 0, 0, 0] : [50, 0, 0, -320]
  );

  // =========================================================================
  // STAGE 5: SERVICES SHOWCASE (Scroll 0.41 to 1.00)
  //
  // 1. Left-Side Service Information: enters cleanly from below (0.41 to 0.48)
  //    only AFTER video-stage headings have exited through the top edge.
  // 2. Service Cards: enter from the right (0.41 to 0.48) directly into
  //    the central anchor to cover and replace the stationary video card!
  // 3. Horizontal translation maps through the 6 service cards (0.48 to 0.93).
  // =========================================================================

  // Left-Side Service Info Container: enters smoothly from below into left flank
  const servicesInfoY = useTransform(
    scrollYProgress,
    [0.38, 0.44],
    shouldReduceMotion ? [0, 0] : [260, 0]
  );
  const servicesInfoOpacity = useTransform(
    scrollYProgress,
    [0.38, 0.43],
    [0, 1]
  );

  // Services Gallery Container Opacity: fades in cleanly at 0.38 - 0.42
  const galleryOpacity = useTransform(
    scrollYProgress,
    [0.38, 0.42],
    [0, 1]
  );

  // Desktop Horizontal Pitch: 310px pitch (285px card width + 25px clear visual gap)
  const DESKTOP_PITCH = 310;
  const trainPositionDesktop = useTransform(
    scrollYProgress,
    [
      0.38, // Card 0 starts outside right edge (+760px)
      0.50, // Card 0 reaches 0px (exact center overlay over video card)
      0.56, // Card 0 holds at center
      0.63, // Card 1 reaches 0px (train at -310px)
      0.67, // Card 1 holds at center
      0.74, // Card 2 reaches 0px (train at -620px)
      0.79, // Card 2 holds at center
      0.85, // Card 3 reaches 0px (train at -930px)
      0.90, // Card 3 holds at center
      0.95, // Card 4 reaches 0px (train at -1240px)
      0.97, // Card 4 holds at center
      0.99, // Card 5 reaches 0px (train at -1550px)
      1.00, // Card 5 holds at center
    ],
    shouldReduceMotion
      ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      : [
          760,
          0,
          0,
          -1 * DESKTOP_PITCH,
          -1 * DESKTOP_PITCH,
          -2 * DESKTOP_PITCH,
          -2 * DESKTOP_PITCH,
          -3 * DESKTOP_PITCH,
          -3 * DESKTOP_PITCH,
          -4 * DESKTOP_PITCH,
          -4 * DESKTOP_PITCH,
          -5 * DESKTOP_PITCH,
          -5 * DESKTOP_PITCH,
        ]
  );

  // Mobile Horizontal Pitch: 270px pitch between cards
  const MOBILE_PITCH = 270;
  const trainPositionMobile = useTransform(
    scrollYProgress,
    [
      0.38,
      0.50,
      0.56,
      0.63,
      0.67,
      0.74,
      0.79,
      0.85,
      0.90,
      0.95,
      0.97,
      0.99,
      1.00,
    ],
    shouldReduceMotion
      ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      : [
          600,
          0,
          0,
          -1 * MOBILE_PITCH,
          -1 * MOBILE_PITCH,
          -2 * MOBILE_PITCH,
          -2 * MOBILE_PITCH,
          -3 * MOBILE_PITCH,
          -3 * MOBILE_PITCH,
          -4 * MOBILE_PITCH,
          -4 * MOBILE_PITCH,
          -5 * MOBILE_PITCH,
          -5 * MOBILE_PITCH,
        ]
  );

  // Active Service Data & Contrast Colors
  const activeService: ServiceItem = SERVICES_DATA[activeServiceIndex] || SERVICES_DATA[0];
  const isLightBackground =
    activeServiceIndex === 1 || activeServiceIndex === 2 || activeServiceIndex === 4;

  // Dynamic text color for OUR SERVICES heading based on background
  const servicesHeadingColor = useTransform(
    scrollYProgress,
    [
      0.36,
      0.38, 0.55, // Service 1 (Hair Treatment): #00552F (dark) -> text #FFF8F6
      0.57, 0.66, // Service 2 (Skin Treatment): #F6D5DE (light) -> text #00552F
      0.69, 0.78, // Service 3 (Facial): #FAF3ED (light) -> text #00552F
      0.80, 0.89, // Service 4 (Anti-Ageing): #C56882 (dark) -> text #FFF8F6
      0.91, 0.96, // Service 5 (Slimming): #D1C4B5 (light) -> text #00552F
      0.98, 1.00, // Service 6 (Semi-Permanent): #E63886 (dark) -> text #FFF8F6
    ],
    [
      '#FFF8F6',
      '#FFF8F6', '#FFF8F6',
      '#00552F', '#00552F',
      '#00552F', '#00552F',
      '#FFF8F6', '#FFF8F6',
      '#00552F', '#00552F',
      '#FFF8F6', '#FFF8F6',
    ]
  );

  // Proportional card dimensions ensuring single viewport fit at 1440x900
  const centerCardDims = {
    width: 'clamp(170px, 20vw, 285px)',
    height: 'clamp(240px, 28vw, 400px)',
  };

  const sideCardDims = {
    width: 'clamp(140px, 17vw, 245px)',
    height: 'clamp(180px, 22vw, 315px)',
  };

  return (
    <div
      key={animationKey}
      className="relative flex items-center justify-between select-none w-full max-w-[1580px] mx-auto px-4 min-h-[460px]"
    >
      {/* =================================================================== */}
      {/* MOBILE / TABLET DISPLAY HEADING: TOP (< 1024px)                     */}
      {/* 1. ADVANCED HAIR SOLUTIONS during Stage 2 & 3                       */}
      {/* 2. OUR SERVICES during Stage 5                                      */}
      {/* =================================================================== */}
      <motion.div
        style={{ opacity: serviceLeftOpacity, y: serviceMobileTopY }}
        className="lg:hidden absolute bottom-[calc(50%+130px)] sm:bottom-[calc(50%+160px)] left-0 right-0 mx-auto w-[92vw] max-w-[480px] flex justify-center text-center z-20 pointer-events-none px-2"
      >
        <div className="service-display-heading text-[#FFF0E9] text-center text-[clamp(22px,5.4vw,34px)] leading-[0.9] tracking-tight drop-shadow-md">
          ADVANCED HAIR SOLUTIONS
        </div>
      </motion.div>

      {/* MOBILE / TABLET SERVICES HEADER (< 1024px) during Stage 5 */}
      <motion.div
        style={{ opacity: servicesInfoOpacity }}
        className={`lg:hidden absolute top-2 left-0 right-0 mx-auto px-4 flex flex-col items-center text-center z-30 ${
          isServicesActive ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-2 h-2 rounded-full shadow-sm animate-pulse"
            style={{ backgroundColor: activeService.accentColorHex }}
          />
          <span
            className="text-[10px] font-bold uppercase tracking-widest transition-colors duration-300"
            style={{ color: isLightBackground ? '#00552F' : '#FFF8F6' }}
          >
            Service {activeService.number} / 06 &bull; {activeService.category}
          </span>
        </div>
        <motion.h2
          style={{ color: servicesHeadingColor }}
          className="brand-condensed-acrow text-3xl sm:text-4xl leading-none tracking-tight"
        >
          OUR SERVICES
        </motion.h2>
      </motion.div>

      {/* =================================================================== */}
      {/* LEFT COLUMN: Dual State (Pink Heading 1 OR Services Info Panel)     */}
      {/* =================================================================== */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-end pr-8 xl:pr-14 relative z-40 min-h-[400px]">
        
        {/* State A: Pink Service Display Heading (ADVANCED HAIR SOLUTIONS) */}
        <motion.div
          style={{
            opacity: serviceLeftOpacity,
            x: serviceLeftX,
            y: serviceLeftY,
          }}
          className="service-display-heading text-[#FFF0E9] text-right drop-shadow-md select-none pointer-events-none absolute inset-0 my-auto flex flex-col justify-center items-end pr-8 xl:pr-14"
        >
          <div className="text-[clamp(44px,5.2vw,86px)] leading-[0.84] tracking-tight">ADVANCED</div>
          <div className="text-[clamp(44px,5.2vw,86px)] leading-[0.84] tracking-tight">HAIR</div>
          <div className="text-[clamp(44px,5.2vw,86px)] leading-[0.84] tracking-tight">SOLUTIONS</div>
        </motion.div>

        {/* State B: Left Services Information Panel (Enters cleanly from below at 0.41) */}
        <motion.div
          style={{
            opacity: servicesInfoOpacity,
            y: servicesInfoY,
          }}
          className={`flex flex-col justify-center text-left w-full max-w-[320px] xl:max-w-[350px] pr-4 xl:pr-6 relative z-40 ${
            isServicesActive ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          {/* Eyebrow / Category & live pulsation indicator */}
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <span
              className="w-2.5 h-2.5 rounded-full shadow-sm animate-pulse"
              style={{ backgroundColor: activeService.accentColorHex }}
            />
            <span
              className="text-[11px] sm:text-xs font-bold uppercase tracking-widest transition-colors duration-300"
              style={{ color: isLightBackground ? '#00552F' : '#FFF8F6' }}
            >
              Service {activeService.number} / 06 &bull; {activeService.category}
            </span>
          </div>

          {/* Persistent Anchored Typography: OUR SERVICES */}
          <motion.h2
            style={{ color: servicesHeadingColor }}
            className="brand-condensed-acrow text-[clamp(46px,5.4vw,96px)] leading-[0.84] tracking-tight drop-shadow-sm select-none"
          >
            OUR<br className="hidden sm:inline" /> SERVICES
          </motion.h2>

          {/* Direction-Aware Upward Sliding Service Content Block */}
          <div className="relative overflow-hidden min-h-[160px] sm:min-h-[190px] mt-2 sm:mt-3">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeServiceIndex}
                initial={{
                  y: slideDirection === 'down' ? 35 : -35,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                exit={{
                  y: slideDirection === 'down' ? -35 : 35,
                  opacity: 0,
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col text-left"
              >
                <h3
                  className="text-base sm:text-lg font-bold tracking-tight transition-colors duration-300"
                  style={{ color: isLightBackground ? '#00552F' : '#FFF8F6' }}
                >
                  {activeService.title}
                </h3>

                <p
                  className="mt-1.5 text-xs sm:text-sm line-clamp-3 leading-relaxed opacity-90 transition-colors duration-300 font-normal max-w-[280px] xl:max-w-[310px]"
                  style={{ color: isLightBackground ? '#200B14' : '#FFF8F6' }}
                >
                  {activeService.description}
                </p>

                {/* Consultation CTA & Duration */}
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onOpenBooking}
                    className="group inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 cursor-pointer"
                    style={{
                      backgroundColor: isLightBackground ? '#00552F' : '#FFF8F6',
                      color: isLightBackground ? '#FFF8F6' : '#00552F',
                    }}
                    aria-label={`Book consultation for ${activeService.title}`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Consultation</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>

                  <span
                    className="inline-flex items-center gap-1 text-[11px] font-semibold opacity-80 tracking-wider uppercase"
                    style={{ color: isLightBackground ? '#00552F' : '#FFF8F6' }}
                  >
                    <Sparkles className="w-3 h-3 text-[#E63886]" />
                    <span>{activeService.treatmentTime}</span>
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Stepper Progress Indicators */}
          <div className="flex items-center gap-1.5 mt-4 sm:mt-5">
            {SERVICES_DATA.map((srv, idx) => (
              <div
                key={srv.id}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === activeServiceIndex
                    ? 'w-7 bg-[#E63886]'
                    : isLightBackground
                    ? 'w-2 bg-[#00552F]/25'
                    : 'w-2 bg-white/30'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* =================================================================== */}
      {/* CENTRAL COMPOSITION ANCHOR: Houses Original Cards, Video & Services */}
      {/* =================================================================== */}
      <div
        style={{
          width: centerCardDims.width,
          height: centerCardDims.height,
          zIndex: 10,
        }}
        className="relative flex items-center justify-center flex-shrink-0 min-h-[400px]"
      >

        {/* ----------------------------------------------------------------- */}
        {/* LAYER A: HERO 3-IMAGE COLLAGE & VIDEO CARD (Stages 1, 2, 3)       */}
        {/* ----------------------------------------------------------------- */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">

          {/* LEFT IMAGE: Scalp & Hair (hero-img2.jpg) */}
          <motion.div
            style={{
              x: leftCardX,
              rotate: leftCardRotate,
              scale: sideCardScale,
              opacity: sideCardOpacity,
              width: sideCardDims.width,
              height: sideCardDims.height,
              top: 'clamp(8px, 1.2vw, 16px)',
            }}
            className="absolute z-20 origin-bottom-right"
          >
            <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-[#FAF0F3] luxury-card-shadow border border-white/70">
              <img
                src="/images/hero-images/hero-img2.jpg"
                alt="Scalp and hair aesthetic treatment at LACROWN"
                className="w-full h-full object-cover object-center filter saturate-[1.05] contrast-[1.03]"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10 pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/45 backdrop-blur-md text-[9px] sm:text-[10px] font-medium text-white/95 tracking-wide uppercase">
                Scalp & Hair
              </div>
            </div>
          </motion.div>

          {/* RIGHT IMAGE: Nail Artistry (hero-img3.jpg) */}
          <motion.div
            style={{
              x: rightCardX,
              rotate: rightCardRotate,
              scale: sideCardScale,
              opacity: sideCardOpacity,
              width: sideCardDims.width,
              height: sideCardDims.height,
              top: 'clamp(8px, 1.2vw, 16px)',
            }}
            className="absolute z-20 origin-bottom-left"
          >
            <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-[#FAF0F3] luxury-card-shadow border border-white/70">
              <img
                src="/images/hero-images/hero-img3.jpg"
                alt="Specialized cosmetic nail artistry at LACROWN"
                className="w-full h-full object-cover object-center filter saturate-[1.05] contrast-[1.03]"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10 pointer-events-none" />
              <div className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-black/45 backdrop-blur-md text-[9px] sm:text-[10px] font-medium text-white/95 tracking-wide uppercase">
                Nail Artistry
              </div>
            </div>
          </motion.div>

          {/* VIDEO CARD (video1.mp4): Centered during Hold, glides left at 0.38 */}
          <motion.div
            style={{
              x: videoCardX,
              y: videoCardY,
              rotate: videoCardRotate,
              scale: videoCardScale,
              opacity: videoCardOpacity,
              boxShadow: videoCardShadow,
              width: centerCardDims.width,
              height: centerCardDims.height,
              zIndex: 10,
            }}
            className="absolute rounded-[16px] sm:rounded-[18px] overflow-hidden pointer-events-auto"
          >
            <div className="relative w-full h-full rounded-[16px] sm:rounded-[18px] overflow-hidden bg-[#2D0D19] border-2 border-white/90 ring-1 ring-black/15">
              <video
                ref={videoRef}
                src="/video/video1.mp4"
                loop
                muted={isMuted}
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full object-cover object-center filter saturate-[1.06] contrast-[1.02]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25 pointer-events-none" />

              {/* Top-Left Badge: Bespoke Dermatology */}
              <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/95 drop-shadow-sm pointer-events-none z-10 border border-white/20">
                <span className="w-2 h-2 rounded-full bg-[#E63886] shadow-sm animate-pulse" />
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-wide">
                  Bespoke Dermatology
                </span>
              </div>

              {/* Bottom-left: Play/Pause button */}
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 w-8 h-8 rounded-full bg-black/45 hover:bg-black/70 text-white backdrop-blur-md border border-white/30 flex items-center justify-center transition-all shadow-sm hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer z-10 pointer-events-auto"
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-white text-white" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                )}
              </button>

              {/* Bottom-right: Mute/Unmute button */}
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 w-8 h-8 rounded-full bg-black/45 hover:bg-black/70 text-white backdrop-blur-md border border-white/30 flex items-center justify-center transition-all shadow-sm hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white cursor-pointer z-10 pointer-events-auto"
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-white" />
                )}
              </button>
            </div>
          </motion.div>

          {/* CENTER STILL IMAGE: Facial Glow (hero-img1.jpg) */}
          <motion.div
            style={{
              x: centerStillX,
              y: centerStillY,
              rotate: centerStillRotate,
              scale: centerStillScale,
              opacity: centerStillOpacity,
              width: centerCardDims.width,
              height: centerCardDims.height,
              zIndex: 30,
              pointerEvents: isVideoDominant ? 'none' : 'auto',
            }}
            className="relative rounded-[16px] sm:rounded-[18px] center-card-shadow"
          >
            <div className="relative w-full h-full rounded-[16px] sm:rounded-[18px] overflow-hidden bg-[#F8EDEE] border-2 border-white/85 ring-1 ring-[#00552F]/10">
              <img
                src="/images/hero-images/hero-img1.jpg"
                alt="Signature dermatology facial rejuvenation treatment at LACROWN"
                className="w-full h-full object-cover object-[center_30%] filter saturate-[1.08] contrast-[1.04]"
                loading="eager"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/15 pointer-events-none" />

              <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 px-2 sm:px-2.5 py-0.5 rounded-full bg-white/85 backdrop-blur-md text-[9px] sm:text-[10px] font-bold text-[#00552F] tracking-wider uppercase border border-white/40 shadow-sm">
                Facial Glow
              </div>

              <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 flex items-center justify-between text-white/95">
                <span className="text-[11px] sm:text-xs font-semibold drop-shadow-sm">
                  Bespoke Dermatology
                </span>
                <span className="w-2 h-2 rounded-full bg-[#E63886] shadow-sm animate-pulse" />
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* =================================================================== */}
      {/* DESKTOP HORIZONTAL SERVICES GALLERY (lg: >= 1024px)                 */}
      {/* Dedicated right-side viewport with overflow-hidden:                 */}
      {/* - Left boundary is at calc(50% - 190px), safely to the right of      */}
      {/*   the left-side OUR SERVICES text, clipping cards cleanly on left!  */}
      {/* - Origin is at left-[190px], exactly 50% (screen center)!           */}
      {/* - Cards glide from the right edge and stack permanently at center   */}
      {/* =================================================================== */}
      <div
        style={{ zIndex: 35 }}
        className={`hidden lg:block absolute right-0 top-0 bottom-0 left-[calc(50%-190px)] overflow-hidden ${
          isServicesActive ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <motion.div
          style={{ opacity: galleryOpacity }}
          className="absolute top-0 bottom-0 left-[190px] flex items-center will-change-transform"
        >
          {SERVICES_DATA.map((service, index) => (
            <ServiceStackCard
              key={service.id}
              service={service}
              index={index}
              trainPosition={trainPositionDesktop}
              pitch={DESKTOP_PITCH}
              cardWidth={centerCardDims.width}
              cardHeight={centerCardDims.height}
              isFeatured={index === activeServiceIndex}
              onOpenBooking={onOpenBooking}
            />
          ))}
        </motion.div>
      </div>

      {/* =================================================================== */}
      {/* MOBILE HORIZONTAL SERVICES GALLERY (< 1024px)                       */}
      {/* =================================================================== */}
      <div
        style={{ zIndex: 35 }}
        className={`lg:hidden absolute inset-0 flex items-center overflow-hidden ${
          isServicesActive ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <motion.div
          style={{ opacity: galleryOpacity }}
          className="absolute top-0 bottom-0 left-1/2 flex items-center will-change-transform"
        >
          {SERVICES_DATA.map((service, index) => (
            <ServiceStackCard
              key={service.id}
              service={service}
              index={index}
              trainPosition={trainPositionMobile}
              pitch={MOBILE_PITCH}
              cardWidth={centerCardDims.width}
              cardHeight={centerCardDims.height}
              isFeatured={index === activeServiceIndex}
              onOpenBooking={onOpenBooking}
              isMobile
            />
          ))}
        </motion.div>
      </div>

      {/* =================================================================== */}
      {/* RIGHT COLUMN: Pink Heading 2 (ADVANCED SEMI-PERMANENT MAKEUP)       */}
      {/* Exits upward at 0.38-0.44 to make space for the services carousel   */}
      {/* =================================================================== */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-start pl-8 xl:pl-14 relative z-20 min-h-[400px] pointer-events-none">
        <motion.div
          style={{
            opacity: serviceRightOpacity,
            x: serviceRightX,
            y: serviceRightY,
          }}
          className="service-display-heading text-[#F49AB9] text-left drop-shadow-md select-none"
        >
          <div className="text-[clamp(44px,5.2vw,86px)] leading-[0.84] tracking-tight">ADVANCED</div>
          <div className="text-[clamp(44px,5.2vw,86px)] leading-[0.84] tracking-tight">SEMI-PERMANENT</div>
          <div className="text-[clamp(44px,5.2vw,86px)] leading-[0.84] tracking-tight">MAKEUP</div>
        </motion.div>
      </div>

      {/* =================================================================== */}
      {/* MOBILE / TABLET DISPLAY HEADING: BOTTOM (< 1024px)                  */}
      {/* =================================================================== */}
      <motion.div
        style={{ opacity: serviceRightOpacity, y: serviceMobileBottomY }}
        className="lg:hidden absolute top-[calc(50%+130px)] sm:top-[calc(50%+160px)] left-0 right-0 mx-auto w-[92vw] max-w-[480px] flex justify-center text-center z-20 pointer-events-none px-2"
      >
        <div className="service-display-heading text-[#F49AB9] text-center text-[clamp(22px,5.4vw,34px)] leading-[0.9] tracking-tight drop-shadow-md">
          ADVANCED SEMI-PERMANENT MAKEUP
        </div>
      </motion.div>
    </div>
  );
};
