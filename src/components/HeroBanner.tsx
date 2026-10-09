import React, { useState, useEffect } from 'react';
import { ArrowDown, Camera } from 'lucide-react';

interface HeroBannerProps {
  lang?: 'bn' | 'en';
  onStartClick?: () => void;
}

interface PlaceSlide {
  nameBn: string;
  nameEn: string;
  districtBn: string;
  districtEn: string;
  imageUrl: string;
}

// 12 Iconic authentic Bangladesh destinations across divisions
const BANGLADESH_PLACES: PlaceSlide[] = [
  {
    nameBn: 'শ্রীমঙ্গল চা বাগান',
    nameEn: 'Sreemangal Tea Gardens',
    districtBn: 'মৌলভীবাজার',
    districtEn: 'Moulvibazar',
    imageUrl: 'https://images.unsplash.com/photo-1588673752528-98e3b7b20468?auto=format&fit=crop&w=2000&q=80',
  },
  {
    nameBn: 'সাজেক ভ্যালি ও মেঘের রাজ্য',
    nameEn: 'Sajek Valley Clouds',
    districtBn: 'রাঙ্গামাটি',
    districtEn: 'Rangamati',
    imageUrl: 'https://images.unsplash.com/photo-1629853601831-29177a66fb31?auto=format&fit=crop&w=2000&q=80',
  },
  {
    nameBn: 'কক্সবাজার সমুদ্র সৈকত',
    nameEn: 'Cox\'s Bazar Sea Beach',
    districtBn: 'কক্সবাজার',
    districtEn: 'Cox\'s Bazar',
    imageUrl: 'https://images.unsplash.com/photo-1608958435020-e8a7109ba809?auto=format&fit=crop&w=2000&q=80',
  },
  {
    nameBn: 'রাতারগুল সোয়াম্প ফরেস্ট',
    nameEn: 'Ratargul Swamp Forest',
    districtBn: 'সিলেট',
    districtEn: 'Sylhet',
    imageUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=2000&q=80',
  },
  {
    nameBn: 'বান্দরবান নীলগিরি ও পাহাড়',
    nameEn: 'Bandarban Nilgiri Hills',
    districtBn: 'বান্দরবান',
    districtEn: 'Bandarban',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80',
  },
  {
    nameBn: 'সুন্দরবন ম্যানগ্রোভ বন',
    nameEn: 'Sundarbans Mangrove Forest',
    districtBn: 'বাগেরহাট / খুলনা',
    districtEn: 'Bagerhat / Khulna',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80',
  },
  {
    nameBn: 'সেন্টমার্টিন প্রবাল দ্বীপ',
    nameEn: 'Saint Martin\'s Coral Island',
    districtBn: 'কক্সবাজার',
    districtEn: 'Cox\'s Bazar',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80',
  },
  {
    nameBn: 'পাহাড়পুর সোমপুর মহাবিহার',
    nameEn: 'Sompur Mahavihara Ruins',
    districtBn: 'নওগাঁ',
    districtEn: 'Naogaon',
    imageUrl: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=2000&q=80',
  },
  {
    nameBn: 'জাফলং ও পিয়াইন নদী',
    nameEn: 'Jaflong & Piyain River',
    districtBn: 'সিলেট',
    districtEn: 'Sylhet',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2000&q=80',
  },
  {
    nameBn: 'কুয়াকাটা সাগরকন্যা ও সূর্যোদয়',
    nameEn: 'Kuakata Beach Sunrise',
    districtBn: 'পটুয়াখালী',
    districtEn: 'Patuakhali',
    imageUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=2000&q=80',
  },
  {
    nameBn: 'কাপ্তাই হ্রদ ও ঝুলন্ত ব্রিজ',
    nameEn: 'Kaptai Lake Scenic Waters',
    districtBn: 'রাঙ্গামাটি',
    districtEn: 'Rangamati',
    imageUrl: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=2000&q=80',
  },
  {
    nameBn: 'পানাম নগর ঐতিহাসিক শহর',
    nameEn: 'Historic Panam Nagar',
    districtBn: 'নারায়ণগঞ্জ',
    districtEn: 'Narayanganj',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2000&q=80',
  },
];

export const HeroBanner: React.FC<HeroBannerProps> = ({ lang = 'bn', onStartClick }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Preload images in memory for zero lag during fast transitions
  useEffect(() => {
    BANGLADESH_PLACES.forEach((place) => {
      const img = new Image();
      img.src = place.imageUrl;
    });
  }, []);

  // Ultra-fast animation cycle: under 1 second per place (850ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANGLADESH_PLACES.length);
    }, 850);
    return () => clearInterval(timer);
  }, []);

  const currentPlace = BANGLADESH_PLACES[currentSlide];

  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-5">
      {/* Outer Card Container */}
      <div className="relative w-full rounded-3xl sm:rounded-[36px] overflow-hidden min-h-[580px] sm:min-h-[640px] flex flex-col items-center justify-center text-center p-6 sm:p-12 shadow-2xl border border-black/10 select-none">
        
        {/* Animated Background Slides: Snappy & smooth 300ms transition under 1s */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#102418]">
          {BANGLADESH_PLACES.map((place, idx) => {
            const isActive = idx === currentSlide;
            return (
              <div
                key={place.imageUrl}
                className={`absolute inset-0 transition-opacity duration-300 ease-out transform-gpu will-change-transform ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <img
                  src={place.imageUrl}
                  alt={place.nameEn}
                  className={`w-full h-full object-cover brightness-115 contrast-105 saturate-115 transition-transform duration-1000 ease-out transform-gpu will-change-transform ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />
              </div>
            );
          })}

          {/* Lightened, Balanced Contrast Overlay - makes background scenes vivid & bright while preserving text readability */}
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/45 via-black/25 to-black/55 pointer-events-none" />
        </div>

        {/* Content Container */}
        <div className="relative z-30 max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Top Capsule: ৬৪ জেলা • ৮ বিভাগ */}
          <div className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-full bg-white/12 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white text-xs sm:text-sm font-semibold mb-6 sm:mb-8 transition-colors shadow-sm">
            <span>{lang === 'bn' ? '৬৪ জেলা • ৮ বিভাগ' : '64 Districts • 8 Divisions'}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[64px] font-black tracking-tight text-white leading-[1.2] sm:leading-[1.18] mb-5 sm:mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
            <span className="text-[#5ce5a5]">
              {lang === 'bn' ? 'বাংলা' : 'Explore'}
            </span>
            <span className="text-[#f7727d]">
              {lang === 'bn' ? 'দেশের ' : ' '}
            </span>
            <span>
              {lang === 'bn' ? 'কতটুকু ঘুরে' : 'Bangladesh'}
            </span>
            <br />
            <span>
              {lang === 'bn' ? 'দেখেছেন?' : 'How Much Have You Seen?'}
            </span>
          </h1>

          {/* Subtitle with high contrast */}
          <p className="text-white text-sm sm:text-base md:text-lg font-medium max-w-2xl leading-relaxed mb-7 sm:mb-9 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] px-2">
            {lang === 'bn'
              ? 'যে জেলাগুলোতে গিয়েছেন সেগুলো বেছে নিন, পছন্দের রঙের থিম দিন, আর ডাউনলোড করুন আপনার ভ্রমণের সুন্দর একটি ম্যাপ।'
              : 'Select the districts you have visited, choose your favorite color theme, and download a beautiful personalized map of your travels.'}
          </p>

          {/* Primary CTA Button */}
          <button
            type="button"
            onClick={onStartClick}
            className="group inline-flex items-center gap-2 bg-white hover:bg-neutral-100 text-[#15271d] font-bold text-base sm:text-lg px-8 sm:px-10 py-3.5 sm:py-4 rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_14px_30px_rgba(0,0,0,0.5)] transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 mb-6 sm:mb-7"
          >
            <span>{lang === 'bn' ? 'জেলা বাছাই শুরু করুন' : 'Start Selecting Districts'}</span>
            <ArrowDown className="w-5 h-5 text-[#15271d] group-hover:translate-y-1 transition-transform" />
          </button>

          {/* FIXED & ENHANCED: Social Proof Counter Badge with Crystal-Clear High Contrast */}
          <div className="inline-flex items-center gap-3 px-5 sm:px-6 py-2.5 rounded-full bg-black/80 backdrop-blur-xl border border-white/30 text-white shadow-[0_4px_24px_rgba(0,0,0,0.6)] mb-8 sm:mb-10 transition-all">
            {/* Glowing Bright Green Live Indicator */}
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ade80] opacity-80" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#22c55e] shadow-[0_0_10px_#22c55e]" />
            </span>
            
            {/* Bright, razor-sharp text with highlighted counter */}
            <span className="text-sm sm:text-base font-medium tracking-wide drop-shadow-sm">
              {lang === 'bn' ? (
                <>
                  <strong className="font-extrabold text-[#5ce5a5] text-base sm:text-lg">১৪,১৬,২৩৯</strong>{' '}
                  <span className="text-white font-semibold">জন ইতিমধ্যে এই ম্যাপ ব্যবহার করেছেন</span>
                </>
              ) : (
                <>
                  <strong className="font-extrabold text-[#5ce5a5] text-base sm:text-lg">1,416,239+</strong>{' '}
                  <span className="text-white font-semibold">people have already used this map</span>
                </>
              )}
            </span>
          </div>

          {/* 3 Step Instruction Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-white text-xs sm:text-sm font-semibold">
            {/* Step 1 */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-xs">
              <span className="w-5 h-5 rounded-full bg-white/25 text-white flex items-center justify-center text-xs font-extrabold">
                {lang === 'bn' ? '১' : '1'}
              </span>
              <span>{lang === 'bn' ? 'জেলা বাছাই করুন' : 'Select Districts'}</span>
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-xs">
              <span className="w-5 h-5 rounded-full bg-white/25 text-white flex items-center justify-center text-xs font-extrabold">
                {lang === 'bn' ? '২' : '2'}
              </span>
              <span>{lang === 'bn' ? 'থিম বেছে নিন' : 'Choose Theme'}</span>
            </div>

            {/* Step 3 */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-xs">
              <span className="w-5 h-5 rounded-full bg-white/25 text-white flex items-center justify-center text-xs font-extrabold">
                {lang === 'bn' ? '৩' : '3'}
              </span>
              <span>{lang === 'bn' ? 'PNG, JPG বা PDF ডাউনলোড করুন' : 'Download PNG, JPG or PDF'}</span>
            </div>
          </div>
        </div>

        {/* Floating Spot Name Tag */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white text-xs font-medium shadow-md">
          <Camera className="w-3.5 h-3.5 text-[#5ce5a5]" />
          <span>
            {lang === 'bn'
              ? `${currentPlace.nameBn} (${currentPlace.districtBn})`
              : `${currentPlace.nameEn} (${currentPlace.districtEn})`}
          </span>
        </div>

        {/* Quick Carousel dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 sm:left-6 sm:translate-x-0 z-30 flex items-center gap-1.5">
          {BANGLADESH_PLACES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentSlide ? 'w-6 bg-[#5ce5a5]' : 'w-1.5 bg-white/40 hover:bg-white/80'
              }`}
              title={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
