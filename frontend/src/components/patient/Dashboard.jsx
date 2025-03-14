import { Link, Routes, Route, useLocation } from "react-router-dom";
import BookAppointment from "./BookAppointment.jsx";
import DoctorProfile from "./DoctorProfile.jsx";
import DoctorSearch from "./DoctorSearch.jsx";
import MedicationTracker from "./MedicationTracker.jsx";
import Profile from "./Profile.jsx";
import Reports from "./Reports.jsx";
import VideoCall from "./VideoCall.jsx";
import { motion } from "framer-motion";

const Dashboard = () => {
  const location = useLocation();

  const navItems = [
    { route: "book-appointment", icon: "📅", label: "Book Appointment", component: <BookAppointment />, color: "blue" },
    { route: "doctor-search", icon: "🩺", label: "Doctor Search", component: <DoctorSearch />, color: "purple" },
    { route: "doctor-profile", icon: "👨‍⚕️", label: "Doctor Profile", component: <DoctorProfile />, color: "pink" },
    { route: "medication-tracker", icon: "💊", label: "Medication Tracker", component: <MedicationTracker />, color: "green" },
    { route: "profile", icon: "👤", label: "Profile", component: <Profile />, color: "indigo" },
    { route: "reports", icon: "📄", label: "Reports", component: <Reports />, color: "yellow" },
    { route: "video-call", icon: "📹", label: "Video Call", component: <VideoCall />, color: "red" },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-100 via-purple-200 to-pink-300">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-72 bg-white/20 backdrop-blur-lg shadow-2xl rounded-r-3xl p-6 flex flex-col gap-5"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Patient Dashboard
        </h1>
        
        <nav className="space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.route}
              to={item.route}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 shadow-sm 
                ${location.pathname.includes(item.route)
                  ? `bg-${item.color}-500 text-white shadow-lg`
                  : "bg-white/30 text-gray-800 hover:bg-gray-100 hover:shadow-md"}`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-semibold text-lg">{item.label}</span>
            </Link>
          ))}
        </nav>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex-1 p-8"
      >
        <div className="bg-white/40 backdrop-blur-lg rounded-3xl shadow-xl p-8 min-h-[calc(100vh-4rem)]">
          <Routes>
            {navItems.map((item) => (
              <Route key={item.route} path={item.route} element={item.component} />
            ))}

            {/* Default Welcome Page */}
            <Route
              path=""
              element={
                <div className="text-center py-20">
                  <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Welcome to Your Dashboard
                  </h2>
                  <p className="mt-4 text-gray-700 text-lg">
                    Select an option from the sidebar to get started
                  </p>
                </div>
              }
            />

            {/* Catch-all Route */}
            <Route path="*" element={<div className="text-red-500 text-center">No matching route found in Dashboard</div>} />
          </Routes>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
