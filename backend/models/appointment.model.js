import mongoose, { Schema } from "mongoose";

const appointmentSchema = new Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    appointmentType: {
        type: String,
        enum: ["In-person", "Teleconsultation", "Home Visit"],
        required: true
    },
    status: {
        type: String,
        enum: ["Scheduled", "Completed", "Canceled", "Rescheduled"],
        default: "Scheduled"
    },
    reasonForVisit: {
        type: String
    },
    symptoms: [{
        type: String
    }],
    doctorNotes: {
        type: String,
        required:true,
    },
    prescription: {
        type: String,
        required:true,
    },
    fee: {
        type: Number,
        required:true,
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending"
    },
    invoice: {
        type: String,
        required:true,
    },
    notificationStatus: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const Appointment = mongoose.model("Appointment", appointmentSchema);

// Let me know if you want me to tweak this or add anything else! 🚀
