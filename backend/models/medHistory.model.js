import mongoose, { Schema } from "mongoose";

const medicalHistorySchema = new Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },
    conditions: [{
        conditionName: { type: String, required: true },
        diagnosisDate: { type: Date, required: true },
        status: { type: String, enum: ["Ongoing", "Resolved", "Chronic"], required: true }
    }],
    medications: [{
        medicationName: { type: String, required: true },
        dosage: { type: String },
        frequency: { type: String },
        startDate: { type: Date },
        endDate: { type: Date }
    }],
    surgeries: [{
        surgeryName: { type: String },
        date: { type: Date },
        hospital: { type: String },
        notes: { type: String }
    }],
    familyHistory: [{
        relation: { type: String },
        condition: { type: String },
        ageAtDiagnosis: { type: Number }
    }],
    notes: {
        type: String
    }
}, { timestamps: true });

export const MedicalHistory = mongoose.model("MedicalHistory", medicalHistorySchema);
