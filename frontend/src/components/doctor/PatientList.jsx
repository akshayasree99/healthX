import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, User, Calendar, Activity, Clock } from 'lucide-react';
import { supabase } from '../../supabase.js';
import { useNavigate } from 'react-router-dom'; // Import for navigation

function PatientList() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      
      // Get patients with their basic information
      const { data: patientData, error: patientError } = await supabase
        .from('patient')
        .select('*');
  
      if (patientError) {
        console.error("Error fetching patients:", patientError);
        throw patientError;
      }
      
      console.log("Patient data:", patientData);
      
      if (patientData && patientData.length > 0) {
        // Create an array to store processed patient data
        const processedPatients = [];
        
        // For each patient, fetch their latest appointment
        for (const patient of patientData) {
          // Fetch the most recent appointment for this patient
          const { data: appointmentData, error: appointmentError } = await supabase
            .from('appointments')
            .select('*')
            .eq('patient_id', patient.id)
            .order('appointment_date', { ascending: false })
            .limit(1);
            
          if (appointmentError) {
            console.error(`Error fetching appointments for patient ${patient.id}:`, appointmentError);
          }
          
          // Get latest appointment info
          const latestAppointment = appointmentData && appointmentData.length > 0 ? appointmentData[0] : null;
          
          // Process patient data with appointment info
          processedPatients.push({
            id: patient.id,
            name: `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 'Unknown',
            age: patient.dob ? calculateAge(patient.dob) : 'Unknown',
            condition: patient.existing_conditions || 'Not specified',
            lastVisit: latestAppointment 
              ? new Date(latestAppointment.appointment_date).toLocaleDateString() 
              : 'No previous visits',
            status: latestAppointment?.status || 'New',
            appointmentType: latestAppointment?.appointment_type || '',
            email: patient.email || '',
            phone: patient.phone_number || ''
          });
        }
        
        setPatients(processedPatients);
      } else {
        setPatients([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error in fetchPatients function:', error);
      setLoading(false);
    }
  };
  
  // Helper function to calculate age
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Function to handle View Details button click
  const handleViewDetails = (patientId) => {
    // Navigate to patient details page with the patient ID
    navigate(`/patient/${patientId}`);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    const statusLower = (status || '').toLowerCase();
    const colors = {
      'emergency': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'scheduled': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'new': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'cancelled': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    return colors[statusLower] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Activity className={`h-8 w-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Patient Directory
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {filteredPatients.length} Patients Found
            </span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              {darkMode ? (
                <Sun className="h-6 w-6 text-yellow-400" />
              ) : (
                <Moon className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <input
            type="text"
            placeholder="Search patients by name..."
            className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className={`text-center py-12 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p>Loading patient data...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredPatients.length === 0 && (
          <div className={`text-center py-12 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <User className={`h-12 w-12 mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <p className="text-xl">No patients found</p>
            <p className="mt-2">Try adjusting your search or add new patients to the system.</p>
          </div>
        )}

        {/* Patient List */}
        <div className="grid gap-6">
          {filteredPatients.map(patient => (
            <div
              key={patient.id}
              className={`p-6 rounded-xl ${
                darkMode 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-white text-gray-900'
              } shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <User className={`h-8 w-8 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{patient.name}</h3>
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(patient.status)}`}>
                        {patient.status || 'Unknown'}
                      </span>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Age: {patient.age}
                      </span>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {patient.condition}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Email: {patient.email}
                      </span>
                      {patient.phone && (
                        <span className={`text-sm ml-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Phone: {patient.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Clock className="h-4 w-4" />
                    <span>Last Visit: {patient.lastVisit}</span>
                    {patient.appointmentType && (
                      <span className="ml-2 px-2 py-1 rounded-md bg-opacity-70 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                        {patient.appointmentType}
                      </span>
                    )}
                  </div>
                  <button 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                    onClick={() => handleViewDetails(patient.id)}
                  >
                    <Calendar className="h-4 w-4" />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PatientList;