const { body, check } = require('express-validator');

// auth validators
const authValidator = [
  body('username').isString().notEmpty().withMessage('username required'),
  body('password').isString().isLength({ min: 6 }).withMessage('password must be >=6 chars')
];

// members: require body object with at least one safe field
const membersValidator = [
  check().custom(value => {
    if(typeof value !== 'object' || Array.isArray(value) || Object.keys(value||{}).length === 0) throw new Error('Request body must be an object with at least one field');
    const keys = Object.keys(value||{});
    const hasValid = keys.some(k => /^[A-Za-z0-9_]+$/.test(k));
    if(!hasValid) throw new Error('No valid fields provided');
    return true;
  })
];

// registration validator: require member_id and one of reservation_id OR class_id OR (workout+day+time)
const registrationValidator = [
  body('member_id').notEmpty().withMessage('member_id required'),
  check().custom((_, { req }) => {
    const body = req.body || {};
    if(body && (body.reservation_id || body.class_id)) return true;
    if(body && body.workout && body.day && body.time) return true;
    return Promise.reject('Provide reservation_id OR class_id OR workout+day+time');
  })
];

module.exports = { authValidator, membersValidator, registrationValidator };
