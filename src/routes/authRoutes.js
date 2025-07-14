const express = require('express');
const { register, login, logout, getUserProfile, saveUserProfile,getAllWorkerProfile } = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", verifyToken, saveUserProfile);
router.get("/workers", getAllWorkerProfile);
module.exports = router;