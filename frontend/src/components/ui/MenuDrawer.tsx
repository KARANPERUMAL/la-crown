import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MapPin, Clock, Phone, ChevronRight } from 'lucide-react';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
  onOpenWhatsApp: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
  onOpenWhatsApp,
}) => {
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
    };
  }, [isOpen, onClose]);

  const navLinks = [
    { label: 'Facial Aesthetics & Glow', badge: 'Signature' },
    { label: 'Medical Dermatology', badge: 'Clinical' },
    { label: 'Scalp & Hair Restoration', badge: 'Advanced' },
    { label: 'Nail Artistry & Wellness', badge: 'Boutique' },
    { label: 'Laser & Pigmentation', badge: 'Precision' },
    { label: 'Specialist Doctors & Team', badge: '' },
    { label: 'Clinic Philosophy & Gallery', badge: '' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 cursor-pointer"
            aria-hidden="true"
          />

          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed top-0 left-0 bottom-0 w-full max-w-md bg-[#FFF8F6] z-50 shadow-2xl flex flex-col p-6 sm:p-8 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            <div className="flex items-center justify-between pb-6 border-b border-[#F4DCE3]">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#E63886] font-semibold">
                  LACROWN Clinic
                </span>
                <h3 className="font-display font-extrabold text-[#00552F] text-2xl tracking-tight">
                  Directory
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="w-10 h-10 rounded-full bg-[#FCE7EE] text-[#00552F] hover:bg-[#F9D0DF] hover:rotate-90 transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#E63886]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="py-6 flex-1 flex flex-col space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#A2697F] mb-1">
                Treatments & Experience
              </p>
              {navLinks.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onClose();
                    onOpenBooking();
                  }}
                  className="group flex items-center justify-between text-left py-2.5 px-3 rounded-xl hover:bg-[#FDE8EF] transition-colors"
                >
                  <span className="text-base sm:text-lg font-medium text-[#1A1A1A] group-hover:text-[#00552F] transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E63886] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </span>
                  <div className="flex items-center gap-2">
                    {link.badge && (
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-[#FCE7EE] text-[#E63886]">
                        {link.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-[#A2697F] group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </nav>

            <div className="pt-6 border-t border-[#F4DCE3] space-y-3 text-xs text-[#555]">
              <div className="flex items-center gap-2.5 text-[#00552F] font-semibold">
                <MapPin className="w-4 h-4 text-[#E63886] shrink-0" />
                <span>Luxury Aesthetic Boulevard, Suite 400</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#A2697F] shrink-0" />
                <span>Mon – Sat: 09:00 AM – 08:00 PM</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#A2697F] shrink-0" />
                <span>VIP Appointments: +1 (800) LACROWN</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3">
                <button
                  onClick={() => {
                    onClose();
                    onOpenBooking();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#00552F] hover:bg-[#003E22] text-white text-xs font-semibold tracking-wide transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F49AB9]" />
                  Book Visit
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onOpenWhatsApp();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FCE7EE] hover:bg-[#F9D0DF] text-[#00552F] text-xs font-semibold tracking-wide transition-all border border-[#F4DCE3] flex items-center justify-center gap-1.5"
                >
                  WhatsApp
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
