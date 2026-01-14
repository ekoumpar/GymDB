// Simple mock data used when the database is unavailable
const classes = [
  { id: 'c1', name: 'Yoga Flow', trainer: 'Alex', time: '08:00', duration: 60, intensity: 6 },
  { id: 'c2', name: 'HIIT Blast', trainer: 'Mia', time: '10:30', duration: 45, intensity: 10 },
  { id: 'c3', name: 'Strength 101', trainer: 'Sam', time: '18:00', duration: 50, intensity: 8 }
];

const trainers = [
  { id: 't1', name: 'Alex', specialty: 'Yoga' },
  { id: 't2', name: 'Mia', specialty: 'HIIT' },
  { id: 't3', name: 'Sam', specialty: 'Strength' }
];

const members = [
  { id: 'm1', name: 'Maria Pappa', password: 'Maria123', dateOfBirth: '1990-05-12', sex: 'F', phoneNumber: '+30 6930234567', height: 165, weight: 60 },
  { id: 'm2', name: 'George Kontos', password: 'George123', dateOfBirth: '1985-09-02', sex: 'M', phoneNumber: '+30 6937653251', height: 180, weight: 82 }
];

// Mock bookings linked to member ids and class ids
const bookings = [
  { id: 'b1', memberId: 'm1', classId: 'c1', className: 'Yoga Flow', trainer: 'Alex', date: '2025-12-24T08:00:00.000Z', location: 'Main Hall' },
  { id: 'b2', memberId: 'm1', classId: 'c3', className: 'Strength 101', trainer: 'Sam', date: '2025-12-24T18:00:00.000Z', location: 'Room B' },
  { id: 'b3', memberId: 'm2', classId: 'c2', className: 'HIIT Blast', trainer: 'Mia', date: '2025-12-25T10:30:00.000Z', location: 'Studio 1' }
];

// Flat schedule rows that mimic the database `timetable` view
const schedule = [
  { day: 'Monday', time: '08:00', name: 'Yoga Flow', trainer_name: 'Alex' },
  { day: 'Monday', time: '18:00', name: 'Strength 101', trainer_name: 'Sam' },
  { day: 'Tuesday', time: '10:30', name: 'HIIT Blast', trainer_name: 'Mia' },
  { day: 'Wednesday', time: '07:00', name: 'Cardio Mix', trainer_name: null },
  { day: 'Wednesday', time: '19:00', name: 'Powerlifting', trainer_name: null }
];

const memberships = [
  { id: 'p1', name: 'Basic', price: '€19/mo', perks: ['Access to gym','1 class/week'] },
  { id: 'p2', name: 'All-inclusive', price: '€49/mo', perks: ['All classes','Personal training discount'] }
];

module.exports = { classes, trainers, members, bookings, schedule, memberships };
