import React, { useState, useEffect } from 'react';
import { Globe, User, X, Check, MapPin, LogOut, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import {
  auth,
  signInWithGoogle,
  signInWithNameAndEmail,
  logOut,
  getLocalTravelerProfile,
  LocalTravelerProfile
} from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface HeaderProps {
  currentLang?: 'bn' | 'en';
  onLangChange?: (lang: 'bn' | 'en') => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang = 'bn',
  onLangChange,
  activeTab = 'my-map',
  onTabChange,
}) => {
  const [lang, setLang] = useState<'bn' | 'en'>(currentLang);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [localProfile, setLocalProfile] = useState<LocalTravelerProfile | null>(getLocalTravelerProfile());
  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sync auth and local profile
  useEffect(() => {
    const syncProfile = () => {
      setLocalProfile(getLocalTravelerProfile());
    };
    window.addEventListener('traveler_profile_updated', syncProfile);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      syncProfile();
    });

    return () => {
      window.removeEventListener('traveler_profile_updated', syncProfile);
      unsubscribe();
    };
  }, []);

  const toggleLanguage = () => {
    const nextLang = lang === 'bn' ? 'en' : 'bn';
    setLang(nextLang);
    if (onLangChange) onLangChange(nextLang);
  };

  const handleGoogleSignIn = async () => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const user = await signInWithGoogle();
      if (user) {
        setIsSignInModalOpen(false);
      }
    } catch (_) {
      // Cancellation handled gracefully
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleNameEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim() || !inputEmail.trim()) return;

    setIsAuthLoading(true);
    setAuthError(null);
    try {
      await signInWithNameAndEmail(inputName, inputEmail);
      setIsSignInModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setAuthError(err?.message || 'সাইন ইন করতে সমস্যা হয়েছে।');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await logOut();
    setInputName('');
    setInputEmail('');
    setIsSignInModalOpen(false);
  };

  // Determine active traveler information
  const isLoggedIn = !!currentUser || !!localProfile;
  const displayName = currentUser?.displayName || localProfile?.name;
  const displayEmail = currentUser?.email || localProfile?.email;

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#fcfaf6]/95 backdrop-blur-md border-b border-[#ebdcd0]/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo & Title */}
          <div
            onClick={() => onTabChange && onTabChange('my-map')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            {/* Green Badge with Bangladesh Map & Red Sun Icon */}
            <div className="relative w-9 h-9 rounded-xl bg-[#006a4e] flex items-center justify-center shadow-xs shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 100 100" className="w-6 h-6 text-white fill-current opacity-95">
                <path d="M42,12 C48,10 58,14 62,20 C64,24 58,30 63,35 C68,40 78,38 80,44 C82,50 72,55 70,62 C68,70 75,82 70,88 C64,94 58,82 52,80 C46,78 40,86 35,84 C30,82 32,70 28,64 C24,58 20,55 22,48 C24,40 28,38 32,32 C36,25 35,16 42,12 Z" />
              </svg>
              <div className="absolute top-[44%] left-[46%] -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#f42a41] ring-1 ring-white/40 shadow-xs" />
            </div>

            {/* Brand Title */}
            <span className="text-xl sm:text-[22px] font-extrabold tracking-tight text-[#16291d] group-hover:text-[#006a4e] transition-colors">
              {lang === 'bn' ? 'অচেনা বাংলা' : 'Ochena Bangla'}
            </span>
          </div>

          {/* Center: Clean Capsule Navigation Menu */}
          <nav className="hidden sm:flex items-center">
            <div className="bg-[#ede7dd]/80 p-1.5 rounded-full border border-[#e2d8cb] shadow-inner">
              <button
                type="button"
                onClick={() => onTabChange && onTabChange('my-map')}
                className={`relative px-6 py-2 rounded-full text-base font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'my-map'
                    ? 'bg-white text-[#182a1d] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                    : 'text-[#4b5a50] hover:text-[#182a1d]'
                }`}
              >
                {lang === 'bn' ? 'আমার ম্যাপ' : 'My Map'}
              </button>
            </div>
          </nav>

          {/* Right: Language Switcher & Sign In Buttons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Language Toggle Button */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#dfd4c5] bg-[#f7f2eb]/70 hover:bg-[#ede6dc] text-[#1f3126] font-medium text-sm transition-colors cursor-pointer shadow-xs active:scale-95"
              title={lang === 'bn' ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
            >
              <Globe className="w-4 h-4 text-[#006a4e]" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Sign In / Profile Button */}
            <button
              type="button"
              onClick={() => setIsSignInModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#dfd4c5] bg-white hover:bg-[#f6f2ec] text-[#182a1d] font-semibold text-sm transition-all cursor-pointer shadow-xs hover:border-[#cfc2b1] active:scale-95"
            >
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Avatar"
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-[#006a4e]" />
              )}
              <span>
                {isLoggedIn
                  ? displayName?.split(' ')[0] || (lang === 'bn' ? 'প্রোফাইল' : 'Profile')
                  : lang === 'bn'
                  ? 'সাইন ইন'
                  : 'Sign In'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Indicator Bar */}
        <div className="sm:hidden px-4 pb-2.5 flex justify-center">
          <div className="bg-[#ede7dd]/90 px-5 py-1.5 rounded-full border border-[#e2d8cb] text-sm font-semibold text-[#182a1d] shadow-inner">
            {lang === 'bn' ? '📍 আমার ম্যাপ' : '📍 My Map'}
          </div>
        </div>
      </header>

      {/* Sign In / Profile Modal */}
      {isSignInModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#fcfaf6] w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#ebdcd0] relative">
            <button
              type="button"
              onClick={() => setIsSignInModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-[#ede7dd] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {isLoggedIn ? (
              // Logged in User Profile State
              <div className="text-center py-2">
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={displayName || 'Traveler'}
                    className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-white shadow-md ring-2 ring-[#006a4e]/20 mb-3"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-[#006a4e] text-white flex items-center justify-center mx-auto mb-3 shadow-md font-bold text-2xl">
                    {displayName ? displayName.charAt(0).toUpperCase() : <User className="w-8 h-8" />}
                  </div>
                )}
                <h3 className="text-xl font-bold text-[#14231b]">
                  {displayName || (lang === 'bn' ? 'প্রিয় ভ্রমণকারী' : 'Traveler')}
                </h3>
                {displayEmail && (
                  <p className="text-xs text-[#5f7466] mt-0.5">{displayEmail}</p>
                )}

                <div className="mt-5 p-4 rounded-2xl bg-[#f2ebe0] text-xs text-[#3f5245] leading-relaxed text-left border border-[#e3d7c7]">
                  <p className="font-semibold text-[#1a2c20] mb-1 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#006a4e]" />
                    <span>{lang === 'bn' ? 'ভ্রমণ একাউন্ট সক্রিয় রয়েছে' : 'Travel Account Active'}</span>
                  </p>
                  <p>
                    {lang === 'bn'
                      ? 'আপনার ৬৪ জেলার ভ্রমণ তালিকা এবং ব্যক্তিগত ম্যাপ নিরাপদে সংরক্ষিত হচ্ছে।'
                      : 'Your 64-district travel progress is safely recorded.'}
                  </p>
                </div>

                {/* If logged in via Name & Email only, offer Google Cloud Sync option */}
                {!currentUser && (
                  <button
                    type="button"
                    disabled={isAuthLoading}
                    onClick={handleGoogleSignIn}
                    className="w-full mt-4 py-2.5 px-4 rounded-xl border border-[#d8ccbc] bg-white hover:bg-neutral-50 text-[#182a1d] font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{lang === 'bn' ? 'Google ক্লাউড সিঙ্ক যুক্ত করুন' : 'Connect Google Cloud Sync'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full mt-5 py-3 px-4 rounded-xl border border-[#e2cfbd] bg-white hover:bg-[#fbf4eb] text-[#9b3a3a] font-semibold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'লগআউট করুন' : 'Sign Out'}</span>
                </button>
              </div>
            ) : (
              // Login Prompt with Email & Name + Google options
              <div>
                <div className="text-center mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-[#006a4e] mx-auto flex items-center justify-center mb-3 shadow-md">
                    <div className="w-4 h-4 rounded-full bg-[#f42a41]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#14231b]">
                    {lang === 'bn' ? 'ভ্রমণ একাউন্টে সাইন ইন' : 'Sign In to Travel Map'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#576b5f] mt-1">
                    {lang === 'bn'
                      ? 'আপনার নাম ও ইমেইল দিয়ে ম্যাপ সেভ করুন'
                      : 'Sign in with your name and email to save your progress'}
                  </p>
                </div>

                {authError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                    {authError}
                  </div>
                )}

                {/* Form: Name & Email Sign In */}
                <form onSubmit={handleNameEmailSignIn} className="space-y-3.5 mb-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#293d30] mb-1">
                      {lang === 'bn' ? 'আপনার নাম' : 'Your Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      placeholder={lang === 'bn' ? 'যেমন: তানভীর আহমেদ' : 'e.g. Tanvir Ahmed'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#cfc3b3] bg-white text-[#182a1d] text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#293d30] mb-1">
                      {lang === 'bn' ? 'আপনার ইমেইল' : 'Your Email'}
                    </label>
                    <input
                      type="email"
                      required
                      value={inputEmail}
                      onChange={(e) => setInputEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#cfc3b3] bg-white text-[#182a1d] text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isAuthLoading}
                    className="w-full py-3 px-4 rounded-xl bg-[#006a4e] hover:bg-[#00553e] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
                  >
                    <span>{lang === 'bn' ? 'নাম ও ইমেইল দিয়ে প্রবেশ করুন' : 'Sign In with Name & Email'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Divider */}
                <div className="relative flex items-center justify-center mb-5">
                  <div className="border-t border-[#dfd4c5] w-full" />
                  <span className="bg-[#fcfaf6] px-3 text-xs text-[#7d9083] font-medium uppercase">
                    {lang === 'bn' ? 'অথবা' : 'OR'}
                  </span>
                </div>

                {/* Google Sign In Option */}
                <button
                  type="button"
                  disabled={isAuthLoading}
                  onClick={handleGoogleSignIn}
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-neutral-50 text-[#182a1d] font-semibold text-sm transition-all border border-[#d8ccbc] shadow-2xs hover:shadow-sm cursor-pointer flex items-center justify-center gap-3 active:scale-95 disabled:opacity-60"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{lang === 'bn' ? 'Google দিয়ে এক ক্লিকে সাইন ইন' : 'Continue with Google'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
