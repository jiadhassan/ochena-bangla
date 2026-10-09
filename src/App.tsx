/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { DistrictSelectorSection } from './components/DistrictSelectorSection';
import { Footer } from './components/Footer';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { TermsAndConditions } from './components/TermsAndConditions';

export default function App() {
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [activeTab, setActiveTab] = useState('my-map');
  const [currentPage, setCurrentPage] = useState<'home' | 'privacy' | 'terms'>('home');

  const scrollToMapSection = () => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById('map-selector-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }

    const el = document.getElementById('map-selector-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenPrivacy = () => {
    setCurrentPage('privacy');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTerms = () => {
    setCurrentPage('terms');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaf6] text-[#19271e] font-['Hind_Siliguri',sans-serif]">
      {/* 1. Header Menu */}
      <Header
        currentLang={lang}
        onLangChange={(newLang) => setLang(newLang)}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'my-map') {
            handleBackToHome();
            scrollToMapSection();
          }
        }}
      />

      {/* 2. Main Content Routing (Home vs Privacy vs Terms Page) */}
      <main className="flex-1">
        {currentPage === 'privacy' ? (
          <PrivacyPolicy lang={lang} onBackToHome={handleBackToHome} />
        ) : currentPage === 'terms' ? (
          <TermsAndConditions lang={lang} onBackToHome={handleBackToHome} />
        ) : (
          <>
            {/* Hero Banner Section with Fast Animated Bangladesh Places */}
            <HeroBanner
              lang={lang}
              onStartClick={scrollToMapSection}
            />

            {/* Interactive 64 Districts Selector & Bangladesh Map Section */}
            <div id="map-selector-section">
              <DistrictSelectorSection lang={lang} />
            </div>
          </>
        )}
      </main>

      {/* 3. Footer Section */}
      <Footer
        lang={lang}
        onOpenPrivacy={handleOpenPrivacy}
        onOpenTerms={handleOpenTerms}
      />
    </div>
  );
}
