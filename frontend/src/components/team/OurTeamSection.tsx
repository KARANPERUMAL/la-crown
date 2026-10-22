import React, { useRef } from 'react';
import { TEAM_MEMBERS, TeamMember } from '../../data/teamData';
import { Sparkles, Calendar, ArrowUpRight } from 'lucide-react';

export interface OurTeamSectionProps {
  onOpenBooking?: () => void;
}

interface TeamCardProps {
  member: TeamMember;
  index: number;
  total: number;
  onOpenBooking?: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ member, index, total, onOpenBooking }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Sticky offset: each card stops slightly lower than the previous one
  // Creating the physical layered card stack effect inspired by Unlumen UI
  const stickyTop = `calc(100px + ${index * 26}px)`;

  return (
    <div
      ref={cardRef}
      style={{
        top: stickyTop,
        zIndex: 10 + index,
      }}
      className="sticky mb-16 sm:mb-24 last:mb-0 will-change-transform"
    >
      <div
        className="relative rounded-[24px] sm:rounded-[28px] bg-white border border-[#00552F]/15 shadow-[0_20px_50px_-15px_rgba(0,85,47,0.08),0_4px_16px_-4px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 hover:shadow-[0_28px_60px_-15px_rgba(0,85,47,0.12)] p-5 sm:p-7 flex flex-col sm:flex-row items-stretch gap-6"
      >
        {/* Doctor Portrait Image */}
        <div className="w-full sm:w-[210px] md:w-[230px] h-[260px] sm:h-[290px] rounded-2xl overflow-hidden bg-[#FAF3ED] shrink-0 border border-neutral-200/90 shadow-sm relative group">
          <img
            src={member.image}
            alt={`${member.name} - ${member.designation} at LACROWN Aesthetic Clinic`}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

          {/* Mobile indicator badge */}
          <div className="sm:hidden absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-[#00552F] tracking-wider uppercase border border-white/60">
            {member.number} / {String(total).padStart(2, '0')}
          </div>
        </div>

        {/* Doctor Details Panel */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            {/* Top Eyebrow & Number */}
            <div className="hidden sm:flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold tracking-widest text-[#E63886] uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E63886] shadow-sm animate-pulse" />
                {member.number} / {String(total).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
                Clinical Excellence
              </span>
            </div>

            {/* Doctor Name */}
            <h3 className="brand-condensed-acrow text-2xl sm:text-3xl lg:text-[34px] text-[#00552F] tracking-tight leading-[0.95]">
              {member.name}
            </h3>

            {/* Designation */}
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#E63886] mt-2">
              {member.designation}
            </p>

            {/* Supporting Specialty */}
            {member.supportingSpecialty && (
              <div className="mt-3.5 pt-3.5 border-t border-neutral-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Specialty Focus
                </span>
                <p className="text-xs sm:text-sm text-neutral-700 font-normal leading-relaxed">
                  {member.supportingSpecialty}
                </p>
              </div>
            )}
          </div>

          {/* Bottom Card Footer */}
          <div className="mt-5 pt-3.5 border-t border-neutral-100/90 flex items-center justify-between">
            <button
              type="button"
              onClick={onOpenBooking}
              className="group inline-flex items-center gap-1.5 text-xs font-semibold text-[#00552F] hover:text-[#E63886] transition-colors focus:outline-none cursor-pointer"
            >
              <span>Consult with {member.name.split(' ')[0]}</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-neutral-400 font-medium">
              <Sparkles className="w-3 h-3 text-[#E63886]" />
              <span>Bespoke Care</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const OurTeamSection: React.FC<OurTeamSectionProps> = ({ onOpenBooking }) => {
  return (
    <section
      id="our-team"
      className="w-full bg-[#FFFFFF] relative py-24 sm:py-32 px-4 sm:px-6 lg:px-12 xl:px-16 border-t border-neutral-100"
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* =============================================================== */}
          {/* LEFT COLUMN: Stationary Sticky Heading & Editorial Narrative     */}
          {/* =============================================================== */}
          <div className="lg:col-span-5 sticky top-28 self-start pt-2">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E63886] shadow-sm animate-pulse" />
              <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-[#E63886] uppercase">
                THE PEOPLE BEHIND LACROWN
              </span>
            </div>

            {/* Heading */}
            <h2 className="brand-condensed-acrow text-5xl sm:text-6xl lg:text-7xl text-[#00552F] tracking-tight leading-[0.88]">
              OUR TEAM
            </h2>

            {/* Supporting Content */}
            <p className="mt-6 text-sm sm:text-base text-neutral-600 leading-relaxed max-w-[460px] font-normal">
              Meet the people behind our approach to dermatology, aesthetic care, and personalised treatment. Our team brings together leadership, clinical expertise, and a shared commitment to thoughtful, patient-focused care.
            </p>

            {/* Supporting Line */}
            <div className="mt-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00552F]/5 border border-[#00552F]/10 text-xs sm:text-sm font-semibold tracking-wider text-[#00552F] uppercase">
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
          {/* RIGHT COLUMN: Sticky Stacked Feature Cards Sequence             */}
          {/* =============================================================== */}
          <div className="lg:col-span-7 relative">
            {TEAM_MEMBERS.map((member, index) => (
              <TeamCard
                key={member.id}
                member={member}
                index={index}
                total={TEAM_MEMBERS.length}
                onOpenBooking={onOpenBooking}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
