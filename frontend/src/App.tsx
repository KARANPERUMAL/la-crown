import React, { useState } from 'react';
import { HeroSection } from './components/hero/HeroSection';
import { ClinicExperienceSection } from './components/experience/ClinicExperienceSection';
import { MenuDrawer } from './components/ui/MenuDrawer';
import { WhatsAppModal } from './components/ui/WhatsAppModal';
import { BookingModal } from './components/ui/BookingModal';

export const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <main className="w-full min-h-screen bg-[#FFF8F6] font-sans antialiased selection:bg-[#E63886] selection:text-white">
      {/* 1. Continuous Hero & Services Scroll Journey:
          - Opening 3-Image Collage & Upward Text Transition
          - Reverse-Carousel Video Reveal & Stable Center Hold
          - Seamless Handoff to Service Cards into Central Anchor
          - Direction-Aware Left-Side Service Information
          - Coordinated Luxury Palette Background Transitions
          - Single, Persistent Header Controls (Menu & WhatsApp) */}
      <HeroSection
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        onOpenMenu={() => setIsMenuOpen(true)}
      />

      {/* 2. Next Website Section: Luxury Clinic Experience & Consultation CTA */}
      <ClinicExperienceSection
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
      />

      {/* Unified Modals & Drawers */}
      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
      />

      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </main>
  );
};

export default App;
