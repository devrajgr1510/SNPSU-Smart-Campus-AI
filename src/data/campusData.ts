export interface CampusSpace {
  id: string;
  name: string;
  category: 'Administration' | 'Library' | 'Classroom' | 'Auditorium' | 'Map';
  image: string;
  location: string;
  capacity: string;
  description: string;
  highlights: string[];
  operatingHours: string;
  inCharge: string;
  googleMapsUrl: string;
}

export const CAMPUS_SPACES: CampusSpace[] = [
  {
    id: 'facade',
    name: 'Sapthagiri University Main Campus & Neoclassical Rotunda',
    category: 'Administration',
    image: '/src/assets/images/sapthagiri_campus_facade_1791511293804.jpg',
    location: '#14/5, Chikkasandra, Hesaraghatta Main Road, Bengaluru - 560 057',
    capacity: '10,000+ Students & Faculty',
    description: 'The monumental neoclassical campus building of Sapthagiri NPS University in Bengaluru. Decorated with golden architectural pilasters, multi-story arched porticos, entrance rotunda with classical dome and spire, and manicured ceremonial front lawns.',
    highlights: [
      'Administrative headquarters & School of Engineering & Technology (SoET)',
      'Office of the Dean, Academic Registrar, and Director of CSE',
      'Ceremonial entrance rotunda with classical fluted columns',
      'Integrated biometric attendance verification gates'
    ],
    operatingHours: '8:30 AM – 6:00 PM (Monday – Saturday)',
    inCharge: 'Office of the Registrar / Dean - SoET',
    googleMapsUrl: 'https://maps.google.com/?q=Sapthagiri+NPS+University+Hesaraghatta+Road+Bangalore'
  },
  {
    id: 'library',
    name: 'Sapthagiri University Library Area (R20)',
    category: 'Library',
    image: '/src/assets/images/sapthagiri_library_exact_1791511311636.jpg',
    location: 'Central Knowledge Block, Level 2 & 3',
    capacity: '850 Reading Seats | 120 Research Nodes',
    description: 'The palatial Sapthagiri University Library Area featuring gold baroque coffered ceiling reliefs, tiered crystal chandeliers, rich purple velvet study seating, and polished blue marble flooring with golden border inlays. Subscribed to IEEE, ACM, and international engineering journals.',
    highlights: [
      'Subscribed to IEEE Xplore, ScienceDirect, and ACM Digital Library',
      'Two-tiered ornate bookshelves with mezzanine study walkways',
      'Quiet individual reading desks and postgraduate research alcoves',
      'Automated RFID book borrowing and returns kiosks'
    ],
    operatingHours: '8:00 AM – 9:00 PM (Monday – Saturday)',
    inCharge: 'Chief University Librarian',
    googleMapsUrl: 'https://maps.google.com/?q=Sapthagiri+NPS+University+Hesaraghatta+Road+Bangalore'
  },
  {
    id: 'classroom',
    name: 'Smart Tiered Lecture Hall (Classroom A202 - A210)',
    category: 'Classroom',
    image: '/src/assets/images/sapthagiri_classroom_exact_1791511326504.jpg',
    location: 'School of Engineering, Academic Block A, 2nd Floor (A202 / A203 / A209)',
    capacity: '75 Executive Swivel Seats per Hall',
    description: 'Tiered amphitheater lecture classroom with curved Italian marble desks, executive burgundy red leather swivel chairs, neoclassical gold wall mouldings, overhead ceiling fans, and integrated dual 4K laser projection podiums.',
    highlights: [
      'Tiered amphitheater rows for unobstructed acoustic and visual clarity',
      'High-back burgundy ergonomic swivel chairs with wheels',
      'Individual desk power sockets and interactive smartboard',
      'Centralized climate conditioning and lecture recording microphones'
    ],
    operatingHours: '8:30 AM – 5:30 PM (Class Timetable dependent)',
    inCharge: 'Class Advisor: Prof. Vikram N R (5CSE01)',
    googleMapsUrl: 'https://maps.google.com/?q=Sapthagiri+NPS+University+Hesaraghatta+Road+Bangalore'
  },
  {
    id: 'seminar_hall',
    name: 'Sapthagiri University Basement Seminar Hall',
    category: 'Auditorium',
    image: '/src/assets/images/sapthagiri_seminar_exact_1791511338130.jpg',
    location: 'Main University Complex, Lower Ground Floor (Basement Concourse)',
    capacity: '600 Delegate Conference Seating',
    description: 'The majestic Sapthagiri University Basement Seminar Hall designed in imperial palace style with ornate gold brocade wall reliefs, grand crystal chandeliers, high-gloss reflective blue-green marble flooring, and rows of gold-framed conference armchairs.',
    highlights: [
      'Surround JBL acoustic audio line array reinforcement',
      'Executive conference dais with integrated presentation podium',
      'Ultra-HD LED stage backdrop and live broadcast telecast suite',
      'VIP guest deliberations and national symposium venue'
    ],
    operatingHours: 'University ceremonies & Symposium schedules',
    inCharge: 'Head of Cultural & Technical Affairs',
    googleMapsUrl: 'https://maps.google.com/?q=Sapthagiri+NPS+University+Hesaraghatta+Road+Bangalore'
  },
  {
    id: 'campus_map',
    name: 'Sapthagiri NPS University Campus Master Plan',
    category: 'Map',
    image: '/src/assets/images/campus_map_1791509191947.jpg',
    location: 'Main Campus Master Layout, #14/5 Hesaraghatta Main Road',
    capacity: '40+ Acre Smart Tech Campus',
    description: 'Aerial isometric campus layout detailing Engineering Academic Blocks A, B, and C, the Central Knowledge Repository, the Basement Seminar Hall, Computing Laboratories, Student Cafeteria, and Athletic Grounds.',
    highlights: [
      'CSE Academic Wing with specialized Cloud & AI Computing Labs',
      'Central knowledge repository and research centers',
      'Olympic-standard athletic running tracks and indoor sports pavilion',
      'Direct transit bay with shuttle services connecting Bengaluru'
    ],
    operatingHours: '24/7 Security Access Control',
    inCharge: 'Campus Security & Facilities Directorate',
    googleMapsUrl: 'https://maps.google.com/?q=Sapthagiri+NPS+University+Hesaraghatta+Road+Bangalore'
  }
];
