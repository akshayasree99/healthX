import { useState, useEffect } from 'react';
import { supabase } from '../../supabase.js';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved, cancelled
  const [currentDoctor, setCurrentDoctor] = useState(null);

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
                      
                      {appointment.status === 'pending' && (
                        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
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
                        </div>
                      )}
                      
                      {appointment.status === 'approved' && (
                        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
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
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;