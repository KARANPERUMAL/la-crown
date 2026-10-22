import React from 'react';
import { motion } from 'framer-motion';

interface HeroHeaderProps {
  onOpenMenu: () => void;
  onOpenWhatsApp: () => void;
  isPinkTheme?: boolean;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  onOpenMenu,
  onOpenWhatsApp,
  isPinkTheme = false,
}) => {
  return (
    <header className="relative z-40 w-full px-5 py-3.5 sm:px-8 sm:py-4 md:px-12 md:py-4 flex items-center justify-between pointer-events-auto">
      {/* Top Left Menu Control */}
      <motion.button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open clinic menu and navigation"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className={`group relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer ${
          isPinkTheme
            ? 'bg-white hover:bg-white/95 text-[#E63886] border border-white/80 focus-visible:ring-white'
            : 'bg-[#FCE7EE] hover:bg-[#F9D0DF] border border-[#F4DCE3] text-[#00552F] focus-visible:ring-[#00552F]'
        }`}
      >
        <span className="sr-only">Menu</span>
        <div className="flex flex-col gap-[4.5px] items-center justify-center">
          <span
            className={`w-4 h-[2px] rounded-full transition-all duration-200 group-hover:-translate-y-[1px] ${
              isPinkTheme ? 'bg-[#E63886]' : 'bg-[#00552F]'
            }`}
          />
          <span
            className={`w-4 h-[2px] rounded-full transition-all duration-200 group-hover:w-3 ${
              isPinkTheme ? 'bg-[#E63886]' : 'bg-[#00552F]'
            }`}
          />
          <span
            className={`w-4 h-[2px] rounded-full transition-all duration-200 group-hover:translate-y-[1px] ${
              isPinkTheme ? 'bg-[#E63886]' : 'bg-[#00552F]'
            }`}
          />
        </div>
      </motion.button>

      {/* Top Right WhatsApp / Contact Control */}
      <motion.button
        type="button"
        onClick={onOpenWhatsApp}
        aria-label="Contact clinic via WhatsApp consultation"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className={`group relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer ${
          isPinkTheme
            ? 'bg-white hover:bg-white/95 text-[#E63886] border border-white/80 focus-visible:ring-white'
            : 'bg-[#FCE7EE] hover:bg-[#F9D0DF] border border-[#F4DCE3] text-[#00552F] focus-visible:ring-[#00552F]'
        }`}
      >
        <span className="sr-only">WhatsApp Consultation</span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
            isPinkTheme ? 'fill-[#E63886]' : 'fill-[#00552F]'
          }`}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </motion.button>
    </header>
  );
};
