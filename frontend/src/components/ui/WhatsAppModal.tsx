import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, ShieldCheck, Clock, Settings2 } from 'lucide-react';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultNumber?: string;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  defaultNumber = '',
}) => {
  const [phoneNumber, setPhoneNumber] = useState(defaultNumber);
  const [message, setMessage] = useState(
    'Hello LACROWN, I would like to inquire about a consultation and treatment availability.'
  );
  const [isConfiguring, setIsConfiguring] = useState(!defaultNumber);

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

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(message);
    
    if (cleanNumber) {
      window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodedMessage}`, '_blank');
    }
    onClose();
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
            aria-labelledby="whatsapp-modal-title"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#F4DCE3]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00552F] text-[#FFF8F6] flex items-center justify-center">
                  <svg
                    className="w-5 h-5 fill-current"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </div>
                <div>
                  <h3 id="whatsapp-modal-title" className="font-display font-bold text-[#00552F] text-lg">
                    LACROWN Concierge
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#E63886] font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Online & Ready to Assist
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="w-9 h-9 rounded-full bg-[#FCE7EE] text-[#00552F] hover:bg-[#F9D0DF] transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#E63886]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleStartChat} className="mt-5 space-y-4">
              <div className="p-3.5 rounded-xl bg-[#FDE8EF]/60 border border-[#F4DCE3] text-xs text-[#555] space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-[#00552F]">
                  <ShieldCheck className="w-4 h-4 text-[#00552F]" />
                  <span>Private Consultation Channel</span>
                </div>
                <p>
                  Connect with our clinical advisors for treatment inquiries, doctor availability, and bespoke aesthetic packages.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="clinic-number" className="font-semibold text-[#1A1A1A]">
                    Clinic WhatsApp Destination
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsConfiguring(!isConfiguring)}
                    className="text-[#E63886] hover:underline flex items-center gap-1 font-medium"
                  >
                    <Settings2 className="w-3 h-3" />
                    {isConfiguring ? 'Hide config' : 'Configure destination'}
                  </button>
                </div>

                {isConfiguring ? (
                  <div className="space-y-1">
                    <input
                      id="clinic-number"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 000-0000 or country code + number"
                      className="w-full px-3 py-2 rounded-lg border border-[#E8CCD5] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00552F] text-[#1A1A1A]"
                    />
                    <p className="text-[11px] text-[#8F7A82]">
                      Destination stays configurable until real clinic number is provided.
                    </p>
                  </div>
                ) : (
                  <div className="px-3 py-2 rounded-lg bg-[#FAF0F3] border border-[#F4DCE3] text-xs text-[#444] flex items-center justify-between">
                    <span>
                      Target: {phoneNumber ? phoneNumber : 'Direct WhatsApp Concierge Dispatch'}
                    </span>
                    <span className="text-[10px] font-semibold text-[#00552F] uppercase bg-white px-2 py-0.5 rounded border border-[#E8CCD5]">
                      Configurable
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="inquiry-message" className="text-xs font-semibold text-[#1A1A1A]">
                  Consultation Note
                </label>
                <textarea
                  id="inquiry-message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E8CCD5] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#00552F] text-[#1A1A1A] resize-none"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#8F7A82] pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Response time: ~10 mins
                </span>
                <span>Confidential medical triage</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-5 rounded-xl bg-[#00552F] hover:bg-[#003E22] text-white font-semibold text-sm tracking-wide transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                <span>Initiate WhatsApp Chat</span>
                <Send className="w-4 h-4 text-[#F49AB9] group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
