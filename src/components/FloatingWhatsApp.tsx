'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <a
      href="https://wa.me/923397100515?text=Hi%20sastamaal.net%20support%20team,%20I%20have%20a%20question%20about%20an%20order."
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-emerald-500 hover:bg-emerald-400 text-slate-950 p-3.5 rounded-full shadow-2xl shadow-emerald-500/50 hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
      aria-label="Contact support on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-slate-950" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold text-xs pl-0 group-hover:pl-2">
        Chat Support
      </span>
    </a>
  );
};
