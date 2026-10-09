import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Student } from '../data/studentsData';
import { StudentSubjectAttendance } from './storageService';

export function generateAttendancePDF(student: Student, summary: StudentSubjectAttendance[]) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor: [number, number, number] = [15, 30, 84]; // Deep Navy #0F1E54
  const goldColor: [number, number, number] = [197, 155, 39]; // University Gold #C59B27
  const slateDark: [number, number, number] = [30, 41, 59];

  // Header Banner Background
  doc.setFillColor(15, 30, 84);
  doc.rect(0, 0, 210, 32, 'F');

  // Gold accent bar
  doc.setFillColor(197, 155, 39);
  doc.rect(0, 32, 210, 2.5, 'F');

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('SAPTHAGIRI NPS UNIVERSITY', 105, 14, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(230, 235, 245);
  doc.text('SCHOOL OF ENGINEERING AND TECHNOLOGY — DEPARTMENT OF COMPUTER SCIENCE & ENGG.', 105, 21, { align: 'center' });
  doc.text('#14/5, Chikkasandra, Hesaraghatta Main Road, Bengaluru - 560 057 | snpsu.edu.in', 105, 27, { align: 'center' });

  // Document Title
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('OFFICIAL STUDENT ATTENDANCE TRANSCRIPT', 14, 45);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  const printDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  doc.text(`Generated on: ${printDate} | Academic Year: 2026-2027 (ODD Semester)`, 14, 51);

  // Student Profile Card
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 55, 182, 34, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 30, 84);
  doc.text('STUDENT CREDENTIALS', 20, 62);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  // Left col
  doc.text(`Student Name:`, 20, 70);
  doc.setFont('helvetica', 'bold');
  doc.text(student.name, 50, 70);

  doc.setFont('helvetica', 'normal');
  doc.text(`SRN / Roll No:`, 20, 77);
  doc.setFont('helvetica', 'bold');
  doc.text(student.srn, 50, 77);

  doc.setFont('helvetica', 'normal');
  doc.text(`Email ID:`, 20, 84);
  doc.text(student.email, 50, 84);

  // Right col
  doc.text(`Program & Sem:`, 115, 70);
  doc.setFont('helvetica', 'bold');
  doc.text(`B.E. CSE — 5th Semester`, 150, 70);

  doc.setFont('helvetica', 'normal');
  doc.text(`Section / Batch:`, 115, 77);
  doc.setFont('helvetica', 'bold');
  doc.text(`${student.section} (${student.batch})`, 150, 77);

  doc.setFont('helvetica', 'normal');
  doc.text(`Department:`, 115, 84);
  doc.text(`Computer Science & Engg`, 150, 84);

  // Calculate Overall Aggregate
  const totalHeld = summary.reduce((acc, s) => acc + s.totalConducted, 0);
  const totalAttended = summary.reduce((acc, s) => acc + s.attended, 0);
  const overallPct = totalHeld > 0 ? Math.round((totalAttended / totalHeld) * 1000) / 10 : 0;
  const isEligible = overallPct >= 75;

  // Prepare table data
  const tableData = summary.map((sub, index) => [
    (index + 1).toString(),
    sub.subjectCode,
    sub.subjectName,
    sub.faculty,
    sub.totalConducted.toString(),
    sub.attended.toString(),
    (sub.totalConducted - sub.attended).toString(),
    `${sub.percentage.toFixed(1)}%`,
    sub.percentage >= 75 ? 'ELIGIBLE' : 'SHORTAGE'
  ]);

  autoTable(doc, {
    startY: 96,
    head: [['#', 'Code', 'Course Title', 'Faculty Allotted', 'Held', 'Present', 'Absent', '%', 'Eligibility']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { halign: 'center', fontStyle: 'bold', cellWidth: 20 },
      2: { cellWidth: 50 },
      3: { cellWidth: 35 },
      4: { halign: 'center', cellWidth: 14 },
      5: { halign: 'center', cellWidth: 15 },
      6: { halign: 'center', cellWidth: 14 },
      7: { halign: 'center', fontStyle: 'bold', cellWidth: 14 },
      8: { halign: 'center', fontStyle: 'bold', cellWidth: 22 }
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 8) {
        if (data.cell.raw === 'SHORTAGE') {
          data.cell.styles.textColor = [190, 24, 93]; // Red
        } else {
          data.cell.styles.textColor = [16, 149, 93]; // Green
        }
      }
    }
  });

  // Get final Y pos after table
  const finalY = (doc as any).lastAutoTable?.finalY || 160;

  // Aggregate Box
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(isEligible ? 240 : 254, isEligible ? 253 : 242, isEligible ? 244 : 242);
  doc.roundedRect(14, finalY + 8, 182, 22, 2, 2, 'FD');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(isEligible ? 21 : 185, isEligible ? 128 : 28, isEligible ? 61 : 28);
  doc.text(`Aggregate Attendance: ${overallPct.toFixed(1)}% (${totalAttended}/${totalHeld} classes attended)`, 22, finalY + 18);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  const statusNote = isEligible
    ? 'Status: Verified Eligible for Semester End Examination (SEE) as per University 75% threshold clause.'
    : 'Status: ATTENDANCE SHORTAGE! Student is falling short of mandatory 75% minimum and requires condonation clearance.';
  doc.text(statusNote, 22, finalY + 24);

  // Regulatory rules footnote
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Important Academic Rule: As per Sapthagiri NPS University examination ordinances, 75% theory & 85% practical attendance', 14, finalY + 38);
  doc.text('is mandatory. System records are dynamically synchronized with Section 5CSE01 Faculty Rosters & CoE AY 2026-27.', 14, finalY + 42);

  // Signature Block
  const sigY = finalY + 60;
  doc.setDrawColor(203, 213, 225);
  doc.line(20, sigY, 65, sigY);
  doc.line(85, sigY, 130, sigY);
  doc.line(145, sigY, 190, sigY);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Student Signature', 42, sigY + 5, { align: 'center' });
  doc.text('Class Advisor', 107, sigY + 5, { align: 'center' });
  doc.text('Dean, School of Engg (SoET)', 167, sigY + 5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`SRN: ${student.srn}`, 42, sigY + 10, { align: 'center' });
  doc.text('Vikram N R', 107, sigY + 10, { align: 'center' });
  doc.text('Sapthagiri NPS University', 167, sigY + 10, { align: 'center' });

  // Download PDF
  doc.save(`SNPSU_Attendance_${student.srn}_5CSE01.pdf`);
}
