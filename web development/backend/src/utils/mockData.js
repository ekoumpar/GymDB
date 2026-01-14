// Simple mock data used when the database is unavailable

// Workouts
const classes = [
  {name: 'Weights', duration: 60, intensity: 6 },
  {name: 'Pilates', duration: 45, intensity: 10 },
  {name: 'Yoga', duration: 50, intensity: 8 },
  {name: 'TRX', duration: 30, intensity: 9 },
  {name: 'Personal-Training', duration: 60, intensity: 7 }
];

// Trainers
const trainers = [
  { id: '2', name: 'Nikos Pappadopoulos' },
  { id: '10', name: 'Alexis Papadakis' },
  { id: '3', name: 'Katerina Gerakari' }
];

// Members
const members = [
  { id: '48', name: 'Maria Pappa', password: 'Maria123', dateOfBirth: '1990-05-12', sex: 'F', phoneNumber: '+30 6930234567', height: 165, weight: 60, age: 33 },
  { id: '100', name: 'George Kontos', password: 'George123', dateOfBirth: '1985-09-02', sex: 'M', phoneNumber: '+30 6937653251', height: 180, weight: 82, age: 38 },
  { id: '150', name: 'Eleni Stavrou', password: 'Eleni123', dateOfBirth: '1995-11-23', sex: 'F', phoneNumber: '+30 6941239876', height: 170, weight: 68, age: 28 }
];

// Mock bookings linked to member ids and class ids
const bookings = [
  { id: '5ga', memberId: '48', className: 'Weights', trainer: 'Nikos Pappadopoulos', date: '2025-12-24T08:00:00.000Z', location: 'Main Hall' },
  { id: '7h9', memberId: '48', className: 'Pilates', trainer: 'Nikos Pappadopoulos', date: '2025-12-24T18:00:00.000Z', location: 'Room B' },
  { id: '7hw', memberId: '100', className: 'Yoga', trainer: 'Alexis Papadakis', date: '2025-12-25T10:30:00.000Z', location: 'Studio 1' }
];

// Flat schedule rows that mimic the database `timetable` view
const schedule = [
  { day: 'Monday', time: '08:00', name: 'Weights', trainer_name: 'Nikos Pappadopoulos' },
  { day: 'Monday', time: '18:00', name: 'Pilates', trainer_name: 'Nikos Pappadopoulos' },
  { day: 'Tuesday', time: '10:30', name: 'Yoga', trainer_name: 'Alexis Papadakis' },
  { day: 'Wednesday', time: '07:00', name: 'Personal-Training', trainer_name: null },
  { day: 'Wednesday', time: '19:00', name: 'TRX', trainer_name: 'Katerina Gerakari' },
];

// Subscriptions (match DB `subscription` rows: name, duration, category, price)
const memberships = [
  { name: 'BlackFriday', duration: 1, category: 'Basic', price: '€200', perks: [] },
  { name: 'BlackFriday', duration: 3, category: 'All-inclusive', price: '€250', perks: [] },
  { name: 'BlackFriday', duration: 24, category: 'Basic', price: '€500', perks: [] },
  { name: 'Mega-Deal', duration: 6, category: 'All-inclusive', price: '€150', perks: [] },
  { name: 'Mega-Deal', duration: 12, category: 'All-inclusive', price: '€200', perks: [] }
];

module.exports = { classes, trainers, members, bookings, schedule, memberships };
