import { useState } from "react";
import { motion } from "framer-motion";
import { FaFileMedical, FaUpload, FaDownload } from "react-icons/fa";
import {supabase} from "../../supabase"

const Reports = () => {
    const [reports, setReports] = useState([
        { id: 1, name: "Blood Test Report", date: "2024-03-01", type: "Lab Test" },
        { id: 2, name: "MRI Scan Report", date: "2024-02-20", type: "Imaging" },
        { id: 3, name: "Doctor's Notes", date: "2024-03-05", type: "Consultation" }
    ]);

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setReports([...reports, { id: reports.length + 1, name: file.name, date: new Date().toISOString().split('T')[0], type: "Uploaded" }]);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-100 to-blue-200 p-8">
            <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold text-blue-700 mb-6"
            >
                📄 Medical Reports
            </motion.h1>

            {/* Report List */}
            <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-6 backdrop-blur-lg">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-gray-700 font-semibold">
                            <th className="p-3">Report Name</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Type</th>
                            <th className="p-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report.id} className="border-b hover:bg-gray-100 transition">
                                <td className="p-3 flex items-center gap-2"><FaFileMedical className="text-blue-500" /> {report.name}</td>
                                <td className="p-3">{report.date}</td>
                                <td className="p-3">{report.type}</td>
                                <td className="p-3 text-center">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="bg-green-500 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                                    >
                                        <FaDownload /> Download
                                    </motion.button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Upload Section */}
            <motion.label
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg cursor-pointer flex items-center gap-2"
            >
                <FaUpload /> Upload Report
                <input type="file" className="hidden" onChange={handleUpload} />
            </motion.label>
        </div>
    );
};

export default Reports;
