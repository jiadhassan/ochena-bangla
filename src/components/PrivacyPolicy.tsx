import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, Database, FileText, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyProps {
  lang?: 'bn' | 'en';
  onBackToHome: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({
  lang = 'bn',
  onBackToHome,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      
      {/* Back to Home Button */}
      <button
        type="button"
        onClick={onBackToHome}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ede7dd]/80 hover:bg-[#e2d8cb] text-[#14231b] text-sm font-semibold mb-8 transition-colors cursor-pointer border border-[#ded5c5]"
      >
        <ArrowLeft className="w-4 h-4 text-[#006a4e]" />
        <span>{lang === 'bn' ? 'ম্যাপে ফিরে যান' : 'Back to Travel Map'}</span>
      </button>

      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#ebdcd0] shadow-sm mb-8">
        <div className="w-12 h-12 rounded-2xl bg-[#006a4e] flex items-center justify-center text-white mb-4 shadow-sm">
          <Shield className="w-6 h-6 text-white" />
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#14231b] tracking-tight mb-2">
          {lang === 'bn' ? 'গোপনীয়তা নীতি · Privacy Policy' : 'Privacy Policy · গোপনীয়তা নীতি'}
        </h1>

        <p className="text-sm sm:text-base text-[#576b5d] leading-relaxed">
          {lang === 'bn'
            ? 'অচেনা বাংলা (Ochena Bangla) ব্যবহারকারীদের তথ্যের গোপনীয়তা রক্ষা করা আমাদের অঙ্গীকার। এই পৃষ্ঠায় আমাদের প্ল্যাটফর্মের ডেটা ব্যবহার ও সুরক্ষা নীতি বিস্তারিত তুলে ধরা হলো।'
            : 'Protecting your privacy on Ochena Bangla is our utmost priority. This document explains our data and privacy practices.'}
        </p>

        <div className="mt-4 pt-4 border-t border-[#f2ede4] flex items-center gap-2 text-xs text-[#738578] font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#006a4e]" />
          <span>{lang === 'bn' ? 'সর্বশেষ হালনাগাদ: অক্টোবর ২০২৬' : 'Last updated: October 2026'}</span>
        </div>
      </div>

      {/* Main Privacy Sections */}
      <div className="space-y-6">
        
        {/* Section 1: Data Collection & Storage */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ebdcd0] shadow-xs">
          <div className="flex items-center gap-3 mb-3 text-[#006a4e]">
            <Lock className="w-5 h-5 shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold text-[#14231b]">
              {lang === 'bn' ? '১. তথ্যের সংগ্রহ ও ব্রাউজার প্রসেসিং' : '1. Data Collection & Processing'}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#465a4c] leading-relaxed">
            {lang === 'bn'
              ? 'অচেনা বাংলা একটি ক্লায়েন্ট-সাইড ইন্টারঅ্যাক্টিভ অ্যাপ্লিকেশন। আপনি যেসব জেলা ভ্রমণ করেছেন তার তালিকা সম্পূর্ণভাবে আপনার ব্রাউজারের ভেতর প্রসেস হয়। আমরা আপনার ভ্রমণের তথ্য ট্র্যাক করি না বা কোনো গোপনীয় তথ্য সেন্ট্রাল ডেটাবেজে জমা রাখি না।'
              : 'Ochena Bangla is a client-side web application. All your selected districts are processed strictly inside your browser session without central tracking.'}
          </p>
        </div>

        {/* Section 2: Personal Photos & Names */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ebdcd0] shadow-xs">
          <div className="flex items-center gap-3 mb-3 text-[#006a4e]">
            <Eye className="w-5 h-5 shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold text-[#14231b]">
              {lang === 'bn' ? '২. আপনার ছবি ও নাম' : '2. Personal Photos and Traveler Name'}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#465a4c] leading-relaxed">
            {lang === 'bn'
              ? 'ম্যাপ কার্ড কাস্টমাইজ করার জন্য আপনি যদি আপনার ছবি আপলোড করেন বা নাম যুক্ত করেন, তবে তা শুধুমাত্র আপনার স্ক্রিনের ক্যানভাসে ছবি তৈরির উদ্দেশ্যে সাময়িকভাবে ব্যবহৃত হয়। আপনার ব্যক্তিগত ছবি কখনোই ইন্টারনেটে আপলোড বা কোনো সার্ভারে স্টোর করা হয় না।'
              : 'Any photo or name you add to the map is rendered locally on your device for generating the downloadable image card. It is never uploaded to any remote server.'}
          </p>
        </div>

        {/* Section 3: Third Party Links & Ads */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ebdcd0] shadow-xs">
          <div className="flex items-center gap-3 mb-3 text-[#006a4e]">
            <Database className="w-5 h-5 shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold text-[#14231b]">
              {lang === 'bn' ? '৩. কোনো বিজ্ঞাপন বা থার্ড-পার্টি ট্র্যাকার নেই' : '3. No Ads or Third-Party Trackers'}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#465a4c] leading-relaxed">
            {lang === 'bn'
              ? 'আমাদের ওয়েবসাইটটি শতভাগ বিজ্ঞাপনমুক্ত এবং কোনো প্রকার থার্ড-পার্টি ট্র্যাকিং স্ক্রিপ্ট বা ডেটা মাইনিং টুলস থেকে মুক্ত। আমরা ব্যবহারকারীদের ব্যক্তিগত স্বাধীনতা এবং নিরাপদ ব্রাউজিং নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ।'
              : 'Our website is 100% free of third-party advertisements and tracker scripts. We are committed to a safe, clean browsing experience.'}
          </p>
        </div>

        {/* Section 4: Contact & Creator */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ebdcd0] shadow-xs">
          <div className="flex items-center gap-3 mb-3 text-[#006a4e]">
            <FileText className="w-5 h-5 shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold text-[#14231b]">
              {lang === 'bn' ? '৪. যোগাযোগ ও স্বত্বাধিকার' : '4. Developer & Contact'}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#465a4c] leading-relaxed mb-4">
            {lang === 'bn'
              ? 'এই গোপনীয়তা নীতি সম্পর্কিত কোনো জিজ্ঞাসা থাকলে সরাসরি নির্মাতার সাথে যোগাযোগ করতে পারেন:'
              : 'For any inquiries regarding this policy, feel free to contact the developer directly:'}
          </p>

          <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e8dfd3] space-y-2 text-sm text-[#182a1d]">
            <div>
              <strong>{lang === 'bn' ? 'নির্মাতা:' : 'Developer:'}</strong> Jiad Hassan
            </div>
            <div>
              <strong>Facebook:</strong>{' '}
              <a
                href="https://www.facebook.com/mdjiad.csc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1877f2] hover:underline font-medium"
              >
                facebook.com/mdjiad.csc
              </a>
            </div>
            <div>
              <strong>LinkedIn:</strong>{' '}
              <a
                href="https://www.linkedin.com/in/jiad-hassan/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0a66c2] hover:underline font-medium"
              >
                linkedin.com/in/jiad-hassan
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Back Button */}
      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#006a4e] hover:bg-[#00553e] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'bn' ? 'মূল ম্যাপ পেজে ফিরে যান' : 'Back to Main Map'}</span>
        </button>
      </div>

    </div>
  );
};
