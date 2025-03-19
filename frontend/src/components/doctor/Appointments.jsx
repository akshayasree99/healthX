import { useState, useEffect } from 'react';
import { supabase } from '../../supabase.js';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, cancelled
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState({
    diagnosis: '',
    medications: '',
    instructions: '',
    followUp: '',
    notes: ''
  });
  const [existingPrescriptionId, setExistingPrescriptionId] = useState(null);

  useEffect(() => {
    getCurrentDoctor();
  }, []);

  useEffect(() => {
    if (currentDoctor) {
      fetchAppointments();
    }
  }, [currentDoctor, filter]);

  const getCurrentDoctor = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('doctor')
          .select('id')
          .eq('email', user.email)
          .single();
        
        if (error) throw error;
        
        setCurrentDoctor(data);
      }
    } catch (error) {
      console.error('Error getting current doctor:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('appointments')
        .select(`
          id,
          doctor_id,
          patient_id,
          appointment_type,
          appointment_date,
          appointment_time,
          reason,
          status,
          created_at,
          has_prescription,
          patient (id, first_name, last_name, email, phone_number)
        `)
        .eq('doctor_id', currentDoctor.id);
      
      if (filter !== 'all') {
        query = query.eq('status', filter);
      }
      
      query = query.order('appointment_date', { ascending: true });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId);
      
      if (error) throw error;
      
      // Update the local state to reflect the change
      setAppointments(appointments.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status } 
          : appointment
      ));
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const fetchExistingPrescription = async (appointmentId) => {
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('appointment_id', appointmentId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        throw error;
      }
      
      if (data) {
        setPrescriptionData({
          diagnosis: data.diagnosis || '',
          medications: data.medications || '',
          instructions: data.instructions || '',
          followUp: data.follow_up || '',
          notes: data.notes || ''
        });
        setExistingPrescriptionId(data.id);
      } else {
        // Reset form data if no prescription exists
        setPrescriptionData({
          diagnosis: '',
          medications: '',
          instructions: '',
          followUp: '',
          notes: ''
        });
        setExistingPrescriptionId(null);
      }
    } catch (error) {
      console.error('Error fetching prescription:', error);
    }
  };

  const openPrescriptionForm = async (appointment) => {
    setCurrentAppointment(appointment);
    
    // If appointment has a prescription, fetch it
    if (appointment.has_prescription) {
      await fetchExistingPrescription(appointment.id);
    } else {
      // Reset form data if creating new prescription
      setPrescriptionData({
        diagnosis: '',
        medications: '',
        instructions: '',
        followUp: '',
        notes: ''
      });
      setExistingPrescriptionId(null);
    }
    
    setShowPrescriptionForm(true);
  };

  const closePrescriptionForm = () => {
    setShowPrescriptionForm(false);
    setCurrentAppointment(null);
    setExistingPrescriptionId(null);
  };

  const handlePrescriptionChange = (e) => {
    const { name, value } = e.target;
    setPrescriptionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const savePrescription = async (e) => {
    e.preventDefault();
    
    try {
      let prescriptionId = existingPrescriptionId;
      
      if (existingPrescriptionId) {
        // Update existing prescription
        const { error: updateError } = await supabase
          .from('prescriptions')
          .update({
            diagnosis: prescriptionData.diagnosis,
            medications: prescriptionData.medications,
            instructions: prescriptionData.instructions,
            follow_up: prescriptionData.followUp,
            notes: prescriptionData.notes,
            updated_at: new Date()
          })
          .eq('id', existingPrescriptionId);
        
        if (updateError) throw updateError;
        
        alert('Prescription updated successfully');
      } else {
        // Create new prescription
        const { data: prescriptionRecord, error: prescriptionError } = await supabase
          .from('prescriptions')
          .insert([
            {
              appointment_id: currentAppointment.id,
              patient_id: currentAppointment.patient_id,
              doctor_id: currentDoctor.id,
              diagnosis: prescriptionData.diagnosis,
              medications: prescriptionData.medications,
              instructions: prescriptionData.instructions,
              follow_up: prescriptionData.followUp,
              notes: prescriptionData.notes,
              created_at: new Date()
            }
          ])
          .select();
        
        if (prescriptionError) throw prescriptionError;
        
        prescriptionId = prescriptionRecord[0].id;
        
        // Create report separately with proper error handling
        try {
          const { error: reportError } = await supabase
            .from('reports')
            .insert([
              {
                patient_id: currentAppointment.patient_id,
                doctor_id: currentDoctor.id,
                name: `Report for ${currentAppointment.patient?.first_name} ${currentAppointment.patient?.last_name}`,
                diagnosis: prescriptionData.diagnosis,
                medications: prescriptionData.medications,
                notes: prescriptionData.notes,
                created_at: new Date()
              }
            ]);
          
          if (reportError) console.error('Report creation error:', reportError);
        } catch (reportErr) {
          console.error('Failed to create report:', reportErr);
          // Continue with the rest of the process even if report creation fails
        }
        
        // Update appointment to indicate it has a prescription
        const { error: appointmentError } = await supabase
          .from('appointments')
          .update({ has_prescription: true })
          .eq('id', currentAppointment.id);
        
        if (appointmentError) throw appointmentError;
        
        // Update local state
        setAppointments(appointments.map(appointment => 
          appointment.id === currentAppointment.id 
            ? { ...appointment, has_prescription: true } 
            : appointment
        ));
        
        alert('Prescription saved successfully');
      }
      
      closePrescriptionForm();
    } catch (error) {
      console.error('Error saving prescription:', error);
      alert(`Failed to save: ${error.message || 'Unknown error'}`);
    }
  };
  

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && !currentDoctor) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-pulse text-indigo-600 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
            <p className="text-gray-600 mb-8">Manage your upcoming and past patient appointments</p>
            
            {/* Filter Tabs */}
            <div className="mb-8 border-b border-gray-200">
              <nav className="flex space-x-4">
                {['all', 'pending', 'approved', 'completed', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`pb-4 px-2 font-medium transition-colors ${
                      filter === status
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </nav>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-pulse text-indigo-600">Loading appointments...</div>
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No appointments found</p>
                {filter !== 'all' && (
                  <p className="text-gray-400 mt-2">Try changing your filter selection</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="flex-grow mb-4 md:mb-0">
                        <div className="flex items-center mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {appointment.patient?.first_name} {appointment.patient?.last_name}
                          </h3>
                          <span className={`ml-4 px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClasses(appointment.status)}`}>
                            {appointment.status}
                          </span>
                          {appointment.has_prescription && (
                            <span className="ml-2 px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              Report Added
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          <div>
                            <span className="text-gray-500">Date:</span>{' '}
                            <span className="text-gray-900">{formatDate(appointment.appointment_date)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Time:</span>{' '}
                            <span className="text-gray-900">{appointment.appointment_time}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Type:</span>{' '}
                            <span className="text-gray-900">{appointment.appointment_type}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Contact:</span>{' '}
                            <span className="text-gray-900">{appointment.patient?.phone_number || appointment.patient?.email}</span>
                          </div>
                        </div>
                        
                        {appointment.reason && (
                          <div className="mt-4">
                            <p className="text-gray-500 text-sm">Reason:</p>
                            <p className="text-gray-700 text-sm mt-1">{appointment.reason}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                        {appointment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 'approved')}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        
                        {appointment.status === 'approved' && (
                          <>
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Mark Complete
                            </button>
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        
                        {appointment.status === 'completed' && !appointment.has_prescription && (
                          <button
                            onClick={() => openPrescriptionForm(appointment)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                          >
                            Create Report
                          </button>
                        )}
                        
                        {appointment.status === 'completed' && appointment.has_prescription && (
                          <button
                            onClick={() => openPrescriptionForm(appointment)}
                            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                          >
                            View/Edit Report
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Prescription Form Modal */}
      {showPrescriptionForm && currentAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {currentAppointment.has_prescription ? 'Edit Report' : 'Create Report'}
                </h2>
                <button
                  onClick={closePrescriptionForm}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Patient: {currentAppointment.patient?.first_name} {currentAppointment.patient?.last_name}
                </h3>
                <p className="text-sm text-gray-500">
                  Date: {formatDate(currentAppointment.appointment_date)} | Time: {currentAppointment.appointment_time}
                </p>
              </div>
              
              <form onSubmit={savePrescription}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">Diagnosis</label>
                    <textarea
                      id="diagnosis"
                      name="diagnosis"
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Enter diagnosis"
                      value={prescriptionData.diagnosis}
                      onChange={handlePrescriptionChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="medications" className="block text-sm font-medium text-gray-700">Medications</label>
                    <textarea
                      id="medications"
                      name="medications"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="List medications, dosages, and frequencies"
                      value={prescriptionData.medications}
                      onChange={handlePrescriptionChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions</label>
                    <textarea
                      id="instructions"
                      name="instructions"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Instructions for the patient"
                      value={prescriptionData.instructions}
                      onChange={handlePrescriptionChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="followUp" className="block text-sm font-medium text-gray-700">Follow-up</label>
                    <input
                      type="text"
                      id="followUp"
                      name="followUp"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Follow-up recommendations"
                      value={prescriptionData.followUp}
                      onChange={handlePrescriptionChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Additional Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Any additional notes or comments"
                      value={prescriptionData.notes}
                      onChange={handlePrescriptionChange}
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={closePrescriptionForm}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {existingPrescriptionId ? 'Update Report' : 'Save Report'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;