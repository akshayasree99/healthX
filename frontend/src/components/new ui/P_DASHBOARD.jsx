"use client"

import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../../supabase"

const DashboardP = () => {
  const { id: patientId } = useParams()
  const [nextAppointment, setNextAppointment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showTipsModal, setShowTipsModal] = useState(false)
  const [activeSidebarItem, setActiveSidebarItem] = useState("dashboard")
  const [collapseSidebar, setCollapseSidebar] = useState(false)

  useEffect(() => {
    async function fetchNextAppointment() {
      try {
        setLoading(true)
        setError(null)

        console.log("Fetching appointments for patient:", patientId)

        // Get current date in ISO format (YYYY-MM-DD)
        const today = new Date().toISOString().split("T")[0]

        // First, try to query using appointment_date
        const { data, error } = await supabase
          .from("appointments")
          .select("*")
          .eq("patient_id", patientId)
          .gte("appointment_date", today) // Get only future appointments
          .order("appointment_date", { ascending: true }) // Order by date in ascending order
          .limit(1) // Get the next upcoming appointment

        if (error) {
          console.error("Supabase query error:", error)

          // If appointment_date doesn't work, try with scheduled_date
          const { data: altData, error: altError } = await supabase
            .from("appointments")
            .select("*")
            .eq("patient_id", patientId)
            .gte("scheduled_date", today)
            .order("scheduled_date", { ascending: true })
            .limit(1)

          if (altError) {
            throw altError
          }

          console.log("Appointment data (alternate):", altData)

          if (altData && altData.length > 0) {
            setNextAppointment(altData[0])
          } else {
            setNextAppointment(null)
          }
        } else {
          console.log("Appointment data:", data)

          if (data && data.length > 0) {
            setNextAppointment(data[0])
          } else {
            setNextAppointment(null)
          }
        }
      } catch (err) {
        console.error("Error fetching appointment:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (patientId) {
      fetchNextAppointment()
    }
  }, [patientId])

  // Format the appointment date and time for display
  const formatAppointment = (appointment) => {
    if (loading) return "Loading..."
    if (error) return "Unable to load appointment"
    if (!appointment) return "No upcoming appointments"

    try {
      // Check which field contains the date information
      let dateField = null

      // Check possible date field names
      if (appointment.appointment_date) dateField = appointment.appointment_date
      else if (appointment.scheduled_date) dateField = appointment.scheduled_date
      else if (appointment.date) dateField = appointment.date
      else if (appointment.created_at) dateField = appointment.created_at
      else {
        // If no date field is found, find the first field that looks like a date
        for (const key in appointment) {
          if (
            appointment[key] &&
            typeof appointment[key] === "string" &&
            (appointment[key].includes("T") || !isNaN(new Date(appointment[key])))
          ) {
            dateField = appointment[key]
            break
          }
        }
      }

      if (!dateField) return "Appointment date not available"

      // Create Date object
      const appointmentDate = new Date(dateField)

      // Check if date is valid
      if (isNaN(appointmentDate.getTime())) {
        console.error("Invalid date format:", dateField)
        return "Invalid appointment date"
      }

      // Format date
      const dateOptions = { weekday: "long", month: "long", day: "numeric" }
      const formattedDate = appointmentDate.toLocaleDateString("en-US", dateOptions)

      // Format time
      const timeOptions = { hour: "numeric", minute: "2-digit", hour12: true }
      const formattedTime = appointmentDate.toLocaleTimeString("en-US", timeOptions)

      return `${formattedDate}, ${formattedTime}`
    } catch (formatError) {
      console.error("Error formatting date:", formatError)
      return "Date format error"
    }
  }

  // Sidebar navigation items
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "appointments", label: "Appointments", icon: "🗓️" },
    { id: "doctors", label: "Doctors", icon: "👨‍⚕️" },
    { id: "medications", label: "Medications", icon: "💊" },
    { id: "reports", label: "Reports", icon: "📝" },
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ]

  // Dashboard statistics
  const statistics = [
    {
      id: "appointments",
      label: "Appointments",
      value: "3",
      change: "+1",
      period: "this month",
      icon: (
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
      ),
    },
    {
      id: "medications",
      label: "Medications",
      value: "4",
      change: "0",
      period: "active",
      icon: (
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          ></path>
        </svg>
      ),
    },
    {
      id: "tests",
      label: "Lab Tests",
      value: "2",
      change: "-1",
      period: "this month",
      icon: (
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          ></path>
        </svg>
      ),
    },
    {
      id: "doctors",
      label: "Doctors",
      value: "2",
      change: "+1",
      period: "new specialist",
      icon: (
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          ></path>
        </svg>
      ),
    },
  ]

  // Health metrics data
  const healthMetrics = [
    { id: "weight", label: "Weight", value: "68", unit: "kg", date: "Last updated: Mar 15, 2025" },
    { id: "bloodPressure", label: "Blood Pressure", value: "120/80", unit: "mmHg", date: "Last updated: Mar 18, 2025" },
    { id: "heartRate", label: "Heart Rate", value: "72", unit: "bpm", date: "Last updated: Mar 18, 2025" },
    { id: "glucose", label: "Blood Glucose", value: "95", unit: "mg/dL", date: "Last updated: Mar 10, 2025" },
  ]

  // Upcoming appointments
  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "March 25, 2025",
      time: "10:30 AM",
      location: "Heart Care Center, Building A",
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "General Practitioner",
      date: "April 3, 2025",
      time: "2:15 PM",
      location: "Main Hospital, Room 302",
    },
  ]

  // Medications
  const medications = [
    {
      id: 1,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      refillDate: "April 10, 2025",
      remaining: 12,
    },
    {
      id: 2,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      refillDate: "March 28, 2025",
      remaining: 5,
    },
    {
      id: 3,
      name: "Atorvastatin",
      dosage: "20mg",
      frequency: "Once daily at bedtime",
      refillDate: "April 15, 2025",
      remaining: 15,
    },
  ]

  // Health tips for the modal
  const healthTips = [
    {
      icon: "💧",
      title: "Stay Hydrated",
      description: "Drink at least 8 glasses of water daily to maintain bodily functions and energy levels.",
    },
    {
      icon: "🍎",
      title: "Balanced Nutrition",
      description: "Include fruits, vegetables, whole grains, lean proteins, and healthy fats in your daily diet.",
    },
    {
      icon: "🏃",
      title: "Regular Exercise",
      description:
        "Aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity weekly.",
    },
    {
      icon: "😴",
      title: "Quality Sleep",
      description: "Adults should get 7-9 hours of sleep per night for optimal health and cognitive function.",
    },
    {
      icon: "🧘",
      title: "Stress Management",
      description: "Practice meditation, deep breathing, or yoga to reduce stress levels and improve mental health.",
    },
    {
      icon: "🧠",
      title: "Mental Wellness",
      description: "Take time for activities you enjoy and maintain social connections to support mental health.",
    },
    {
      icon: "🧪",
      title: "Regular Check-ups",
      description: "Schedule annual physical exams and recommended screenings based on your age and health status.",
    },
    {
      icon: "🚭",
      title: "Avoid Harmful Habits",
      description: "Limit alcohol consumption, avoid smoking, and stay away from other harmful substances.",
    },
  ]

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 transition-all duration-300 ${collapseSidebar ? "w-16" : "w-64"}`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className={`flex items-center ${collapseSidebar ? "justify-center w-full" : ""}`}>
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-600 text-white font-bold">
              H
            </div>
            {!collapseSidebar && <span className="ml-2 font-semibold text-gray-800">HealthX</span>}
          </div>
          <button onClick={() => setCollapseSidebar(!collapseSidebar)} className="text-gray-500 hover:text-gray-700">
            {collapseSidebar ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                ></path>
              </svg>
            )}
          </button>
        </div>
        <div className="py-4">
          <ul>
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSidebarItem(item.id)}
                  className={`flex items-center w-full px-4 py-3 ${
                    activeSidebarItem === item.id
                      ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  } transition-colors duration-200`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!collapseSidebar && <span className="ml-3">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">Patient Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                ></path>
              </svg>
            </button>
            <div className="flex items-center">
              <img
                src="/placeholder.svg?height=32&width=32"
                alt="Patient"
                className="w-8 h-8 rounded-full border border-gray-200"
              />
              <span className="ml-2 font-medium">John Doe</span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Welcome Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Welcome back, John</h2>
            <p className="text-gray-600">Here's an overview of your health information</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {statistics.map((stat) => (
              <div
                key={stat.id}
                className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg">{stat.icon}</div>
                </div>
                <div className="mt-4 flex items-center">
                  <span
                    className={`text-xs font-medium ${
                      stat.change.startsWith("+")
                        ? "text-green-600"
                        : stat.change.startsWith("-")
                          ? "text-red-600"
                          : "text-gray-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">{stat.period}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Two Column Layout for Appointments and Health Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Appointments Section */}
            <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Upcoming Appointments</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All</button>
              </div>
              <div className="p-6">
                {upcomingAppointments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Doctor
                          </th>
                          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Specialty
                          </th>
                          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {upcomingAppointments.map((appointment) => (
                          <tr key={appointment.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-800">{appointment.doctor}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-gray-600">{appointment.specialty}</td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-gray-800">{appointment.date}</div>
                              <div className="text-gray-500 text-sm">{appointment.time}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-gray-600">{appointment.location}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-right">
                              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Details</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No upcoming appointments</p>
                    <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                      Schedule Appointment
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Health Metrics Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Health Metrics</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {healthMetrics.map((metric) => (
                    <div key={metric.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">{metric.label}</span>
                        <span className="font-semibold text-gray-800">
                          {metric.value} <span className="text-gray-500 text-sm">{metric.unit}</span>
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{metric.date}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
                    onClick={() => setShowTipsModal(true)}
                  >
                    View Health Tips
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Medications Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Current Medications</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">Manage Medications</button>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Medication
                      </th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dosage
                      </th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Frequency
                      </th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Refill Date
                      </th>
                      <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Remaining
                      </th>
                      <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {medications.map((medication) => (
                      <tr key={medication.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-800">{medication.name}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-gray-600">{medication.dosage}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-gray-600">{medication.frequency}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-gray-600">{medication.refillDate}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              medication.remaining <= 5
                                ? "bg-red-100 text-red-800"
                                : medication.remaining <= 10
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {medication.remaining} pills
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Refill</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-800">Appointment Completed</p>
                    <p className="text-sm text-gray-500">Dr. Sarah Johnson - Cardiology Checkup</p>
                    <p className="text-xs text-gray-400">March 18, 2025 at 11:30 AM</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-800">Prescription Refilled</p>
                    <p className="text-sm text-gray-500">Lisinopril - 30 day supply</p>
                    <p className="text-xs text-gray-400">March 15, 2025</p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 text-purple-600">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-800">Lab Results Available</p>
                    <p className="text-sm text-gray-500">Complete Blood Count (CBC)</p>
                    <p className="text-xs text-gray-400">March 10, 2025</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All Activity</button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Health Tips Modal */}
      {showTipsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Health Tips & Recommendations</h2>
              <button onClick={() => setShowTipsModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Following these evidence-based health tips can help you maintain and improve your overall wellbeing.
                Remember that small, consistent changes lead to significant health benefits over time.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {healthTips.map((tip, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                        {tip.icon}
                      </div>
                      <h3 className="font-semibold text-gray-800">{tip.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{tip.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowTipsModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardP

