import React, { useState } from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  Bell,
  Sparkles,
  Building2,
  LogOut,
  FileDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BookOpen,
  MapPin,
  ChevronRight,
  Coffee,
  UtensilsCrossed,
  Filter,
  Users
} from 'lucide-react';
import { Student } from '../data/studentsData';
import { SECTION_5CSE01_TIMETABLE } from '../data/timetableData';
import { CALENDAR_EVENTS } from '../data/calendarData';
import { CAMPUS_SPACES, CampusSpace } from '../data/campusData';
import {
  getStudentAttendanceSummary,
  getStudentNotifications,
  markNotificationAsRead
} from '../services/storageService';
import { generateAttendancePDF } from '../services/pdfService';

interface StudentDashboardProps {
  student: Student;
  onLogout: () => void;
  onOpenSapthaAI: () => void;
  onSelectCampusSpace: (space: CampusSpace) => void;
  initialTab?: string;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  onLogout,
  onOpenSapthaAI,
  onSelectCampusSpace,
  initialTab = 'overview'
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<'MON' | 'TUE' | 'WED' | 'THUR' | 'FRI'>('MON');

  const summary = getStudentAttendanceSummary(student.srn, student.section);
  const notifications = getStudentNotifications(student.srn);

  const totalHeld = summary.reduce((acc, s) => acc + s.totalConducted, 0);
  const totalAttended = summary.reduce((acc, s) => acc + s.attended, 0);
  const aggregatePct = totalHeld > 0 ? Math.round((totalAttended / totalHeld) * 1000) / 10 : 0;
  const isShortage = aggregatePct < 75;

  const currentScheduleDay = SECTION_5CSE01_TIMETABLE.schedule.find(s => s.day === selectedDay) || SECTION_5CSE01_TIMETABLE.schedule[0];

  const handleDownloadPDF = () => {
    generateAttendancePDF(student, summary);
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="min-w-0 flex-1 flex flex-col md:flex-row bg-slate-50 min-h-[calc(100vh-120px)]">
      {/* Left Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-4 flex flex-col justify-between shrink-0 shadow-xs">
        <div>
          {/* Student Profile Card in Sidebar */}
          <div className="p-3.5 bg-gradient-to-br from-[#0c1b4f] to-[#1e3a8a] text-white rounded-xl shadow-xs mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center font-bold text-amber-300 text-sm">
                {student.name.slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-amber-300/80 font-medium">Student Portal</p>
                <h4 className="text-sm font-bold truncate text-white">{student.name}</h4>
                <p className="text-[11px] font-mono text-slate-300 truncate">{student.srn}</p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
              <span>Section: <strong className="text-white">{student.section}</strong></span>
              <span>Sem: <strong className="text-white">5th</strong></span>
              <span>Batch: <strong className="text-white">{student.batch}</strong></span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
              Menu
            </div>
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'bg-blue-50 text-[#0c1b4f] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-blue-700" />
                Overview
              </span>
              {activeTab === 'overview' && <ChevronRight className="w-3.5 h-3.5 text-blue-700" />}
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'attendance'
                  ? 'bg-blue-50 text-[#0c1b4f] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <CalendarCheck className="w-4 h-4 text-emerald-600" />
                Attendance
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                isShortage ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {aggregatePct}%
              </span>
            </button>

            <button
              onClick={() => setActiveTab('timetable')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'timetable'
                  ? 'bg-blue-50 text-[#0c1b4f] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <CalendarDays className="w-4 h-4 text-indigo-600" />
                Timetable
              </span>
              <span className="text-[10px] text-slate-400 font-mono">5CSE01</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'notifications'
                  ? 'bg-blue-50 text-[#0c1b4f] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-amber-600" />
                Notifications
              </span>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

            <button
              onClick={onOpenSapthaAI}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-amber-900 bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 fill-amber-300" />
                Saptha AI ✦
              </span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-200/60 px-1.5 py-0.5 rounded">
                Voice/Text
              </span>
            </button>

            <button
              onClick={() => setActiveTab('campus')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'campus'
                  ? 'bg-blue-50 text-[#0c1b4f] font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-cyan-600" />
                Campus Facilities
              </span>
              <span className="text-[10px] text-slate-400">Tour</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="pt-4 border-t border-slate-200 mt-6">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out / Switch Role
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Hero Welcome Banner */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span>Sapthagiri NPS University</span>
                  <span>·</span>
                  <span>Odd Semester 2026-27</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c1b4f] font-serif">
                  {greeting()}, {student.name.split(' ')[0]}!
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  CSE Department · Semester 5 · Section {student.section} · Advisor: Prof. Vikram N R
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleDownloadPDF}
                  className="px-4 py-2.5 text-xs font-bold text-white bg-[#0c1b4f] hover:bg-blue-900 rounded-xl transition-all shadow-xs flex items-center gap-2"
                >
                  <FileDown className="w-4 h-4 text-amber-300" />
                  <span>Download Attendance PDF</span>
                </button>
                <button
                  onClick={onOpenSapthaAI}
                  className="px-4 py-2.5 text-xs font-bold text-amber-950 bg-amber-100/90 hover:bg-amber-200 border border-amber-300 rounded-xl transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>Ask Saptha AI</span>
                </button>
              </div>
            </div>

            {/* Attendance Alert if Shortage */}
            {isShortage && (
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-800">
                  <h4 className="font-bold text-rose-900 text-sm">Attendance Shortage Warning ({aggregatePct}%)</h4>
                  <p className="mt-0.5">
                    Your cumulative attendance is currently below the mandatory 75% university eligibility requirement.
                    Please attend the next upcoming lectures to regain eligibility before the First Internal Assessment (IA-1).
                  </p>
                </div>
              </div>
            )}

            {/* Metric KPI Cards Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Overall Attendance</span>
                  <CalendarCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-extrabold text-[#0c1b4f] font-mono tabular-nums">
                  {aggregatePct}%
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {totalAttended} attended of {totalHeld} total held
                </p>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      aggregatePct >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, aggregatePct)}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Enrolled Courses</span>
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                  {summary.length}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Core Theory + Labs + Electives
                </p>
                <div className="text-[11px] font-semibold text-blue-700 mt-3">
                  PE-2: {student.pe2Elective} · PE-3: {student.pe3Elective}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Working Days Progress</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                  28 / 90
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Odd Semester AY 2026-27 (CoE)
                </p>
                <div className="text-[11px] font-semibold text-amber-700 mt-3">
                  Next: IA-1 (22 Oct - 29 Oct)
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Class Advisor</span>
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-lg font-bold text-slate-900 truncate">
                  Prof. Vikram N R
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Assistant Professor (CSE Block)
                </p>
                <div className="text-[11px] font-semibold text-purple-700 mt-3">
                  Faculty Cabin 304
                </div>
              </div>
            </div>

            {/* Two-Column Split: Today's Timetable + Recent Attendance Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Today's Timetable Widget */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Today's Timetable ({currentScheduleDay.fullDay})
                    </h3>
                    <p className="text-xs text-slate-500">Section {student.section} · Room A202 / A203</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('timetable')}
                    className="text-xs font-semibold text-blue-700 hover:underline"
                  >
                    Full Schedule →
                  </button>
                </div>

                <div className="space-y-2.5">
                  {currentScheduleDay.slots.slice(0, 6).map((slot, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                        slot.isBreak
                          ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-500 font-semibold w-24">
                          {slot.time}
                        </span>
                        {slot.isBreak ? (
                          <div className="flex items-center gap-2 font-bold text-amber-800">
                            {slot.breakName === 'Tea Break' ? (
                              <Coffee className="w-4 h-4 text-amber-600" />
                            ) : (
                              <UtensilsCrossed className="w-4 h-4 text-amber-600" />
                            )}
                            <span>{slot.breakName}</span>
                          </div>
                        ) : (
                          <div>
                            <p className="font-bold text-slate-900">
                              {slot.subjectName || slot.shortCode}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {slot.faculty} {slot.faculty2 ? `· ${slot.faculty2}` : ''}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-mono text-[11px] font-semibold text-slate-700">
                          {slot.room}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subject Attendance Highlights */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Subject Attendance Overview
                    </h3>
                    <p className="text-xs text-slate-500">Live attendance count from faculty register</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="text-xs font-semibold text-blue-700 hover:underline"
                  >
                    Detailed View →
                  </button>
                </div>

                <div className="space-y-3">
                  {summary.map((sub) => (
                    <div key={sub.subjectCode} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div>
                          <span className="font-bold text-slate-900">{sub.subjectName}</span>
                          <span className="text-[11px] text-slate-500 ml-2">({sub.faculty})</span>
                        </div>
                        <span className={`font-mono font-bold text-xs ${
                          sub.percentage >= 75 ? 'text-emerald-700' : 'text-rose-700'
                        }`}>
                          {sub.percentage}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                        <span>Attended: <strong>{sub.attended}</strong> / {sub.totalConducted} classes</span>
                        <span className={sub.percentage >= 75 ? 'text-emerald-600' : 'text-rose-600 font-semibold'}>
                          {sub.percentage >= 75 ? 'Eligible' : 'Shortage'}
                        </span>
                      </div>

                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            sub.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(100, sub.percentage)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ATTENDANCE TAB */}
        {activeTab === 'attendance' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <h2 className="text-2xl font-bold text-[#0c1b4f] font-serif">
                  Subject-Wise Attendance Record
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Individual attendance tracked across 60 class periods as per university norms.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDownloadPDF}
                  className="px-4 py-2.5 text-xs font-bold text-white bg-[#0c1b4f] hover:bg-blue-900 rounded-xl transition-all shadow-xs flex items-center gap-2"
                >
                  <FileDown className="w-4 h-4 text-amber-300" />
                  <span>Download Official PDF Transcript</span>
                </button>
              </div>
            </div>

            {/* Subject Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {summary.map((sub) => (
                <div
                  key={sub.subjectCode}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                        {sub.subjectCode}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        sub.percentage >= 75
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {sub.percentage}%
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{sub.subjectName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Faculty: {sub.faculty}</p>

                    <div className="grid grid-cols-3 gap-2 text-center my-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Held</span>
                        <p className="font-bold text-slate-800 font-mono text-sm">{sub.totalConducted}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Present</span>
                        <p className="font-bold text-emerald-600 font-mono text-sm">{sub.attended}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold">Absent</span>
                        <p className="font-bold text-rose-600 font-mono text-sm">{sub.totalConducted - sub.attended}</p>
                      </div>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full ${
                          sub.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${Math.min(100, sub.percentage)}%` }}
                      ></div>
                    </div>

                    {sub.classesNeededFor75 > 0 ? (
                      <p className="text-[11px] text-rose-600 font-medium">
                        ⚠️ Need next {sub.classesNeededFor75} classes continuously to attain 75%
                      </p>
                    ) : (
                      <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Exam Eligible
                      </p>
                    )}
                  </div>

                  {/* 60 Columns Micro Strip Indicator */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                      <span>Cumulative Class Log (1 – 60 slots)</span>
                      <span>{sub.attended} Present</span>
                    </div>
                    <div className="flex flex-wrap gap-0.5 max-h-12 overflow-y-auto p-1 bg-slate-50 rounded border border-slate-200">
                      {sub.runningCounts.slice(0, sub.totalConducted).map((cnt, idx) => (
                        <span
                          key={idx}
                          title={`Class ${idx + 1}: Total Present = ${cnt}`}
                          className="w-4 h-4 text-[9px] font-mono flex items-center justify-center rounded bg-emerald-100 text-emerald-800"
                        >
                          {cnt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Full Attendance Summary Table */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900">
                  Semester Cumulative Attendance Matrix
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  SRN: {student.srn} · Section: {student.section}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                      <th className="p-3 font-bold">Course Code</th>
                      <th className="p-3 font-bold">Course Name</th>
                      <th className="p-3 font-bold">Faculty Allotted</th>
                      <th className="p-3 font-bold text-center">Conducted</th>
                      <th className="p-3 font-bold text-center">Attended (+1)</th>
                      <th className="p-3 font-bold text-center">Absent (+0)</th>
                      <th className="p-3 font-bold text-center">% Rate</th>
                      <th className="p-3 font-bold text-center">Eligibility</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {summary.map((sub) => (
                      <tr key={sub.subjectCode} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-bold font-mono text-slate-900">{sub.subjectCode}</td>
                        <td className="p-3 font-semibold text-slate-800">{sub.subjectName}</td>
                        <td className="p-3 text-slate-600">{sub.faculty}</td>
                        <td className="p-3 text-center font-mono">{sub.totalConducted}</td>
                        <td className="p-3 text-center font-mono font-bold text-emerald-700">{sub.attended}</td>
                        <td className="p-3 text-center font-mono text-rose-700">{sub.totalConducted - sub.attended}</td>
                        <td className="p-3 text-center font-mono font-bold text-slate-900">{sub.percentage}%</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            sub.percentage >= 75
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {sub.percentage >= 75 ? 'ELIGIBLE' : 'SHORTAGE'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TIMETABLE TAB */}
        {activeTab === 'timetable' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Timetable Header */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  OFFICIAL ACADEMIC TIME TABLE w.e.f AY 2026-2027
                </span>
                <h2 className="text-2xl font-bold text-[#0c1b4f] font-serif mt-0.5">
                  Section 5CSE01 — Weekly Master Schedule
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Class Advisor: Prof. Vikram N R · School of Engineering and Technology
                </p>
              </div>

              {/* Day Selector */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {(['MON', 'TUE', 'WED', 'THUR', 'FRI'] as const).map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      selectedDay === day
                        ? 'bg-white text-[#0c1b4f] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Timetable Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">
                  {currentScheduleDay.fullDay} Period Allocations
                </h3>
                <span className="text-xs text-slate-500">
                  Includes Tea Break (11:00 AM) & Lunch Break (1:15 PM)
                </span>
              </div>

              <div className="space-y-3">
                {currentScheduleDay.slots.map((slot, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-all ${
                      slot.isBreak
                        ? 'bg-amber-50/80 border-amber-300 text-amber-950 flex items-center justify-between'
                        : 'bg-white border-slate-200 hover:border-blue-400 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3'
                    }`}
                  >
                    {slot.isBreak ? (
                      <div className="flex items-center gap-3 w-full justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
                            {slot.time}
                          </span>
                          <span className="text-sm font-bold flex items-center gap-2">
                            {slot.breakName === 'Tea Break' ? (
                              <Coffee className="w-4 h-4 text-amber-700" />
                            ) : (
                              <UtensilsCrossed className="w-4 h-4 text-amber-700" />
                            )}
                            {slot.breakName}
                          </span>
                        </div>
                        <span className="text-xs text-amber-800/80">{slot.room}</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 font-bold text-xs flex items-center justify-center shrink-0">
                            P{slot.period}
                          </div>
                          <div>
                            <span className="font-mono text-xs text-slate-500 font-semibold block sm:inline sm:mr-3">
                              {slot.time}
                            </span>
                            <span className="font-bold text-slate-900 text-sm">
                              {slot.subjectName}
                            </span>
                            {slot.batch && slot.batch !== 'All' && (
                              <span className="ml-2 px-1.5 py-0.2 bg-purple-100 text-purple-800 font-mono text-[10px] rounded">
                                Batch {slot.batch}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:justify-end">
                          <div className="text-left sm:text-right">
                            <p className="text-xs font-semibold text-slate-700">{slot.faculty}</p>
                            {slot.faculty2 && (
                              <p className="text-[11px] text-slate-500">Co-Faculty / DC: {slot.faculty2}</p>
                            )}
                          </div>
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-mono text-xs font-bold text-[#0c1b4f]">
                            {slot.room}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#0c1b4f] font-serif">
                  Attendance & Academic Alerts
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Automatic push notifications triggered upon faculty attendance submission.
                </p>
              </div>
              <span className="text-xs font-mono bg-blue-50 text-blue-800 font-bold px-3 py-1 rounded-lg border border-blue-200">
                {notifications.length} Total Alerts
              </span>
            </div>

            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationAsRead(notif.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    notif.read ? 'bg-white border-slate-200' : 'bg-blue-50/60 border-blue-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        notif.type === 'attendance_present'
                          ? 'bg-emerald-100 text-emerald-700'
                          : notif.type === 'attendance_absent'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {notif.type === 'attendance_present' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : notif.type === 'attendance_absent' ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : (
                          <Bell className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
                        <p className="text-[10px] text-slate-400 mt-2 font-mono">
                          {new Date(notif.timestamp).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CAMPUS FACILITIES TAB */}
        {activeTab === 'campus' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#0c1b4f] font-serif">
                  Interactive Campus Landmark Guide
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Click any campus facility to view 3D details, lecture capacity, and navigation.
                </p>
              </div>
              <a
                href="https://snpsu.edu.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1"
              >
                Official snpsu.edu.in portal →
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CAMPUS_SPACES.map((space) => (
                <div
                  key={space.id}
                  onClick={() => onSelectCampusSpace(space)}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-900">
                    <img
                      src={space.image}
                      alt={space.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-black/60 text-amber-300 backdrop-blur-md rounded">
                        {space.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                        {space.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {space.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        {space.capacity}
                      </span>
                      <span className="font-semibold text-blue-700 group-hover:underline">
                        Explore →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
