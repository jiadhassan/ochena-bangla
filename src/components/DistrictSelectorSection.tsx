import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  Check,
  User,
  Camera,
  Download,
  CheckSquare,
  Square,
  Sparkles,
  MapPin,
  X
} from 'lucide-react';
import {
  DISTRICTS,
  DIVISIONS,
  THEME_PALETTES,
  District
} from '../data/bangladeshDistricts';
import { BangladeshMap } from './BangladeshMap';
import { toPng, toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { auth, saveUserTravelProfile, loadUserTravelProfile } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface DistrictSelectorSectionProps {
  lang?: 'bn' | 'en';
}

// Convert numbers to Bengali digits
function toBnNum(num: number): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, (d) => bnDigits[parseInt(d, 10)]);
}

export const DistrictSelectorSection: React.FC<DistrictSelectorSectionProps> = ({
  lang = 'bn',
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(THEME_PALETTES[0]);
  const [travelerName, setTravelerName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showDistrictLabels, setShowDistrictLabels] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapCardRef = useRef<HTMLDivElement>(null);

  // Sync Auth and load saved data
  useEffect(() => {
    const handleProfileUpdate = () => {
      try {
        const stored = localStorage.getItem('ochena_traveler_profile');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.name) setTravelerName(parsed.name);
        }
      } catch (_) {}
    };
    window.addEventListener('traveler_profile_updated', handleProfileUpdate);
    handleProfileUpdate();

    // Load locally saved visited districts if available
    try {
      const savedDistricts = localStorage.getItem('ochena_saved_districts');
      if (savedDistricts) {
        const arr = JSON.parse(savedDistricts);
        if (Array.isArray(arr) && arr.length > 0) {
          setSelectedIds(new Set(arr));
        }
      }
    } catch (_) {}

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsSyncing(true);
        try {
          const profile = await loadUserTravelProfile();
          if (profile) {
            if (profile.visitedDistricts && profile.visitedDistricts.length > 0) {
              setSelectedIds(new Set(profile.visitedDistricts));
            }
            if (profile.travelerName) {
              setTravelerName(profile.travelerName);
            }
            if (profile.themeId) {
              const matchedTheme = THEME_PALETTES.find((t) => t.id === profile.themeId);
              if (matchedTheme) setSelectedTheme(matchedTheme);
            }
            if (profile.photoUrl) {
              setAvatarUrl(profile.photoUrl);
            }
          } else {
            // First time login - set name & photo from profile or storage
            let initialName = user.displayName;
            try {
              const stored = localStorage.getItem('ochena_traveler_profile');
              if (stored) {
                const parsed = JSON.parse(stored);
                if (!initialName && parsed.name) initialName = parsed.name;
              }
            } catch (_) {}
            if (initialName) setTravelerName(initialName);
            if (user.photoURL) setAvatarUrl(user.photoURL);
          }
        } catch (e) {
          console.error('Error loading profile from Firestore:', e);
        } finally {
          setIsSyncing(false);
        }
      }
    });

    return () => {
      window.removeEventListener('traveler_profile_updated', handleProfileUpdate);
      unsubscribe();
    };
  }, []);

  // Save changes locally and to Firestore when user is logged in
  useEffect(() => {
    // Save to local storage for instant offline persistence
    try {
      localStorage.setItem('ochena_saved_districts', JSON.stringify(Array.from(selectedIds)));
    } catch (_) {}

    if (!currentUser) return;
    const timeout = setTimeout(() => {
      saveUserTravelProfile({
        travelerName: travelerName || currentUser.displayName || 'ভ্রমণকারী',
        photoUrl: avatarUrl || currentUser.photoURL || undefined,
        visitedDistricts: Array.from(selectedIds),
        themeId: selectedTheme.id,
      }).catch((err) => console.error('Auto-save to Firestore failed:', err));
    }, 800);

    return () => clearTimeout(timeout);
  }, [selectedIds, travelerName, selectedTheme, avatarUrl, currentUser]);

  // Toggle district selection
  const toggleDistrict = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Select all districts
  const handleSelectAll = () => {
    setSelectedIds(new Set(DISTRICTS.map((d) => d.id)));
  };

  // Clear all selections
  const handleClearAll = () => {
    setSelectedIds(new Set());
  };

  // Toggle whole division
  const toggleDivision = (divisionDistrictIds: string[]) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const allSelected = divisionDistrictIds.every((id) => next.has(id));
      if (allSelected) {
        divisionDistrictIds.forEach((id) => next.delete(id));
      } else {
        divisionDistrictIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  // Profile image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter districts based on search query
  const filteredDistricts = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();
    return DISTRICTS.filter(
      (d) =>
        d.nameBn.includes(q) ||
        d.nameEn.toLowerCase().includes(q) ||
        d.divisionBn.includes(q) ||
        d.divisionEn.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Statistics calculation
  const totalCount = DISTRICTS.length; // 64
  const selectedCount = selectedIds.size;
  const percentage = Math.round((selectedCount / totalCount) * 100);

  // Count how many divisions have at least 1 visited district
  const visitedDivisionsCount = useMemo(() => {
    return DIVISIONS.filter((div) =>
      div.districtIds.some((id) => selectedIds.has(id))
    ).length;
  }, [selectedIds]);

  // Download card as PNG / JPG / PDF
  const handleDownload = async (format: 'png' | 'jpg' | 'pdf') => {
    if (!mapCardRef.current) return;
    setIsExporting(true);

    try {
      const node = mapCardRef.current;
      const fileName = `amar-bangladesh-map-${Date.now()}`;
      // Crucial: skipFonts: true prevents SecurityError when reading cross-origin CSS rules from Google Fonts
      const exportOptions = {
        skipFonts: true,
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
      };

      if (format === 'png') {
        const dataUrl = await toPng(node, exportOptions);
        const link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (format === 'jpg') {
        const dataUrl = await toJpeg(node, exportOptions);
        const link = document.createElement('a');
        link.download = `${fileName}.jpg`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (format === 'pdf') {
        // Generate authentic PDF document via jsPDF
        const dataUrl = await toPng(node, exportOptions);
        const img = new Image();
        img.src = dataUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        // Create A4 portrait document
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 12; // 12mm margin
        const maxW = pageWidth - margin * 2;
        const maxH = pageHeight - margin * 2;

        const imgRatio = img.width / img.height;
        let renderW = maxW;
        let renderH = maxW / imgRatio;

        if (renderH > maxH) {
          renderH = maxH;
          renderW = maxH * imgRatio;
        }

        const posX = (pageWidth - renderW) / 2;
        const posY = (pageHeight - renderH) / 2;

        pdf.addImage(dataUrl, 'PNG', posX, posY, renderW, renderH);
        pdf.save(`${fileName}.pdf`);
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* 2-Column Responsive Grid matching the screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: যেসব জেলায় গিয়েছি (64 Districts Selector) */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-7 border border-[#ebdcd0] shadow-sm flex flex-col gap-5">
          
          {/* Header Title & Counter Badge */}
          <div className="flex items-center justify-between border-b border-[#f3eee7] pb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#16271c] tracking-tight">
                {lang === 'bn' ? 'যেসব জেলায় গিয়েছি' : 'Districts Visited'}
              </h2>
              {currentUser && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-[#006a4e] bg-[#e6f4ee] px-2.5 py-0.5 rounded-full border border-[#c4e4d5]">
                  {isSyncing ? 'সিঙ্ক হচ্ছে...' : '☁️ ক্লাউড সেভ'}
                </span>
              )}
            </div>
            <div className="px-3.5 py-1 rounded-full bg-[#f2ede4] text-[#1e3425] font-bold text-sm tracking-wide border border-[#e0d5c4]">
              {lang === 'bn'
                ? `${toBnNum(selectedCount)} / ${toBnNum(totalCount)}`
                : `${selectedCount} / ${totalCount}`}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7b8e81]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'bn' ? 'জেলা খুঁজুন...' : 'Search district...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#faf7f2] border border-[#ded5c5] text-[#16271c] placeholder-[#8d9e92] text-sm focus:outline-none focus:ring-2 focus:ring-[#006a4e] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Action Links: সব বাছাই করুন / সব মুছুন */}
          <div className="flex items-center gap-4 text-xs font-semibold pt-1">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-[#006a4e] hover:underline cursor-pointer transition-colors"
            >
              {lang === 'bn' ? 'সব বাছাই করুন' : 'Select All'}
            </button>
            <span className="text-[#d8cdbd]">•</span>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[#964747] hover:underline cursor-pointer transition-colors"
            >
              {lang === 'bn' ? 'সব মুছুন' : 'Clear All'}
            </button>
          </div>

          {/* Search Results OR Division-wise List */}
          <div className="space-y-6 max-h-[680px] overflow-y-auto pr-1 select-none">
            {filteredDistricts ? (
              // Search Filtered View
              <div>
                <p className="text-xs text-[#6e8073] font-medium mb-3">
                  {lang === 'bn'
                    ? `খোঁজার ফলাফল: ${toBnNum(filteredDistricts.length)}টি জেলা`
                    : `Search Results: ${filteredDistricts.length} districts`}
                </p>
                <div className="flex flex-wrap gap-2">
                  {filteredDistricts.map((district) => {
                    const isSelected = selectedIds.has(district.id);
                    return (
                      <button
                        key={district.id}
                        type="button"
                        onClick={() => toggleDistrict(district.id)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'text-white shadow-xs'
                            : 'bg-[#ede7dd] text-[#243529] hover:bg-[#e2d8cb]'
                        }`}
                        style={{
                          backgroundColor: isSelected ? selectedTheme.fillColor : undefined,
                        }}
                      >
                        {isSelected && <span className="mr-1">✓</span>}
                        {lang === 'bn' ? district.nameBn : district.nameEn}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              // All 8 Divisions matching screenshot layout
              DIVISIONS.map((division) => {
                const divisionDistricts = DISTRICTS.filter(
                  (d) => d.divisionId === division.id
                );
                const selectedInDiv = divisionDistricts.filter((d) =>
                  selectedIds.has(d.id)
                ).length;
                const isAllDivSelected =
                  divisionDistricts.length > 0 &&
                  selectedInDiv === divisionDistricts.length;

                return (
                  <div key={division.id} className="space-y-2.5">
                    {/* Division Header Row */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[#1e3124]">
                        {lang === 'bn' ? division.nameBn : division.nameEn}{' '}
                        <span className="font-normal text-xs text-[#6b7d70]">
                          {lang === 'bn'
                            ? `${toBnNum(selectedInDiv)}/${toBnNum(divisionDistricts.length)}`
                            : `${selectedInDiv}/${divisionDistricts.length}`}
                        </span>
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          toggleDivision(divisionDistricts.map((d) => d.id))
                        }
                        className="text-xs font-semibold text-[#006a4e] hover:underline cursor-pointer"
                      >
                        {isAllDivSelected
                          ? lang === 'bn'
                            ? 'সব বাদ'
                            : 'Deselect'
                          : lang === 'bn'
                          ? 'সব বাছাই'
                          : 'Select All'}
                      </button>
                    </div>

                    {/* District Pills Grid */}
                    <div className="flex flex-wrap gap-2">
                      {divisionDistricts.map((district) => {
                        const isSelected = selectedIds.has(district.id);
                        return (
                          <button
                            key={district.id}
                            type="button"
                            onClick={() => toggleDistrict(district.id)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${
                              isSelected
                                ? 'text-white shadow-xs font-semibold scale-102'
                                : 'bg-[#ede7dd] text-[#25362a] hover:bg-[#e4dacb]'
                            }`}
                            style={{
                              backgroundColor: isSelected
                                ? selectedTheme.fillColor
                                : undefined,
                            }}
                          >
                            {isSelected && <span className="mr-1 text-[11px]">✓</span>}
                            {lang === 'bn' ? district.nameBn : district.nameEn}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Map Card Preview & Customization Controls */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Top Customization Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-3xl border border-[#ebdcd0] shadow-xs">
            
            {/* Theme Picker */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#5c6f62]">
                {lang === 'bn' ? 'থিম' : 'Theme'}
              </span>
              <div className="flex items-center gap-1.5">
                {THEME_PALETTES.map((theme) => {
                  const isCurrent = theme.id === selectedTheme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedTheme(theme)}
                      className={`w-7 h-7 rounded-full transition-all cursor-pointer relative flex items-center justify-center ${
                        isCurrent
                          ? 'ring-2 ring-offset-2 ring-[#1b3023] scale-110 shadow-sm'
                          : 'hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: theme.fillColor }}
                      title={lang === 'bn' ? theme.nameBn : theme.nameEn}
                    >
                      {isCurrent && (
                        <div className="w-2 h-2 rounded-full bg-white shadow-xs" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Profile Photo / Name / District Labels Controls */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
              
              {/* Photo Upload Button */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#ded5c5] bg-[#faf7f2] hover:bg-[#ede6dc] text-[#1c2e22] font-semibold cursor-pointer transition-colors shadow-2xs"
              >
                <Camera className="w-3.5 h-3.5 text-[#006a4e]" />
                <span>
                  {avatarUrl
                    ? lang === 'bn'
                      ? 'ছবি পরিবর্তন'
                      : 'Change Photo'
                    : lang === 'bn'
                    ? 'আপনার ছবি যোগ করুন'
                    : 'Add Photo'}
                </span>
              </button>

              {/* Traveler Name Input Button */}
              {isEditingName ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={travelerName}
                    onChange={(e) => setTravelerName(e.target.value)}
                    placeholder={lang === 'bn' ? 'আপনার নাম' : 'Your Name'}
                    className="px-2.5 py-1 rounded-xl border border-[#006a4e] text-xs text-[#16271c] focus:outline-none w-28"
                    autoFocus
                    onBlur={() => setIsEditingName(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                  />
                  <button
                    type="button"
                    onClick={() => setIsEditingName(false)}
                    className="p-1 rounded-lg bg-[#006a4e] text-white"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#ded5c5] bg-[#faf7f2] hover:bg-[#ede6dc] text-[#1c2e22] font-semibold cursor-pointer transition-colors shadow-2xs"
                >
                  <User className="w-3.5 h-3.5 text-[#006a4e]" />
                  <span>
                    {travelerName
                      ? travelerName
                      : lang === 'bn'
                      ? 'আপনার নাম (ঐচ্ছিক)'
                      : 'Your Name (Optional)'}
                  </span>
                </button>
              )}

              {/* Show District Names Checkbox */}
              <button
                type="button"
                onClick={() => setShowDistrictLabels((prev) => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#ded5c5] bg-[#faf7f2] hover:bg-[#ede6dc] text-[#1c2e22] font-semibold cursor-pointer transition-colors shadow-2xs"
              >
                {showDistrictLabels ? (
                  <CheckSquare className="w-3.5 h-3.5 text-[#006a4e]" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-[#7c9082]" />
                )}
                <span>{lang === 'bn' ? 'জেলার নাম' : 'District Names'}</span>
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* THE TRAVEL MAP CARD (Capturable for Download) */}
          {/* ========================================================= */}
          <div
            ref={mapCardRef}
            className="w-full bg-[#fbf9f4] rounded-3xl sm:rounded-[32px] p-6 sm:p-8 border border-[#ebe1d4] shadow-md flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top of Card: Title, Name, Count */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                {/* User Avatar if uploaded */}
                {avatarUrl && (
                  <img
                    src={avatarUrl}
                    alt="Traveler Avatar"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-[#006a4e]/20"
                  />
                )}
                <div>
                  <span className="text-xs sm:text-sm font-medium text-[#657669] tracking-wide block">
                    {lang === 'bn' ? 'বাংলাদেশ ভ্রমণ ম্যাপ' : 'Bangladesh Travel Map'}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#15251b] tracking-tight leading-tight">
                    {travelerName
                      ? lang === 'bn'
                        ? `${travelerName}-এর বাংলাদেশ`
                        : `${travelerName}'s Bangladesh`
                      : lang === 'bn'
                      ? 'আমার বাংলাদেশ'
                      : 'My Bangladesh'}
                  </h3>
                </div>
              </div>

              {/* Big Bold Counter matching screenshot: 0 / ৬৪ */}
              <div className="text-right flex items-baseline gap-1 select-none">
                <span
                  className="text-4xl sm:text-5xl font-black tracking-tight"
                  style={{ color: selectedTheme.fillColor }}
                >
                  {lang === 'bn' ? toBnNum(selectedCount) : selectedCount}
                </span>
                <span className="text-xl sm:text-2xl font-bold text-[#8c9c90]">
                  /{lang === 'bn' ? toBnNum(totalCount) : totalCount}
                </span>
              </div>
            </div>

            {/* Center: The Interactive Bangladesh SVG Map */}
            <div className="my-2 py-2 flex items-center justify-center">
              <BangladeshMap
                selectedDistrictIds={selectedIds}
                onToggleDistrict={toggleDistrict}
                fillColor={selectedTheme.fillColor}
                showLabels={showDistrictLabels}
                lang={lang}
              />
            </div>

            {/* Bottom of Card: Progress Bar, Stats, Clean Branding */}
            <div className="border-t border-[#ede4d7] pt-4 mt-2">
              {/* Progress Line Bar */}
              <div className="w-full h-2 rounded-full bg-[#e8e0d4] overflow-hidden mb-3">
                <div
                  className="h-full rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${Math.max(percentage, 2)}%`,
                    backgroundColor: selectedTheme.fillColor,
                  }}
                />
              </div>

              {/* Progress Stats Row */}
              <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm font-semibold text-[#485c50] gap-2 mb-4">
                <span>
                  {lang === 'bn'
                    ? `${toBnNum(percentage)}% বাংলাদেশ ঘোরা হয়েছে`
                    : `${percentage}% of Bangladesh Explored`}
                </span>
                <span className="text-[#64776b] font-normal">
                  {lang === 'bn'
                    ? `${toBnNum(selectedCount)}টি জেলা • ৮টির মধ্যে ${toBnNum(visitedDivisionsCount)}টি বিভাগ`
                    : `${selectedCount} Districts • ${visitedDivisionsCount} of 8 Divisions`}
                </span>
              </div>

              {/* Card Footer: Inspiring Travel Text & Clean Branding (NO COMPETITOR WEBSITE LINK as requested) */}
              <div className="flex items-center justify-between gap-4 pt-2 border-t border-[#f0e7dc]">
                <div>
                  <span className="text-xs text-[#708477] font-medium block">
                    {lang === 'bn' ? 'মানচিত্র পূরণ করতে' : 'Keep exploring to'}
                  </span>
                  <span className="text-sm font-bold text-[#14231b]">
                    {lang === 'bn' ? 'ঘুরতে থাকুন নিজের প্রিয় দেশে' : 'Explore your homeland'}
                  </span>
                </div>

                {/* Clean watermark badge (Strictly NO competitor link / website link) */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/70 border border-[#e2d8cb] shadow-2xs">
                  <div className="w-5 h-5 rounded-md bg-[#006a4e] flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f42a41]" />
                  </div>
                  <span className="text-xs font-bold text-[#16271c]">
                    {lang === 'bn' ? 'অচেনা বাংলা' : 'Ochena Bangla'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Under Card Tip */}
          <p className="text-center text-xs text-[#6e8073] font-medium select-none">
            {lang === 'bn'
              ? 'টিপস: ম্যাপের জেলায় সরাসরি ক্লিক করেও বাছাই করতে পারেন।'
              : 'Tip: You can also click directly on any district on the map to select it.'}
          </p>

          {/* ========================================================= */}
          {/* DOWNLOAD SECTION: PNG, JPG, PDF */}
          {/* ========================================================= */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#ebdcd0] shadow-xs">
            <h4 className="text-base font-bold text-[#15271d] mb-4">
              {lang === 'bn' ? 'আপনার ম্যাপ ডাউনলোড করুন' : 'Download Your Map'}
            </h4>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <button
                type="button"
                disabled={isExporting}
                onClick={() => handleDownload('png')}
                className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl border border-[#ded5c5] bg-[#faf7f2] hover:bg-[#ede6dc] text-[#16291d] font-bold text-sm transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-[#006a4e]" />
                <span>↓ PNG</span>
              </button>

              <button
                type="button"
                disabled={isExporting}
                onClick={() => handleDownload('jpg')}
                className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl border border-[#ded5c5] bg-[#faf7f2] hover:bg-[#ede6dc] text-[#16291d] font-bold text-sm transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-[#006a4e]" />
                <span>↓ JPG</span>
              </button>

              <button
                type="button"
                disabled={isExporting}
                onClick={() => handleDownload('pdf')}
                className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-2xl border border-[#ded5c5] bg-[#faf7f2] hover:bg-[#ede6dc] text-[#16291d] font-bold text-sm transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50"
              >
                <Download className="w-4 h-4 text-[#006a4e]" />
                <span>↓ PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
