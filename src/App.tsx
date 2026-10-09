import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CampusBannerSlider } from './components/CampusBannerSlider';
import { ImageDetailModal } from './components/ImageDetailModal';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { SapthaAIModal } from './components/SapthaAIModal';
import { CalendarModal } from './components/CalendarModal';
import { LoginModal } from './components/LoginModal';
import { STUDENTS_DATA, Student } from './data/studentsData';
import { CampusSpace } from './data/campusData';
import {
  getActiveUser,
  setActiveUser,
  ActiveUser,
  getStudentNotifications
} from './services/storageService';
import { MapPin, Phone, Mail, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUserState] = useState<ActiveUser>(() => getActiveUser());
  const [selectedCampusSpace, setSelectedCampusSpace] = useState<CampusSpace | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Sync active user to storage
  const handleUserChange = (user: ActiveUser) => {
    setCurrentUserState(user);
    setActiveUser(user);
  };

  const currentStudent: Student =
    STUDENTS_DATA.find(s => s.srn === currentUser.srn) || STUDENTS_DATA[0];

  const unreadNotifs = getStudentNotifications(currentUser.srn).filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-950">
      {/* Official Top Navigation */}
      <Navbar
        activeUser={currentUser}
        onSwitchRole={() => setIsLoginModalOpen(true)}
        onOpenCalendar={() => setIsCalendarModalOpen(true)}
        onOpenAI={() => setIsAIModalOpen(true)}
        onOpenNotifications={() => {
          if (currentUser.role === 'student') {
            setActiveTab('notifications');
          }
        }}
        unreadCount={unreadNotifs}
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

      {/* Sliding Campus Photo Gallery */}
      <CampusBannerSlider onSelectSpace={(space) => setSelectedCampusSpace(space)} />

      {/* Main Role-Specific View */}
      <div className="flex-1 flex flex-col">
        {currentUser.role === 'student' ? (
          <StudentDashboard
            student={currentStudent}
            onLogout={() => setIsLoginModalOpen(true)}
            onOpenSapthaAI={() => setIsAIModalOpen(true)}
            onSelectCampusSpace={(space) => setSelectedCampusSpace(space)}
            initialTab={activeTab}
          />
        ) : (
          <TeacherDashboard
            facultyName={currentUser.teacherName || 'Vikram N R'}
            onLogout={() => handleUserChange({ role: 'student', srn: '24SUUBECS0001' })}
            onOpenSapthaAI={() => setIsAIModalOpen(true)}
          />
        )}
      </div>

      {/* Modals & Drawers */}
      <ImageDetailModal
        space={selectedCampusSpace}
        onClose={() => setSelectedCampusSpace(null)}
      />

      <SapthaAIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        currentSrn={currentStudent.srn}
      />

      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleUserChange}
      />

      {/* Institutional Footer */}
      <footer className="bg-[#0b1742] text-white border-t border-amber-500/30 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-xs text-slate-300">
          {/* Col 1: University Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold text-white tracking-wide">
                SAPTHAGIRI NPS UNIVERSITY
              </span>
            </div>
            <p className="text-amber-300/90 font-medium">
              School of Engineering and Technology (SoET)
            </p>
            <p className="text-slate-400 leading-relaxed">
              Committed to unmatched academic excellence, advanced engineering research, and holistic student development.
            </p>
          </div>

          {/* Col 2: Campus Address */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
              Main Campus
            </h4>
            <div className="flex items-start gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                #14/5, Chikkasandra, Hesaraghatta Main Road, Bengaluru - 560 057, Karnataka, India
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>+91 80 2837 2800 / 2801</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>admissions@snpsu.edu.in</span>
            </div>
          </div>

          {/* Col 3: Portal Links */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
              Quick Portals
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              <li>
                <a
                  href="https://snpsu.edu.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 flex items-center gap-1 transition-colors"
                >
                  <span>Official University Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => setIsCalendarModalOpen(true)}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Calendar of Events (CoE 2026-27)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAIModalOpen(true)}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Saptha AI Assistant ✦
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Faculty Attendance Console
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Academic Compliance */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-sans">
              Accreditation & Regulations
            </h4>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1.5">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                UGC Recognized & AICTE Approved
              </p>
              <p className="text-[11px] text-slate-400">
                Mandatory minimum 75% attendance policy enforced under SoET Academic Regulations 2026-27.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Sapthagiri NPS University. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            Built for Sapthagiri NPS University Attendance & Smart Campus Systems
          </p>
        </div>
      </footer>
    </div>
  );
}
