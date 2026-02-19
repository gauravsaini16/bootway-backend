const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    employeeId: {
        type: String,
        required: true,
        unique: true,
        default: function () {
            // Generate a simple random ID if not provided
            return 'EMP-' + Math.floor(1000 + Math.random() * 9000);
        }
    },
    department: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    dateJoined: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'probation', 'terminated', 'resigned', 'on-leave'],
        default: 'probation'
    },
    salary: {
        amount: { type: Number, default: 0 },
        currency: { type: String, default: 'USD' }
    },
    personalDetails: {
        address: String,
        emergencyContact: {
            name: String,
            phone: String,
            relation: String
        },
        dateOfBirth: Date
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
