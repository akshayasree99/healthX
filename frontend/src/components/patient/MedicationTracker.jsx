import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../supabase.js"; // Adjust the path as needed

const MedicationTracker = () => {
  const [medications, setMedications] = useState([]);
  const [newMed, setNewMed] = useState({ name: "", dosage: "", frequency: "", time: "" });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [overallStatus, setOverallStatus] = useState("No medications");
  const [user, setUser] = useState(null);
  const [editingMed, setEditingMed] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMed, setNotificationMed] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [alarms, setAlarms] = useState([]);
  const [reminderIntervals, setReminderIntervals] = useState({});

  // Check for authenticated user on component mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchMedications(user.id);
      } else {
        setLoading(false);
      }
    };
    
    getUser();
    
    // Check for notification permission
    if (Notification && Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        setPermissionGranted(permission === "granted");
      });
    }
  }, []);

  // Calculate overall status whenever medications change
  useEffect(() => {
    calculateOverallStatus();
  }, [medications]);

  // Set up alarm listeners
  useEffect(() => {
    if (medications.length > 0) {
      // Clear existing alarms
      alarms.forEach(alarm => clearTimeout(alarm.timerId));
      
      // Set up new alarms
      const newAlarms = medications.map(med => {
        if (!med.time) return null;
        
        const [hours, minutes] = med.time.split(':').map(Number);
        const now = new Date();
        const alarmTime = new Date();
        alarmTime.setHours(hours, minutes, 0);
        
        // If the time has already passed today, set for tomorrow
        if (alarmTime < now) {
          alarmTime.setDate(alarmTime.getDate() + 1);
        }
        
        const timeUntilAlarm = alarmTime - now;
        
        // Set timeout for the alarm
        const timerId = setTimeout(() => {
          triggerAlarm(med);
          // Start the 5-minute interval reminder
          startReminderInterval(med);
          
          // Set up next day's alarm
          const nextAlarmTime = new Date(alarmTime);
          nextAlarmTime.setDate(nextAlarmTime.getDate() + 1);
          const nextTimeUntilAlarm = nextAlarmTime - new Date();
          const nextTimerId = setTimeout(() => triggerAlarm(med), nextTimeUntilAlarm);
          
          // Update the alarm in our state
          setAlarms(prevAlarms => prevAlarms.map(alarm => 
            alarm.medId === med.id ? { ...alarm, timerId: nextTimerId } : alarm
          ));
        }, timeUntilAlarm);
        
        return { medId: med.id, timerId, time: med.time };
      }).filter(Boolean);
      
      setAlarms(newAlarms);
    }
    
    // Clean up on unmount
    return () => {
      alarms.forEach(alarm => clearTimeout(alarm.timerId));
      Object.values(reminderIntervals).forEach(interval => clearInterval(interval));
    };
  }, [medications]);

  // Monitor medication status to stop reminders when taken
  useEffect(() => {
    medications.forEach(med => {
      if (med.status === "Taken" && reminderIntervals[med.id]) {
        clearInterval(reminderIntervals[med.id]);
        setReminderIntervals(prevIntervals => {
          const newIntervals = {...prevIntervals};
          delete newIntervals[med.id];
          return newIntervals;
        });
      }
    });
  }, [medications]);

  const startReminderInterval = (med) => {
    // Clear any existing interval for this medication
    if (reminderIntervals[med.id]) {
      clearInterval(reminderIntervals[med.id]);
    }
    
    // Only start reminder if medication is not already taken
    const medication = medications.find(m => m.id === med.id);
    if (medication && medication.status !== "Taken") {
      // Set new interval - 5 minutes (300000 ms)
      const intervalId = setInterval(() => {
        // Check if medication has been taken before sending another reminder
        const currentMed = medications.find(m => m.id === med.id);
        if (currentMed && currentMed.status !== "Taken") {
          triggerAlarm(med);
        } else {
          // Stop the interval if medication is taken
          clearInterval(intervalId);
          setReminderIntervals(prevIntervals => {
            const newIntervals = {...prevIntervals};
            delete newIntervals[med.id];
            return newIntervals;
          });
        }
      }, 300000); // 5 minutes
      
      // Store the interval ID
      setReminderIntervals(prevIntervals => ({
        ...prevIntervals,
        [med.id]: intervalId
      }));
    }
  };

  const triggerAlarm = (med) => {
    // Show in-app notification
    setNotificationMed(med);
    setShowNotification(true);
    
    // Play sound (optional)
    const audio = new Audio('/notification-sound.mp3'); // Add this sound file to your public directory
    audio.play().catch(e => console.log("Audio play failed:", e));
    
    // Browser notification if permission granted
    if (permissionGranted) {
      new Notification(`Time to take ${med.name}`, {
        body: `Dosage: ${med.dosage}`,
        icon: '/pill-icon.png', // Add this icon to your public directory
        requireInteraction: true, // Keeps notification visible until user interacts with it
      });
    }
    
    // Vibration for mobile devices if supported
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  const dismissNotification = () => {
    setShowNotification(false);
  };

  const markAsTaken = () => {
    if (notificationMed) {
      handleStatusChange(notificationMed.id, "Taken");
      
      // Clear reminder interval
      if (reminderIntervals[notificationMed.id]) {
        clearInterval(reminderIntervals[notificationMed.id]);
        setReminderIntervals(prevIntervals => {
          const newIntervals = {...prevIntervals};
          delete newIntervals[notificationMed.id];
          return newIntervals;
        });
      }
      
      dismissNotification();
    }
  };

  const snoozeReminder = () => {
    if (notificationMed) {
      // Snooze for 5 minutes
      setTimeout(() => {
        // Check if medication has been taken before sending another reminder
        const currentMed = medications.find(m => m.id === notificationMed.id);
        if (currentMed && currentMed.status !== "Taken") {
          triggerAlarm(notificationMed);
        }
      }, 300000); // 5 minutes
      
      dismissNotification();
    }
  };

  const fetchMedications = async (userId) => {
    try {
      setLoading(true);
      
      // Query medications table for this patient
      const { data, error } = await supabase
        .from("medications")
        .select("*")
        .eq("id", userId)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      setMedications(data || []);
      
      // Check if any medications need immediate reminders
      // This is for medications that had alarms set but the app was closed
      if (data && data.length > 0) {
        data.forEach(med => {
          if (med.time && med.status !== "Taken") {
            const [hours, minutes] = med.time.split(':').map(Number);
            const now = new Date();
            const alarmTime = new Date();
            alarmTime.setHours(hours, minutes, 0);
            
            // If the medication time has already passed today and it's not taken
            if (alarmTime < now && now - alarmTime < 86400000) { // Within 24 hours
              startReminderInterval(med);
            }
          }
        });
      }
    } catch (error) {
      console.error("Error fetching medications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMedication = async () => {
    try {
      if (!user) {
        alert("You must be logged in to add medications");
        return;
      }
      
      // If we're editing an existing medication
      if (editingMed) {
        const { error } = await supabase
          .from("medications")
          .update({ 
            name: newMed.name,
            dosage: newMed.dosage,
            frequency: newMed.frequency,
            time: newMed.time
          })
          .eq("id", editingMed.id);
          
        if (error) throw error;
        
        // Update local state
        setMedications(medications.map(med => 
          med.id === editingMed.id ? { ...med, ...newMed } : med
        ));
        
        setEditingMed(null);
      } 
      // Adding a new medication
      else {
        const newMedication = { 
          ...newMed, 
          id: user.id,
          status: "Pending"
        };
        
        const { data, error } = await supabase
          .from("medications")
          .insert([newMedication])
          .select();
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setMedications([data[0], ...medications]);
        }
      }
      
      setNewMed({ name: "", dosage: "", frequency: "", time: "" });
      setShowModal(false);
    } catch (error) {
      console.error("Error saving medication:", error);
      alert("Failed to save medication. Please try again.");
    }
  };

  const handleEditMedication = (med) => {
    setEditingMed(med);
    setNewMed({
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      time: med.time || ""
    });
    setShowModal(true);
  };

  const handleDeleteMedication = async (id) => {
    try {
      if (!confirm("Are you sure you want to delete this medication?")) {
        return;
      }
      
      const { error } = await supabase
        .from("medications")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      // Update local state
      setMedications(medications.filter(med => med.id !== id));
      
      // Clean up any alarms for this medication
      const medAlarm = alarms.find(alarm => alarm.medId === id);
      if (medAlarm) {
        clearTimeout(medAlarm.timerId);
        setAlarms(alarms.filter(alarm => alarm.medId !== id));
      }
      
      // Clean up any reminder intervals
      if (reminderIntervals[id]) {
        clearInterval(reminderIntervals[id]);
        setReminderIntervals(prevIntervals => {
          const newIntervals = {...prevIntervals};
          delete newIntervals[id];
          return newIntervals;
        });
      }
    } catch (error) {
      console.error("Error deleting medication:", error);
      alert("Failed to delete medication. Please try again.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Update local state first for immediate feedback
      const updatedMeds = medications.map(med => 
        med.id === id ? { ...med, status: newStatus } : med
      );
      setMedications(updatedMeds);
      
      // Then update in database
      const { error } = await supabase
        .from("medications")
        .update({ status: newStatus })
        .eq("id", id);
        
      if (error) throw error;
      
      // If marked as taken, stop any reminder intervals
      if (newStatus === "Taken" && reminderIntervals[id]) {
        clearInterval(reminderIntervals[id]);
        setReminderIntervals(prevIntervals => {
          const newIntervals = {...prevIntervals};
          delete newIntervals[id];
          return newIntervals;
        });
      }
      
      // Recalculate overall status
      calculateOverallStatus();
    } catch (error) {
      console.error("Error updating medication status:", error);
      // Revert to original state if error
      if (user) {
        fetchMedications(user.id);
      }
    }
  };
  
  const calculateOverallStatus = () => {
    if (medications.length === 0) {
      setOverallStatus("No medications");
      return;
    }
    
    const allTaken = medications.every(med => med.status === "Taken");
    const someMissed = medications.some(med => med.status === "Missed");
    const allPending = medications.every(med => med.status === "Pending");
    
    if (allTaken) {
      setOverallStatus("Incomplete");
    } else if (someMissed) {
      setOverallStatus("Complete");
    } else if (allPending) {
      setOverallStatus("Pending");
    } else {
      setOverallStatus("In Progress");
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    return new Date(0, 0, 0, hours, minutes).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatNextDose = (timeString) => {
    if (!timeString) return "No time set";
    
    const [hours, minutes] = timeString.split(':').map(Number);
    const now = new Date();
    const alarmTime = new Date();
    alarmTime.setHours(hours, minutes, 0);
    
    // If the time has already passed today, set for tomorrow
    if (alarmTime < now) {
      alarmTime.setDate(alarmTime.getDate() + 1);
    }
    
    return `Next dose: ${alarmTime.toLocaleString()}`;
  };

  // Check if a medication has active reminders
  const hasActiveReminder = (medId) => {
    return !!reminderIntervals[medId];
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-300 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Please log in to use the Medication Tracker</h1>
        <p>You need to be signed in to track your medications.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-white">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-6 tracking-tight"
      >
        Medication Tracker 💊
      </motion.h1>
      
      {/* Overall Status */}
      <div className="mb-6 text-center ">
        <h2 className="text-xl font-semibold text-gray-800">Today's Status: 
          <span className={`ml-2 font-bold ${
            overallStatus === "Complete" ? "text-green-600" : 
            overallStatus === "Incomplete" ? "text-red-600" :
            overallStatus === "In Progress" ? "text-yellow-600" : "text-gray-600"
          }`}>
            {overallStatus}
          </span>
        </h2>
      </div>

      {/* Medication Table */}
      <div className="w-full max-w-4xl bg-slate-100 bg-opacity-80 shadow-xl rounded-xl p-6 backdrop-blur-lg">
        {loading ? (
          <div className="text-center py-8">Loading your medications...</div>
        ) : medications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No medications added yet. Click the button below to add your first medication.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-700 font-semibold">
                <th className="p-3">Medication</th>
                <th className="p-3">Dosage</th>
                <th className="p-3">Frequency</th>
                <th className="p-3">Time</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medications.map((med) => (
                <tr key={med.id} className={`border-b hover:bg-gray-100 transition ${
                  hasActiveReminder(med.id) ? "bg-red-100" : ""
                }`}>
                  <td className="p-3">
                    {med.name}
                    {hasActiveReminder(med.id) && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <span className="animate-pulse mr-1">●</span> Due
                      </span>
                    )}
                  </td>
                  <td className="p-3">{med.dosage}</td>
                  <td className="p-3">{med.frequency}</td>
                  <td className="p-3">
                    {med.time ? formatTime(med.time) : "No time set"}
                    {med.time && (
                      <div className="text-xs text-gray-500">
                        {formatNextDose(med.time)}
                      </div>
                    )}
                  </td>
                  <td className={`p-3 font-semibold ${
                    med.status === "Taken" ? "text-green-500" : 
                    med.status === "Missed" ? "text-red-500" : "text-yellow-500"
                  }`}>
                    {med.status}
                  </td>
                  <td className="p-5">
                    <div className="flex  items-center gap-2">
                      <button 
                        onClick={() => handleStatusChange(med.id, "Taken")}
                        className={`px-5 py-0.5 rounded-lg text-sm font-medium shadow-md transition ${
                          med.status === "Taken" 
                            ? "bg-green-500 text-white hover:bg-green-600" 
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        ✓ Taken
                      </button>
                      <button 
                        onClick={() => handleStatusChange(med.id, "Missed")}
                        className={`px-5 py-0.5 rounded-lg text-sm font-medium shadow-md transition ${
                          med.status === "Missed" 
                            ? "bg-red-500 text-white hover:bg-red-600" 
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        ✗ Missed
                      </button>
                      <button 
                        onClick={() => handleEditMedication(med)}
                        className="px-5 py-0.5 bg-blue-500 text-white rounded-lg text-sm font-medium shadow-md hover:bg-blue-600 transition"
                      >
                        ✎ Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteMedication(med.id)}
                        className="px-5 py-0.5 bg-red-500 text-white rounded-lg text-sm font-medium shadow-md hover:bg-red-600 transition"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md mt-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Medication Adherence</h3>
        <div className="w-full bg-gray-300 rounded-full h-4">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ 
              width: `${medications.length > 0 ? 
                (medications.filter(m => m.status === "Taken").length / medications.length) * 100 : 0}%` 
            }}
            transition={{ duration: 1 }}
            className="h-full bg-green-500 rounded-full"
          ></motion.div>
        </div>
        <div className="text-right text-sm mt-1 text-gray-600">
          {medications.filter(m => m.status === "Taken").length}/{medications.length} taken
        </div>
      </div>

      {/* Add Medication Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 mb-6 tracking-tight font-semibold rounded-xl shadow-lg text-white"
        onClick={() => {
          setEditingMed(null);
          setNewMed({ name: "", dosage: "", frequency: "", time: "" });
          setShowModal(true);
        }}
      >
        + Add Medication
      </motion.button>

      {/* Add/Edit Medication Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full"
          >
            <h2 className="text-2xl font-semibold text-gray-800">
              {editingMed ? "Edit Medication" : "Add New Medication"}
            </h2>
            <input
              type="text"
              placeholder="Medication Name"
              className="w-full p-2 border border-gray-300 rounded mt-3"
              value={newMed.name}
              onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Dosage"
              className="w-full p-2 border border-gray-300 rounded mt-3"
              value={newMed.dosage}
              onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
            />
            <input
              type="text"
              placeholder="Frequency"
              className="w-full p-2 border border-gray-300 rounded mt-3"
              value={newMed.frequency}
              onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
            />
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reminder Time
              </label>
              <input
                type="time"
                className="w-full p-2 border border-gray-300 rounded"
                value={newMed.time}
                onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
              />
            </div>
            <div className="flex justify-end mt-4">
              <button 
                className="px-4 py-2 bg-gray-300 rounded mr-2" 
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={handleSaveMedication}
                disabled={!newMed.name || !newMed.dosage || !newMed.frequency}
              >
                {editingMed ? "Update" : "Add"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotification && notificationMed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">
              Medication Reminder
            </h2>
            <div className="text-center mb-4">
              <p className="text-lg font-semibold">{notificationMed.name}</p>
              <p>Dosage: {notificationMed.dosage}</p>
              <p>Frequency: {notificationMed.frequency}</p>
              <p className="text-red-500 font-semibold mt-2">
                This reminder will repeat every 5 minutes until you take your medication
              </p>
            </div>
            <div className="flex justify-center space-x-3 mt-4 flex-wrap">
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded mb-2" 
                onClick={snoozeReminder}
              >
                Snooze (5 min)
              </button>
              <button 
                className="px-4 py-2 bg-gray-300 rounded mb-2" 
                onClick={dismissNotification}
              >
                Dismiss
              </button>
              <button 
                className="px-4 py-2 bg-green-500 text-white rounded mb-2"
                onClick={markAsTaken}
              >
                Mark as Taken
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Notification Permission Request */}
      {!permissionGranted && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-sm">
          <h3 className="font-semibold mb-2">Enable Notifications</h3>
          <p className="text-sm mb-3">Allow notifications to receive medication reminders even when the app is closed.</p>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded text-sm"
            onClick={() => {
              Notification.requestPermission().then(permission => {
                setPermissionGranted(permission === "granted");
              });
            }}
          >
            Enable Notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default MedicationTracker;