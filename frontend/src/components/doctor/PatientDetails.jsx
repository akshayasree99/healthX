import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase.js';
import { User, Calendar, ArrowLeft, FileText, Activity, Clock, Heart, AlertCircle } from 'lucide-react';

function PatientDetails() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      
      // Fetch patient details
      const { data: patientData, error: patientError } = await supabase
        .from('patient')
        .select('*')
        .eq('id', patientId)
        .single();
      
      if (patientError) {
        throw patientError;
      }
      
      setPatient(patientData);
      
      // Fetch patient appointments
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .order('appointment_date', { ascending: false });
      
      if (!appointmentsError) {
        setAppointments(appointmentsData || []);
      }
      
      // Fetch patient reports
      const { data: reportsData, error: reportsError } = await supabase
        .from('reports')
        .select('*')
        .eq('patient_id', patientId)
        .order('date', { ascending: false });
      
      if (!reportsError) {
        setReports(reportsData || []);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const calculateAge = (dob) => {
    if (!dob) return 'Unknown';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  const getStatusBadge = (status) => {
    const statusLower = (status || '').toLowerCase();
    const colors = {
      'emergency': 'bg-red-100 text-red-800',
      'completed': 'bg-green-100 text-green-800',
      'scheduled': 'bg-blue-100 text-blue-800',
      'new': 'bg-purple-100 text-purple-800',
      'cancelled': 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[statusLower] || 'bg-gray-100 text-gray-800'}`}>
        {status || 'Unknown'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patient information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-lg p-6 bg-white rounded-xl shadow-lg">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Patient</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={handleBackClick}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-lg p-6 bg-white rounded-xl shadow-lg">
          <User className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Patient Not Found</h2>
          <p className="text-gray-600 mb-4">The patient you're looking for doesn't exist or you don't have permission to view their details.</p>
          <button 
            onClick={handleBackClick}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Patient List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Back Button */}
        <button 
          onClick={handleBackClick}
          className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Patient List</span>
        </button>
        
        {/* Patient Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-indigo-100 rounded-xl">
                <User className="h-10 w-10 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {patient.first_name} {patient.last_name}
                </h1>
                <div className="flex flex-wrap gap-3 mt-2">
                  <span className="text-gray-600">Age: {calculateAge(patient.dob)}</span>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-600">
                    Gender: {patient.gender || 'Not specified'}
                  </span>
                  {patient.blood_group && (
                    <>
                      <span className="text-gray-600">•</span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        Blood: {patient.blood_group}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              onClick={() => navigate(`/patient/${patientId}/schedule`)}
            >
              Schedule Appointment
            </button>
          </div>
          
          {/* Patient Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
              <p className="text-gray-900">{patient.email || 'Not provided'}</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
              <p className="text-gray-900">{patient.phone_number || 'Not provided'}</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Date of Birth</h3>
              <p className="text-gray-900">{formatDate(patient.dob) || 'Not provided'}</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Address</h3>
              <p className="text-gray-900">{patient.address || 'Not provided'}</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Current Medications</h3>
              <p className="text-gray-900">{patient.current_medication || 'None listed'}</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Allergies</h3>
              <p className="text-gray-900">{patient.allergies || 'None listed'}</p>
            </div>
          </div>
          
          {patient.existing_conditions && (
            <div className="mt-6 border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Existing Conditions</h3>
              <p className="text-gray-900">{patient.existing_conditions}</p>
            </div>
          )}
        </div>
        
        {/* Appointments Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Appointment History</h2>
          </div>
          
          {appointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No appointment history found for this patient.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-700 border-b">
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment, index) => (
                    <tr key={appointment.id} className={index !== appointments.length - 1 ? 'border-b' : ''}>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          {formatDate(appointment.appointment_date)}
                          <span className="text-sm text-gray-500">
                            {new Date(appointment.appointment_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                      </td>
                      <td className="py-4">{appointment.appointment_type || 'Consultation'}</td>
                      <td className="py-4">{getStatusBadge(appointment.status)}</td>
                      <td className="py-4">{appointment.reason || 'Not specified'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Medical Reports Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="h-6 w-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Medical Reports</h2>
          </div>
          
          {reports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No medical reports found for this patient.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reports.map(report => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{report.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{formatDate(report.date)}</p>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">
                      {report.type}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <a 
                      href={report.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      View Report →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientDetails;