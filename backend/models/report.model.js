import mongoose, { Schema } from "mongoose";

const reportSchema = new Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },
    history: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicalHistory"
    },
    reportType: {
        type: String,
        required: true,
        enum: ["Blood Test", "X-Ray", "MRI", "CT Scan", "Ultrasound", "ECG", "Other"]
    },
    reportDate: {
        type: Date,
        required: true
    },
    results: {
        type: String
    },
    findings: {
        type: String
    },
    fileUrl: {
        type: String, // URL or path to the report file
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor"
    },
    hospital: {
        type: String
    },
    additionalNotes: {
        type: String
    }
}, { timestamps: true });

export const Report = mongoose.model("Report", reportSchema);

// Let me know if you want me to add anything or link it differently! 🚀
