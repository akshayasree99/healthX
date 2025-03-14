import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterP = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        gender: '',
        email: '',
        phone: '',
        address: '',
        nationality: '',
        bloodGroup: '',
        height: '',
        weight: '',
        allergies: '',
        conditions: '',
        medications: '',
        familyHistory: '',
        emergencyContactName: '',
        emergencyContactRelation: '',
        emergencyContactPhone: '',
        emergencyContactEmail: '',
        lifestyle: '',
        language: '',
        communication: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const navigate = useNavigate(); // Initialize navigate function

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);

        // Simulating form submission success
        setTimeout(() => {
            navigate('/patient/dashboard'); // Navigate to patient dashboard
        }, 500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-teal-200 to-blue-300 flex items-center justify-center py-6">
            <div className="bg-white bg-opacity-80 backdrop-blur-lg shadow-lg p-8 rounded-lg max-w-4xl w-full">
                <h2 className="text-3xl font-semibold text-gray-700 text-center mb-6">Patient Registration Form</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <h3 className="col-span-2 text-xl font-semibold text-gray-1000">Personal Information</h3>
                    <label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</label>
                    <input id="firstName" type="text" name="firstName" placeholder="First Name" onChange={handleChange} className="p-2 border rounded-md border-gray-300" required />

                    <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</label>
                    <input id="lastName" type="text" name="lastName" placeholder="Last Name" onChange={handleChange} className="p-2 border rounded-md border-gray-300" required />

                    <label htmlFor="dob" className="text-sm font-medium text-gray-700">Date of Birth</label>
                    <input id="dob" type="date" name="dob" onChange={handleChange} className="p-2 border rounded-md border-gray-300" required />

                    <label htmlFor="gender" className="text-sm font-medium text-gray-700">Select Gender</label>
                    <select id="gender" name="gender" onChange={handleChange} className="p-2 border rounded-md border-gray-300" required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>

                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
                    <input id="email" type="email" name="email" placeholder="Email" onChange={handleChange} className="p-2 border rounded-md border-gray-300" required />

                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
                    <input id="phone" type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} className="p-2 border rounded-md border-gray-300" required />

                    <label htmlFor="address" className="text-sm font-medium text-gray-700">Address</label>
                    <input id="address" type="text" name="address" placeholder="Address" onChange={handleChange} className="p-2 border rounded-md border-gray-300" />

                    <label htmlFor="nationality" className="text-sm font-medium text-gray-700">Nationality</label>
                    <input id="nationality" type="text" name="nationality" placeholder="Nationality" onChange={handleChange} className="p-2 border rounded-md border-gray-300" />

                    <h3 className="col-span-2 text-xl font-semibold text-gray-1000">Health Details</h3>

                    <label htmlFor="bloodGroup" className="text-sm font-medium text-gray-700">Blood Group</label>
                    <input id="bloodGroup" type="text" name="bloodGroup" placeholder="Blood Group" onChange={handleChange} className="p-2 border rounded-md border-gray-300" />

                    <label htmlFor="height" className="text-sm font-medium text-gray-700">Height (cm)</label>
                    <input id="height" type="text" name="height" placeholder="Height (cm)" onChange={handleChange} className="p-2 border rounded-md border-gray-300" />

                    <label htmlFor="weight" className="text-sm font-medium text-gray-700">Weight (kg)</label>
                    <input id="weight" type="text" name="weight" placeholder="Weight (kg)" onChange={handleChange} className="p-2 border rounded-md border-gray-300" />

                    <label htmlFor="allergies" className="text-sm font-medium text-gray-700">Known Allergies</label>
                    <input id="allergies" type="text" name="allergies" placeholder="Known Allergies" onChange={handleChange} className="p-2 border rounded-md border-gray-300" />

                    <label htmlFor="conditions" className="text-sm font-medium text-gray-700">Existing Conditions</label>
                    <input id="conditions" type="text" name="conditions" placeholder="Existing Conditions" onChange={handleChange} className="p-2 border rounded-md border-gray-300" />

                    <label htmlFor="medications" className="text-sm font-medium text-gray-700">Current Medications</label>
                    <input id="medications" type="text" name="medications" placeholder="Current Medications" onChange={handleChange} className="p-2 border rounded-md border-gray-300" />

                    <label htmlFor="familyHistory" className="text-sm font-medium text-gray-700">Family Medical History</label>
                    <input id="familyHistory" type="text" name="familyHistory" placeholder="Family Medical History" onChange={handleChange} className="p-2 border rounded-md border-gray-300" />

                    <h3 className="col-span-2 text-xl font-semibold text-gray-1000">Emergency Contact</h3>

                    <label htmlFor="emergencyContactName" className="text-sm font-medium text-gray-700">Emergency Contact Name</label>
                    <input id="emergencyContactName" type="text" name="emergencyContactName" placeholder="Contact Name" onChange={handleChange} className="p-2 border rounded-md border-gray-300" />

                    <label htmlFor="emergencyContactRelation" className="text-sm font-medium text-gray-700">Relation</label>
                    <input id="emergencyContactRelation" type="text" name="emergencyContactRelation" placeholder="Relation" onChange={handleChange} className="p-2 border rounded-md border-gray-300" />

                    <label htmlFor="emergencyContactPhone" className="text-sm font-medium text-gray-700">Phone Number</label>
                    <input id="emergencyContactPhone" type="tel" name="emergencyContactPhone" placeholder="Phone Number" onChange={handleChange} className="p-2 border rounded-md border-gray-300" />

                    <label htmlFor="emergencyContactEmail" className="text-sm font-medium text-gray-700">Email</label>
                    <input id="emergencyContactEmail" type="email" name="emergencyContactEmail" placeholder="Email" onChange={handleChange} className="p-2 border rounded-md border-gray-300" />

                    <h3 className="col-span-2 text-xl font-semibold text-gray-1000">Preferences</h3>

                    <label htmlFor="lifestyle" className="text-sm font-medium text-gray-700">Lifestyle Habits</label>
                    <input id="lifestyle" type="text" name="lifestyle" placeholder="Lifestyle Habits" onChange={handleChange} className="p-2 border rounded-md border-gray-300" />

                    <label htmlFor="language" className="text-sm font-medium text-gray-700">Preferred Language</label>
                    <input id="language" type="text" name="language" placeholder="Preferred Language" onChange={handleChange} className="p-2 border rounded-md border-gray-300" />

                    <label htmlFor="communication" className="text-sm font-medium text-gray-700">Communication Preferences</label>
                    <input id="communication" type="text" name="communication" placeholder="Communication Preferences" onChange={handleChange} className="p-2 border rounded-md border-gray-300" />

                    <button type="submit" className="col-span-2 bg-teal-500 text-white p-2 rounded-md hover:bg-teal-600 transition-all">Register</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterP;
