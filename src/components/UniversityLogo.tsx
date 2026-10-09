import React from 'react';

interface UniversityLogoProps {
  variant?: 'full' | 'shield' | 'compact';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const UniversityLogo: React.FC<UniversityLogoProps> = ({
  variant = 'full',
  className = '',
  size = 'md'
}) => {
  // Exact vector reproduction of the official Sapthagiri NPS University crest
  const renderShield = (dimensionClass: string) => (
    <div className={`relative shrink-0 flex items-center justify-center ${dimensionClass}`}>
      <svg viewBox="0 0 100 125" className="w-full h-full drop-shadow-sm" fill="none">
        {/* Outer Shield with Royal Blue & Gold Border */}
        <path
          d="M50 4 C76 4, 94 18, 94 48 C94 82, 68 112, 50 120 C32 112, 6 82, 6 48 C6 18, 24 4, 50 4 Z"
          fill="#0C235A"
          stroke="#C59B27"
          strokeWidth="3.5"
        />
        {/* Inner border line */}
        <path
          d="M50 9 C72 9, 88 22, 88 48 C88 78, 64 105, 50 112 C36 105, 12 78, 12 48 C12 22, 28 9, 50 9 Z"
          stroke="#E5BA42"
          strokeWidth="1.2"
          strokeOpacity="0.7"
        />

        {/* Central Vertical Dividing Line */}
        <line x1="50" y1="12" x2="50" y2="108" stroke="#E5BA42" strokeWidth="2.5" />

        {/* LEFT SIDE: Sun with 12 Radiating Rays */}
        <circle cx="30" cy="35" r="7.5" stroke="#E5BA42" strokeWidth="2" fill="#E5BA42" fillOpacity="0.15" />
        {/* 12 Sun Rays */}
        <line x1="30" y1="23" x2="30" y2="18" stroke="#E5BA42" strokeWidth="2" strokeLinecap="round" />
        <line x1="30" y1="47" x2="30" y2="52" stroke="#E5BA42" strokeWidth="2" strokeLinecap="round" />
        <line x1="18" y1="35" x2="13" y2="35" stroke="#E5BA42" strokeWidth="2" strokeLinecap="round" />
        <line x1="42" y1="35" x2="47" y2="35" stroke="#E5BA42" strokeWidth="2" strokeLinecap="round" />
        <line x1="21.5" y1="26.5" x2="17.5" y2="22.5" stroke="#E5BA42" strokeWidth="2" strokeLinecap="round" />
        <line x1="38.5" y1="43.5" x2="42.5" y2="47.5" stroke="#E5BA42" strokeWidth="2" strokeLinecap="round" />
        <line x1="38.5" y1="26.5" x2="42.5" y2="22.5" stroke="#E5BA42" strokeWidth="2" strokeLinecap="round" />
        <line x1="21.5" y1="43.5" x2="17.5" y2="47.5" stroke="#E5BA42" strokeWidth="2" strokeLinecap="round" />

        {/* LEFT SIDE: Mountain Peaks (3 tiers) */}
        <path
          d="M14 84 L26 62 L38 84"
          stroke="#E5BA42"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M26 84 L38 68 L48 84"
          stroke="#E5BA42"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          d="M18 100 L32 78 L46 100"
          stroke="#E5BA42"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* RIGHT SIDE: Open Book at top */}
        <path
          d="M58 26 C66 23, 76 23, 84 26 L84 39 C76 36, 66 36, 58 39 Z"
          stroke="#E5BA42"
          strokeWidth="2"
          fill="#E5BA42"
          fillOpacity="0.2"
        />
        <path
          d="M58 26 L58 39"
          stroke="#E5BA42"
          strokeWidth="2"
        />
        <line x1="71" y1="24.5" x2="71" y2="37.5" stroke="#E5BA42" strokeWidth="1.5" />

        {/* RIGHT SIDE: Classical Column Capital (Ionic Volute) */}
        <path
          d="M55 52 C55 48, 62 48, 64 52 C65 56, 60 58, 57 56 C54 54, 55 50, 59 50 L83 50 C87 50, 88 54, 85 56 C82 58, 77 56, 78 52 C80 48, 87 48, 87 52"
          stroke="#E5BA42"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <line x1="56" y1="52" x2="86" y2="52" stroke="#E5BA42" strokeWidth="2.5" />

        {/* RIGHT SIDE: Classical Fluted Columns (3 vertical flutes) */}
        <line x1="62" y1="56" x2="62" y2="98" stroke="#E5BA42" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="71" y1="56" x2="71" y2="98" stroke="#E5BA42" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="80" y1="56" x2="80" y2="98" stroke="#E5BA42" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="58" y1="98" x2="84" y2="98" stroke="#E5BA42" strokeWidth="2.5" />
      </svg>
    </div>
  );

  if (variant === 'shield') {
    const dim = size === 'sm' ? 'w-8 h-10' : size === 'lg' ? 'w-16 h-20' : size === 'xl' ? 'w-24 h-30' : 'w-12 h-15';
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {renderShield(dim)}
      </div>
    );
  }

  // Full official logo banner exactly matching user's image.png
  return (
    <div className={`inline-flex items-center gap-3.5 ${className}`}>
      {renderShield(size === 'sm' ? 'w-9 h-11' : size === 'lg' ? 'w-16 h-20' : 'w-12 h-15')}
      <div className="flex flex-col justify-center select-none">
        <div className="flex items-baseline gap-1.5 leading-none">
          <span className="font-sans font-black tracking-tight text-[#0C235A] text-xl sm:text-2xl">
            SAPTHAGIRI
          </span>
          <span className="font-sans font-bold tracking-tight text-[#C59B27] text-xl sm:text-2xl">
            NPS
          </span>
        </div>
        <div className="font-sans font-semibold tracking-wider text-[#0C235A] text-xs sm:text-sm mt-0.5">
          UNIVERSITY
        </div>
        <div className="font-sans font-semibold tracking-wider text-[#A37B24] text-[9px] sm:text-[10px] mt-1 uppercase">
          UNMATCHED EXCELLENCE, UNLIMITED POTENTIAL
        </div>
      </div>
    </div>
  );
};
