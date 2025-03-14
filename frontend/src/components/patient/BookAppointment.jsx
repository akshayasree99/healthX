import { useState } from 'react';
import { motion } from 'framer-motion';
import doctorData from '../../data/doctors'; // Mock data file for doctors

const BookAppointment = () => {
  const [step, setStep] = useState(1);
  const [appointmentData, setAppointmentData] = useState({
    doctor: null,
    appointmentType: '',
    date: '',
    time: '',
    reason: '',
    paymentMethod: '',
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);
  const handleChange = (field, value) => {
    setAppointmentData({ ...appointmentData, [field]: value });
  };

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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {doctorData.map((doctor) => (
                <motion.div
                  key={doctor.id}
                  className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center transition duration-300 transform ${
                    appointmentData.doctor === doctor.name ? 'bg-blue-500 text-white' : 'hover:bg-blue-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleChange('doctor', doctor.name)}
                >
                  <img src={doctor.photo} alt={doctor.name} className="w-24 h-24 rounded-full mb-2" />
                  <h3 className="text-lg font-semibold">{doctor.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.specialization}</p>
                  <p className="text-yellow-500">{'⭐'.repeat(doctor.rating)}</p>
                </motion.div>
              ))}
            </div>
            <button onClick={handleNext} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg">Next</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-3xl font-bold text-blue-700 mb-4">Select Appointment Type</h2>
            <div className="space-y-3">
              <button className="w-full py-2 border rounded-lg hover:bg-blue-200" onClick={() => handleChange('appointmentType', 'In-person')}>In-Person</button>
              <button className="w-full py-2 border rounded-lg hover:bg-blue-200" onClick={() => handleChange('appointmentType', 'Video Call')}>Video Call</button>
            </div>
            <div className="flex justify-between mt-4">
              <button onClick={handleBack} className="px-4 py-2 bg-gray-400 text-white rounded-lg">Back</button>
              <button onClick={handleNext} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-3xl font-bold text-blue-700 mb-4">Select Date & Time</h2>
            <input type="date" className="w-full p-2 border rounded-lg" onChange={(e) => handleChange('date', e.target.value)} />
            <input type="time" className="w-full p-2 border rounded-lg mt-2" onChange={(e) => handleChange('time', e.target.value)} />
            <div className="flex justify-between mt-4">
              <button onClick={handleBack} className="px-4 py-2 bg-gray-400 text-white rounded-lg">Back</button>
              <button onClick={handleNext} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Next</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-3xl font-bold text-blue-700 mb-4">Confirm & Book</h2>
            <p><strong>Doctor:</strong> {appointmentData.doctor}</p>
            <p><strong>Type:</strong> {appointmentData.appointmentType}</p>
            <p><strong>Date:</strong> {appointmentData.date}</p>
            <p><strong>Time:</strong> {appointmentData.time}</p>
            <button onClick={handleBack} className="mt-4 px-4 py-2 bg-gray-400 text-white rounded-lg">Back</button>
            <button className="mt-4 ml-2 px-4 py-2 bg-green-600 text-white rounded-lg">Confirm Booking</button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BookAppointment;
