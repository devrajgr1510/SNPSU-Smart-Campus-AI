import React, { useState, useMemo } from 'react';
import {
  Users,
  CalendarCheck,
  Calendar,
  Check,
  X,
  FileCheck2,
  Clock,
  BookOpen,
  MapPin,
  ChevronRight,
  Filter,
  Sparkles,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  ChevronLeft,
  Search
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { STUDENTS_DATA, Student } from '../data/studentsData';
import { SECTION_5CSE01_TIMETABLE, SECTION_5CSE02_TIMETABLE, FACULTY_MEMBERS } from '../data/timetableData';
import {
  getAttendanceSessions,
  saveAttendanceSession,
  getAttendanceMatrixForSection,
  AttendanceSession
} from '../services/storageService';

interface TeacherDashboardProps {
  facultyName: string;
  onLogout: () => void;
  onOpenSapthaAI: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  facultyName,
  onLogout,
  onOpenSapthaAI
}) => {
  const [activeTab, setActiveTab] = useState<'mark_attendance' | 'my_timetable' | 'master_register' | 'students'>('mark_attendance');
  const [selectedSection, setSelectedSection] = useState<string>('5CSE01');
  const [selectedSubject, setSelectedSubject] = useState<string>('CCT');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-09');
  const [selectedPeriod, setSelectedPeriod] = useState<number>(1);
  const [selectedClassroom, setSelectedClassroom] = useState<string>('A202');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFull60Columns, setShowFull60Columns] = useState<boolean>(true);

  // Success receipt modal state
  const [submittedReceipt, setSubmittedReceipt] = useState<{
    presentCount: number;
    absentCount: number;
    totalCount: number;
    percentage: number;
    subjectName: string;
    section: string;
    date: string;
    period: number;
  } | null>(null);

  // Fetch faculty profile & their allotted subjects
  const facultyProfile = useMemo(() => {
    return FACULTY_MEMBERS.find(f => f.name.toLowerCase() === facultyName.toLowerCase()) || FACULTY_MEMBERS[0];
  }, [facultyName]);

  // Compute teacher's own weekly schedule across the week
  const teacherWeeklySchedule = useMemo(() => {
    const list: {
      day: string;
      fullDay: string;
      period: number;
      time: string;
      subject: string;
      section: string;
      room: string;
      batch?: string;
    }[] = [];

    const sections = [SECTION_5CSE01_TIMETABLE, SECTION_5CSE02_TIMETABLE];
    sections.forEach(sec => {
      sec.schedule.forEach(day => {
        day.slots.forEach(slot => {
          if (!slot.isBreak && (
            slot.faculty.toLowerCase().includes(facultyName.toLowerCase()) ||
            (slot.faculty2 && slot.faculty2.toLowerCase().includes(facultyName.toLowerCase()))
          )) {
            list.push({
              day: day.day,
              fullDay: day.fullDay,
              period: slot.period,
              time: slot.time,
              subject: slot.subjectName || slot.shortCode || '',
              section: sec.section,
              room: slot.room,
              batch: slot.batch
            });
          }
        });
      });
    });

    return list.sort((a, b) => {
      const dayOrder = { MON: 1, TUE: 2, WED: 3, THUR: 4, FRI: 5 };
      const diff = (dayOrder[a.day as keyof typeof dayOrder] || 0) - (dayOrder[b.day as keyof typeof dayOrder] || 0);
      return diff !== 0 ? diff : a.period - b.period;
    });
  }, [facultyName]);

  // Matrix data for selected section & subject
  const matrixData = useMemo(() => {
    return getAttendanceMatrixForSection(selectedSection, selectedSubject);
  }, [selectedSection, selectedSubject]);

  const existingSessions = matrixData.sessions;
  const nextSessionIndex = existingSessions.length + 1;

  // Attendance state for current session being marked: srn -> 'P' | 'A'
  const [currentAttendance, setCurrentAttendance] = useState<Record<string, 'P' | 'A'>>(() => {
    const initial: Record<string, 'P' | 'A'> = {};
    STUDENTS_DATA.filter(s => s.section === selectedSection).forEach(s => {
      initial[s.srn] = 'P'; // Default all present for convenience
    });
    return initial;
  });

  const studentsList = useMemo(() => {
    return STUDENTS_DATA.filter(s => s.section === selectedSection && (
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.srn.toLowerCase().includes(searchQuery.toLowerCase())
    ));
  }, [selectedSection, searchQuery]);

  const toggleStudentStatus = (srn: string) => {
    setCurrentAttendance(prev => ({
      ...prev,
      [srn]: prev[srn] === 'P' ? 'A' : 'P'
    }));
  };

  const markAll = (status: 'P' | 'A') => {
    const updated: Record<string, 'P' | 'A'> = {};
    studentsList.forEach(s => {
      updated[s.srn] = status;
    });
    setCurrentAttendance(prev => ({ ...prev, ...updated }));
  };

  // Submit attendance handler
  const handleSubmitAttendance = () => {
    const sectionStudents = STUDENTS_DATA.filter(s => s.section === selectedSection);
    let presentCount = 0;
    let absentCount = 0;

    sectionStudents.forEach(s => {
      if (currentAttendance[s.srn] === 'P') {
        presentCount++;
      } else {
        absentCount++;
      }
    });

    const totalCount = sectionStudents.length;
    const percentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 1000) / 10 : 0;

    const subjectFullName = selectedSubject === 'CCT'
      ? 'Cloud Computing Technology'
      : selectedSubject === 'BDT'
      ? 'Big Data Tools and Techniques'
      : selectedSubject === 'ML'
      ? 'Machine Learning'
      : selectedSubject;

    const newSession: AttendanceSession = {
      sessionId: `sess-${selectedSubject}-${selectedDate}-P${selectedPeriod}`,
      section: selectedSection,
      subjectCode: selectedSubject,
      subjectName: subjectFullName,
      facultyName: facultyProfile.name,
      date: selectedDate,
      period: selectedPeriod,
      classroom: selectedClassroom,
      sessionIndex: nextSessionIndex,
      records: currentAttendance,
      timestamp: Date.now()
    };

    saveAttendanceSession(newSession);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}

    setSubmittedReceipt({
      presentCount,
      absentCount,
      totalCount,
      percentage,
      subjectName: subjectFullName,
      section: selectedSection,
      date: selectedDate,
      period: selectedPeriod
    });
  };

  // Live stats for current form
  const liveStats = useMemo(() => {
    let p = 0;
    let a = 0;
    const all = STUDENTS_DATA.filter(s => s.section === selectedSection);
    all.forEach(st => {
      if (currentAttendance[st.srn] === 'P') p++;
      else a++;
    });
    return {
      total: all.length,
      present: p,
      absent: a,
      pct: all.length > 0 ? ((p / all.length) * 100).toFixed(1) : '0'
    };
  }, [currentAttendance, selectedSection]);

  return (
    <div className="flex-1 flex flex-col md:flex-row bg-slate-50 min-h-[calc(100vh-120px)]">
      {/* Faculty Left Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-4 flex flex-col justify-between shrink-0 shadow-xs">
        <div>
          {/* Faculty Profile Card */}
          <div className="p-3.5 bg-gradient-to-br from-[#1e1b4b] to-[#312e81] text-white rounded-xl shadow-xs mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-400/20 border border-amber-300/40 flex items-center justify-center font-bold text-amber-300 text-sm">
                {facultyProfile.name.slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Faculty Portal</p>
                <h4 className="text-sm font-bold truncate text-white">{facultyProfile.name}</h4>
                <p className="text-[11px] text-indigo-200 truncate">{facultyProfile.room}</p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-white/10 text-[11px] text-indigo-200">
              <p className="font-medium text-white">{facultyProfile.title}</p>
            </div>
          </div>

          {/* Current Class Detection Pill */}
          <div className="bg-amber-50 border border-amber-200/80 p-3 rounded-xl mb-4 text-xs">
            <div className="flex items-center gap-1.5 text-amber-800 font-bold">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Current Timetable Class</span>
            </div>
            <p className="font-semibold text-slate-900 mt-1">
              Section 5CSE01 · Period {selectedPeriod}
            </p>
            <p className="text-[11px] text-slate-600">
              Cloud Computing Technology in {selectedClassroom}
            </p>
          </div>

          {/* Sidebar Navigation */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
              Faculty Controls
            </div>
            <button
              onClick={() => setActiveTab('mark_attendance')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'mark_attendance'
                  ? 'bg-indigo-50 text-indigo-900 font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <CalendarCheck className="w-4 h-4 text-indigo-700" />
                Mark Attendance
              </span>
              {activeTab === 'mark_attendance' && <ChevronRight className="w-3.5 h-3.5 text-indigo-700" />}
            </button>

            <button
              onClick={() => setActiveTab('my_timetable')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'my_timetable'
                  ? 'bg-indigo-50 text-indigo-900 font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                My Weekly Timetable
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {teacherWeeklySchedule.length} slots
              </span>
            </button>

            <button
              onClick={() => setActiveTab('master_register')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'master_register'
                  ? 'bg-indigo-50 text-indigo-900 font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                Master Register (60 Cols)
              </span>
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'students'
                  ? 'bg-indigo-50 text-indigo-900 font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-purple-600" />
                5 CSE Student Roster
              </span>
              <span className="text-[10px] font-mono text-slate-400">58</span>
            </button>

            <button
              onClick={onOpenSapthaAI}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 fill-amber-300" />
                Saptha AI ✦
              </span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-200/60 px-1.5 py-0.5 rounded">
                Assistant
              </span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-slate-200 mt-6">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Switch to Student Portal
          </button>
        </div>
      </aside>

      {/* Main Faculty Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* MARK ATTENDANCE TAB */}
        {activeTab === 'mark_attendance' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            {/* Control Form Bar */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                    ATTENDANCE MANAGEMENT CONSOLE
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 font-serif">
                    Mark Student Attendance — Class #{nextSessionIndex} of 60
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select Section, Course, and Period. Present adds +1 to cumulative count, Absent adds +0.
                  </p>
                </div>

                {/* Live Real-time Indicator Pill */}
                <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-900">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>IST Session Active</span>
                </div>
              </div>

              {/* Form Input Selectors */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Section</label>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
                  >
                    <option value="5CSE01">5CSE01 (Class Advisor: Vikram N R)</option>
                    <option value="5CSE02">5CSE02 (Class Advisor: Kavya M)</option>
                    <option value="5CSE03">5CSE03 (Class Advisor: A Ranjini)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Course / Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
                  >
                    <option value="CCT">Cloud Computing Technology (CCT)</option>
                    <option value="BDT">Big Data Tools and Techniques (BDT)</option>
                    <option value="ML">Machine Learning (ML)</option>
                    <option value="FLAT">Formal Languages & Automata (FLAT)</option>
                    <option value="DM">Digital Marketing (DM)</option>
                    <option value="FOD">Foundations of DevOps (FOD)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-medium text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Timetable Period</label>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
                  >
                    <option value={1}>Period 1 (9:00 - 10:00)</option>
                    <option value={2}>Period 2 (10:00 - 11:00)</option>
                    <option value={3}>Period 3 (11:15 - 12:15)</option>
                    <option value={4}>Period 4 (12:15 - 1:15)</option>
                    <option value={5}>Period 5 (2:15 - 3:10)</option>
                    <option value={6}>Period 6 (3:10 - 4:05)</option>
                    <option value={7}>Period 7 (4:05 - 5:00)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Classroom</label>
                  <select
                    value={selectedClassroom}
                    onChange={(e) => setSelectedClassroom(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800"
                  >
                    <option value="A202">Room A202 (Lecture Hall)</option>
                    <option value="A203">Room A203 (Lecture Hall)</option>
                    <option value="A405">Lab A405 (Cloud Lab)</option>
                    <option value="A625">Lab A625 (Big Data Lab)</option>
                    <option value="A222">Lab A222 (ML Lab)</option>
                  </select>
                </div>
              </div>

              {/* Action Toolbar & Summary KPI */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => markAll('P')}
                    className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Mark All Present</span>
                  </button>
                  <button
                    onClick={() => markAll('A')}
                    className="px-3 py-1.5 text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-300 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5 text-rose-700" />
                    <span>Mark All Absent</span>
                  </button>

                  <button
                    onClick={() => setShowFull60Columns(!showFull60Columns)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 ml-2"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                    <span>{showFull60Columns ? 'Hide 60 Columns Grid' : 'Show 60 Columns Grid'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-3 bg-slate-100 px-3 py-1.5 rounded-lg font-mono">
                    <span>Total: <strong>{liveStats.total}</strong></span>
                    <span className="text-emerald-700">Present: <strong>{liveStats.present}</strong></span>
                    <span className="text-rose-700">Absent: <strong>{liveStats.absent}</strong></span>
                    <span className="font-bold text-indigo-900">{liveStats.pct}%</span>
                  </div>

                  <button
                    onClick={handleSubmitAttendance}
                    className="px-5 py-2 text-xs font-bold text-white bg-indigo-900 hover:bg-indigo-800 rounded-xl transition-all shadow-md flex items-center gap-2"
                  >
                    <FileCheck2 className="w-4 h-4 text-amber-300" />
                    <span>Submit & Notify Students</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Attendance Marking Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-bold text-slate-900">
                    Attendance Sheet: Section {selectedSection} ({studentsList.length} Students)
                  </h3>
                  <span className="text-xs text-slate-500">
                    Column {nextSessionIndex} being recorded
                  </span>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by student name or SRN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="sticky top-0 z-20 bg-slate-100 border-b border-slate-200 shadow-2xs">
                    <tr>
                      <th className="p-2.5 font-bold text-slate-700 w-10 text-center sticky left-0 bg-slate-100 z-30">#</th>
                      <th className="p-2.5 font-bold text-slate-700 w-32 sticky left-10 bg-slate-100 z-30">SRN</th>
                      <th className="p-2.5 font-bold text-slate-700 min-w-[200px] sticky left-42 bg-slate-100 z-30">Student Name</th>
                      
                      {/* Mark Status Toggle Column */}
                      <th className="p-2.5 font-bold text-center bg-indigo-100/70 text-indigo-950 min-w-[140px]">
                        Mark Status (Col {nextSessionIndex})
                      </th>

                      {/* Previous Count & New Total */}
                      <th className="p-2.5 font-bold text-center text-slate-700 w-20">Prev Count</th>
                      <th className="p-2.5 font-bold text-center text-emerald-800 w-24">New Total</th>
                      <th className="p-2.5 font-bold text-center text-slate-700 w-20">% Rate</th>

                      {/* The 60 Columns (1, 2, 3, ... 60) as requested */}
                      {showFull60Columns && (
                        Array.from({ length: 60 }, (_, i) => i + 1).map((colNum) => (
                          <th
                            key={colNum}
                            className={`p-1.5 font-mono text-center text-[10px] min-w-[34px] border-l border-slate-200 ${
                              colNum === nextSessionIndex
                                ? 'bg-amber-100 text-amber-900 font-extrabold'
                                : colNum < nextSessionIndex
                                ? 'bg-slate-50 text-slate-600'
                                : 'text-slate-300 font-normal'
                            }`}
                          >
                            {colNum}
                          </th>
                        ))
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {studentsList.map((st, idx) => {
                      const isPresent = currentAttendance[st.srn] === 'P';
                      // Find student's matrix row for cumulative history
                      const studentMatrix = matrixData.rows.find(r => r.student.srn === st.srn);
                      const prevCount = studentMatrix ? studentMatrix.totalPresent : 12;
                      const newTotal = prevCount + (isPresent ? 1 : 0);
                      const newHeld = (studentMatrix ? studentMatrix.totalConducted : 14) + 1;
                      const newPct = Math.round((newTotal / newHeld) * 1000) / 10;

                      return (
                        <tr
                          key={st.srn}
                          className={`hover:bg-slate-50 transition-colors ${
                            !isPresent ? 'bg-rose-50/30' : ''
                          }`}
                        >
                          <td className="p-2.5 text-center font-mono text-slate-400 sticky left-0 bg-white z-10">{idx + 1}</td>
                          <td className="p-2.5 font-mono font-bold text-slate-800 sticky left-10 bg-white z-10">{st.srn}</td>
                          <td className="p-2.5 font-semibold text-slate-900 sticky left-42 bg-white z-10">{st.name}</td>

                          {/* Present / Absent Action Buttons */}
                          <td className="p-2 text-center bg-indigo-50/40">
                            <div className="inline-flex items-center gap-1 p-0.5 bg-slate-200 rounded-lg">
                              <button
                                onClick={() => setCurrentAttendance(prev => ({ ...prev, [st.srn]: 'P' }))}
                                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                                  isPresent
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                P (+1)
                              </button>
                              <button
                                onClick={() => setCurrentAttendance(prev => ({ ...prev, [st.srn]: 'A' }))}
                                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                                  !isPresent
                                    ? 'bg-rose-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                A (+0)
                              </button>
                            </div>
                          </td>

                          <td className="p-2.5 text-center font-mono text-slate-600">{prevCount}</td>
                          <td className="p-2.5 text-center font-mono font-bold text-emerald-700">{newTotal}</td>
                          <td className={`p-2.5 text-center font-mono font-bold ${
                            newPct >= 75 ? 'text-slate-800' : 'text-rose-700'
                          }`}>
                            {newPct}%
                          </td>

                          {/* The 60 Columns cells */}
                          {showFull60Columns && (
                            Array.from({ length: 60 }, (_, i) => i + 1).map((colNum) => {
                              let cellVal: string | number = '-';
                              if (colNum === nextSessionIndex) {
                                cellVal = isPresent ? prevCount + 1 : prevCount;
                              } else if (studentMatrix && colNum <= studentMatrix.counts.length) {
                                cellVal = studentMatrix.counts[colNum - 1];
                              }

                              return (
                                <td
                                  key={colNum}
                                  className={`p-1 text-center font-mono text-[10px] border-l border-slate-100 ${
                                    colNum === nextSessionIndex
                                      ? isPresent
                                        ? 'bg-emerald-100 text-emerald-900 font-bold'
                                        : 'bg-rose-100 text-rose-900 font-bold'
                                      : colNum < nextSessionIndex
                                      ? 'text-slate-700'
                                      : 'text-slate-300'
                                  }`}
                                >
                                  {cellVal}
                                </td>
                              );
                            })
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-slate-500">
                  Showing all {studentsList.length} students in Section {selectedSection}.
                </span>
                <button
                  onClick={handleSubmitAttendance}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-900 hover:bg-indigo-800 rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <FileCheck2 className="w-4 h-4 text-amber-300" />
                  <span>Submit Attendance & Notify Students</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TEACHER'S INDIVIDUAL WEEKLY TIMETABLE */}
        {activeTab === 'my_timetable' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  INDIVIDUAL FACULTY TEACHING ROSTER
                </span>
                <h2 className="text-2xl font-bold text-slate-900 font-serif mt-0.5">
                  Prof. {facultyProfile.name} — Weekly Schedule
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Exclusively displays your assigned lectures and laboratories across the entire instructional week.
                </p>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-900 font-mono">
                {teacherWeeklySchedule.length} Teaching Hours / Week
              </div>
            </div>

            {/* Teaching Schedule Cards */}
            <div className="space-y-3">
              {teacherWeeklySchedule.map((slot, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-400 shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-900 text-white font-bold flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] text-amber-300 uppercase">{slot.day}</span>
                      <span className="text-xs">P{slot.period}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-slate-500 font-semibold">{slot.time}</span>
                        <span>·</span>
                        <span className="font-bold text-indigo-700">Section {slot.section}</span>
                        {slot.batch && (
                          <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 text-[10px] font-mono">
                            Batch {slot.batch}
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-slate-900 mt-0.5">{slot.subject}</h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:justify-end">
                    <span className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 font-mono text-xs font-bold text-[#0c1b4f]">
                      Room {slot.room}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedSection(slot.section);
                        setSelectedPeriod(slot.period);
                        setSelectedClassroom(slot.room);
                        setActiveTab('mark_attendance');
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-lg transition-colors"
                    >
                      Mark Class →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MASTER 60-COLUMN REGISTER TAB */}
        {activeTab === 'master_register' && (
          <div className="space-y-6 max-w-7xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  DIGITAL CUMULATIVE ATTENDANCE REGISTER
                </span>
                <h2 className="text-2xl font-bold text-slate-900 font-serif mt-0.5">
                  Section {selectedSection} — 60 Sessions Master Matrix
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Full historical view of cumulative attendance counts across all 60 instructional periods.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-xs text-slate-800"
                >
                  <option value="CCT">Cloud Computing Technology (CCT)</option>
                  <option value="BDT">Big Data Tools and Techniques (BDT)</option>
                  <option value="ML">Machine Learning (ML)</option>
                  <option value="FLAT">Formal Languages & Automata (FLAT)</option>
                  <option value="DM">Digital Marketing (DM)</option>
                  <option value="FOD">Foundations of DevOps (FOD)</option>
                </select>
              </div>
            </div>

            {/* Cumulative Register Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="sticky top-0 bg-slate-100 z-20 border-b border-slate-200">
                    <tr>
                      <th className="p-2.5 font-bold text-slate-700 w-10 text-center sticky left-0 bg-slate-100 z-30">#</th>
                      <th className="p-2.5 font-bold text-slate-700 w-32 sticky left-10 bg-slate-100 z-30">SRN</th>
                      <th className="p-2.5 font-bold text-slate-700 min-w-[180px] sticky left-42 bg-slate-100 z-30">Student Name</th>
                      <th className="p-2.5 font-bold text-center text-slate-700 w-20">Total P</th>
                      <th className="p-2.5 font-bold text-center text-slate-700 w-20">Rate</th>
                      {Array.from({ length: 60 }, (_, i) => i + 1).map((col) => (
                        <th key={col} className="p-1 font-mono text-center text-[10px] min-w-[32px] border-l border-slate-200">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {matrixData.rows.map((row, idx) => (
                      <tr key={row.student.srn} className="hover:bg-slate-50">
                        <td className="p-2 text-center font-mono text-slate-400 sticky left-0 bg-white z-10">{idx + 1}</td>
                        <td className="p-2 font-mono font-bold text-slate-800 sticky left-10 bg-white z-10">{row.student.srn}</td>
                        <td className="p-2 font-semibold text-slate-900 sticky left-42 bg-white z-10">{row.student.name}</td>
                        <td className="p-2 text-center font-mono font-bold text-emerald-700">{row.totalPresent}</td>
                        <td className={`p-2 text-center font-mono font-bold ${
                          row.percentage >= 75 ? 'text-slate-800' : 'text-rose-700'
                        }`}>
                          {row.percentage}%
                        </td>
                        {row.counts.map((count, cIdx) => (
                          <td key={cIdx} className="p-1 text-center font-mono text-[10px] border-l border-slate-100 text-slate-700">
                            {count}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5 CSE STUDENTS DIRECTORY */}
        {activeTab === 'students' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700">
                  OFFICIAL 5 CSE STUDENT ROSTER
                </span>
                <h2 className="text-2xl font-bold text-slate-900 font-serif mt-0.5">
                  Section 5CSE01 Students Directory (58 Students)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Database verified against university registration with contact & elective choices.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {studentsList.map((st) => (
                <div key={st.srn} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {st.srn}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Batch {st.batch}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{st.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{st.email}</p>
                  <p className="text-xs text-slate-500">{st.phone}</p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                    <span>PE-2: <strong className="text-slate-900">{st.pe2Elective}</strong></span>
                    <span>PE-3: <strong className="text-slate-900">{st.pe3Elective}</strong></span>
                    <span>Year: <strong className="text-slate-900">{st.enrollmentYear}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Submission Receipt Modal */}
      {submittedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Attendance Successfully Committed
            </span>

            <h3 className="text-xl font-bold text-slate-900 font-serif mt-3">
              Attendance Saved to Database
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Class session #{submittedReceipt.period} on {submittedReceipt.date} for {submittedReceipt.subjectName} ({submittedReceipt.section}).
            </p>

            <div className="my-5 p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Present</span>
                <p className="text-lg font-bold text-emerald-600 font-mono">{submittedReceipt.presentCount}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Absent</span>
                <p className="text-lg font-bold text-rose-600 font-mono">{submittedReceipt.absentCount}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Students</span>
                <p className="text-lg font-bold text-slate-900 font-mono">{submittedReceipt.totalCount}</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 mb-6 bg-blue-50/70 p-3 rounded-lg border border-blue-200">
              Push notifications have been dispatched to all {submittedReceipt.totalCount} student portals with their attendance status and running count!
            </div>

            <button
              onClick={() => setSubmittedReceipt(null)}
              className="w-full py-2.5 text-xs font-bold text-white bg-indigo-900 hover:bg-indigo-800 rounded-xl transition-colors"
            >
              Done & Return to Console
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
