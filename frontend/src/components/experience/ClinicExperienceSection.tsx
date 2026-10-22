import React from 'react';
import { Calendar, ArrowUpRight, Phone, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';

interface ClinicExperienceSectionProps {
  onOpenBooking: () => void;
  onOpenWhatsApp: () => void;
}

export const ClinicExperienceSection: React.FC<ClinicExperienceSectionProps> = ({
  onOpenBooking,
  onOpenWhatsApp,
}) => {
  return (
    <section className="relative w-full bg-[#FFF8F6] text-[#1A1A1A] py-20 sm:py-28 px-6 sm:px-10 lg:px-16 overflow-hidden">
      {/* Subtle luxury background decoration */}
      <div className="absolute inset-0 editorial-texture opacity-30 pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#FCE7EE] filter blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#00552F]/5 filter blur-3xl opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FCE7EE] text-[#00552F] text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#E63886]" />
            <span>The LACROWN Standard</span>
          </div>

          <h2 className="brand-condensed-acrow text-5xl sm:text-6xl md:text-7xl text-[#00552F] tracking-tight leading-[0.9]">
            EXCELLENCE IN EVERY DETAIL
          </h2>

          <p className="mt-4 text-sm sm:text-base text-[#66555C] leading-relaxed">
            Where advanced dermatological science meets high-editorial aesthetic artistry. Every treatment protocol is meticulously customized to your individual anatomy and clinical goals.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-14 sm:mt-18">
          {/* Card 1 */}
          <div className="p-7 rounded-[22px] bg-white border border-[#F4DCE3] luxury-card-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FCE7EE] flex items-center justify-center text-[#E63886] mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#00552F] tracking-tight">
                Board-Certified Dermatologists
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#73636B] leading-relaxed">
                Consultations and treatments are led by credentialed specialists trained in clinical dermatology, trichology, and advanced aesthetic rejuvenation.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F8E7EC] text-xs font-semibold text-[#E63886]">
              Clinical Rigor &bull; Evidence-Based
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-7 rounded-[22px] bg-white border border-[#F4DCE3] luxury-card-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#00552F]/10 flex items-center justify-center text-[#00552F] mb-5">
                <Sparkles className="w-6 h-6 text-[#00552F]" />
              </div>
              <h3 className="text-lg font-bold text-[#00552F] tracking-tight">
                Gold-Standard Medical Devices
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#73636B] leading-relaxed">
                Utilizing FDA-approved, globally renowned lasers, ultrasound contouring, and medical infusion platforms with clinically proven outcomes.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F8E7EC] text-xs font-semibold text-[#00552F]">
              Precision Technology &bull; Proven Safety
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-7 rounded-[22px] bg-white border border-[#F4DCE3] luxury-card-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FCE7EE] flex items-center justify-center text-[#E63886] mb-5">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#00552F] tracking-tight">
                Private Luxury Suites
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#73636B] leading-relaxed">
                An intimate boutique clinic atmosphere designed for total privacy, restorative relaxation, and discreet individualized care from start to finish.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F8E7EC] text-xs font-semibold text-[#E63886]">
              Discreet Comfort &bull; VIP Service
            </div>
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="mt-14 sm:mt-18 p-8 sm:p-12 rounded-[28px] bg-gradient-to-br from-[#00552F] to-[#013D22] text-[#FFF8F6] flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F49AB9]">
              Begin Your Rejuvenation
            </span>
            <h3 className="brand-condensed-acrow text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[0.95] mt-1 text-white">
              SCHEDULE YOUR COMPREHENSIVE CONSULTATION
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#E2ECE6] max-w-lg leading-relaxed">
              Our clinical advisors will design a bespoke treatment sequence tailored to your exact skin, hair, or aesthetic goals.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={onOpenBooking}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#E63886] hover:bg-[#D42876] text-white font-semibold text-sm tracking-wide transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenWhatsApp}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-sm tracking-wide transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4 text-[#F49AB9]" />
              <span>WhatsApp Direct</span>
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-16 pt-8 border-t border-[#ECD6DD] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8F7A82]">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-[#00552F]">LACROWN Clinic</span>
            <span>&bull;</span>
            <span>Suite 400, Aesthetic Medicine</span>
            <span>&bull;</span>
            <span>Mon–Sat 9AM–8PM</span>
          </div>

          <div>
            &copy; {new Date().getFullYear()} LACROWN Aesthetic Clinic. All rights reserved.
          </div>
        </div>
      </div>
    </section>
  );
};
