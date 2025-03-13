import { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const patientSchema=new Schema(
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
        email:{
            type: String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
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
        emergencyContact: {
            name: {
                type: String,
                required: true,
                trim: true,
                minlength: 3,                         // Minimum length for the name
                maxlength: 40                         // Maximum length for the name
            },
            relation: { 
                type: String ,
                required: true,
                trim: true,
                maxlength: 15,
            },
            number: {
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
            }
        },        
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        medHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "medHist"
            }
        ],
        reports:[
            {
                type:Schema.Types.ObjectId,
                ref:"Reports"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        currentMedications: [String],
        allergies: [String],
        bloodType: { 
            type: String, 
            enum: ['A', 'B', 'AB', 'O'] 
        },
        docAssigned:{
            type:Schema.Types.ObjectId,
            ref:"Doctors",
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamp:true
    }
);

patientSchema.pre("save",async function(next)
{
    if(!this.isModified("password"))
    {
        return next();
    }
    this.password= await bcrypt.hash(this.password,10);
    next();
}
)

patientSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(this.password,password);
}

patient.methods.generateAcessTokens=function(){
    return jwt.sign(
        {
            _id:this.id,
            email:this.email,
            username:this.username,
            fullname:this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACESS_TOKEN_EXPIRY,
        }
    )
}

patient.methods.generateRefreshTokens=function(){
    return jwt.sign(
        {
            _id:this.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}
export const patient=mongoose.model("Patient",patientSchema);