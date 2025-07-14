const Complaint = require("../models/complaintModel");
const User = require("../models/userModel");
exports.submitComplaint = async (req, res) => {
  try {
    //trim leading 0 from phone number
    if (req.body.phone && req.body.phone.startsWith("0")) {
      req.body.phone = req.body.phone.substring(1);
    }
    const {
        complaintId, // Unique identifier for the complaint 
      fullName,
      email,
      phone,
      address,
      title,
      description,
      category,
      department,
      urgency,
    } = req.body;

    const images = req.files?.map(file => file.path) || [];

    const complaint = new Complaint({
      complaintId,
      fullName,
      email,
      phone,
      address,
      title,
      description,
      category,
      department,
      urgency,
      images,
    });

    await complaint.save();
    res.status(201).json({ message: "Complaint submitted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit complaint." });
  }
};

exports.trackComplaint = async (req, res) => {
  const { complaintId, phone } = req.query;

  if (!complaintId && !phone) {
    return res.status(400).json({ message: "Please provide complaintId or phone." });
  }

  try {
    let complaint;

    // Case 1: Both provided → match both
    if (complaintId && phone) {
      complaint = await Complaint.findOne({ complaintId, phone });
    }
    // Case 2: Only one provided → match either
    else if (complaintId) {
      complaint = await Complaint.findOne({ complaintId });
    } else if (phone) {
      complaint = await Complaint.findOne({ phone });
    }

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found." });
    }

    console.log("Complaint found:", complaint);
    return res.status(200).json(complaint);

  } catch (error) {
    console.error("Error in trackComplaint:", error);
    return res.status(500).json({ message: "Server error while tracking complaint." });
  }
};

// GET /api/complaints/stats
exports.getComplaintStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: "Pending" });
    const inProgress = await Complaint.countDocuments({ status: "In Progress" });
    const resolved = await Complaint.countDocuments({ status: "Resolved" });

    res.status(200).json({
      totalComplaints: total,
      pending,
      inProgress,
      resolved,
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ message: "Failed to fetch stats." });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.status(200).json(complaints);
  } catch (err) {
    console.error("Error fetching complaints:", err);
    res.status(500).json({ message: "Failed to fetch complaints." });
  }
};
exports.assignWorker = async (req, res) => {
  const { id } = req.params;
  const { assignedTo } = req.body;

  console.log("Assigning worker to complaint:", id, assignedTo);

  try {
    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { assignedTo, status: "In Progress" }, // Set status if needed
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // ✅ Increment active complaints and push assigned complaint ID
    if (assignedTo && assignedTo.workerId) {
      await User.findByIdAndUpdate(
        assignedTo.workerId,
        {
          $inc: { activeComplaints: 1 },
          $push: { assignedComplaints: complaint._id }, // Add this line
        }
      );
    }

    res.status(200).json({ message: "Worker assigned", complaint });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getComplaintsForUser = async (req, res) => {
  const { userId } = req.params;
  console.log("Fetching complaints for user:", userId);

  try {
    const user = await User.findById(userId).populate({
      path: "assignedComplaints",
      options: { sort: { createdAt: -1 } }, // sort complaints by latest
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "worker") {
      return res.status(400).json({ message: "User is not a worker" });
    }

    const complaints = user.assignedComplaints || [];

    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error fetching complaints for user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.resolveComplaint = async (req, res) => {
  const { id } = req.params; // this is the complaintId (not _id)
  console.log("Resolving complaint:", id);

  try {
    const complaint = await Complaint.findOneAndUpdate(
      { complaintId: id }, // 🔍 match by complaintId
      { status: "Resolved", resolvedAt: new Date() },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Decrement active complaints for the assigned worker
    if (complaint.assignedTo?.workerId) {
      await User.findByIdAndUpdate(
        complaint.assignedTo.workerId,
        { $inc: { activeComplaints: -1, resolvedComplaints: 1 } } // ✅ also increment resolved count
      );
    }

    res.status(200).json({ message: "Complaint resolved", complaint });
  } catch (error) {
    console.error("Error resolving complaint:", error);
    res.status(500).json({ message: "Server error" });
  }
};
