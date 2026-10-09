import React from 'react';
import { Linkedin, ShieldCheck, Scale } from 'lucide-react';

interface FooterProps {
  lang?: 'bn' | 'en';
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang = 'bn',
  onOpenPrivacy,
  onOpenTerms,
}) => {
  return (
    <footer className="w-full bg-[#fbf9f5] border-t border-[#ebdcd0]/70 py-12 sm:py-16 select-none transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Name matching header & screenshot */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-8 h-8 rounded-xl bg-[#006a4e] flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-5 h-5 text-white fill-current opacity-95">
              <path d="M42,12 C48,10 58,14 62,20 C64,24 58,30 63,35 C68,40 78,38 80,44 C82,50 72,55 70,62 C68,70 75,82 70,88 C64,94 58,82 52,80 C46,78 40,86 35,84 C30,82 32,70 28,64 C24,58 20,55 22,48 C24,40 28,38 32,32 C36,25 35,16 42,12 Z" />
            </svg>
            <div className="absolute top-[44%] left-[46%] -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#f42a41] ring-1 ring-white/40 shadow-xs" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#16271c]">
            {lang === 'bn' ? 'অচেনা বাংলা' : 'Ochena Bangla'}
          </span>
        </div>

        {/* Subtitle description matching screenshot */}
        <p className="text-sm sm:text-base text-[#4d5f52] max-w-xl leading-relaxed mb-6">
          {lang === 'bn'
            ? 'কোন কোন জেলা আর দেশ ঘুরেছেন ম্যাপে রাঙিয়ে নিন, নতুন জায়গা খুঁজুন আর পরের ট্রিপ সাজান।'
            : "Color in the districts and destinations you've traveled to, discover new places and plan your next journey."}
        </p>

        {/* Creator, Social Links & Legal Pages */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#eee5d8]">
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Social Icons (Facebook & LinkedIn) */}
            <div className="flex items-center gap-2.5">
              {/* Facebook Icon */}
              <a
                href="https://www.facebook.com/mdjiad.csc"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Profile"
                className="w-9 h-9 rounded-full bg-[#1877f2] hover:bg-[#166fe5] text-white flex items-center justify-center shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* LinkedIn Icon */}
              <a
                href="https://www.linkedin.com/in/jiad-hassan/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="w-9 h-9 rounded-full bg-[#0a66c2] hover:bg-[#084e96] text-white flex items-center justify-center shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Linkedin className="w-4 h-4 text-white" />
              </a>
            </div>

            {/* Made by attribution */}
            <div className="text-sm font-medium text-[#182a1d]">
              <span>{lang === 'bn' ? 'তৈরি করেছেন: ' : 'Made by: '}</span>
              <a
                href="https://www.facebook.com/mdjiad.csc"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline underline-offset-4 hover:text-[#006a4e] transition-colors"
              >
                Jiad Hassan
              </a>
            </div>
          </div>

          {/* Legal Pages: গোপনীয়তা নীতি & শর্তাবলি */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Terms and Conditions Button */}
            <button
              type="button"
              onClick={onOpenTerms}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#ded5c5] bg-white hover:bg-[#f6f1ea] text-[#34473a] hover:text-[#006a4e] text-xs font-semibold cursor-pointer transition-all shadow-2xs"
            >
              <Scale className="w-3.5 h-3.5 text-[#006a4e]" />
              <span>{lang === 'bn' ? 'শর্তাবলি · Terms' : 'Terms & Conditions · শর্তাবলি'}</span>
            </button>

            {/* Privacy Policy Button */}
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#ded5c5] bg-white hover:bg-[#f6f1ea] text-[#34473a] hover:text-[#006a4e] text-xs font-semibold cursor-pointer transition-all shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#006a4e]" />
              <span>{lang === 'bn' ? 'গোপনীয়তা নীতি · Privacy' : 'Privacy Policy · গোপনীয়তা নীতি'}</span>
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
};
