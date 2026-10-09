import React from 'react';
import { ArrowLeft, FileText, CheckCircle2, AlertCircle, Shield, Award, Scale } from 'lucide-react';

interface TermsAndConditionsProps {
  lang?: 'bn' | 'en';
  onBackToHome: () => void;
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
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
          <Scale className="w-6 h-6 text-white" />
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#14231b] tracking-tight mb-2">
          {lang === 'bn' ? 'শর্তাবলি · Terms & Conditions' : 'Terms & Conditions · শর্তাবলি'}
        </h1>

        <p className="text-sm sm:text-base text-[#576b5d] leading-relaxed">
          {lang === 'bn'
            ? 'অচেনা বাংলা (Ochena Bangla) ব্যবহারের সাধারণ নিয়মাবলি ও শর্তাবলি। আমাদের প্ল্যাটফর্ম ব্যবহার করার মাধ্যমে আপনি নিচের শর্তাবলির সাথে সম্মতি জ্ঞাপন করছেন।'
            : 'Welcome to Ochena Bangla. By using our website, you agree to the following terms and conditions.'}
        </p>

        <div className="mt-4 pt-4 border-t border-[#f2ede4] flex items-center gap-2 text-xs text-[#738578] font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#006a4e]" />
          <span>{lang === 'bn' ? 'সর্বশেষ হালনাগাদ: অক্টোবর ২০২৬' : 'Last updated: October 2026'}</span>
        </div>
      </div>

      {/* Main Terms Sections */}
      <div className="space-y-6">
        
        {/* Section 1: Use of Service */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ebdcd0] shadow-xs">
          <div className="flex items-center gap-3 mb-3 text-[#006a4e]">
            <Award className="w-5 h-5 shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold text-[#14231b]">
              {lang === 'bn' ? '১. সেবার পরিধি ও ব্যবহারের উদ্দেশ্য' : '1. Purpose & Permitted Use'}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#465a4c] leading-relaxed">
            {lang === 'bn'
              ? 'অচেনা বাংলা একটি উন্মুক্ত ও ফ্রি প্ল্যাটফর্ম যা বাংলাদেশের ভ্রমণপ্রেমীদের জন্য নিজস্ব জেলা ভ্রমণ ম্যাপ তৈরি ও সংরক্ষণের সুযোগ দেয়। এই সাইটটি শুধুমাত্র ব্যক্তিগত, বিনোদনমূলক এবং শিক্ষামূলক উদ্দেশ্যে ব্যবহারের জন্য উন্মুক্ত।'
              : 'Ochena Bangla is a free public digital tool designed for travelers to track and celebrate their journeys across Bangladesh. It is provided for personal, educational, and leisure use.'}
          </p>
        </div>

        {/* Section 2: User Content & Image Sharing */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ebdcd0] shadow-xs">
          <div className="flex items-center gap-3 mb-3 text-[#006a4e]">
            <FileText className="w-5 h-5 shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold text-[#14231b]">
              {lang === 'bn' ? '২. ম্যাপ ডাউনলোড ও সোশ্যাল শেয়ারিং' : '2. Map Downloads & Social Sharing'}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#465a4c] leading-relaxed">
            {lang === 'bn'
              ? 'আপনার তৈরি করা ট্রাভেল ম্যাপ (PNG, JPG, PDF) আপনি যেকোনো সোশ্যাল মিডিয়া বা ব্যক্তিগত প্ল্যাটফর্মে শেয়ার করতে পারেন। তবে প্ল্যাটফর্মের ব্র্যান্ডিং মুছে বিভ্রান্তিকর বা বেআইনি কোনো উদ্দেশ্যে এটি ব্যবহার করা নিষিদ্ধ।'
              : 'You are welcome to download and share your personalized travel map across social media. However, deceptive alteration or unlawful use is strictly prohibited.'}
          </p>
        </div>

        {/* Section 3: Intellectual Property */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ebdcd0] shadow-xs">
          <div className="flex items-center gap-3 mb-3 text-[#006a4e]">
            <Shield className="w-5 h-5 shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold text-[#14231b]">
              {lang === 'bn' ? '৩. বৌদ্ধিক সম্পত্তি ও স্বত্বাধিকার' : '3. Intellectual Property Rights'}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#465a4c] leading-relaxed">
            {lang === 'bn'
              ? 'অচেনা বাংলা প্ল্যাটফর্মটির ইউজার ইন্টারফেস, লোগো, কোডিং আর্কিটেকচার এবং কনসেপ্টের সার্বিক স্বত্বাধিকার নির্মাতা Jiad Hassan-এর ওপর ন্যস্ত। অনুমতি ব্যতীত সম্পূর্ণ কোড বা ডিজাইন বাণিজ্যিক উদ্দেশ্যে নকল করা আইনত দণ্ডনীয়।'
              : 'All branding, architecture, UI design, and creative elements of Ochena Bangla belong to the developer Jiad Hassan. Unauthorized commercial replication is not permitted.'}
          </p>
        </div>

        {/* Section 4: Limitation of Liability */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ebdcd0] shadow-xs">
          <div className="flex items-center gap-3 mb-3 text-[#006a4e]">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold text-[#14231b]">
              {lang === 'bn' ? '৪. দায়মুক্তি ও সীমাবদ্ধতা' : '4. Disclaimer & Limitation of Liability'}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#465a4c] leading-relaxed">
            {lang === 'bn'
              ? 'এই সাইটের মানচিত্র ও ভৌগোলিক তথ্যসমূহ শুধুমাত্র ডিজিটাল ইন্টারঅ্যাকশনের সুবিধার্থে তৈরি করা হয়েছে এবং এটি কোনো অফিসিয়াল জরিপ বা আইনি সীমানা নির্ধারণের দলিল হিসেবে গণ্য হবে না।'
              : 'The geographic representations on this map are intended for interactive travel visualization and do not serve as formal legal boundary documentation.'}
          </p>
        </div>

        {/* Section 5: Developer Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ebdcd0] shadow-xs">
          <div className="flex items-center gap-3 mb-3 text-[#006a4e]">
            <FileText className="w-5 h-5 shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold text-[#14231b]">
              {lang === 'bn' ? '৫. নির্মাতা ও যোগাযোগ' : '5. Developer & Contact'}
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#465a4c] leading-relaxed mb-4">
            {lang === 'bn'
              ? 'শর্তাবলি সম্পর্কিত কোনো প্রশ্ন বা পরামর্শ থাকলে সরাসরি যোগাযোগ করুন:'
              : 'For any feedback or questions regarding these terms, contact the developer:'}
          </p>

          <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e8dfd3] space-y-2 text-sm text-[#182a1d]">
            <div>
              <strong>{lang === 'bn' ? 'ডেভলপার:' : 'Developer:'}</strong> Jiad Hassan
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
