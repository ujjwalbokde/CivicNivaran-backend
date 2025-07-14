const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    complaintId: String, // Unique identifier for the complaint
    fullName: String,
    email: String,
    phone: String,
    address: String,
    title: String,
    description: String,
    category: String,
    department: String,
    urgency: String,
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },
    resolvedAt: Date,
    assignedTo: {
      workerId: mongoose.Schema.Types.ObjectId, // User model
      name: String, // For redundancy/display
    },
    images: [String], // paths of uploaded image files
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
