import { useState } from "react";
import { motion } from "framer-motion";
import { FaUserEdit, FaMoon, FaSun, FaFileMedical, FaCalendarAlt, FaPills, FaUtensils } from "react-icons/fa";

const Profile = () => {
  const [darkMode, setDarkMode] = useState(false);

  const user = {
    name: "John Doe",
    age: 28,
    gender: "Male",
    email: "johndoe@email.com",
    phone: "+1234567890",
    medicines: ["Paracetamol - 500mg", "Vitamin D - 1000 IU"],
    appointments: ["Dr. Smith - 12th March", "Dr. Wilson - 20th March"],
    reports: ["Blood Test - Jan 2024", "MRI Scan - Feb 2024"],
    dietPlan: ["High Protein Breakfast", "Low Sugar Diet"],
  };

  return (
    <div className={`min-h-screen flex flex-col items-center p-8 transition-all duration-500 ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-100 via-purple-200 to-pink-200 text-gray-900"}`}>
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between w-full max-w-4xl bg-white bg-opacity-90 shadow-xl rounded-xl p-6 mb-6 backdrop-blur-lg"
      >
        <h1 className="text-3xl font-bold">👤 Patient Profile</h1>
        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 transition-all">
          {darkMode ? <FaSun className="text-yellow-500 text-2xl" /> : <FaMoon className="text-gray-800 text-2xl" />}
        </button>
      </motion.div>

      {/* Profile Info */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl bg-white bg-opacity-90 shadow-xl rounded-xl p-6 backdrop-blur-lg"
      >
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-600">📅 Age: {user.age}</p>
            <p className="text-gray-600">⚥ Gender: {user.gender}</p>
            <p className="text-gray-600">📧 {user.email}</p>
            <p className="text-gray-600">📞 {user.phone}</p>
          </div>
          <button className="mt-4 sm:mt-0 px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 shadow-lg hover:bg-blue-600 transition-all">
            <FaUserEdit /> Edit Profile
          </button>
        </div>
      </motion.div>

      {/* Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 w-full max-w-4xl">
        
        {/* Medication List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white bg-opacity-90 shadow-xl rounded-xl p-6 backdrop-blur-lg"
        >
          <h3 className="text-xl font-semibold flex items-center gap-2"><FaPills className="text-red-500" /> Medication List</h3>
          <ul className="mt-2 text-gray-700">
            {user.medicines.map((med, index) => (
              <li key={index} className="border-b py-1">{med}</li>
            ))}
          </ul>
        </motion.div>

        {/* Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white bg-opacity-90 shadow-xl rounded-xl p-6 backdrop-blur-lg"
        >
          <h3 className="text-xl font-semibold flex items-center gap-2"><FaCalendarAlt className="text-blue-500" /> Booked Appointments</h3>
          <ul className="mt-2 text-gray-700">
            {user.appointments.map((appt, index) => (
              <li key={index} className="border-b py-1">{appt}</li>
            ))}
          </ul>
        </motion.div>

        {/* Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white bg-opacity-90 shadow-xl rounded-xl p-6 backdrop-blur-lg"
        >
          <h3 className="text-xl font-semibold flex items-center gap-2"><FaFileMedical className="text-green-500" /> Reports</h3>
          <ul className="mt-2 text-gray-700">
            {user.reports.map((report, index) => (
              <li key={index} className="border-b py-1">{report}</li>
            ))}
          </ul>
        </motion.div>

        {/* Diet Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white bg-opacity-90 shadow-xl rounded-xl p-6 backdrop-blur-lg"
        >
          <h3 className="text-xl font-semibold flex items-center gap-2"><FaUtensils className="text-orange-500" /> Diet Plans</h3>
          <ul className="mt-2 text-gray-700">
            {user.dietPlan.map((diet, index) => (
              <li key={index} className="border-b py-1">{diet}</li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
