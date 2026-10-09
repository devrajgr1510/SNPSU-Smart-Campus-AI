import React from 'react';
import { X, ExternalLink, MapPin, Users, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CampusSpace } from '../data/campusData';

interface ImageDetailModalProps {
  space: CampusSpace | null;
  onClose: () => void;
}

export const ImageDetailModal: React.FC<ImageDetailModalProps> = ({ space, onClose }) => {
  if (!space) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:px-6 bg-[#0b1742] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 rounded border border-amber-400/30">
              {space.category}
            </span>
            <span className="text-xs text-slate-300">· Sapthagiri NPS University</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Main Visual with Frame */}
          <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-950 aspect-video sm:aspect-16/9">
            <img
              src={space.image}
              alt={space.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              {space.name}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <MapPin className="w-4 h-4 text-amber-600" />
                {space.location}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <Users className="w-4 h-4 text-blue-600" />
                Capacity: {space.capacity}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            {space.description}
          </div>

          {/* Key Infrastructure Highlights */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              FACILITY HIGHLIGHTS & AMENITIES
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {space.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Meta Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-amber-50/50 p-4 rounded-xl border border-amber-200/60">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-950 block">Operating Hours</span>
                <span className="text-amber-900/80">{space.operatingHours}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-950 block">Administrative In-Charge</span>
                <span className="text-amber-900/80">{space.inCharge}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <a
            href="https://snpsu.edu.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-[#0c1b4f] hover:text-amber-600 flex items-center gap-1.5 transition-colors"
          >
            Visit University Website (snpsu.edu.in)
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-3">
            <a
              href={space.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
