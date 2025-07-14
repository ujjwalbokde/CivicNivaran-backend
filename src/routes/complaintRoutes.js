const express = require("express");
const router = express.Router();
const complaintController = require("../controllers/complaintController");
const multer = require("multer");
const path = require("path");

// Multer Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Route
router.post("/submit", upload.array("images", 5), complaintController.submitComplaint);
router.get("/track", complaintController.trackComplaint);
router.get("/stats", complaintController.getComplaintStats);
router.get("/all", complaintController.getAllComplaints);
router.post("/assign/:id", complaintController.assignWorker);
router.get("/user/:userId", complaintController.getComplaintsForUser);
router.post("/resolve/:id", complaintController.resolveComplaint);
module.exports = router;
