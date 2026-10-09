import React, { useRef, useState, useEffect } from 'react';
import { ExternalLink, ChevronLeft, ChevronRight, Maximize2, Users, Upload, Image as ImageIcon } from 'lucide-react';
import { CAMPUS_SPACES, CampusSpace } from '../data/campusData';

interface CampusBannerSliderProps {
  onSelectSpace: (space: CampusSpace) => void;
}

export const CampusBannerSlider: React.FC<CampusBannerSliderProps> = ({ onSelectSpace }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [customImages, setCustomImages] = useState<Record<string, string>>(() => {
    try {
      const raw = localStorage.getItem('snpsu_custom_images');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // Auto-scroll from right to left smoothly
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
        }
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Handler for custom image file uploads
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const nameLower = file.name.toLowerCase();

        let targetId = 'facade';
        if (nameLower.includes('library') || nameLower.includes('oip')) {
          targetId = 'library';
        } else if (nameLower.includes('class') || nameLower.includes('phppapoag')) {
          targetId = 'classroom';
        } else if (nameLower.includes('seminar') || nameLower.includes('basement')) {
          targetId = 'seminar_hall';
        } else if (nameLower.includes('map')) {
          targetId = 'campus_map';
        } else if (nameLower.includes('untitled') || nameLower.includes('facade') || nameLower.includes('1747380414')) {
          targetId = 'facade';
        }

        setCustomImages((prev) => {
          const updated = { ...prev, [targetId]: dataUrl };
          localStorage.setItem('snpsu_custom_images', JSON.stringify(updated));
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="relative bg-gradient-to-b from-slate-900 via-[#0e1a42] to-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Hidden file input for uploading user's exact image files */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Background ambient lighting */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                CAMPUS INFRASTRUCTURE & HERITAGE
              </span>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-xs text-slate-300">Bengaluru Campus</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-serif">
              Explore Sapthagiri NPS University
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Authentic campus facilities, classical architecture, and modern research infrastructure. Click any photo for details.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Upload My Photos button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 rounded-lg transition-colors flex items-center gap-1.5"
              title="Upload your own original campus images from device"
            >
              <Upload className="w-3.5 h-3.5 text-amber-300" />
              <span>Upload My Photos</span>
            </button>

            <a
              href="https://snpsu.edu.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg transition-colors flex items-center gap-1.5 backdrop-blur-xs"
            >
              <span>Official snpsu.edu.in</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            </a>

            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
              <button
                onClick={() => handleManualScroll('left')}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleManualScroll('right')}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sliding Cards Strip */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex items-stretch gap-6 overflow-x-auto pb-4 scroll-smooth no-scrollbar"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {CAMPUS_SPACES.map((space) => {
            const currentImg = customImages[space.id] || space.image;

            return (
              <div
                key={space.id}
                onClick={() => onSelectSpace({ ...space, image: currentImg })}
                className="group min-w-[320px] sm:min-w-[380px] max-w-[400px] bg-slate-800/80 rounded-2xl overflow-hidden border border-white/10 hover:border-amber-400/50 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col shrink-0 transform hover:-translate-y-1"
                style={{ scrollSnapAlign: 'start' }}
              >
                {/* Image Frame with Measured Scrim */}
                <div className="relative h-56 sm:h-60 overflow-hidden bg-slate-900">
                  <img
                    src={currentImg}
                    alt={space.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                  {/* Badge & Maximize button */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase bg-black/60 backdrop-blur-md text-amber-300 rounded-md border border-amber-400/30">
                      {space.category}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/80 group-hover:text-white group-hover:bg-amber-500/80 transition-colors">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Title inside image bottom */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug drop-shadow-sm group-hover:text-amber-200 transition-colors">
                      {space.name}
                    </h3>
                  </div>
                </div>

                {/* Info Snippet */}
                <div className="p-4 flex-1 flex flex-col justify-between bg-slate-800/50 backdrop-blur-xs">
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {space.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      {space.capacity}
                    </span>
                    <span className="text-amber-400 font-semibold group-hover:underline flex items-center gap-1">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
