import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../supabase.js'; // Import your Supabase client

const BookAppointment = () => {
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState('');
  const [appointmentData, setAppointmentData] = useState({
    doctor_id: null,
    doctor_name: '',
    patient_id: null, // Will be set from auth context
    appointment_type: '',
    date: '',
    time: '',
    reason: '',
    status: 'pending', // Default status
  });

  // Fetch doctors from Supabase on component mount
  useEffect(() => {
    fetchDoctors();
    // Get current user/patient ID from Supabase auth
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Fetch the patient record associated with this auth user
      const { data: patientData, error } = await supabase
        .from('patient')
        .select('id')
        .eq('email', user.email)
        .single();
      
      if (patientData) {
        setAppointmentData(prev => ({ ...prev, patient_id: patientData.id }));
      }
    }
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      // Query the doctor table to get all registered doctors
      const { data, error } = await supabase
        .from('doctor')
        .select(`
          id, 
          first_name, 
          last_name, 
          email,
          license_number,
          doctor_id
        `);

      if (error) throw error;

      // Transform the data to match your UI needs
      const formattedDoctors = data.map(doctor => ({
        id: doctor.id,
        doctorId: doctor.doctor_id,
        name: `${doctor.first_name} ${doctor.last_name}`,
        email: doctor.email,
        licenseNumber: doctor.license_number,
        // You might want to add a default image or fetch from storage
        photo: `/default-doctor.png` 
      }));

      setDoctors(formattedDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);
  
  const handleChange = (field, value) => {
    setAppointmentData({ ...appointmentData, [field]: value });
  };

  const handleDoctorSelect = (doctorId, doctorName) => {
    setAppointmentData({
      ...appointmentData,
      doctor_id: doctorId,
      doctor_name: doctorName
    });
  };

  const handleConfirmBooking = async () => {
    try {
      setBookingStatus('submitting');
      
      // Create appointment record in your database
      // This assumes you'll have an 'appointments' table
      const { data, error } = await supabase
        .from('appointments')
        .insert([
          {
            doctor_id: appointmentData.doctor_id,
            patient_id: appointmentData.patient_id,
            appointment_type: appointmentData.appointment_type,
            appointment_date: appointmentData.date,
            appointment_time: appointmentData.time,
            reason: appointmentData.reason,
            status: 'pending'
          }
        ])
        .select();

      if (error) throw error;
      
      setBookingStatus('success');
      // You might want to redirect or show a success message
    } catch (error) {
      console.error('Error booking appointment:', error);
      setBookingStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading doctors...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-300 p-6">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6"
      >
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-bold text-blue-700 mb-6">Select a Doctor</h2>
            {doctors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {doctors.map((doctor) => (
                  <motion.div
                    key={doctor.id}
                    className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center transition duration-300 transform ${
                      appointmentData.doctor_id === doctor.id ? 'bg-blue-500 text-white' : 'hover:bg-blue-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDoctorSelect(doctor.id, doctor.name)}
                  >
                    <img src={doctor.photo} alt={doctor.name} className="w-24 h-24 rounded-full mb-2" />
                    <h3 className="text-lg font-semibold">{doctor.name}</h3>
                    <p className="text-sm">{doctor.email}</p>
                    <p className="text-xs">License: {doctor.licenseNumber}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p>No doctors available at this time.</p>
            )}
            <button 
              onClick={handleNext} 
              disabled={!appointmentData.doctor_id}
              className={`mt-6 px-4 py-2 text-white rounded-lg ${
                appointmentData.doctor_id ? 'bg-blue-600' : 'bg-gray-400'
              }`}
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-3xl font-bold text-blue-700 mb-4">Select Appointment Type</h2>
            <div className="space-y-3">
              <button 
                className={`w-full py-2 border rounded-lg transition ${
                  appointmentData.appointment_type === 'In-person' ? 'bg-blue-500 text-white' : 'hover:bg-blue-200'
                }`} 
                onClick={() => handleChange('appointment_type', 'In-person')}
              >
                In-Person
              </button>
              <button 
                className={`w-full py-2 border rounded-lg transition ${
                  appointmentData.appointment_type === 'Video Call' ? 'bg-blue-500 text-white' : 'hover:bg-blue-200'
                }`} 
                onClick={() => handleChange('appointment_type', 'Video Call')}
              >
                Video Call
              </button>
            </div>
            <div className="flex justify-between mt-4">
              <button onClick={handleBack} className="px-4 py-2 bg-gray-400 text-white rounded-lg">Back</button>
              <button 
                onClick={handleNext} 
                disabled={!appointmentData.appointment_type}
                className={`px-4 py-2 text-white rounded-lg ${
                  appointmentData.appointment_type ? 'bg-blue-600' : 'bg-gray-400'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-3xl font-bold text-blue-700 mb-4">Select Date & Time</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Appointment Date</label>
              <input 
                type="date" 
                className="w-full p-2 border rounded-lg" 
                value={appointmentData.date}
                onChange={(e) => handleChange('date', e.target.value)} 
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Appointment Time</label>
              <input 
                type="time" 
                className="w-full p-2 border rounded-lg" 
                value={appointmentData.time}
                onChange={(e) => handleChange('time', e.target.value)} 
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Reason for Visit</label>
              <textarea 
                className="w-full p-2 border rounded-lg" 
                value={appointmentData.reason}
                onChange={(e) => handleChange('reason', e.target.value)}
                placeholder="Please briefly describe your symptoms or reason for the appointment"
                rows="3"
              />
            </div>
            <div className="flex justify-between mt-4">
              <button onClick={handleBack} className="px-4 py-2 bg-gray-400 text-white rounded-lg">Back</button>
              <button 
                onClick={handleNext} 
                disabled={!appointmentData.date || !appointmentData.time}
                className={`px-4 py-2 text-white rounded-lg ${
                  (appointmentData.date && appointmentData.time) ? 'bg-blue-600' : 'bg-gray-400'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-3xl font-bold text-blue-700 mb-4">Confirm & Book</h2>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <p className="mb-2"><strong>Doctor:</strong> {appointmentData.doctor_name}</p>
              <p className="mb-2"><strong>Type:</strong> {appointmentData.appointment_type}</p>
              <p className="mb-2"><strong>Date:</strong> {appointmentData.date}</p>
              <p className="mb-2"><strong>Time:</strong> {appointmentData.time}</p>
              {appointmentData.reason && (
                <p className="mb-2"><strong>Reason:</strong> {appointmentData.reason}</p>
              )}
            </div>
            
            {bookingStatus === 'success' && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                <p className="font-bold">Success!</p>
                <p>Your appointment has been booked. You will receive a confirmation email shortly.</p>
              </div>
            )}
            
            {bookingStatus === 'error' && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                <p className="font-bold">Error!</p>
                <p>There was a problem booking your appointment. Please try again.</p>
              </div>
            )}
            
            <div className="flex justify-between mt-4">
              <button 
                onClick={handleBack} 
                disabled={bookingStatus === 'submitting' || bookingStatus === 'success'}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
              >
                Back
              </button>
              <button 
                onClick={handleConfirmBooking}
                disabled={bookingStatus === 'submitting' || bookingStatus === 'success'} 
                className={`px-4 py-2 text-white rounded-lg ${
                  bookingStatus === 'submitting' ? 'bg-yellow-500' : 
                  bookingStatus === 'success' ? 'bg-green-500' : 'bg-blue-600'
                }`}
              >
                {bookingStatus === 'submitting' ? 'Processing...' : 
                 bookingStatus === 'success' ? 'Booked!' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BookAppointment;