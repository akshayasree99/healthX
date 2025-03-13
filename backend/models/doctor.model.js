import { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const doctorSchema=new Schema(
    {
        username:{
            type:String,
            required:true,
            minlength:3,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        fullname:{
            type:String,
            required:true,
            minlength:3,
            index:true,
            lowercase:true,
            trim:true,
        },
        sex:{
            type:String,
            required:true,
            trim:true,
            lowercase:true,
            enum: ['Male', 'Female', 'Other']
        },
        dateOfBirth: {
            type: Date,
            required: true
        },
        address: {
            street: { type: String },
            city: { type: String },
            state: { type: String },
            postalCode: { type: String },
            country: { type: String }
        },
        specialization: {
            type: String,
            required: true
        },
        hospitalAffiliation: {
            type: String
        },
        licenseNumber: {
            type: String,
            required: true,
            unique: true
        },
        qualifications: [{
            degree: { type: String },
            institution: { type: String },
            yearOfCompletion: { type: Number }
        }],
        availability: {
            days: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }],
            timeSlots: [{
                startTime: { type: String },
                endTime: { type: String }
            }]
        },
        email:{
            type: String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        contact:{
            type: Number,
                required: true,
                unique: true,
                validate: {
                    validator: function(v) {
                        return /^\d{10}$/.test(v);    // Validates a 10-digit phone number
                    },
                    message: props => `${props.value} is not a valid phone number!`
                },
                min: 1000000000,
                max: 9999999999,
                trim: true
        },
        review:{
            type:Schema.Types.ObjectId,
            ref:"review",
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        certificates:{
            types:String,
            required:true,
        },
        patients:{
            type:Schema.Types.ObjectId,
            ref:"patient",
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        rating:{
            type:Number,
            required:true,
            max:5,
            min:1,
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamp:true
    }
)


export const doctor=mongoose.model("Doctor",doctorSchema);