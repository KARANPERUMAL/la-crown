import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { TEAM_MEMBERS, TeamMember } from '../../data/teamData';
import { Sparkles, Calendar, ArrowUpRight } from 'lucide-react';

export interface OurTeamSectionProps {
  onOpenBooking?: () => void;
}

interface TeamCardProps {
  member: TeamMember;
  index: number;
  total: number;
  scrollYProgress: any;
  onOpenBooking?: () => void;
}

const TeamCardItem: React.FC<TeamCardProps> = ({
  member,
  index,
  total,
  scrollYProgress,
  onOpenBooking,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Alternating card colors:
  // Card 1: Pink (#E63886)
  // Card 2: Green (#00552F)
  // Card 3: Pink (#E63886)
  // Card 4: Green (#00552F)
  // Card 5: Pink (#E63886)
  const isPink = index % 2 === 0;
  const bgColor = isPink ? '#E63886' : '#00552F';
  const designationColor = isPink ? '#FFF0E9' : '#F49AB9';
  const badgeBg = isPink ? 'bg-white/20 border-white/30' : 'bg-white/15 border-white/25';
  const ctaBtnStyle = isPink
    ? 'bg-white text-[#E63886] hover:bg-[#FFF0E9]'
    : 'bg-[#E63886] text-white hover:bg-[#d42d79]';

  // Final stacked offset: consistent 28px per card
  // Card 0: 0px, Card 1: 28px, Card 2: 56px, Card 3: 84px, Card 4: 112px
  const targetY = index * 28;

  // Scroll arrival ranges:
  // Card 0: already present at 0
  // Card 1: enters 0.12 -> 0.30
  // Card 2: enters 0.30 -> 0.48
  // Card 3: enters 0.48 -> 0.66
  // Card 4 (5th card): enters 0.66 -> 0.84, completing full alignment before the stack exits!
  const startProgress = index === 0 ? 0 : 0.12 + (index - 1) * 0.18;
  const endProgress = index === 0 ? 0.05 : startProgress + 0.18;

  // Transform for card Y translation
  const cardY = useTransform(
    scrollYProgress,
    index === 0 ? [0, 1] : [startProgress, endProgress],
    index === 0 ? [0, 0] : [650, targetY],
    { clamp: true }
  );

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        y: shouldReduceMotion ? targetY : cardY,
        zIndex: 10 + index,
      }}
      className="will-change-transform"
    >
      <div
        style={{ backgroundColor: bgColor }}
        className="relative rounded-[24px] sm:rounded-[28px] border-2 border-white/20 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.22),0_4px_16px_-4px_rgba(0,0,0,0.1)] overflow-hidden p-5 sm:p-7 flex flex-col sm:flex-row items-stretch gap-6 select-none"
      >
        {/* Doctor Portrait Image */}
        <div className="w-full sm:w-[200px] md:w-[220px] h-[250px] sm:h-[280px] rounded-2xl overflow-hidden bg-black/10 shrink-0 border border-white/25 shadow-sm relative group">
          <img
            src={member.image}
            alt={`${member.name} - ${member.designation} at LACROWN`}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 filter saturate-[1.03]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

          {/* Mobile index badge */}
          <div className="sm:hidden absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-bold text-white tracking-wider uppercase border border-white/30">
            {member.number} / {String(total).padStart(2, '0')}
          </div>
        </div>

        {/* Doctor Details Panel: High-contrast original LACROWN typography */}
        <div className="flex-1 flex flex-col justify-between py-1 text-white">
          <div>
            {/* Top Eyebrow & Number */}
            <div className="hidden sm:flex items-center justify-between mb-2 sm:mb-3">
              <span
                className={`text-[10px] sm:text-[11px] font-bold tracking-widest text-white uppercase px-2.5 py-0.5 rounded-full backdrop-blur-md border ${badgeBg} flex items-center gap-1.5`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {member.number} / {String(total).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-semibold text-white/80 uppercase tracking-widest">
                Clinical Excellence
              </span>
            </div>

            {/* Doctor Name: Original LACROWN font-sans font-bold typography */}
            <h3 className="font-sans font-bold text-2xl sm:text-3xl text-white tracking-tight leading-tight mt-1">
              {member.name}
            </h3>

            {/* Designation */}
            <p
              style={{ color: designationColor }}
              className="text-xs sm:text-sm font-semibold uppercase tracking-wider mt-1"
            >
              {member.designation}
            </p>

            {/* Supporting Specialty */}
            {member.supportingSpecialty && (
              <div className="mt-3 pt-2.5 border-t border-white/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 block mb-0.5">
                  Specialty Focus
                </span>
                <p className="text-xs sm:text-sm text-white/95 font-normal leading-relaxed line-clamp-2">
                  {member.supportingSpecialty}
                </p>
              </div>
            )}
          </div>

          {/* Bottom Card Footer */}
          <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
            <button
              type="button"
              onClick={onOpenBooking}
              className={`group inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-xs transition-all shadow-sm active:scale-95 cursor-pointer ${ctaBtnStyle}`}
            >
              <span>Consult with {member.name.split(' ')[0]}</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-white/80 font-medium">
              <Sparkles className="w-3 h-3 text-white/90" />
              <span>Bespoke Care</span>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const OurTeamSection: React.FC<OurTeamSectionProps> = ({ onOpenBooking }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Master scrubbed scroll progress across the pinned Our Team track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={containerRef} className="relative w-full h-[320vh] bg-[#FFFFFF]">
      {/* Pinned Sticky Stage: Remains centered and stable while cards stack */}
      <section
        id="our-team"
        className="sticky top-0 w-full h-[100svh] min-h-[620px] max-h-[1050px] flex items-center bg-[#FFFFFF] overflow-hidden px-4 sm:px-6 lg:px-12 xl:px-16 border-t border-neutral-100"
      >
        <div className="max-w-[1440px] w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 xl:gap-16 items-center">
            
            {/* =============================================================== */}
            {/* LEFT COLUMN: Stationary Heading & Narrative                      */}
            {/* =============================================================== */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              {/* Eyebrow: Original LACROWN pill badge style */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCE7EE] text-[#00552F] text-xs font-bold uppercase tracking-widest mb-4 w-fit">
                <Sparkles className="w-3.5 h-3.5 text-[#E63886]" />
                <span>THE PEOPLE BEHIND LACROWN</span>
              </div>

              {/* Heading: Original LACROWN brand-condensed-acrow */}
              <h2 className="brand-condensed-acrow text-5xl sm:text-6xl md:text-7xl text-[#00552F] tracking-tight leading-[0.9]">
                OUR TEAM
              </h2>

              {/* Supporting Content: Original LACROWN body font & tone */}
              <p className="mt-4 text-sm sm:text-base text-[#66555C] leading-relaxed max-w-[460px] font-normal">
                Meet the people behind our approach to dermatology, aesthetic care, and personalised treatment. Our team brings together leadership, clinical expertise, and a shared commitment to thoughtful, patient-focused care.
              </p>

              {/* Supporting Line: Original LACROWN uppercase editorial divider */}
              <div className="mt-5 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider text-[#00552F] uppercase">
                <span>Expertise</span>
                <span className="text-[#E63886]">&bull;</span>
                <span>Care</span>
                <span className="text-[#E63886]">&bull;</span>
                <span>Confidence</span>
              </div>

              {/* Book Consultation Button */}
              <div className="mt-8">
                <button
                  type="button"
                  onClick={onOpenBooking}
                  className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#00552F] hover:bg-[#004224] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-[#F49AB9]" />
                  <span>Book a Consultation</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* =============================================================== */}
            {/* RIGHT COLUMN: Stacked Feature Cards Sequence                     */}
            {/* Dedicated stage where cards overlap progressively in sequence   */}
            {/* =============================================================== */}
            <div className="lg:col-span-7 flex justify-center items-center">
              <div className="relative w-full max-w-[620px] h-[390px] sm:h-[430px]">
                {TEAM_MEMBERS.map((member, index) => (
                  <TeamCardItem
                    key={member.id}
                    member={member}
                    index={index}
                    total={TEAM_MEMBERS.length}
                    scrollYProgress={scrollYProgress}
                    onOpenBooking={onOpenBooking}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
