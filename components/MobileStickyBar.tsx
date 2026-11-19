'use client';

import React from 'react';
import { PhoneCall, MessageCircle } from 'lucide-react';
import { trackConversion } from './TrackingManager';

interface MobileStickyBarProps {
  phone: string;
  whatsapp: string;
}

export default function MobileStickyBar({ phone, whatsapp }: MobileStickyBarProps) {
  const cleanWhatsapp = whatsapp.replace(/\+/g, '').replace(/\s+/g, '');

  const handlePhoneClick = () => {
    trackConversion('Contact', { channel: 'phone' });
  };

  const handleWhatsappClick = () => {
    trackConversion('Contact', { channel: 'whatsapp' });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 py-2.5 shadow-[0_-4px_15px_rgba(0,0,0,0.1)]">
      <div className="flex items-center gap-2 max-w-lg mx-auto">
        {/* 50% Direct Call Button */}
        <a
          href={`tel:${phone}`}
          onClick={handlePhoneClick}
          className="flex-1 flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-extrabold py-3.5 px-3 rounded-xl shadow-md text-sm active:scale-95 transition"
        >
          <PhoneCall className="w-4 h-4 animate-bounce" />
          <span>اتصال مباشر</span>
        </a>

        {/* 50% Green WhatsApp Button */}
        <a
          href={`https://wa.me/${cleanWhatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsappClick}
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold py-3.5 px-3 rounded-xl shadow-md text-sm active:scale-95 transition"
        >
          <MessageCircle className="w-5 h-5" />
          <span>محادثة واتساب</span>
        </a>
      </div>
    </div>
  );
}
