export interface Course {
  code: string;
  name: string;
  shortCode: string;
  type: 'Theory' | 'Lab' | 'Elective' | 'ValueAdded' | 'Institutional';
  defaultFaculty: string;
  faculty2?: string;
}

export interface TimetableSlot {
  period: number;
  time: string;
  isBreak?: boolean;
  breakName?: string;
  subjectCode?: string;
  subjectName?: string;
  shortCode?: string;
  faculty: string;
  faculty2?: string; // Dual faculty / DC-MC support
  room: string;
  batch?: 'All' | 'B1' | 'B2';
}

export interface DaySchedule {
  day: 'MON' | 'TUE' | 'WED' | 'THUR' | 'FRI';
  fullDay: string;
  slots: TimetableSlot[];
}

export interface SectionTimetable {
  section: string;
  semester: string;
  academicYear: string;
  classAdvisor: string;
  department: string;
  schedule: DaySchedule[];
}

export const COURSES_CATALOG: Record<string, Course> = {
  CCT: { code: '24BECSE501', name: 'Cloud Computing Technology', shortCode: 'CCT', type: 'Theory', defaultFaculty: 'Vikram N R', faculty2: 'Prabodh C P' },
  BDT: { code: '24BECSE502', name: 'Big Data Tools and Techniques', shortCode: 'BDT', type: 'Theory', defaultFaculty: 'Kavya M', faculty2: 'Dr. Prasath Srinivasan' },
  ML: { code: '24BECSE503', name: 'Machine Learning', shortCode: 'ML', type: 'Theory', defaultFaculty: 'A Ranjini', faculty2: 'Divya Visakh' },
  FLAT: { code: '24BECSE504', name: 'Formal Languages and Automata Theory', shortCode: 'FLAT', type: 'Theory', defaultFaculty: 'Monisha R', faculty2: 'Shwetha K Gowda' },
  DM: { code: '24BECSE505', name: 'Digital Marketing', shortCode: 'DM', type: 'Theory', defaultFaculty: 'Vani BA', faculty2: 'Dhanush K' },
  PEHV: { code: '24BECSE506', name: 'Professional Ethics and Human Values', shortCode: 'PEHV', type: 'Institutional', defaultFaculty: 'Vani BA' },
  DWM: { code: '24BECSE521', name: 'Data Mining and Wrangling (PE-2)', shortCode: 'DWM', type: 'Elective', defaultFaculty: 'Dr. Prasath Srinivasan' },
  ST: { code: '25BECSE522', name: 'Software Testing (PE-2)', shortCode: 'ST', type: 'Elective', defaultFaculty: 'Divya Visakh' },
  FOD: { code: '25BECSE533', name: 'Foundations of DevOps (PE-3)', shortCode: 'FOD', type: 'Elective', defaultFaculty: 'Dhanush K' },
  CCTL: { code: '24BECSE501L', name: 'Cloud Computing Technology Lab', shortCode: 'CCTL', type: 'Lab', defaultFaculty: 'Vikram N R', faculty2: 'Nayana K C' },
  BDTL: { code: '24BECSE502L', name: 'Big Data Tools and Techniques Lab', shortCode: 'BDTL', type: 'Lab', defaultFaculty: 'Pallavi H Nanjappanavar', faculty2: 'Kavya M' },
  MLL: { code: '24BECSE503L', name: 'Machine Learning Lab', shortCode: 'MLL', type: 'Lab', defaultFaculty: 'A Ranjini', faculty2: 'Ganesh G' },
  CTVA1: { code: 'CTVA-1', name: 'Critical Thinking & Value Addition 1', shortCode: 'CTVA 1', type: 'ValueAdded', defaultFaculty: 'A Ranjini' },
  CTVA2: { code: 'CTVA-2', name: 'Critical Thinking & Value Addition 2', shortCode: 'CTVA 2', type: 'ValueAdded', defaultFaculty: 'Vikram N R' },
  PWM: { code: 'PWM', name: 'Proctor Ward Meeting', shortCode: 'PWM', type: 'Institutional', defaultFaculty: 'Vikram N R' },
  SPORTS: { code: 'SPORTS', name: 'Sports & Wellness', shortCode: 'SPORTS', type: 'Institutional', defaultFaculty: 'Dept. Sports Coordinator' },
  LIBRARY: { code: 'LIB', name: 'Library & Research Hour', shortCode: 'LIBRARY', type: 'Institutional', defaultFaculty: 'Dept. Librarian' },
};

// 5CSE01 Complete Timetable from PDF Page 1 & Page 43
export const SECTION_5CSE01_TIMETABLE: SectionTimetable = {
  section: '5CSE01',
  semester: '5th Semester',
  academicYear: '2026-2027',
  classAdvisor: 'Vikram N R',
  department: 'School of Engineering and Technology - CSE',
  schedule: [
    {
      day: 'MON',
      fullDay: 'Monday',
      slots: [
        { period: 1, time: '9:00 - 10:00', subjectCode: '24BECSE501L / 502L', subjectName: 'CCTL (B1) / BDTL (B2)', shortCode: 'CCTL/BDTL', faculty: 'Vikram N R', faculty2: 'Nayana K C', room: 'A405 / A625', batch: 'All' },
        { period: 2, time: '10:00 - 11:00', subjectCode: '24BECSE501L / 502L', subjectName: 'CCTL (B1) / BDTL (B2)', shortCode: 'CCTL/BDTL', faculty: 'Vikram N R', faculty2: 'Pallavi H Nanjappanavar', room: 'A405 / A625', batch: 'All' },
        { period: 0, time: '11:00 - 11:15', isBreak: true, breakName: 'Tea Break', faculty: '', room: 'Campus Cafeteria' },
        { period: 3, time: '11:15 - 12:15', subjectCode: '24BECSE503', subjectName: 'Machine Learning', shortCode: 'ML', faculty: 'A Ranjini', faculty2: 'Divya Visakh', room: 'A203' },
        { period: 4, time: '12:15 - 1:15', subjectCode: '24BECSE504', subjectName: 'Formal Languages and Automata Theory', shortCode: 'FLAT', faculty: 'Monisha R', faculty2: 'Shwetha K Gowda', room: 'A203' },
        { period: 0, time: '1:15 - 2:15', isBreak: true, breakName: 'Lunch Break', faculty: '', room: 'University Food Court' },
        { period: 5, time: '2:15 - 3:10', subjectCode: '24BECSE502', subjectName: 'Big Data Tools and Techniques', shortCode: 'BDT', faculty: 'Kavya M', room: 'A209' },
        { period: 6, time: '3:10 - 4:05', subjectCode: '24BECSE506', subjectName: 'Professional Ethics and Human Values', shortCode: 'PEHV', faculty: 'Vani BA', room: 'A203' },
        { period: 7, time: '4:05 - 5:00', subjectCode: 'PWM', subjectName: 'Proctor Ward Meeting', shortCode: 'PWM', faculty: 'Vikram N R', room: 'A203' }
      ]
    },
    {
      day: 'TUE',
      fullDay: 'Tuesday',
      slots: [
        { period: 1, time: '9:00 - 10:00', subjectCode: '24BECSE502', subjectName: 'Big Data Tools and Techniques', shortCode: 'BDT', faculty: 'Kavya M', faculty2: 'Dr. Prasath Srinivasan', room: 'A202' },
        { period: 2, time: '10:00 - 11:00', subjectCode: '24BECSE504', subjectName: 'Formal Languages and Automata Theory', shortCode: 'FLAT', faculty: 'Monisha R', room: 'A202' },
        { period: 0, time: '11:00 - 11:15', isBreak: true, breakName: 'Tea Break', faculty: '', room: 'Campus Cafeteria' },
        { period: 3, time: '11:15 - 12:15', subjectCode: 'CTVA-1', subjectName: 'Critical Thinking & Value Addition 1', shortCode: 'CTVA 1', faculty: 'A Ranjini (P1)', faculty2: 'Vikram N R (P2)', room: 'HRD1' },
        { period: 4, time: '12:15 - 1:15', subjectCode: 'CTVA-1', subjectName: 'Critical Thinking & Value Addition 1', shortCode: 'CTVA 1', faculty: 'A Ranjini (P1)', faculty2: 'Vikram N R (P2)', room: 'HRD1' },
        { period: 0, time: '1:15 - 2:15', isBreak: true, breakName: 'Lunch Break', faculty: '', room: 'University Food Court' },
        { period: 5, time: '2:15 - 3:10', subjectCode: '24BECSE501L / 502L', subjectName: 'CCTL (B2) / BDTL (B1)', shortCode: 'CCTL/BDTL', faculty: 'Vikram N R', faculty2: 'Pallavi H Nanjappanavar', room: 'A525 / A505', batch: 'All' },
        { period: 6, time: '3:10 - 4:05', subjectCode: '24BECSE501L / 502L', subjectName: 'CCTL (B2) / BDTL (B1)', shortCode: 'CCTL/BDTL', faculty: 'Vikram N R', faculty2: 'Pallavi H Nanjappanavar', room: 'A525 / A505', batch: 'All' },
        { period: 7, time: '4:05 - 5:00', subjectCode: 'SPORTS', subjectName: 'Sports & Wellness', shortCode: 'SPORTS', faculty: 'Dept. Sports Coordinator', room: 'Sports Complex' }
      ]
    },
    {
      day: 'WED',
      fullDay: 'Wednesday',
      slots: [
        { period: 1, time: '9:00 - 10:00', subjectCode: '24BECSE505', subjectName: 'Digital Marketing', shortCode: 'DM', faculty: 'Vani BA', faculty2: 'Dhanush K', room: 'A202' },
        { period: 2, time: '10:00 - 11:00', subjectCode: '24BECSE502', subjectName: 'Big Data Tools and Techniques', shortCode: 'BDT', faculty: 'Kavya M', room: 'A202' },
        { period: 0, time: '11:00 - 11:15', isBreak: true, breakName: 'Tea Break', faculty: '', room: 'Campus Cafeteria' },
        { period: 3, time: '11:15 - 12:15', subjectCode: '24BECSE504', subjectName: 'Formal Languages and Automata Theory', shortCode: 'FLAT', faculty: 'Monisha R', room: 'A202' },
        { period: 4, time: '12:15 - 1:15', subjectCode: 'PE-2', subjectName: 'Data Mining (DWM) / Software Testing (ST)', shortCode: 'PE-2', faculty: 'Dr. Prasath Srinivasan / Divya Visakh', room: 'A202 / A203' },
        { period: 0, time: '1:15 - 2:15', isBreak: true, breakName: 'Lunch Break', faculty: '', room: 'University Food Court' },
        { period: 5, time: '2:15 - 3:10', subjectCode: '25BECSE533', subjectName: 'Foundations of DevOps', shortCode: 'FOD', faculty: 'Dhanush K', room: 'A202' },
        { period: 6, time: '3:10 - 4:05', subjectCode: '24BECSE501', subjectName: 'Cloud Computing Technology', shortCode: 'CCT', faculty: 'Vikram N R', room: 'A202' },
        { period: 7, time: '4:05 - 5:00', subjectCode: 'LIBRARY', subjectName: 'Central Library Hour', shortCode: 'LIBRARY', faculty: 'Dept. Librarian', room: 'Central Library' }
      ]
    },
    {
      day: 'THUR',
      fullDay: 'Thursday',
      slots: [
        { period: 1, time: '9:00 - 10:00', subjectCode: '25BECSE533', subjectName: 'Foundations of DevOps', shortCode: 'FOD', faculty: 'Dhanush K', room: 'A202' },
        { period: 2, time: '10:00 - 11:00', subjectCode: 'PE-2', subjectName: 'Professional Elective II (DWM/ST)', shortCode: 'PE-2', faculty: 'Dr. Prasath Srinivasan / Divya Visakh', room: 'A202 / A203' },
        { period: 0, time: '11:00 - 11:15', isBreak: true, breakName: 'Tea Break', faculty: '', room: 'Campus Cafeteria' },
        { period: 3, time: '11:15 - 12:15', subjectCode: '24BECSE503L', subjectName: 'Machine Learning Lab (B1/B2)', shortCode: 'MLL', faculty: 'A Ranjini (B1)', faculty2: 'Ganesh G (B2)', room: 'A222' },
        { period: 4, time: '12:15 - 1:15', subjectCode: '24BECSE503L', subjectName: 'Machine Learning Lab (B1/B2)', shortCode: 'MLL', faculty: 'A Ranjini (B1)', faculty2: 'Ganesh G (B2)', room: 'A222' },
        { period: 0, time: '1:15 - 2:15', isBreak: true, breakName: 'Lunch Break', faculty: '', room: 'University Food Court' },
        { period: 5, time: '2:15 - 3:10', subjectCode: '24BECSE505', subjectName: 'Digital Marketing', shortCode: 'DM', faculty: 'Vani BA', room: 'A202' },
        { period: 6, time: '3:10 - 4:05', subjectCode: '24BECSE503', subjectName: 'Machine Learning', shortCode: 'ML', faculty: 'A Ranjini', room: 'A202' },
        { period: 7, time: '4:05 - 5:00', subjectCode: 'PEHV', subjectName: 'Self-Study & Revision', shortCode: 'REV', faculty: 'Vikram N R', room: 'A202' }
      ]
    },
    {
      day: 'FRI',
      fullDay: 'Friday',
      slots: [
        { period: 1, time: '9:00 - 10:00', subjectCode: '24BECSE505', subjectName: 'Digital Marketing', shortCode: 'DM', faculty: 'Vani BA', room: 'A202' },
        { period: 2, time: '10:00 - 11:00', subjectCode: 'PE-2', subjectName: 'Professional Elective II (DWM/ST)', shortCode: 'PE-2', faculty: 'Dr. Prasath Srinivasan / Divya Visakh', room: 'A202 / A203' },
        { period: 0, time: '11:00 - 11:15', isBreak: true, breakName: 'Tea Break', faculty: '', room: 'Campus Cafeteria' },
        { period: 3, time: '11:15 - 12:15', subjectCode: 'CTVA-2', subjectName: 'Critical Thinking & Value Addition 2', shortCode: 'CTVA 2', faculty: 'Vikram N R', faculty2: 'A Ranjini', room: 'HRD5' },
        { period: 4, time: '12:15 - 1:15', subjectCode: 'CTVA-2', subjectName: 'Critical Thinking & Value Addition 2', shortCode: 'CTVA 2', faculty: 'Vikram N R', faculty2: 'A Ranjini', room: 'HRD5' },
        { period: 0, time: '1:15 - 2:15', isBreak: true, breakName: 'Lunch Break', faculty: '', room: 'University Food Court' },
        { period: 5, time: '2:15 - 3:10', subjectCode: '25BECSE533', subjectName: 'Foundations of DevOps', shortCode: 'FOD', faculty: 'Dhanush K', room: 'A202' },
        { period: 6, time: '3:10 - 4:05', subjectCode: '24BECSE501', subjectName: 'Cloud Computing Technology', shortCode: 'CCT', faculty: 'Vikram N R', room: 'A202' },
        { period: 7, time: '4:05 - 5:00', subjectCode: 'VAP', subjectName: 'Value Added Program-I (VAP)', shortCode: 'VAP', faculty: 'Vikram N R', room: 'A202' }
      ]
    }
  ]
};

// Section 5CSE02 Timetable from PDF Page 1 (bottom) & Page 43/44
export const SECTION_5CSE02_TIMETABLE: SectionTimetable = {
  section: '5CSE02',
  semester: '5th Semester',
  academicYear: '2026-2027',
  classAdvisor: 'Kavya M',
  department: 'School of Engineering and Technology - CSE',
  schedule: [
    {
      day: 'MON',
      fullDay: 'Monday',
      slots: [
        { period: 1, time: '9:00 - 10:00', subjectCode: '24BECSE506', subjectName: 'Professional Ethics and Human Values', shortCode: 'PEHV', faculty: 'Vani BA', room: 'A203' },
        { period: 2, time: '10:00 - 11:00', subjectCode: '24BECSE504', subjectName: 'Formal Languages and Automata Theory', shortCode: 'FLAT', faculty: 'Monisha R', room: 'A203' },
        { period: 0, time: '11:00 - 11:15', isBreak: true, breakName: 'Tea Break', faculty: '', room: 'Campus Cafeteria' },
        { period: 3, time: '11:15 - 12:15', subjectCode: '24BECSE501L / 502L', subjectName: 'CCTL (B2) / BDTL (B1)', shortCode: 'CCTL/BDTL', faculty: 'Vikram N R', faculty2: 'Pallavi H Nanjappanavar', room: 'A525 / A505', batch: 'All' },
        { period: 4, time: '12:15 - 1:15', subjectCode: '24BECSE501L / 502L', subjectName: 'CCTL (B2) / BDTL (B1)', shortCode: 'CCTL/BDTL', faculty: 'Vikram N R', faculty2: 'Pallavi H Nanjappanavar', room: 'A525 / A505', batch: 'All' },
        { period: 0, time: '1:15 - 2:15', isBreak: true, breakName: 'Lunch Break', faculty: '', room: 'University Food Court' },
        { period: 5, time: '2:15 - 3:10', subjectCode: '24BECSE501', subjectName: 'Cloud Computing Technology', shortCode: 'CCT', faculty: 'Vikram N R', room: 'A203' },
        { period: 6, time: '3:10 - 4:05', subjectCode: '24BECSE505', subjectName: 'Digital Marketing', shortCode: 'DM', faculty: 'Vani BA', room: 'A203' },
        { period: 7, time: '4:05 - 5:00', subjectCode: 'PWM', subjectName: 'Proctor Ward Meeting', shortCode: 'PWM', faculty: 'Kavya M', room: 'A203' }
      ]
    },
    {
      day: 'TUE',
      fullDay: 'Tuesday',
      slots: [
        { period: 1, time: '9:00 - 10:00', subjectCode: '24BECSE503', subjectName: 'Machine Learning', shortCode: 'ML', faculty: 'A Ranjini', room: 'A203' },
        { period: 2, time: '10:00 - 11:00', subjectCode: '24BECSE501', subjectName: 'Cloud Computing Technology', shortCode: 'CCT', faculty: 'Vikram N R', room: 'A203' },
        { period: 0, time: '11:00 - 11:15', isBreak: true, breakName: 'Tea Break', faculty: '', room: 'Campus Cafeteria' },
        { period: 3, time: '11:15 - 12:15', subjectCode: 'CTVA-2', subjectName: 'Critical Thinking & Value Addition 2', shortCode: 'CTVA 2', faculty: 'Kavya M', room: 'HRD5' },
        { period: 4, time: '12:15 - 1:15', subjectCode: 'CTVA-2', subjectName: 'Critical Thinking & Value Addition 2', shortCode: 'CTVA 2', faculty: 'Kavya M', room: 'HRD5' },
        { period: 0, time: '1:15 - 2:15', isBreak: true, breakName: 'Lunch Break', faculty: '', room: 'University Food Court' },
        { period: 5, time: '2:15 - 3:10', subjectCode: '24BECSE505', subjectName: 'Digital Marketing', shortCode: 'DM', faculty: 'Vani BA', room: 'A203' },
        { period: 6, time: '3:10 - 4:05', subjectCode: '24BECSE502', subjectName: 'Big Data Tools and Techniques', shortCode: 'BDT', faculty: 'Kavya M', room: 'A203' },
        { period: 7, time: '4:05 - 5:00', subjectCode: 'SPORTS', subjectName: 'Sports & Wellness', shortCode: 'SPORTS', faculty: 'Dept. Sports Coordinator', room: 'Sports Complex' }
      ]
    },
    {
      day: 'WED',
      fullDay: 'Wednesday',
      slots: [
        { period: 1, time: '9:00 - 10:00', subjectCode: '24BECSE503L', subjectName: 'Machine Learning Lab (B1/B2)', shortCode: 'MLL', faculty: 'A Ranjini (B1)', faculty2: 'Chaitra H V (B2)', room: 'A222' },
        { period: 2, time: '10:00 - 11:00', subjectCode: '24BECSE503L', subjectName: 'Machine Learning Lab (B1/B2)', shortCode: 'MLL', faculty: 'A Ranjini (B1)', faculty2: 'Chaitra H V (B2)', room: 'A222' },
        { period: 0, time: '11:00 - 11:15', isBreak: true, breakName: 'Tea Break', faculty: '', room: 'Campus Cafeteria' },
        { period: 3, time: '11:15 - 12:15', subjectCode: '24BECSE502', subjectName: 'Big Data Tools and Techniques', shortCode: 'BDT', faculty: 'Kavya M', room: 'A203' },
        { period: 4, time: '12:15 - 1:15', subjectCode: 'PE-2', subjectName: 'Professional Elective II (DWM/ST)', shortCode: 'PE-2', faculty: 'Dr. Prasath Srinivasan / Divya Visakh', room: 'A203 / A202' },
        { period: 0, time: '1:15 - 2:15', isBreak: true, breakName: 'Lunch Break', faculty: '', room: 'University Food Court' },
        { period: 5, time: '2:15 - 3:10', subjectCode: '25BECSE533', subjectName: 'Foundations of DevOps', shortCode: 'FOD', faculty: 'Dhanush K', room: 'A203' },
        { period: 6, time: '3:10 - 4:05', subjectCode: '24BECSE504', subjectName: 'Formal Languages and Automata Theory', shortCode: 'FLAT', faculty: 'Monisha R', room: 'A203' },
        { period: 7, time: '4:05 - 5:00', subjectCode: 'LIBRARY', subjectName: 'Library Research Hour', shortCode: 'LIBRARY', faculty: 'Dept. Librarian', room: 'Central Library' }
      ]
    },
    {
      day: 'THUR',
      fullDay: 'Thursday',
      slots: [
        { period: 1, time: '9:00 - 10:00', subjectCode: '24BECSE501L / 502L', subjectName: 'CCTL (B1) / BDTL (B2)', shortCode: 'CCTL/BDTL', faculty: 'Vikram N R', faculty2: 'Monisha R', room: 'A405 / A625' },
        { period: 2, time: '10:00 - 11:00', subjectCode: '24BECSE501L / 502L', subjectName: 'CCTL (B1) / BDTL (B2)', shortCode: 'CCTL/BDTL', faculty: 'Vikram N R', faculty2: 'Monisha R', room: 'A405 / A625' },
        { period: 0, time: '11:00 - 11:15', isBreak: true, breakName: 'Tea Break', faculty: '', room: 'Campus Cafeteria' },
        { period: 3, time: '11:15 - 12:15', subjectCode: '24BECSE501', subjectName: 'Cloud Computing Technology', shortCode: 'CCT', faculty: 'Vikram N R', room: 'A203' },
        { period: 4, time: '12:15 - 1:15', subjectCode: '24BECSE503', subjectName: 'Machine Learning', shortCode: 'ML', faculty: 'A Ranjini', room: 'A203' },
        { period: 0, time: '1:15 - 2:15', isBreak: true, breakName: 'Lunch Break', faculty: '', room: 'University Food Court' },
        { period: 5, time: '2:15 - 3:10', subjectCode: '25BECSE533', subjectName: 'Foundations of DevOps', shortCode: 'FOD', faculty: 'Dhanush K', room: 'A203' },
        { period: 6, time: '3:10 - 4:05', subjectCode: '24BECSE503', subjectName: 'Machine Learning', shortCode: 'ML', faculty: 'A Ranjini', room: 'A203' },
        { period: 7, time: '4:05 - 5:00', subjectCode: 'VAP', subjectName: 'Value Added Program', shortCode: 'VAP', faculty: 'Kavya M', room: 'A203' }
      ]
    },
    {
      day: 'FRI',
      fullDay: 'Friday',
      slots: [
        { period: 1, time: '9:00 - 10:00', subjectCode: '24BECSE502', subjectName: 'Big Data Tools and Techniques', shortCode: 'BDT', faculty: 'Kavya M', room: 'A203' },
        { period: 2, time: '10:00 - 11:00', subjectCode: 'PE-2', subjectName: 'Professional Elective II', shortCode: 'PE-2', faculty: 'Dr. Prasath Srinivasan / Divya Visakh', room: 'A203 / A202' },
        { period: 0, time: '11:00 - 11:15', isBreak: true, breakName: 'Tea Break', faculty: '', room: 'Campus Cafeteria' },
        { period: 3, time: '11:15 - 12:15', subjectCode: '24BECSE505', subjectName: 'Digital Marketing', shortCode: 'DM', faculty: 'Vani BA', room: 'A203' },
        { period: 4, time: '12:15 - 1:15', subjectCode: '24BECSE504', subjectName: 'Formal Languages and Automata Theory', shortCode: 'FLAT', faculty: 'Monisha R', room: 'A203' },
        { period: 0, time: '1:15 - 2:15', isBreak: true, breakName: 'Lunch Break', faculty: '', room: 'University Food Court' },
        { period: 5, time: '2:15 - 3:10', subjectCode: '25BECSE533', subjectName: 'Foundations of DevOps', shortCode: 'FOD', faculty: 'Dhanush K', room: 'A203' },
        { period: 6, time: '3:10 - 4:05', subjectCode: '24BECSE501', subjectName: 'Cloud Computing Technology', shortCode: 'CCT', faculty: 'Vikram N R', room: 'A203' },
        { period: 7, time: '4:05 - 5:00', subjectCode: 'CTVA-1', subjectName: 'CTVA 1', shortCode: 'CTVA 1', faculty: 'Kavya M', room: 'HRD1' }
      ]
    }
  ]
};

export const ALL_SECTIONS = ['5CSE01', '5CSE02', '5CSE03', '5CSE04', '5CSE05', '5CSE06', '5CSE07'];

export const FACULTY_MEMBERS = [
  { name: 'Vikram N R', title: 'Assistant Professor & Class Advisor (5CSE01)', subjects: ['Cloud Computing Technology', 'Cloud Computing Technology Lab', 'CTVA 2'], room: 'Faculty Block 3, Cabin 304' },
  { name: 'Kavya M', title: 'Associate Professor & Class Advisor (5CSE02)', subjects: ['Big Data Tools and Techniques', 'Big Data Tools and Techniques Lab'], room: 'Faculty Block 3, Cabin 306' },
  { name: 'A Ranjini', title: 'Assistant Professor & Class Advisor (5CSE03)', subjects: ['Machine Learning', 'Machine Learning Lab', 'CTVA 1'], room: 'Faculty Block 3, Cabin 308' },
  { name: 'Amrutha T R', title: 'Assistant Professor & Class Advisor (5CSE04)', subjects: ['Data Mining and Wrangling', 'Cloud Computing Technology'], room: 'Faculty Block 3, Cabin 310' },
  { name: 'K Rajesh Kumar', title: 'Associate Professor & Class Advisor (5CSE05)', subjects: ['Big Data Tools and Techniques', 'DevOps'], room: 'Faculty Block 2, Cabin 201' },
  { name: 'Dr. Prasath Srinivasan', title: 'Professor & Subject Head', subjects: ['Data Mining and Wrangling (PE-2)', 'Machine Learning'], room: 'Deanery Wing, Executive Cabin D1' },
  { name: 'Monisha R', title: 'Assistant Professor', subjects: ['Formal Languages and Automata Theory'], room: 'Faculty Block 3, Cabin 312' },
  { name: 'Vani BA', title: 'Assistant Professor', subjects: ['Digital Marketing', 'Professional Ethics and Human Values'], room: 'Faculty Block 2, Cabin 205' },
  { name: 'Dhanush K', title: 'Assistant Professor', subjects: ['Foundations of DevOps (PE-3)'], room: 'Faculty Block 2, Cabin 208' },
  { name: 'Pallavi H Nanjappanavar', title: 'Assistant Professor', subjects: ['Big Data Tools and Techniques Lab'], room: 'Faculty Block 2, Cabin 210' },
  { name: 'Divya Visakh', title: 'Assistant Professor', subjects: ['Software Testing (PE-2)', 'Machine Learning'], room: 'Faculty Block 3, Cabin 315' }
];

export const DEMO_FACULTY = FACULTY_MEMBERS[0]; // Vikram N R
