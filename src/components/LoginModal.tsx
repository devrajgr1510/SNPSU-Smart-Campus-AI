import React, { useState } from 'react';
import { X, GraduationCap, UserCheck, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { STUDENTS_DATA, Student } from '../data/studentsData';
import { FACULTY_MEMBERS } from '../data/timetableData';
import { ActiveUser } from '../services/storageService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: ActiveUser) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedUser = username.trim().toUpperCase();
    const trimmedPass = password.trim().toUpperCase();

    // Validate against student data
    const matched = STUDENTS_DATA.find(
      s => (s.name.toUpperCase() === trimmedUser || s.srn.toUpperCase() === trimmedUser) &&
           (s.srn.toUpperCase() === trimmedPass || trimmedPass === 'DEMO' || trimmedPass === s.name.toUpperCase())
    );

    if (matched) {
      onLogin({ role: 'student', srn: matched.srn });
      onClose();
    } else {
      setErrorMsg('Invalid credentials. Student Username is your Name (e.g. A MOHITH SANTOSH) and Password is your SRN (e.g. 24SUUBECS0001). Or use Quick Demo Login below.');
    }
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmed = username.trim().toLowerCase();
    const matched = FACULTY_MEMBERS.find(f => f.name.toLowerCase().includes(trimmed));

    if (matched || trimmed === 'admin' || trimmed === 'teacher') {
      const selectedName = matched ? matched.name : 'Vikram N R';
      onLogin({ role: 'teacher', teacherName: selectedName });
      onClose();
    } else {
      setErrorMsg(`Teacher name not recognized. You can enter any faculty name (e.g. Vikram N R, Kavya M, A Ranjini) or click Quick Demo Faculty.`);
    }
  };

  const handleQuickDemoStudent = (srn: string) => {
    onLogin({ role: 'student', srn });
    onClose();
  };

  const handleQuickDemoTeacher = (name: string) => {
    onLogin({ role: 'teacher', teacherName: name });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:px-6 bg-[#0c1b4f] text-white flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-serif">Sapthagiri NPS University Portal</h3>
            <p className="text-[11px] text-amber-200/90">Sign In to Student or Faculty Console</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 p-3 bg-slate-100 border-b border-slate-200 gap-2">
          <button
            onClick={() => {
              setRole('student');
              setErrorMsg(null);
            }}
            className={`py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
              role === 'student'
                ? 'bg-white text-[#0c1b4f] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-blue-700" />
            <span>Student Portal</span>
          </button>

          <button
            onClick={() => {
              setRole('teacher');
              setErrorMsg(null);
            }}
            className={`py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
              role === 'teacher'
                ? 'bg-white text-indigo-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4 text-indigo-700" />
            <span>Faculty Console</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {role === 'student' ? (
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student Name (as in PDF)
                </label>
                <input
                  type="text"
                  placeholder="e.g. A MOHITH SANTOSH or ADITI SINGH"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password (Student SRN)
                </label>
                <input
                  type="password"
                  placeholder="e.g. 24SUUBECS0001"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-600 focus:bg-white font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-white bg-[#0c1b4f] hover:bg-blue-900 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Log In to Student Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick 1-Click Demo Profiles */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
                  Zero-Friction Quick Student Access:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoStudent('24SUUBECS0001')}
                    className="p-2 text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors"
                  >
                    <span className="font-bold text-slate-900 block truncate">A MOHITH SANTOSH</span>
                    <span className="font-mono text-[10px] text-slate-500">24SUUBECS0001 (5CSE01)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoStudent('24SUUBECS0054')}
                    className="p-2 text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors"
                  >
                    <span className="font-bold text-slate-900 block truncate">ADITI SINGH</span>
                    <span className="font-mono text-[10px] text-slate-500">24SUUBECS0054 (5CSE01)</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleTeacherSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Faculty Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vikram N R, Kavya M, A Ranjini"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Faculty Access Passcode (Optional for demo)
                </label>
                <input
                  type="password"
                  placeholder="Press Log In directly or any password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600 focus:bg-white font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-white bg-indigo-900 hover:bg-indigo-800 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Enter Faculty Attendance Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Quick 1-Click Demo Teachers */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
                  Quick Faculty Presets:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoTeacher('Vikram N R')}
                    className="p-2 text-left bg-slate-50 hover:bg-indigo-50 border border-slate-200 rounded-lg transition-colors"
                  >
                    <span className="font-bold text-slate-900 block truncate">Prof. Vikram N R</span>
                    <span className="text-[10px] text-slate-500">5CSE01 Advisor (CCT)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoTeacher('Kavya M')}
                    className="p-2 text-left bg-slate-50 hover:bg-indigo-50 border border-slate-200 rounded-lg transition-colors"
                  >
                    <span className="font-bold text-slate-900 block truncate">Prof. Kavya M</span>
                    <span className="text-[10px] text-slate-500">5CSE02 Advisor (BDT)</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
