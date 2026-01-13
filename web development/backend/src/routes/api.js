const express = require('express');
const pool = require('../config/database');
const { generateToken, authMiddleware } = require('../middleware/auth');
const membersController = require('../controllers/membersController');
const classesController = require('../controllers/classesController');
const trainersController = require('../controllers/trainersController');
const authController = require('../controllers/authController');
const registrationsController = require('../controllers/registrationsController');
const bookingsController = require('../controllers/bookingsController');
const scheduleController = require('../controllers/scheduleController');
const membershipsController = require('../controllers/membershipsController');
const miscController = require('../controllers/miscController');
const bcrypt = require('bcryptjs');
const { requireFields, requireNonEmptyBody } = require('../middleware/validation');
const validationResultHandler = require('../middleware/validationResult');
const { authValidator, membersValidator, registrationValidator } = require('../utils/validators');
const router = express.Router();

// Helper to validate table names (only letters, numbers, underscore)
function validTableName(name) {
  return /^[A-Za-z0-9_]+$/.test(name);
}

router.get('/table/:name', miscController.getTable);

// members endpoints (refactored to controller/service)
router.get('/members', membersController.getMembers);

router.get('/trainers', trainersController.getTrainers);
router.get('/classes', classesController.getClasses);
// schedule (public)
router.get('/schedule', scheduleController.getSchedule);
// memberships
router.get('/memberships', membershipsController.getMemberships);
// bookings (profile) - protected
router.get('/bookings', authMiddleware, bookingsController.getBookings);
router.delete('/bookings/:id', authMiddleware, bookingsController.deleteBooking);

// Add a member (generic insert) — protected
router.post('/members', authMiddleware, membersValidator, validationResultHandler, membersController.createMember);

// Auth endpoints
router.post('/auth/register', authValidator, validationResultHandler, authController.register);
router.post('/auth/login', authValidator, validationResultHandler, authController.login);

// Register a member to a class - attempts to insert into `registrations` or `class_registrations` (protected)
// Log body for debugging registration payloads, then validate
router.post('/register', authMiddleware, (req,res,next)=>{ console.log('[route /register] body:', JSON.stringify(req.body)); next(); }, registrationValidator, validationResultHandler, registrationsController.register);

module.exports = router;
