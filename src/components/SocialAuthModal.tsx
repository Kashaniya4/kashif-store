'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { X, User as UserIcon, Check, ShieldCheck, Mail, Phone } from 'lucide-react';

export const SocialAuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, setUser } = useStore();
  const [activeTab, setActiveTab] = useState<'social' | 'guest'>('social');
  
  // Guest signup form state
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSocialLogin = (provider: 'google' | 'facebook' | 'apple') => {
    let mockName = 'Ali Raza';
    let mockEmail = 'ali.raza@example.pk';
    let avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

    if (provider === 'google') {
      mockName = 'Hamza Khan (Google)';
      mockEmail = 'hamza.google@gmail.com';
    } else if (provider === 'facebook') {
      mockName = 'Zainab Ahmed (Facebook)';
      mockEmail = 'zainab.fb@hotmail.com';
    } else if (provider === 'apple') {
      mockName = 'Usman Malik (Apple ID)';
      mockEmail = 'usman.apple@icloud.com';
    }

    setUser({
      id: `usr-${Date.now()}`,
      name: mockName,
      email: mockEmail,
      avatar,
      provider
    });
    setIsAuthModalOpen(false);
  };

  const handleGuestSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestPhone) return;

    setUser({
      id: `usr-guest-${Date.now()}`,
      name: guestName,
      email: guestEmail || `${guestPhone}@guest.sastamaal.net`,
      phone: guestPhone,
      provider: 'guest'
    });
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 text-slate-900 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-600/40 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <UserIcon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900">Welcome to sastamaal.net</h3>
          <p className="text-xs text-slate-600 mt-1">
            Choose your preferred sign in method or continue as a guest for fast checkout.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-50 border border-slate-200 mb-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('social')}
            className={`py-2.5 rounded-lg transition ${
              activeTab === 'social'
                ? 'bg-emerald-500 text-slate-50 shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Social Signup
          </button>
          <button
            onClick={() => setActiveTab('guest')}
            className={`py-2.5 rounded-lg transition ${
              activeTab === 'guest'
                ? 'bg-emerald-500 text-slate-50 shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Instant Guest Checkout
          </button>
        </div>

        {/* Social Login Content */}
        {activeTab === 'social' ? (
          <div className="space-y-3">
            <button
              onClick={() => handleSocialLogin('google')}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center gap-3 transition shadow-md"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              onClick={() => handleSocialLogin('facebook')}
              className="w-full py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-blue-600 text-slate-900 font-bold text-xs flex items-center justify-center gap-3 transition shadow-md"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Continue with Facebook</span>
            </button>

            <button
              onClick={() => handleSocialLogin('apple')}
              className="w-full py-3 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold text-xs border border-slate-300 flex items-center justify-center gap-3 transition shadow-md"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.11-1.92.99-3.04-.96.04-2.13.64-2.82 1.44-.61.71-1.15 1.86-1 2.96 1.07.08 2.17-.56 2.83-1.36z"/>
              </svg>
              <span>Continue with Apple ID</span>
            </button>

            <div className="pt-3 text-center">
              <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                100% Encrypted & Safe Authentication
              </span>
            </div>
          </div>
        ) : (
          /* Guest Signup Content */
          <form onSubmit={handleGuestSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Usman Chaudhry"
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs rounded-xl py-2.5 pl-9 pr-3 border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
                <UserIcon className="w-4 h-4 text-slate-600 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pakistani Mobile Number *</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="03001234567"
                  value={guestPhone}
                  onChange={e => setGuestPhone(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs rounded-xl py-2.5 pl-9 pr-3 border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
                <Phone className="w-4 h-4 text-slate-600 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Optional)</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="usman@example.com"
                  value={guestEmail}
                  onChange={e => setGuestEmail(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 text-xs rounded-xl py-2.5 pl-9 pr-3 border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
                <Mail className="w-4 h-4 text-slate-600 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-50 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:from-emerald-400 hover:to-teal-400 transition shadow-lg shadow-emerald-500/20"
            >
              <Check className="w-4 h-4" />
              <span>Continue as Guest</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
