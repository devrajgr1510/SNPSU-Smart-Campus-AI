export interface CalendarEvent {
  id: string;
  dateStr: string; // e.g., '2026-09-07'
  displayDate: string; // e.g. '07 Sep 2026'
  title: string;
  type: 'Commencement' | 'InternalAssessment' | 'Holiday' | 'TimetableAdjustment' | 'Meeting' | 'Exam' | 'Audit';
  description: string;
  isImportant?: boolean;
}

export const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    dateStr: '2026-09-07',
    displayDate: '07 Sep 2026',
    title: 'Commencement of ODD Semester Classes',
    type: 'Commencement',
    description: '3rd and 5th Semester B.E. Classes commence for Academic Year 2026-27.',
    isImportant: true
  },
  {
    id: 'evt-2',
    dateStr: '2026-09-07',
    displayDate: '07 - 10 Sep 2026',
    title: "Student's Course Registration",
    type: 'Commencement',
    description: 'Formal course registration for core subjects and professional electives (PE-2, PE-3).'
  },
  {
    id: 'evt-3',
    dateStr: '2026-09-12',
    displayDate: '12 Sep 2026',
    title: 'Monday Timetable Followed',
    type: 'TimetableAdjustment',
    description: 'Saturday instructional compensation day: all classes follow Monday timetable schedule.'
  },
  {
    id: 'evt-4',
    dateStr: '2026-09-14',
    displayDate: '14 Sep 2026',
    title: 'Ganesh Chaturthi',
    type: 'Holiday',
    description: 'General Public Holiday. Campus academic activities remain suspended.'
  },
  {
    id: 'evt-5',
    dateStr: '2026-09-26',
    displayDate: '26 Sep 2026',
    title: 'Tuesday Timetable Followed',
    type: 'TimetableAdjustment',
    description: 'Saturday instructional compensation day: all classes follow Tuesday timetable schedule.'
  },
  {
    id: 'evt-6',
    dateStr: '2026-10-02',
    displayDate: '02 Oct 2026',
    title: 'Mahatma Gandhi Jayanthi',
    type: 'Holiday',
    description: 'National Holiday. Campus community service & remembrance.'
  },
  {
    id: 'evt-7',
    dateStr: '2026-10-20',
    displayDate: '20 Oct 2026',
    title: 'Mahanavami',
    type: 'Holiday',
    description: 'Festival Holiday across all university faculties.'
  },
  {
    id: 'evt-8',
    dateStr: '2026-10-21',
    displayDate: '21 Oct 2026',
    title: 'Vijayadashami',
    type: 'Holiday',
    description: 'Festival Holiday.'
  },
  {
    id: 'evt-9',
    dateStr: '2026-10-22',
    displayDate: '22 - 29 Oct 2026',
    title: 'First Internal Assessment Test (IA-1)',
    type: 'InternalAssessment',
    description: 'Centralized IA-1 examinations for 3rd and 5th Semester B.E. Mandatory attendance.',
    isImportant: true
  },
  {
    id: 'evt-10',
    dateStr: '2026-10-31',
    displayDate: '31 Oct 2026',
    title: 'Wednesday Timetable Followed',
    type: 'TimetableAdjustment',
    description: 'Saturday instructional compensation day: all classes follow Wednesday timetable schedule.'
  },
  {
    id: 'evt-11',
    dateStr: '2026-11-10',
    displayDate: '10 Nov 2026',
    title: 'Balipadyami',
    type: 'Holiday',
    description: 'Deepavali Festive Holiday.'
  },
  {
    id: 'evt-12',
    dateStr: '2026-11-14',
    displayDate: '14 Nov 2026',
    title: "Parent Teacher's Meeting (PTM)",
    type: 'Meeting',
    description: 'Mid-term academic appraisal, attendance status review with proctors and class advisors.',
    isImportant: true
  },
  {
    id: 'evt-13',
    dateStr: '2026-11-28',
    displayDate: '28 Nov 2026',
    title: 'Friday Timetable Followed',
    type: 'TimetableAdjustment',
    description: 'Saturday instructional compensation day: all classes follow Friday timetable schedule.'
  },
  {
    id: 'evt-14',
    dateStr: '2026-12-07',
    displayDate: '07 - 14 Dec 2026',
    title: 'Second Internal Assessment Test (IA-2)',
    type: 'InternalAssessment',
    description: 'Centralized IA-2 examinations. Marks factored into continuous internal evaluation (CIE).',
    isImportant: true
  },
  {
    id: 'evt-15',
    dateStr: '2026-12-12',
    displayDate: '12 Dec 2026',
    title: 'Wednesday Timetable Followed',
    type: 'TimetableAdjustment',
    description: 'Instructional compensation day: Wednesday timetable schedule followed.'
  },
  {
    id: 'evt-16',
    dateStr: '2026-12-25',
    displayDate: '25 Dec 2026',
    title: 'Christmas',
    type: 'Holiday',
    description: 'University Holiday.'
  },
  {
    id: 'evt-17',
    dateStr: '2026-12-28',
    displayDate: '28 Dec 2026 - 01 Jan 2027',
    title: 'Laboratory IA & Faculty Feedback',
    type: 'InternalAssessment',
    description: 'Practical lab exam assessments and student feedback on course delivery.',
    isImportant: true
  },
  {
    id: 'evt-18',
    dateStr: '2027-01-05',
    displayDate: '05 Jan 2027',
    title: 'Last Working Day for ODD Semester',
    type: 'Commencement',
    description: 'Formal conclusion of odd semester classroom teaching (Total 90 working days completed).',
    isImportant: true
  },
  {
    id: 'evt-19',
    dateStr: '2027-01-07',
    displayDate: '07 Jan 2027',
    title: 'IA Marks Submission Deadline',
    type: 'Audit',
    description: 'All faculty members must submit compiled CIE & attendance registers to Dean - SoET.'
  },
  {
    id: 'evt-20',
    dateStr: '2027-01-14',
    displayDate: '14 Jan 2027',
    title: 'Makara Sankranthi',
    type: 'Holiday',
    description: 'Festival Holiday.'
  },
  {
    id: 'evt-21',
    dateStr: '2027-01-18',
    displayDate: '18 Jan 2027',
    title: 'Semester End Theory Exam (SEE) Begins',
    type: 'Exam',
    description: 'Commencement of University Semester End Examinations across all CSE courses.',
    isImportant: true
  },
  {
    id: 'evt-22',
    dateStr: '2027-01-26',
    displayDate: '26 Jan 2027',
    title: 'Republic Day',
    type: 'Holiday',
    description: 'National Holiday & Flag Hoisting Ceremony in Main Quadrant at 8:30 AM.'
  },
  {
    id: 'evt-23',
    dateStr: '2027-02-08',
    displayDate: '08 - 10 Feb 2027',
    title: 'University Academic Audit',
    type: 'Audit',
    description: 'Quality audit of course portfolios, question banks, and attainment analysis by Deanery.'
  },
  {
    id: 'evt-24',
    dateStr: '2027-02-22',
    displayDate: '22 Feb 2027',
    title: 'Commencement of EVEN Semester Classes',
    type: 'Commencement',
    description: 'Registration and start of 4th and 6th semester B.E. instruction for AY 2026-27.',
    isImportant: true
  }
];

export const TOTAL_WORKING_DAYS = 90;
