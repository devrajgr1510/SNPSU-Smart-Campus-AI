import { STUDENTS_DATA } from '../data/studentsData';
import { SECTION_5CSE01_TIMETABLE } from '../data/timetableData';
import { CALENDAR_EVENTS } from '../data/calendarData';
import { CAMPUS_SPACES } from '../data/campusData';
import { getStudentAttendanceSummary } from './storageService';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
}

export function processSapthaQuery(query: string, currentSrn = '24SUUBECS0001'): string {
  const q = query.toLowerCase().trim();

  // 1. Attendance Queries
  if (q.includes('my attendance') || q.includes('attendance percentage') || q.includes('how much attendance')) {
    const student = STUDENTS_DATA.find(s => s.srn === currentSrn) || STUDENTS_DATA[0];
    const summary = getStudentAttendanceSummary(student.srn, student.section);
    const totalConducted = summary.reduce((a, b) => a + b.totalConducted, 0);
    const totalAttended = summary.reduce((a, b) => a + b.attended, 0);
    const overallPct = totalConducted > 0 ? ((totalAttended / totalConducted) * 100).toFixed(1) : '0';

    const lowSubjects = summary.filter(s => s.percentage < 75);
    let lowNotice = '';
    if (lowSubjects.length > 0) {
      lowNotice = ` ⚠️ Warning: You are below 75% in ${lowSubjects.map(s => `${s.subjectName} (${s.percentage}%)`).join(', ')}. You need consecutive attendances to recover.`;
    } else {
      lowNotice = ` 🌟 Great job! You are above the mandatory 75% threshold across all subjects!`;
    }

    return `Hello ${student.name}! Your overall attendance for 5th Semester (${student.section}) is ${overallPct}% (${totalAttended}/${totalConducted} classes attended).${lowNotice} You can download your official PDF transcript directly from the Attendance tab.`;
  }

  // 2. Attendance rules / 75% requirement
  if (q.includes('rule') || q.includes('75') || q.includes('condonation') || q.includes('minimum attendance')) {
    return `As per Sapthagiri NPS University (SNPSU) academic ordinances, students must maintain a minimum of 75% attendance in theory courses and 85% in laboratory practicals to be eligible for Semester End Examinations (SEE). Condonation is permitted only up to 10% on certified medical or sports representation grounds upon approval from the Dean - School of Engineering and Technology (SoET).`;
  }

  // 3. Tea Break / Lunch Break
  if (q.includes('tea break') || q.includes('coffee break') || q.includes('morning break')) {
    return `Tea Break is scheduled every instructional day from 11:00 AM to 11:15 AM (15 minutes interval between Period 2 and Period 3). The central university cafeteria and courtyard coffee nodes are open during this time.`;
  }
  if (q.includes('lunch break') || q.includes('lunch time') || q.includes('food court')) {
    return `Lunch Break is scheduled daily from 1:15 PM to 2:15 PM (1 full hour between Period 4 and Period 5). The University Food Court and Student Dining Pavilion offer North & South Indian meals.`;
  }

  // 4. Timetable & Subject Questions
  if (q.includes('cloud computing') || q.includes('cct') || q.includes('cctl')) {
    return `Cloud Computing Technology (24BECSE501) is instructed by Prof. Vikram N R (Class Advisor 5CSE01). Theory sessions take place in Room A202 / A203, and Lab sessions (CCTL) are conducted in Lab A405 & A525.`;
  }
  if (q.includes('machine learning') || q.includes('ml') || q.includes('mll')) {
    return `Machine Learning (24BECSE503) is taught by Prof. A Ranjini (with Divya Visakh / Ganesh G). Theory is in Room A203, and Machine Learning Lab (MLL) takes place in Advanced Computing Center A222 (Thursdays 11:15 AM - 1:15 PM).`;
  }
  if (q.includes('big data') || q.includes('bdt') || q.includes('bdtl')) {
    return `Big Data Tools & Techniques (24BECSE502) is taught by Prof. Kavya M (Class Advisor 5CSE02) and Dr. Prasath Srinivasan. Classes run in Room A202 & A209; BDTL Lab runs in A625 / A505.`;
  }
  if (q.includes('flat') || q.includes('automata')) {
    return `Formal Languages & Automata Theory (24BECSE504) is instructed by Prof. Monisha R in Lecture Hall A202 / A203.`;
  }
  if (q.includes('devops') || q.includes('fod')) {
    return `Foundations of DevOps (25BECSE533 - PE III) is taught by Prof. Dhanush K in Room A202 / A203.`;
  }
  if (q.includes('digital marketing') || q.includes('dm')) {
    return `Digital Marketing (24BECSE505) is taught by Prof. Vani BA in Room A202 / A203.`;
  }
  if (q.includes('ethics') || q.includes('pehv')) {
    return `Professional Ethics & Human Values (24BECSE506) is instructed by Prof. Vani BA in Room A203.`;
  }

  // 5. Calendar of Events / IA / Exams / Holidays
  if (q.includes('ia-1') || q.includes('first internal') || q.includes('internal assessment 1') || q.includes('exam date')) {
    return `The First Internal Assessment Test (IA-1) is scheduled from 22nd October 2026 to 29th October 2026. Hall tickets and seating allotments will be published 3 days prior.`;
  }
  if (q.includes('ia-2') || q.includes('second internal')) {
    return `The Second Internal Assessment Test (IA-2) will be conducted from 7th December 2026 to 14th December 2026. Practical Laboratory IAs and faculty feedback take place between 28 Dec 2026 and 1 Jan 2027.`;
  }
  if (q.includes('last working day') || q.includes('semester end') || q.includes('see')) {
    return `The Last Working Day for the 3rd and 5th Semester B.E. (ODD Sem AY 2026-27) is 5th January 2027 (completing 90 working days). Theory Semester End Exams (SEE) begin on 18th January 2027.`;
  }
  if (q.includes('even semester') || q.includes('next semester') || q.includes('commencement')) {
    return `Commencement of EVEN Semester Classes (4th and 6th semester B.E.) is scheduled on 22nd February 2027, preceded by the University Academic Audit from 8–10 February 2027.`;
  }
  if (q.includes('holiday') || q.includes('holidays') || q.includes('gandhi') || q.includes('sankranthi')) {
    return `Key upcoming holidays in the AY 2026-27 Calendar: Mahanavami (20 Oct), Vijayadashami (21 Oct), Balipadyami (10 Nov), Christmas (25 Dec), Makara Sankranthi (14 Jan 2027), and Republic Day (26 Jan 2027).`;
  }
  if (q.includes('ptm') || q.includes('parents') || q.includes('parent teacher')) {
    return `The Parent-Teacher Meeting (PTM) for the 3rd & 5th semester is scheduled on 14th November 2026. Proctors will review student attendance and IA-1 performance with guardians.`;
  }

  // 6. Campus & Facilities
  if (q.includes('library') || q.includes('book') || q.includes('reading room')) {
    return `The Sapthagiri Central Library is located on Floors 2 & 3 of the Central Academic Block. It houses 85,000+ volumes, 120 digital IEEE/ACM research terminals, and 850 reading seats. Operating hours: 8:00 AM – 9:00 PM (Monday–Saturday).`;
  }
  if (q.includes('seminar hall') || q.includes('auditorium') || q.includes('basement')) {
    return `The Basement Seminar Hall & Imperial Auditorium is located in the Lower Ground Concourse of the Main Building. It features ornate gilded wall architecture, crystal chandeliers, mirror-marble flooring, and accommodates 600 delegates.`;
  }
  if (q.includes('classroom') || q.includes('lecture hall') || q.includes('a202') || q.includes('a203')) {
    return `The 5th Semester CSE lecture halls (A202, A203, A209, A210) are located in Academic Block A, 2nd Floor. They feature stepped amphitheater marble desks, burgundy leather executive swivel seating, and motorized 4K laser projectors.`;
  }
  if (q.includes('website') || q.includes('link') || q.includes('snpsu.edu.in') || q.includes('portal')) {
    return `The official university portal is https://snpsu.edu.in. You can click the 'Visit snpsu.edu.in' link in the top bar anytime to open official announcements, fee payment, and examination notifications.`;
  }
  if (q.includes('where') || q.includes('location') || q.includes('address') || q.includes('map')) {
    return `Sapthagiri NPS University is located at #14/5, Chikkasandra, Hesaraghatta Main Road, Bengaluru - 560 057, Karnataka, India. You can click the Google Maps button in the Campus section for turn-by-turn driving directions!`;
  }

  // 7. Fallback smart helpful answer
  return `I am Saptha AI ✦, your university campus intelligence assistant! I can provide real-time information regarding:
• Your subject-wise attendance & 75% exam eligibility
• Section 5CSE01 timetable, period timings, tea break (11:00 AM) & lunch break (1:15 PM)
• Academic Calendar (IA-1: 22-29 Oct, IA-2: 7-14 Dec, SEE: 18 Jan 2027)
• Faculty allocations (Vikram N R, Kavya M, A Ranjini, Dr. Prasath Srinivasan)
• Campus facilities (Central Library, Basement Seminar Hall, Smart Classrooms, snpsu.edu.in)

What would you like to check?`;
}
