"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaPills, FaCalendarAlt, FaFileMedical, FaUtensils, FaUserEdit, FaSun, FaMoon } from "react-icons/fa"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "../../supabase"

const ProfileD = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [doctor, setDoctor] = useState(null)
  const { id: doctorId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const { data, error } = await supabase
          .from("doctor")
          .select("first_name,last_name, email, gender, phone_number, specialization, experience, fees, available_hours")
          .eq("doctor_id", doctorId)
          .single()

        if (error) {
          console.error("Error fetching doctor data:", error.message)
        } else {
          setDoctor({
            name: data.first_name,
            lname: data.last_name,
            email: data.email,
            gender: data.gender,
            phone: data.phone_number,
            specialization: data.specialization,
            experience: data.experience,
            fees: data.fees,
            availableHours: data.available_hours,
          })
        }
      } catch (err) {
        console.error("Unexpected error:", err)
      }
    }

    if (doctorId) {
      fetchDoctorData()
    }
  }, [doctorId])

  const handleEditProfile = () => {
    navigate(`/register/doctor/${doctorId}`)
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gradient-to-r from-indigo-50 to-purple-50 text-gray-800"
      }`}
    >
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with dark mode toggle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`flex items-center justify-between mb-8 ${darkMode ? "text-white" : "text-gray-800"}`}
        >
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <span className="inline-block p-2 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
              👤
            </span>
            Doctor Dashboard
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full transition-all ${
              darkMode
                ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                : "bg-white hover:bg-gray-100 text-indigo-600 shadow-md"
            }`}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
          </button>
        </motion.div>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`rounded-2xl shadow-lg overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <div className={`h-24 ${darkMode ? "bg-indigo-900" : "bg-indigo-600"}`}></div>
            <div className="p-6 -mt-12">
              <div
                className={`w-24 h-24 rounded-full border-4 ${
                  darkMode ? "border-gray-800 bg-gray-700" : "border-white bg-indigo-100"
                } flex items-center justify-center mx-auto mb-4`}
              >
                <span className="text-4xl">{doctor?.name ? doctor.name.charAt(0).toUpperCase() : "D"}</span>
              </div>

              {doctor ? (
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold mb-1">{doctor.name}</h2>
                  <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>Doctor ID: {doctorId}</p>
                </div>
              ) : (
                <div className="text-center mb-6">
                  <div
                    className={`h-8 w-48 mx-auto rounded ${darkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`}
                  ></div>
                  <div
                    className={`h-4 w-32 mx-auto rounded mt-2 ${darkMode ? "bg-gray-700" : "bg-gray-200"} animate-pulse`}
                  ></div>
                </div>
              )}

              {doctor ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-indigo-50"}`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                    <p className="font-medium">{doctor.gender || "Not specified"}</p>
                  </div>
                  <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-indigo-50"}`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium truncate">{doctor.email}</p>
                  </div>
                  <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-indigo-50"}`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="font-medium">{doctor.phone}</p>
                  </div>
                  {/* <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-indigo-50"}`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Specialization</p>
                    <p className="font-medium">{doctor.specialization}</p>
                  </div> */}
                  <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-indigo-50"}`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Experience</p>
                    <p className="font-medium">{doctor.experience} years</p>
                  </div>
                  <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-indigo-50"}`}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fees</p>
                    <p className="font-medium">${doctor.fees}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-100"} animate-pulse`}>
                      <div className={`h-3 w-16 rounded ${darkMode ? "bg-gray-600" : "bg-gray-200"}`}></div>
                      <div className={`h-5 w-24 rounded mt-2 ${darkMode ? "bg-gray-600" : "bg-gray-200"}`}></div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-center">
                <button
                  onClick={handleEditProfile}
                  className={`px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-all ${
                    darkMode
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
                  }`}
                >
                  <FaUserEdit /> Edit Profile
                </button>
              </div>
            </div>
          </motion.div>

          {/* Health Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Available Hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`rounded-xl shadow-md p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className={`p-3 rounded-lg ${darkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-600"}`}>
                  <FaCalendarAlt className="text-xl" />
                </span>
                <h3 className="text-xl font-semibold">Available Hours</h3>
              </div>

              <div className={`h-40 overflow-auto rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} p-3`}>
                <p className={`text-center py-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {doctor?.availableHours || "No available hours listed"}
                </p>
              </div>
            </motion.div>

            {/* Specialization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`rounded-xl shadow-md p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`p-3 rounded-lg ${
                    darkMode ? "bg-green-900 text-green-300" : "bg-green-100 text-green-600"
                  }`}
                >
                  <FaFileMedical className="text-xl" />
                </span>
                <h3 className="text-xl font-semibold">Specialization</h3>
              </div>

              <div className={`h-40 overflow-auto rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} p-3`}>
                <p className={`text-center py-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {doctor?.specialization || "No specialization listed"}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileD