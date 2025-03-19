import { useState, useEffect } from 'react';
import { supabase } from '../../supabase.js';

const BookAppointment = () => {
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingStatus, setBookingStatus] = useState('');
  const [appointmentData, setAppointmentData] = useState({
    doctor_id: null,
    doctor_name: '',
    patient_id: null,
    appointment_type: '',
    date: '',
    time: '',
    reason: '',
    status: 'pending',
  });

  useEffect(() => {
    fetchDoctors();
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
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

      const formattedDoctors = data.map(doctor => ({
        id: doctor.id,
        doctorId: doctor.doctor_id,
        name: `${doctor.first_name} ${doctor.last_name}`,
        email: doctor.email,
        licenseNumber: doctor.license_number,
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
    } catch (error) {
      console.error('Error booking appointment:', error);
      setBookingStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-pulse text-indigo-600 text-xl">Loading doctors...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
          <div className="p-8">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {[1, 2, 3, 4].map((num) => (
                  <div
                    key={num}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= num ? 'bg-indigo-600 text-white' : 'bg-gray-200'
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">Choose Your Doctor</h2>
                <p className="text-gray-600">Select a doctor from our experienced medical professionals</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      onClick={() => handleDoctorSelect(doctor.id, doctor.name)}
                      className={`cursor-pointer rounded-xl p-6 transition-all duration-300 ${
                        appointmentData.doctor_id === doctor.id
                          ? 'bg-indigo-600 text-white shadow-lg scale-105'
                          : 'bg-white border-2 border-gray-200 hover:border-indigo-600'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={doctor.photo}
                          alt={doctor.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-white"
                        />
                        <div>
                          <h3 className={`font-semibold ${
                            appointmentData.doctor_id === doctor.id ? 'text-white' : 'text-gray-900'
                          }`}>{doctor.name}</h3>
                          <p className={appointmentData.doctor_id === doctor.id ? 'text-indigo-100' : 'text-gray-600'}>
                            {doctor.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleNext}
                    disabled={!appointmentData.doctor_id}
                    className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                      appointmentData.doctor_id
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">Select Appointment Type</h2>
                <p className="text-gray-600">Choose how you'd like to meet with Dr. {appointmentData.doctor_name}</p>
                <div className="space-y-4">
                  {['In-person', 'Video Call'].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleChange('appointment_type', type)}
                      className={`w-full p-6 text-left rounded-xl transition-all duration-300 ${
                        appointmentData.appointment_type === type
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white border-2 border-gray-200 hover:border-indigo-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-medium">{type}</span>
                        <div className={`w-6 h-6 rounded-full border-2 ${
                          appointmentData.appointment_type === type
                            ? 'border-white bg-white'
                            : 'border-gray-300'
                        }`} />
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={handleBack}
                    className="px-8 py-3 rounded-lg font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!appointmentData.appointment_type}
                    className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                      appointmentData.appointment_type
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">Schedule Your Visit</h2>
                <p className="text-gray-600">Pick a date and time that works best for you</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={appointmentData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={appointmentData.time}
                      onChange={(e) => handleChange('time', e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Visit
                    </label>
                    <textarea
                      value={appointmentData.reason}
                      onChange={(e) => handleChange('reason', e.target.value)}
                      placeholder="Please describe your symptoms or reason for visit"
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      rows="4"
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={handleBack}
                    className="px-8 py-3 rounded-lg font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!appointmentData.date || !appointmentData.time}
                    className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                      appointmentData.date && appointmentData.time
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">Confirm Your Appointment</h2>
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Doctor</span>
                    <span className="font-medium text-gray-900">{appointmentData.doctor_name}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium text-gray-900">{appointmentData.appointment_type}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium text-gray-900">{appointmentData.date}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium text-gray-900">{appointmentData.time}</span>
                  </div>
                  {appointmentData.reason && (
                    <div className="pt-4">
                      <span className="block text-gray-600 mb-2">Reason for Visit</span>
                      <p className="text-gray-900">{appointmentData.reason}</p>
                    </div>
                  )}
                </div>

                {bookingStatus === 'success' && (
                  <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-xl">
                    <p className="text-green-800 font-medium">Appointment Booked Successfully!</p>
                    <p className="text-green-700 mt-1">You will receive a confirmation email shortly.</p>
                  </div>
                )}

                {bookingStatus === 'error' && (
                  <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-xl">
                    <p className="text-red-800 font-medium">Booking Failed</p>
                    <p className="text-red-700 mt-1">Please try again or contact support if the issue persists.</p>
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    onClick={handleBack}
                    disabled={bookingStatus === 'submitting' || bookingStatus === 'success'}
                    className="px-8 py-3 rounded-lg font-medium text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmBooking}
                    disabled={bookingStatus === 'submitting' || bookingStatus === 'success'}
                    className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                      bookingStatus === 'submitting'
                        ? 'bg-yellow-500 text-white'
                        : bookingStatus === 'success'
                        ? 'bg-green-500 text-white'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    {bookingStatus === 'submitting'
                      ? 'Processing...'
                      : bookingStatus === 'success'
                      ? 'Booked!'
                      : 'Confirm Booking'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;