import { useState } from "react";
import { motion } from "framer-motion";

const MedicationTracker = () => {
    const [medications, setMedications] = useState([
        { id: 1, name: "Paracetamol", dosage: "500mg", frequency: "Twice a day", status: "Taken" },
        { id: 2, name: "Amoxicillin", dosage: "250mg", frequency: "Once a day", status: "Missed" },
    ]);

    const [newMed, setNewMed] = useState({ name: "", dosage: "", frequency: "" });
    const [showModal, setShowModal] = useState(false);

    const handleAddMedication = () => {
        setMedications([...medications, { ...newMed, id: medications.length + 1, status: "Pending" }]);
        setNewMed({ name: "", dosage: "", frequency: "" });
        setShowModal(false);
    };

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

            {/* Medication Table */}
            <div className="w-full max-w-4xl bg-white bg-opacity-80 shadow-xl rounded-xl p-6 backdrop-blur-lg">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-gray-700 font-semibold">
                            <th className="p-3">Medication</th>
                            <th className="p-3">Dosage</th>
                            <th className="p-3">Frequency</th>
                            <th className="p-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medications.map((med) => (
                            <tr key={med.id} className="border-b hover:bg-gray-100 transition">
                                <td className="p-3">{med.name}</td>
                                <td className="p-3">{med.dosage}</td>
                                <td className="p-3">{med.frequency}</td>
                                <td className={`p-3 font-semibold ${med.status === "Taken" ? "text-green-500" : "text-red-500"}`}>
                                    {med.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md mt-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Medication Adherence</h3>
                <div className="w-full bg-gray-300 rounded-full h-4">
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: `${(medications.filter(m => m.status === "Taken").length / medications.length) * 100}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-green-500 rounded-full"
                    ></motion.div>
                </div>
            </div>

            {/* Add Medication Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-red-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg"
                onClick={() => setShowModal(true)}
            >
                ➕ Add Medication
            </motion.button>

            {/* Add Medication Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full"
                    >
                        <h2 className="text-2xl font-semibold text-gray-800">Add New Medication</h2>
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
                            <button className="px-4 py-2 bg-gray-300 rounded mr-2" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={handleAddMedication}>Add</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default MedicationTracker;
