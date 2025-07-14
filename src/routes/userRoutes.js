const express = require('express');
const verifyToken = require('../middlewares/authMiddleware'); // Middleware to verify JWT token
const authorizeRoles = require('../middlewares/roleMiddleware'); // Middleware to authorize roles
const router = express.Router();

// Officer-only route
router.get('/admin', verifyToken, authorizeRoles('officer'), (req, res) => {
  res.status(200).json({ message: 'Admin route accessed' });
});

// Worker-only route
router.get('/worker', verifyToken, authorizeRoles('worker'), (req, res) => {
  res.status(200).json({ message: 'Worker route accessed' });
});

// Citizen route — accessible by both citizen and officer
router.get('/', verifyToken, authorizeRoles('citizen', 'officer'), (req, res) => {
  res.status(200).json({ message: 'Citizen route accessed' });
});

module.exports = router;
