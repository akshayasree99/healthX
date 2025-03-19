"use client"

import { Link, useParams } from "react-router-dom"

const DashboardP = () => {
  const { id: patientId } = useParams()

  const navItems = [
    {
      route: `/patient/bookappointment/${patientId}`,
      icon: "🗓️",
      label: "Book Appointment",
      description: "Schedule your next visit",
      color: "bg-indigo-50 border-indigo-500",
      hoverColor: "hover:bg-indigo-100",
      gradient: "from-indigo-500 to-blue-600",
      iconBg: "bg-indigo-100",
    },
    {
      route: `/patient/doctorsearch/${patientId}`,
      icon: "🔍",
      label: "Doctor Search",
      description: "Find the right specialist",
      color: "bg-purple-50 border-purple-500",
      hoverColor: "hover:bg-purple-100",
      gradient: "from-purple-500 to-pink-600",
      iconBg: "bg-purple-100",
    },
    {
      route: `/patient/medicationtracker/${patientId}`,
      icon: "💊",
      label: "Medication Tracker",
      description: "Manage your medications",
      color: "bg-emerald-50 border-emerald-500",
      hoverColor: "hover:bg-emerald-100",
      gradient: "from-emerald-500 to-teal-600",
      iconBg: "bg-emerald-100",
    },
    {
      route: `/patient/profile/${patientId}`,
      icon: "👤",
      label: "Profile",
      description: "View and edit your details",
      color: "bg-blue-50 border-blue-500",
      hoverColor: "hover:bg-blue-100",
      gradient: "from-blue-500 to-cyan-600",
      iconBg: "bg-blue-100",
    },
    {
      route: `/patient/reports/${patientId}`,
      icon: "📊",
      label: "Reports",
      description: "Access your medical records",
      color: "bg-amber-50 border-amber-500",
      hoverColor: "hover:bg-amber-100",
      gradient: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-100",
    },
    {
      route: `/patient/videocall/${patientId}`,
      icon: "🎥",
      label: "Video Call",
      description: "Virtual consultations",
      color: "bg-rose-50 border-rose-500",
      hoverColor: "hover:bg-rose-100",
      gradient: "from-rose-500 to-red-600",
      iconBg: "bg-rose-100",
    },
  ]

  const stats = [
    {
      title: "Next Appointment",
      value: "Tomorrow, 10:00 AM",
      icon: "🕒",
      color: "from-indigo-500 to-blue-600",
      bgLight: "bg-indigo-50",
    },
    {
      title: "Pending Reports",
      value: "2 Reports",
      icon: "📋",
      color: "from-purple-500 to-pink-600",
      bgLight: "bg-purple-50",
    },
    {
      title: "Medication Reminders",
      value: "3 Today",
      icon: "⏰",
      color: "from-emerald-500 to-teal-600",
      bgLight: "bg-emerald-50",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 font-sans">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header Section */}
        <div className="mb-16 text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-lg shadow-indigo-200" />

          <div className="inline-block p-2 px-6 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium mb-6 shadow-lg shadow-indigo-500/20 transform hover:scale-105 transition-transform duration-300">
            <span className="mr-2">👋</span> Welcome Back
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-6 tracking-tight">
            Patient Dashboard
          </h1>

          <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Manage your health journey with our comprehensive suite of tools and services
          </p>

          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-xl" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl relative overflow-hidden group"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
              />

              <div className="flex items-center justify-between mb-4">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-xl ${stat.bgLight} text-2xl shadow-md group-hover:scale-110 transition-transform duration-300`}
                >
                  {stat.icon}
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse" />
                </div>
              </div>

              <div className="text-indigo-600 text-lg font-medium mb-2">{stat.title}</div>
              <div className="text-2xl font-bold text-gray-800 group-hover:text-indigo-700 transition-colors duration-300">
                {stat.value}
              </div>

              <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* Main Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {navItems.map((item, index) => (
            <Link
              key={item.route}
              to={item.route}
              className={`group relative overflow-hidden rounded-2xl ${item.color} border p-8 shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${item.hoverColor}`}
            >
              {/* Background gradient on hover */}
              <div
                className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
              />

              {/* Decorative elements */}
              <div
                className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-all duration-500 blur-lg"
                style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
              />

              <div className="flex items-start space-x-6 relative z-10">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.iconBg} shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}
                >
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                    {item.label}
                  </h3>
                  <p className="mt-2 text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                    {item.description}
                  </p>
                </div>

                <div className="text-gray-400 group-hover:text-indigo-600 transform group-hover:translate-x-2 transition-all duration-300">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Bottom border animation */}
              <div
                className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r transition-all duration-500"
                style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
              />
            </Link>
          ))}
        </div>

        {/* Health Tips Section */}
        <div className="mt-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-32 -translate-y-32" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full transform -translate-x-16 translate-y-16" />

          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-2xl group-hover:scale-110 transition-transform duration-300">
                💡
              </div>
              <h2 className="text-3xl font-bold">Today's Health Tip</h2>
            </div>

            <p className="text-lg text-indigo-100 max-w-3xl leading-relaxed">
              Remember to stay hydrated! Drinking enough water helps maintain your body's temperature, removes waste,
              and protects your joints. Aim for 8 glasses of water daily.
            </p>

            <div className="mt-6 flex justify-end">
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors duration-300 flex items-center space-x-2">
                <span>More Tips</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="h-px w-40 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-8 shadow-sm" />

          <p className="text-gray-600 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
            <span>© 2025 HealthX</span>
            <span className="hidden sm:inline">|</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 font-medium">
              Your Health, Our Priority
            </span>
          </p>

          <div className="mt-4 flex justify-center space-x-4">
            <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors duration-300">
              <span className="sr-only">Privacy Policy</span>
              <span>Privacy</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors duration-300">
              <span className="sr-only">Terms of Service</span>
              <span>Terms</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors duration-300">
              <span className="sr-only">Contact Us</span>
              <span>Contact</span>
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default DashboardP

