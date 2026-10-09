import React, { useState } from 'react';
import { X, Calendar, AlertCircle, CheckCircle2, Clock, Filter, Flag, GraduationCap } from 'lucide-react';
import { CALENDAR_EVENTS, CalendarEvent, TOTAL_WORKING_DAYS } from '../data/calendarData';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const currentDateObj = new Date('2026-10-09'); // Consistent with system reference date

  const filteredEvents = CALENDAR_EVENTS.filter((evt) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'ia' && evt.type === 'InternalAssessment') return true;
    if (selectedCategory === 'holiday' && evt.type === 'Holiday') return true;
    if (selectedCategory === 'exam' && (evt.type === 'Exam' || evt.type === 'Audit')) return true;
    if (selectedCategory === 'tt' && evt.type === 'TimetableAdjustment') return true;
    return false;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white rounded-2xl max-w-3xl w-full h-[650px] max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:px-6 bg-[#0c1b4f] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Digital Academic Calendar of Events</h3>
                <span className="px-2 py-0.2 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded">
                  AY 2026-27
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                School of Engineering & Technology (SoET) · 3rd & 5th Semester B.E.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress & Highlights Strip */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px]">Academic Progress</span>
              <p className="font-bold text-slate-900 font-mono">28 of {TOTAL_WORKING_DAYS} Working Days</p>
            </div>
            <div className="hidden sm:block w-32 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '31%' }}></div>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#0c1b4f] text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              All ({CALENDAR_EVENTS.length})
            </button>
            <button
              onClick={() => setSelectedCategory('ia')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                selectedCategory === 'ia'
                  ? 'bg-[#0c1b4f] text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              IA Tests
            </button>
            <button
              onClick={() => setSelectedCategory('holiday')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                selectedCategory === 'holiday'
                  ? 'bg-[#0c1b4f] text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Holidays
            </button>
            <button
              onClick={() => setSelectedCategory('exam')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                selectedCategory === 'exam'
                  ? 'bg-[#0c1b4f] text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              Exams & Audit
            </button>
            <button
              onClick={() => setSelectedCategory('tt')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                selectedCategory === 'tt'
                  ? 'bg-[#0c1b4f] text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              TT Days
            </button>
          </div>
        </div>

        {/* Scrollable Event Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {/* Active Highlight for current month */}
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <span className="font-bold text-amber-950 block">Current Academic Phase: October 2026</span>
              <span>
                First Internal Assessment Test (IA-1) is scheduled from <strong>22nd – 29th October 2026</strong>.
                Ensure a minimum of 75% attendance to avoid eligibility debarment.
              </span>
            </div>
          </div>

          {filteredEvents.map((evt) => {
            const isIA = evt.type === 'InternalAssessment';
            const isHoliday = evt.type === 'Holiday';
            const isExam = evt.type === 'Exam';
            const isCommence = evt.type === 'Commencement';

            return (
              <div
                key={evt.id}
                className={`p-4 rounded-xl border transition-all ${
                  evt.isImportant
                    ? 'bg-white border-indigo-300 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                      isIA
                        ? 'bg-purple-100 text-purple-800'
                        : isHoliday
                        ? 'bg-rose-100 text-rose-800'
                        : isExam
                        ? 'bg-amber-100 text-amber-900'
                        : isCommence
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {isIA ? 'IA' : isHoliday ? 'HOL' : isExam ? 'SEE' : 'CoE'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{evt.title}</h4>
                        {evt.isImportant && (
                          <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                            Critical
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        {evt.description}
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0 mt-2 sm:mt-0">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 font-mono text-xs font-bold text-slate-800 border border-slate-200">
                      {evt.displayDate}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Signed: Dean - SoET, Sapthagiri NPS University</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold transition-colors"
          >
            Close Calendar
          </button>
        </div>
      </div>
    </div>
  );
};
