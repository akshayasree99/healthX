import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const DashboardD = () => {
  const { id: doctorId } = useParams();

  const navItems = [
    { route: `/doctor/appointments/${doctorId}`, icon: "📅", label: "Appointments", color: "from-blue-500 to-blue-700" },
    { route: `/doctor/patientlist/${doctorId}`, icon: "👥", label: "Patient List", color: "from-purple-500 to-purple-700" },
    { route: `/doctor/reportcreation/${doctorId}`, icon: "📝", label: "Report Creation", color: "from-pink-500 to-pink-700" },
    { route: `/doctor/handwrittenreportupload/${doctorId}`, icon: "📜", label: "Handwritten Report Upload", color: "from-green-500 to-green-700" },
    { route: `/doctor/profileD/${doctorId}`, icon: "👤", label: "Profile", color: "from-indigo-500 to-indigo-700" },
    { route: `/doctor/videocall/${doctorId}`, icon: "📹", label: "Video Call", color: "from-red-500 to-red-700" },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 via-purple-200 to-pink-300 p-8">
      
      {/* Dashboard Title */}
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8"
      >
        Doctor Dashboard
      </motion.h1>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-5xl">
        {navItems.map((item) => (
          <motion.div
            key={item.route}
            whileHover={{ scale: 1.07, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)" }}
            whileTap={{ scale: 0.95 }}
            className={`p-6 rounded-2xl shadow-lg bg-gradient-to-br ${item.color} text-white text-center cursor-pointer transition-all duration-300 relative overflow-hidden`}
          >
            <Link to={item.route} className="flex flex-col items-center">
              
              {/* Icon with Glow Effect */}
              <motion.span 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="text-5xl mb-4 drop-shadow-lg"
              >
                {item.icon}
              </motion.span>

              {/* Label with Animation */}
              <motion.span 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="text-xl font-semibold"
              >
                {item.label}
              </motion.span>

              {/* Animated Background Shine Effect */}
              <motion.div 
                className="absolute inset-0 bg-white opacity-10 blur-xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardD;