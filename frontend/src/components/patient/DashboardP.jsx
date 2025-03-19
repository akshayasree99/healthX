import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const DashboardP = () => {
  const { id: patientId } = useParams(); // Get patient ID from URL

  const navItems = [
    { route: `/patient/bookappointment/${patientId}`, icon: "📅", label: "Book Appointment", color: "bg-blue-100 border-blue-500" },
    { route: `/patient/medicationtracker/${patientId}`, icon: "💊", label: "Medication Tracker", color: "bg-green-100 border-green-500" },
    { route: `/patient/profile/${patientId}`, icon: "👤", label: "Profile", color: "bg-indigo-100 border-indigo-500" },
    { route: `/patient/reports/${patientId}`, icon: "📄", label: "Reports", color: "bg-yellow-100 border-yellow-500" },
    { route: `/patient/videocall/${patientId}`, icon: "📹", label: "Video Call", color: "bg-red-100 border-red-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center p-10">
      
      {/* Header with Medical Styling */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl flex justify-between items-center mb-12 p-5 bg-white shadow-lg rounded-xl border-t-4 border-blue-500"
      >
        <h1 className="text-4xl font-bold text-blue-700">👨‍⚕️ Patient Dashboard</h1>
        <span className="text-lg text-gray-600">Your Health, Our Priority</span>
      </motion.div>

      {/* Dashboard Sections Spread Out */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl">
        {navItems.map((item, index) => (
          <motion.div
            key={item.route}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            className={`p-8 rounded-xl shadow-md border-2 ${item.color} text-gray-800 text-center transition-all duration-300 relative overflow-hidden`}
          >
            <Link to={item.route} className="flex flex-col items-center">
              
              {/* Floating Icon with Bounce Effect */}
              <motion.span 
                initial={{ y: -10 }}
                animate={{ y: 10 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", repeatType: "mirror" }}
                className="text-6xl mb-4"
              >
                {item.icon}
              </motion.span>

              {/* Title with Fading Effect */}
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-xl font-semibold"
              >
                {item.label}
              </motion.span>

              {/* Subtle Background Shine Effect */}
              <motion.div 
                className="absolute inset-0 bg-white opacity-10 blur-xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Footer Section */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="mt-16 text-gray-500 text-sm"
      >
        © 2025 HealthX | Designed for Better Healthcare
      </motion.footer>
    </div>
  );
};

export default DashboardP;
