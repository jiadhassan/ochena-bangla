import React, { useState } from 'react';
import { DISTRICTS, District } from '../data/bangladeshDistricts';

interface BangladeshMapProps {
  selectedDistrictIds: Set<string>;
  onToggleDistrict: (id: string) => void;
  fillColor: string;
  showLabels?: boolean;
  lang?: 'bn' | 'en';
}

export const BangladeshMap: React.FC<BangladeshMapProps> = ({
  selectedDistrictIds,
  onToggleDistrict,
  fillColor,
  showLabels = false,
  lang = 'bn',
}) => {
  const [hoveredDistrict, setHoveredDistrict] = useState<District | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<SVGElement>, d: District) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setHoveredDistrict(d);
  };

  const handleMouseLeave = () => {
    setHoveredDistrict(null);
    setTooltipPos(null);
  };

  return (
    <div className="relative w-full max-w-[560px] mx-auto select-none flex items-center justify-center">
      {/* Official 64 Districts Bangladesh Vector Map */}
      <svg
        viewBox="0 0 600 872"
        className="w-full h-auto max-h-[660px] drop-shadow-md transition-all"
        style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.08))' }}
      >
        {/* Soft nationwide base background shadow for realism */}
        <g id="base-layer" opacity="0.3">
          {DISTRICTS.map((d) => (
            <path
              key={`base-${d.id}`}
              d={d.path}
              fill="#c8beaf"
              stroke="#b5a997"
              strokeWidth="1.2"
            />
          ))}
        </g>

        {/* 64 Official District Geographic Boundaries */}
        <g id="districts-layer">
          {DISTRICTS.map((district) => {
            const isSelected = selectedDistrictIds.has(district.id);
            const isHovered = hoveredDistrict?.id === district.id;

            return (
              <path
                key={district.id}
                id={`map-district-${district.id}`}
                d={district.path}
                fill={isSelected ? fillColor : '#d9d0c2'}
                stroke={isSelected ? '#ffffff' : '#ece4d6'}
                strokeWidth={isHovered ? 2.5 : isSelected ? 1.8 : 0.9}
                strokeLinejoin="round"
                className="cursor-pointer transition-all duration-150 ease-out"
                style={{
                  filter: isHovered
                    ? 'drop-shadow(0 0 8px rgba(0,0,0,0.35)) brightness(1.08)'
                    : isSelected
                    ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))'
                    : 'none',
                }}
                onClick={() => onToggleDistrict(district.id)}
                onMouseMove={(e) => handleMouseMove(e, district)}
                onMouseEnter={(e) => handleMouseMove(e, district)}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}
        </g>

        {/* District Name Labels on Map */}
        {/* Requirement: Whenever ANY district is selected, its name ALWAYS appears clearly on the map! */}
        <g id="labels-layer" pointerEvents="none">
          {DISTRICTS.map((d) => {
            const isSelected = selectedDistrictIds.has(d.id);
            // Show label if district is selected OR user enabled showLabels checkbox
            const shouldShow = isSelected || showLabels;

            if (!shouldShow) return null;

            const labelText = lang === 'bn' ? d.nameBn : d.nameEn;

            return (
              <g key={`label-${d.id}`} transform={`translate(${d.center[0]}, ${d.center[1]})`}>
                {/* Pill background badge for selected districts to ensure maximum contrast */}
                {isSelected && (
                  <rect
                    x={-(labelText.length * 5.2 + 8)}
                    y={-10}
                    width={labelText.length * 10.4 + 16}
                    height={19}
                    rx={9.5}
                    fill="rgba(0, 0, 0, 0.72)"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                  />
                )}

                {/* Text Label */}
                <text
                  x="0"
                  y="3.5"
                  textAnchor="middle"
                  fontSize={isSelected ? "11.5" : "9"}
                  fontWeight={isSelected ? "700" : "600"}
                  fill={isSelected ? "#ffffff" : "#4a3e2f"}
                  style={{
                    fontFamily: "'Hind Siliguri', sans-serif",
                    textShadow: isSelected
                      ? '0 1px 2px rgba(0,0,0,0.8)'
                      : '0 1px 2px rgba(255,255,255,0.95)',
                    letterSpacing: '0.01em',
                  }}
                >
                  {labelText}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Hover Tooltip */}
      {hoveredDistrict && tooltipPos && (
        <div
          className="absolute z-40 pointer-events-none -translate-x-1/2 -translate-y-full px-3.5 py-2 rounded-2xl bg-[#14231b]/95 text-white text-xs font-semibold shadow-2xl border border-white/20 backdrop-blur-md flex flex-col items-center gap-0.5 transition-transform"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y - 12}px`,
          }}
        >
          <span className="text-sm font-bold text-[#5ce5a5]">
            {lang === 'bn' ? hoveredDistrict.nameBn : hoveredDistrict.nameEn}
          </span>
          <span className="text-[10px] text-white/75 font-normal">
            {lang === 'bn' ? hoveredDistrict.divisionBn : hoveredDistrict.divisionEn}
          </span>
          <span className="text-[10px] text-[#ffd166] mt-0.5 font-medium">
            {selectedDistrictIds.has(hoveredDistrict.id)
              ? (lang === 'bn' ? '✓ ভ্রমণ করা হয়েছে' : '✓ Visited')
              : (lang === 'bn' ? 'ক্লিক করে নির্বাচন করুন' : 'Click to select')}
          </span>
        </div>
      )}
    </div>
  );
};
