import React, { useState } from 'react';

const RegisterD = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        gender: '',
        phone: '',
        email: '',
        address: '',
        nationality: '',
        languages: '',
        licenseNumber: '',
        licenseAuthority: '',
        licenseExpiry: '',
        specialization: '',
        subspecialties: '',
        experience: '',
        clinicAffiliation: '',
        practiceAddress: '',
        fees: '',
        availableHours: '',
        medicalSchool: '',
        graduationYear: '',
        postgraduateDegrees: '',
        certifications: '',
        fellowships: '',
        researchLinks: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [passwordError, setPasswordError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setPasswordError('Passwords do not match!');
            setSuccessMessage('');
        } else {
            setPasswordError('');
            setSuccessMessage('Doctor registration form submitted successfully!');
            console.log('Form Data:', formData);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl w-full">
                <h2 className="text-2xl font-bold mb-6">Doctor Registration Form</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <h3 className="col-span-2 text-lg font-semibold">Personal Information</h3>
                    <label>Full Name</label>
                    <input type="text" name="fullName" placeholder="Full Name (as per official ID)" onChange={handleChange} className="p-2 border rounded" required />
                    <label>Date of Birth</label>
                    <input type="date" name="dob" onChange={handleChange} className="p-2 border rounded" required />
                    <label>Gender</label>
                    <select name="gender" onChange={handleChange} className="p-2 border rounded" required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <label>Phone Number</label>
                    <input type="tel" name="phone" placeholder="Phone Number (with country code)" onChange={handleChange} className="p-2 border rounded" required />
                    <label>Email Address</label>
                    <input type="email" name="email" placeholder="Email Address" onChange={handleChange} className="p-2 border rounded" required />
                    <label>Residential Address</label>
                    <input type="text" name="address" placeholder="Residential Address" onChange={handleChange} className="p-2 border rounded" />
                    <label>Nationality</label>
                    <input type="text" name="nationality" placeholder="Nationality" onChange={handleChange} className="p-2 border rounded" />
                    <label>Languages Spoken</label>
                    <input type="text" name="languages" placeholder="Languages Spoken (comma-separated)" onChange={handleChange} className="p-2 border rounded" />

                    <h3 className="col-span-2 text-lg font-semibold">Professional Details</h3>
                    <label>Medical License Number</label>
                    <input type="text" name="licenseNumber" placeholder="Medical License Number (as issued by the authority)" onChange={handleChange} className="p-2 border rounded" required />
                    <label>License Issuing Authority</label>
                    <input type="text" name="licenseAuthority" placeholder="License Issuing Authority" onChange={handleChange} className="p-2 border rounded" required />
                    <label>License Expiry Date</label>
                    <input type="date" name="licenseExpiry" onChange={handleChange} className="p-2 border rounded" />
                    <label>Primary Specialization</label>
                    <input type="text" name="specialization" placeholder="Primary Specialization" onChange={handleChange} className="p-2 border rounded" />
                    <label>Subspecialties</label>
                    <input type="text" name="subspecialties" placeholder="Subspecialties (if any)" onChange={handleChange} className="p-2 border rounded" />
                    <label>Years of Experience</label>
                    <input type="text" name="experience" placeholder="Years of Experience" onChange={handleChange} className="p-2 border rounded" />
                    <label>Clinic/Hospital Affiliation</label>
                    <input type="text" name="clinicAffiliation" placeholder="Clinic/Hospital Affiliation (if any)" onChange={handleChange} className="p-2 border rounded" />
                    <label>Practice/Clinic Address</label>
                    <input type="text" name="practiceAddress" placeholder="Practice/Clinic Address" onChange={handleChange} className="p-2 border rounded" />
                    <label>Consultation Fees</label>
                    <input type="text" name="fees" placeholder="Consultation Fees (in local currency)" onChange={handleChange} className="p-2 border rounded" />
                    <label>Available Hours</label>
                    <input type="text" name="availableHours" placeholder="Available Hours (e.g., 9 AM - 5 PM)" onChange={handleChange} className="p-2 border rounded" />

                    <h3 className="col-span-2 text-lg font-semibold">Education & Certifications</h3>
                    <label>Medical School</label>
                    <input type="text" name="medicalSchool" placeholder="Medical School" onChange={handleChange} className="p-2 border rounded" />
                    <label>Graduation Year</label>
                    <input type="text" name="graduationYear" placeholder="Graduation Year" onChange={handleChange} className="p-2 border rounded" />
                    <label>Postgraduate Degrees</label>
                    <input type="text" name="postgraduateDegrees" placeholder="Postgraduate Degrees" onChange={handleChange} className="p-2 border rounded" />
                    <label>Certifications</label>
                    <input type="text" name="certifications" placeholder="Certifications" onChange={handleChange} className="p-2 border rounded" />
                    <label>Fellowships/Residencies</label>
                    <input type="text" name="fellowships" placeholder="Fellowships/Residencies" onChange={handleChange} className="p-2 border rounded" />

                    <h3 className="col-span-2 text-lg font-semibold">Account & Security</h3>
                    <label>Username</label>
                    <input type="text" name="username" placeholder="Choose a Username" onChange={handleChange} className="p-2 border rounded" required />
                    <label>Password</label>
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} className="p-2 border rounded" required />
                    <label>Confirm Password</label>
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} className="p-2 border rounded" required />

                    <button type="submit" className="col-span-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Register</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterD;
