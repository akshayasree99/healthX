import React, { useState } from 'react';

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
                <h2 className="text-2xl font-bold mb-6">Patient Registration Form</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <h3 className="col-span-2 text-lg font-semibold">Personal Information</h3>
                    <label htmlFor="firstName">First Name</label>
                    <input id="firstName" type="text" name="firstName" placeholder="First Name" onChange={handleChange} className="p-2 border rounded" required />
                    <label htmlFor="lastName">Last Name</label>
                    <input id="lastName" type="text" name="lastName" placeholder="Last Name" onChange={handleChange} className="p-2 border rounded" required />
                    <label htmlFor="dob">Date of Birth (dd-mm-yyyy)</label>
                    <input id="dob" type="date" name="dob" onChange={handleChange} className="p-2 border rounded" required />
                    <label htmlFor="gender">Select Gender</label>
                    <select id="gender" name="gender" onChange={handleChange} className="p-2 border rounded" required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" name="email" placeholder="Email" onChange={handleChange} className="p-2 border rounded" required />
                    <label htmlFor="phone">Phone Number</label>
                    <input id="phone" type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} className="p-2 border rounded" required />
                    <label htmlFor="address">Address</label>
                    <input id="address" type="text" name="address" placeholder="Address" onChange={handleChange} className="p-2 border rounded" />
                    <label htmlFor="nationality">Nationality</label>
                    <input id="nationality" type="text" name="nationality" placeholder="Nationality" onChange={handleChange} className="p-2 border rounded" />

                    <h3 className="col-span-2 text-lg font-semibold">Health Details</h3>
                    <label htmlFor="bloodGroup">Blood Group</label>
                    <input id="bloodGroup" type="text" name="bloodGroup" placeholder="Blood Group" onChange={handleChange} className="p-2 border rounded" />
                    <label htmlFor="height">Height (cm)</label>
                    <input id="height" type="text" name="height" placeholder="Height (cm)" onChange={handleChange} className="p-2 border rounded" />
                    <label htmlFor="weight">Weight (kg)</label>
                    <input id="weight" type="text" name="weight" placeholder="Weight (kg)" onChange={handleChange} className="p-2 border rounded" />
                    <label htmlFor="allergies">Known Allergies</label>
                    <input id="allergies" type="text" name="allergies" placeholder="Known Allergies" onChange={handleChange} className="p-2 border rounded" />
                    <label htmlFor="conditions">Existing Conditions</label>
                    <input id="conditions" type="text" name="conditions" placeholder="Existing Conditions" onChange={handleChange} className="p-2 border rounded" />
                    <label htmlFor="medications">Current Medications</label>
                    <input id="medications" type="text" name="medications" placeholder="Current Medications" onChange={handleChange} className="p-2 border rounded" />
                    <label htmlFor="familyHistory">Family Medical History</label>
                    <input id="familyHistory" type="text" name="familyHistory" placeholder="Family Medical History" onChange={handleChange} className="p-2 border rounded" />

                    <h3 className="col-span-2 text-lg font-semibold">Emergency Contact</h3>
                    <label htmlFor="emergencyContactName">Emergency Contact Name</label>
                    <input id="emergencyContactName" type="text" name="emergencyContactName" placeholder="Contact Name" onChange={handleChange} className="p-2 border rounded" />
                    <label htmlFor="emergencyContactRelation">Relation</label>
                    <input id="emergencyContactRelation" type="text" name="emergencyContactRelation" placeholder="Relation" onChange={handleChange} className="p-2 border rounded" />
                    <label htmlFor="emergencyContactPhone">Phone Number</label>
                    <input id="emergencyContactPhone" type="tel" name="emergencyContactPhone" placeholder="Phone Number" onChange={handleChange} className="p-2 border rounded" />
                    <label htmlFor="emergencyContactEmail">Email</label>
                    <input id="emergencyContactEmail" type="email" name="emergencyContactEmail" placeholder="Email" onChange={handleChange} className="p-2 border rounded" />

                    <h3 className="col-span-2 text-lg font-semibold">Preferences</h3>
                    <label htmlFor="lifestyle">Lifestyle Habits</label>
                    <input id="lifestyle" type="text" name="lifestyle" placeholder="Lifestyle Habits" onChange={handleChange} className="p-2 border rounded" />
                    <label htmlFor="language">Preferred Language</label>
                    <input id="language" type="text" name="language" placeholder="Preferred Language" onChange={handleChange} className="p-2 border rounded" />
                    <label htmlFor="communication">Communication Preferences</label>
                    <input id="communication" type="text" name="communication" placeholder="Communication Preferences" onChange={handleChange} className="p-2 border rounded" />

                    <button type="submit" className="col-span-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Register</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterP;
