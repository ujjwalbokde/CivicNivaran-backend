const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        match: /^\d{10}$/
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    department: {
        type: String
    },
    role: {
        type: String,
        enum: ['citizen', 'worker', 'officer'],
        default: 'citizen'
    },
    activeComplaints: {
        type: Number,
        default: 0
    },
    resolvedComplaints: {
        type: Number,
        default: 0
    },
    assignedComplaints: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint',
    },]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;