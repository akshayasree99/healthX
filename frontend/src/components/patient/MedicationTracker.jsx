import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../supabase.js"; // Adjust the path as needed

const MedicationTracker = () => {
  const [medications, setMedications] = useState([]);
  const [newMed, setNewMed] = useState({ name: "", dosage: "", frequency: "" });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [overallStatus, setOverallStatus] = useState("No medications");
  const [user, setUser] = useState(null);
  const [editingMed, setEditingMed] = useState(null);

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
  }, []);

  // Calculate overall status whenever medications change
  useEffect(() => {
    calculateOverallStatus();
  }, [medications]);

  const fetchMedications = async (userId) => {
    try {
      setLoading(true);
      
      // Query medications table for this patient
      const { data, error } = await supabase
        .from("medications")
        .select("*")
        .eq("patient_id", userId)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      setMedications(data || []);
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
            frequency: newMed.frequency
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
          patient_id: user.id,
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
      
      setNewMed({ name: "", dosage: "", frequency: "" });
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
      frequency: med.frequency
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
      setOverallStatus("Complete");
    } else if (someMissed) {
      setOverallStatus("Incomplete");
    } else if (allPending) {
      setOverallStatus("Pending");
    } else {
      setOverallStatus("In Progress");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-200 to-pink-300 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Please log in to use the Medication Tracker</h1>
        <p>You need to be signed in to track your medications.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-100 via-purple-200 to-pink-300 p-8">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent mb-6"
      >
        Medication Tracker 💊
      </motion.h1>
      
      {/* Overall Status */}
      <div className="mb-6 text-center">
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
      <div className="w-full max-w-4xl bg-white bg-opacity-80 shadow-xl rounded-xl p-6 backdrop-blur-lg">
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
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medications.map((med) => (
                <tr key={med.id} className="border-b hover:bg-gray-100 transition">
                  <td className="p-3">{med.name}</td>
                  <td className="p-3">{med.dosage}</td>
                  <td className="p-3">{med.frequency}</td>
                  <td className={`p-3 font-semibold ${
                    med.status === "Taken" ? "text-green-500" : 
                    med.status === "Missed" ? "text-red-500" : "text-yellow-500"
                  }`}>
                    {med.status}
                  </td>
                  <td className="p-3">
                    <div className="flex space-x-2 flex-wrap">
                      <button 
                        onClick={() => handleStatusChange(med.id, "Taken")}
                        className={`px-3 py-1 rounded text-xs mb-1 ${
                          med.status === "Taken" ? "bg-green-500 text-white" : "bg-gray-200"
                        }`}
                      >
                        ✓ Taken
                      </button>
                      <button 
                        onClick={() => handleStatusChange(med.id, "Missed")}
                        className={`px-3 py-1 rounded text-xs mb-1 ${
                          med.status === "Missed" ? "bg-red-500 text-white" : "bg-gray-200"
                        }`}
                      >
                        ✗ Missed
                      </button>
                      <button 
                        onClick={() => handleEditMedication(med)}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-xs mb-1"
                      >
                        ✎ Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteMedication(med.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded text-xs mb-1"
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
        className="mt-6 px-6 py-3 bg-gradient-to-r from-red-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg"
        onClick={() => {
          setEditingMed(null);
          setNewMed({ name: "", dosage: "", frequency: "" });
          setShowModal(true);
        }}
      >
        ➕ Add Medication
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
    </div>
  );
};

export default MedicationTracker;