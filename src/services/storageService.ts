import { STUDENTS_DATA, Student } from '../data/studentsData';
import { COURSES_CATALOG } from '../data/timetableData';

export interface AttendanceSession {
  sessionId: string;
  section: string;
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  date: string;
  period: number;
  classroom: string;
  sessionIndex: number; // 1 to 60
  records: Record<string, 'P' | 'A'>; // srn -> 'P' | 'A'
  timestamp: number;
}

export interface StudentNotification {
  id: string;
  srn: string;
  title: string;
  message: string;
  type: 'attendance_present' | 'attendance_absent' | 'academic' | 'alert';
  timestamp: number;
  read: boolean;
  subject?: string;
  date?: string;
}

const STORAGE_KEYS = {
  SESSIONS: 'snpsu_attendance_sessions_v1',
  NOTIFICATIONS: 'snpsu_notifications_v1',
  ACTIVE_USER: 'snpsu_active_user_v1'
};

// Seed initial realistic attendance (16 completed classes per subject)
function generateInitialSessions(): AttendanceSession[] {
  const initialSessions: AttendanceSession[] = [];
  const subjects = [
    { code: 'CCT', name: 'Cloud Computing Technology', faculty: 'Vikram N R', room: 'A202' },
    { code: 'BDT', name: 'Big Data Tools and Techniques', faculty: 'Kavya M', room: 'A202' },
    { code: 'ML', name: 'Machine Learning', faculty: 'A Ranjini', room: 'A203' },
    { code: 'FLAT', name: 'Formal Languages and Automata Theory', faculty: 'Monisha R', room: 'A202' },
    { code: 'DM', name: 'Digital Marketing', faculty: 'Vani BA', room: 'A202' },
    { code: 'FOD', name: 'Foundations of DevOps', faculty: 'Dhanush K', room: 'A202' }
  ];

  const dates = [
    '2026-09-08', '2026-09-10', '2026-09-12', '2026-09-15',
    '2026-09-17', '2026-09-21', '2026-09-24', '2026-09-28',
    '2026-10-01', '2026-10-05', '2026-10-07', '2026-10-08'
  ];

  subjects.forEach(subj => {
    dates.forEach((date, idx) => {
      const records: Record<string, 'P' | 'A'> = {};
      STUDENTS_DATA.forEach((st, sIdx) => {
        // High attendance with deterministic occasional absence
        const isAbsent = (sIdx + idx * 7) % 11 === 0 || (sIdx === 24 && idx > 5);
        records[st.srn] = isAbsent ? 'A' : 'P';
      });

      initialSessions.push({
        sessionId: `sess-${subj.code}-${idx + 1}`,
        section: '5CSE01',
        subjectCode: subj.code,
        subjectName: subj.name,
        facultyName: subj.faculty,
        date: date,
        period: (idx % 6) + 1,
        classroom: subj.room,
        sessionIndex: idx + 1,
        records: records,
        timestamp: new Date(date).getTime()
      });
    });
  });

  return initialSessions;
}

export function getAttendanceSessions(): AttendanceSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) {
      const seeded = generateInitialSessions();
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw);
  } catch {
    return generateInitialSessions();
  }
}

export function saveAttendanceSession(session: AttendanceSession): void {
  const all = getAttendanceSessions();
  const existingIdx = all.findIndex(s => s.sessionId === session.sessionId);
  if (existingIdx >= 0) {
    all[existingIdx] = session;
  } else {
    all.push(session);
  }
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(all));

  // Dispatch student notifications for this submission
  const notifs = getStudentNotifications();
  Object.entries(session.records).forEach(([srn, status]) => {
    const isPresent = status === 'P';
    const newNotif: StudentNotification = {
      id: `notif-${Date.now()}-${srn}`,
      srn: srn,
      title: isPresent ? `Attendance: Marked Present` : `Attendance Alert: Marked Absent`,
      message: isPresent
        ? `You were marked PRESENT for ${session.subjectName} on ${session.date} (Period ${session.period}) in Room ${session.classroom}.`
        : `You were marked ABSENT for ${session.subjectName} on ${session.date} (Period ${session.period}) by Prof. ${session.facultyName}. Please reach out if this is in error.`,
      type: isPresent ? 'attendance_present' : 'attendance_absent',
      timestamp: Date.now(),
      read: false,
      subject: session.subjectName,
      date: session.date
    };
    notifs.unshift(newNotif);
  });
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs.slice(0, 300)));
}

export function getStudentNotifications(srn?: string): StudentNotification[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    let notifs: StudentNotification[] = raw ? JSON.parse(raw) : [];
    if (!raw || notifs.length === 0) {
      // Seed default institutional announcements
      notifs = [
        {
          id: 'init-1',
          srn: '24SUUBECS0001',
          title: 'IA-1 Schedule Announcement',
          message: 'First Internal Assessment Test (IA-1) commences from 22nd October 2026. Hall tickets available at department office.',
          type: 'academic',
          timestamp: Date.now() - 3600000 * 24,
          read: false
        },
        {
          id: 'init-2',
          srn: '24SUUBECS0001',
          title: 'Minimum Attendance Requirement (75%)',
          message: 'As per SNPSU Regulations, a minimum of 75% attendance in theory and 85% in laboratories is mandatory to appear for Semester End Examinations (SEE).',
          type: 'alert',
          timestamp: Date.now() - 3600000 * 48,
          read: true
        }
      ];
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    }
    if (srn) {
      return notifs.filter(n => n.srn === srn || n.srn === 'ALL');
    }
    return notifs;
  } catch {
    return [];
  }
}

export function markNotificationAsRead(id: string): void {
  const notifs = getStudentNotifications();
  const found = notifs.find(n => n.id === id);
  if (found) {
    found.read = true;
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  }
}

// Compute subject wise attendance stats for a specific student
export interface StudentSubjectAttendance {
  subjectCode: string;
  subjectName: string;
  shortCode: string;
  faculty: string;
  attended: number;
  totalConducted: number;
  percentage: number;
  status: 'Safe' | 'Warning' | 'Critical';
  classesNeededFor75: number;
  runningCounts: number[]; // 60 values
}

export function getStudentAttendanceSummary(srn: string, section = '5CSE01'): StudentSubjectAttendance[] {
  const sessions = getAttendanceSessions().filter(s => s.section === section);
  const subjects = [
    { code: 'CCT', name: 'Cloud Computing Technology', short: 'CCT', faculty: 'Vikram N R' },
    { code: 'BDT', name: 'Big Data Tools and Techniques', short: 'BDT', faculty: 'Kavya M' },
    { code: 'ML', name: 'Machine Learning', short: 'ML', faculty: 'A Ranjini' },
    { code: 'FLAT', name: 'Formal Languages and Automata Theory', short: 'FLAT', faculty: 'Monisha R' },
    { code: 'DM', name: 'Digital Marketing', short: 'DM', faculty: 'Vani BA' },
    { code: 'FOD', name: 'Foundations of DevOps', short: 'FOD', faculty: 'Dhanush K' }
  ];

  return subjects.map(subj => {
    const subjSessions = sessions
      .filter(s => s.subjectCode === subj.code || s.subjectName.toLowerCase().includes(subj.name.toLowerCase()))
      .sort((a, b) => a.sessionIndex - b.sessionIndex);

    let attended = 0;
    const runningCounts: number[] = [];

    // Fill up to 60 slots
    for (let i = 1; i <= 60; i++) {
      const sess = subjSessions.find(s => s.sessionIndex === i);
      if (sess) {
        if (sess.records[srn] === 'P') {
          attended += 1;
        }
      }
      runningCounts.push(attended);
    }

    const totalConducted = subjSessions.length || 1;
    const percentage = totalConducted > 0 ? Math.round((attended / totalConducted) * 1000) / 10 : 0;

    let status: 'Safe' | 'Warning' | 'Critical' = 'Safe';
    if (percentage < 75) status = 'Critical';
    else if (percentage < 85) status = 'Warning';

    // Calculate how many consecutive classes are needed to reach 75% if below
    let needed = 0;
    if (percentage < 75) {
      needed = Math.max(0, Math.ceil((0.75 * totalConducted - attended) / 0.25));
    }

    return {
      subjectCode: subj.code,
      subjectName: subj.name,
      shortCode: subj.short,
      faculty: subj.faculty,
      attended,
      totalConducted,
      percentage,
      status,
      classesNeededFor75: needed,
      runningCounts
    };
  });
}

// Compute cumulative attendance across 60 columns for a given subject & section
export interface MatrixRow {
  student: Student;
  counts: number[]; // 60 values (each column i is cumulative count after session i)
  totalPresent: number;
  totalConducted: number;
  percentage: number;
}

export function getAttendanceMatrixForSection(section: string, subjectCode: string): {
  sessions: AttendanceSession[];
  rows: MatrixRow[];
} {
  const allSessions = getAttendanceSessions();
  const filteredSessions = allSessions
    .filter(s => s.section === section && s.subjectCode === subjectCode)
    .sort((a, b) => a.sessionIndex - b.sessionIndex);

  const students = STUDENTS_DATA.filter(st => st.section === section);

  const rows: MatrixRow[] = students.map(st => {
    let cumulative = 0;
    const counts: number[] = [];

    for (let col = 1; col <= 60; col++) {
      const sess = filteredSessions.find(s => s.sessionIndex === col);
      if (sess) {
        if (sess.records[st.srn] === 'P') {
          cumulative += 1;
        }
        counts.push(cumulative);
      } else {
        // If session not yet conducted, keep last cumulative count
        counts.push(cumulative);
      }
    }

    const totalConducted = filteredSessions.length;
    const percentage = totalConducted > 0 ? Math.round((cumulative / totalConducted) * 1000) / 10 : 0;

    return {
      student: st,
      counts,
      totalPresent: cumulative,
      totalConducted,
      percentage
    };
  });

  return { sessions: filteredSessions, rows };
}

// Active user session
export interface ActiveUser {
  role: 'student' | 'teacher';
  srn?: string;
  teacherName?: string;
}

export function getActiveUser(): ActiveUser {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { role: 'student', srn: '24SUUBECS0001' }; // Default to A MOHITH SANTOSH
}

export function setActiveUser(user: ActiveUser): void {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
}
