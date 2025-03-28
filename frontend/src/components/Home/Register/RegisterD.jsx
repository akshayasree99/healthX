import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../../supabase.js'; // Import Supabase client
import { ArrowLeft } from 'lucide-react';

const RegisterD = () => {
    const { id: doctorId } = useParams();  // Get doctor_id from URL
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: '',
        dob: '',
        gender: '',
        phone_number: '',
        email: '',
        address: '',
        nationality: '',
        language: '',
        license_number: '',
        license_authority: '',
        license_expiry: '',
        specialization: '',
        experience: '',
        fees: '',
        start_hours: '', // New field
        end_hours: '',   // New field
        available_date: [], // New field (array for multiple days)
        medical_school: '',
        graduation_year: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch doctor data when the component mounts
    useEffect(() => {
        const fetchDoctor = async () => {
            const { data, error } = await supabase
                .from('doctor')
                .select('*')
                .eq('doctor_id', doctorId)
                .single(); // Get a single row

            if (error) {
                console.error('Error fetching doctor:', error);
                setError('Failed to fetch doctor data.');
            } else {
                setFormData({
                    ...data,
                    available_date: data.available_date || [] // Ensure available_date is an array
                }); // Set fetched data in the form
            }
        };

        fetchDoctor();
    }, [doctorId]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
    
        setFormData((prevData) => {
            let updatedData = { ...prevData, [name]: value };
    
            // Convert time to minutes for comparison
            const toMinutes = (time) => {
                const [hours, minutes] = time.split(":").map(Number);
                return hours * 60 + minutes;
            };
    
            if (name === "start_hours" && updatedData.end_hours) {
                const startTime = toMinutes(value);
                const endTime = toMinutes(updatedData.end_hours);
    
                if (startTime >= endTime) {
                    alert("Start time must be earlier than End time.");
                    return prevData; // Prevent updating
                }
    
                if (endTime - startTime < 120) {
                    alert("The gap between Start and End time must be at least 2 hours.");
                    return prevData; // Prevent updating
                }
            }
    
            if (name === "end_hours" && updatedData.start_hours) {
                const startTime = toMinutes(updatedData.start_hours);
                const endTime = toMinutes(value);
    
                if (endTime <= startTime) {
                    alert("End time must be later than Start time.");
                    return prevData; // Prevent updating
                }
    
                if (endTime - startTime < 120) {
                    alert("The gap between Start and End time must be at least 2 hours.");
                    return prevData; // Prevent updating
                }
            }
    
            return updatedData; // Update state if valid
        });
    };
    

    // Handle checkbox changes for available_date
    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prevData) => {
            const updatedDates = checked
                ? [...prevData.available_date, value] // Add the day if checked
                : prevData.available_date.filter((day) => day !== value); // Remove the day if unchecked

            return { ...prevData, available_date: updatedDates };
        });
        console.log(available_date);
    };

    // Update doctor data in Supabase
    const handleSubmit = async (e) => {
        if (!formData.start_hours || !formData.end_hours) {
            alert("Start Hours and End Hours are required!");
            return;
        }
    
        if (!formData.available_date || formData.available_date.length === 0) {
            alert("Please select at least one available day!");
            return;
        }
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Send all form data, including empty fields
            const { error } = await supabase
                .from('doctor')
                .update(formData) // Send the entire formData object
                .eq('doctor_id', doctorId); // Update where doctor_id matches

            if (error) {
                throw error;
            }

            alert('Doctor details updated successfully!');
            navigate(`/doctor/profileD/${doctorId}`); // Redirect after update
        } catch (error) {
            console.error('Error updating doctor:', error);
            setError('Failed to update doctor details.');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(`/doctor/profileD/${doctorId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={handleBack}
                    className="mb-6 flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Profile
                </button>
                
                <div className="bg-white shadow-xl rounded-2xl p-8">
                    <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center">Doctor Registration</h2>
                    
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Personal Information Section */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-indigo-600 border-b border-indigo-100 pb-2">
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        value={formData.first_name}
                                        placeholder="Full Name (as per official ID)"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                    <input
                                        type="date"
                                        id="dob"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone_number"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        placeholder="Enter phone number"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        placeholder="Enter email address"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        placeholder="Enter your address"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">Nationality</label>
                                    <input
                                        type="text"
                                        id="nationality"
                                        name="nationality"
                                        value={formData.nationality}
                                        placeholder="Enter nationality"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="language" className="block text-sm font-medium text-gray-700">Languages Spoken</label>
                                    <input
                                        type="text"
                                        id="language"
                                        name="language"
                                        value={formData.language}
                                        placeholder="Enter languages (comma separated)"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Professional Details Section */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-indigo-600 border-b border-indigo-100 pb-2">
                                Professional Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="license_number" className="block text-sm font-medium text-gray-700">License Number</label>
                                    <input
                                        type="text"
                                        id="license_number"
                                        name="license_number"
                                        value={formData.license_number}
                                        placeholder="Enter medical license number"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="license_authority" className="block text-sm font-medium text-gray-700">License Authority</label>
                                    <input
                                        type="text"
                                        id="license_authority"
                                        name="license_authority"
                                        value={formData.license_authority}
                                        placeholder="Enter licensing authority"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="license_expiry" className="block text-sm font-medium text-gray-700">License Expiry Date</label>
                                    <input
                                        type="date"
                                        id="license_expiry"
                                        name="license_expiry"
                                        value={formData.license_expiry}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">Specialization</label>
                                    <input
                                        type="text"
                                        id="specialization"
                                        name="specialization"
                                        value={formData.specialization}
                                        placeholder="Enter your specialization"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Years of Experience</label>
                                    <input
                                        type="number"
                                        id="experience"
                                        name="experience"
                                        value={formData.experience}
                                        placeholder="Enter years of experience"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="fees" className="block text-sm font-medium text-gray-700">Consultation Fees</label>
                                    <input
                                        type="number"
                                        id="fees"
                                        name="fees"
                                        value={formData.fees}
                                        placeholder="Enter consultation fees"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                    />
                                </div>

                                {/* New fields for start_hours, end_hours, and available_date */}
                                <div className="space-y-2">
                                    <label htmlFor="start_hours" className="block text-sm font-medium text-gray-700">Start Hours</label>
                                    <input
                                        type="time"
                                        id="start_hours"
                                        name="start_hours"
                                        required
                                        value={formData.start_hours}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="end_hours" className="block text-sm font-medium text-gray-700">End Hours</label>
                                    <input
                                        type="time"
                                        id="end_hours"
                                        name="end_hours"
                                        required
                                        value={formData.end_hours}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                    />
                                </div>

                                <div className="space-y-2 col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Available Days</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                            <label key={day} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    name="available_date"
                                                    value={day}
                                                    required
                                                    checked={formData.available_date.includes(day)}
                                                    onChange={handleCheckboxChange}
                                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                />
                                                <span className="text-sm text-gray-700">{day}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Education & Certifications Section */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-indigo-600 border-b border-indigo-100 pb-2">
                                Education & Certifications
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="medical_school" className="block text-sm font-medium text-gray-700">Medical School</label>
                                    <input
                                        type="text"
                                        id="medical_school"
                                        name="medical_school"
                                        value={formData.medical_school}
                                        placeholder="Enter medical school name"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="graduation_year" className="block text-sm font-medium text-gray-700">Graduation Year</label>
                                    <input
                                        type="number"
                                        id="graduation_year"
                                        name="graduation_year"
                                        value={formData.graduation_year}
                                        placeholder="Enter graduation year"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                            >
                                {loading ? 'Updating...' : 'Complete Registration'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterD;