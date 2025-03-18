import React, { useState } from 'react';
import { Search, Moon, Sun, User, Calendar, Activity, Clock } from 'lucide-react';
import { createRoot } from 'react-dom/client';


// Sample patient data
const patients = [
  { id: 1, name: "Sarah Johnson", age: 45, condition: "Hypertension", lastVisit: "2024-03-10", status: "Regular Checkup" },
  { id: 2, name: "Michael Chen", age: 32, condition: "Diabetes Type 2", lastVisit: "2024-03-12", status: "Follow-up" },
  { id: 3, name: "Emily Davis", age: 28, condition: "Asthma", lastVisit: "2024-03-08", status: "Emergency" },
  { id: 4, name: "Robert Wilson", age: 56, condition: "Arthritis", lastVisit: "2024-03-15", status: "New Patient" },
];

function PatientList() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    const colors = {
      'Emergency': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Regular Checkup': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Follow-up': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'New Patient': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
                        {patient.status}
                      </span>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Age: {patient.age}
                      </span>
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {patient.condition}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Clock className="h-4 w-4" />
                    <span>Last Visit: {patient.lastVisit}</span>
                  </div>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2">
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

// Render the app
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PatientList />
  </React.StrictMode>
);

export default PatientList;