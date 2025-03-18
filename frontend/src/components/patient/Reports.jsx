import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaFileMedical, FaUpload, FaDownload, FaTrash } from "react-icons/fa";
import { supabase } from "../../supabase";

const Reports = () => {
    const [reports, setReports] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [patientId, setPatientId] = useState(null);
    
    // Fetch current user and their patient id on component mount
    useEffect(() => {
        const initializeData = async () => {
            const user = await fetchCurrentUser();
            if (user) {
                await fetchReports(user.id);
            }
        };
        
        initializeData();
    }, []);
    
    const fetchCurrentUser = async () => {
        try {
            // Get current authenticated user
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            
            if (authError) {
                setErrorMessage(`Authentication error: ${authError.message}`);
                return null;
            }
            
            if (!user) {
                setErrorMessage("Please log in to view your reports");
                return null;
            }
            
            setCurrentUser(user);
            
            // Check if user is a patient and get their patient ID
            const { data: patientData, error: patientError } = await supabase
                .from('patient')
                .select('id')
                .eq('id', user.id)
                .single();
            
            if (patientError && patientError.code !== 'PGRST116') {
                console.error("Error fetching patient data:", patientError);
                setErrorMessage("Error loading patient information. Please contact support.");
                return user;
            }
            
            if (patientData) {
                setPatientId(patientData.id);
            }
            
            return user;
        } catch (error) {
            console.error("Error fetching user:", error);
            setErrorMessage(`Authentication error: ${error.message}`);
            return null;
        }
    };

    const fetchReports = async (userId) => {
        try {
            if (!userId) return;
            
            // Get reports for this patient
            const { data, error } = await supabase
                .from('reports')
                .select('*')
                .eq('patient_id', userId)
                .order('date', { ascending: false });

            if (error) {
                // Handle case where reports table might not exist
                if (error.code === '42P01') {
                    setErrorMessage("Reports feature is not set up properly. Please contact support.");
                    console.error("Table 'reports' does not exist");
                } else {
                    setErrorMessage(`Error fetching reports: ${error.message}`);
                    console.error("Error fetching reports:", error);
                }
                return;
            }

            setReports(data || []);
        } catch (error) {
            console.error("Unexpected error fetching reports:", error);
            setErrorMessage(`Unexpected error: ${error.message}`);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setErrorMessage("");

        try {
            if (!currentUser) {
                throw new Error("Please log in to upload reports");
            }
            
            // Create storage bucket if it doesn't exist
            try {
                const { data: buckets } = await supabase.storage.listBuckets();
                const bucketExists = buckets.some(b => b.name === 'medical-reports');
                
                if (!bucketExists) {
                    await supabase.storage.createBucket('medical-reports', { 
                        public: true,
                        fileSizeLimit: 10485760  // 10MB
                    });
                }
            } catch (bucketError) {
                console.warn("Bucket check/create error:", bucketError);
                // Continue anyway, the bucket might already exist
            }

            // Upload file to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const filePath = `${currentUser.id}/${fileName}`;  // Organize by user ID

            const { error: uploadError } = await supabase.storage
                .from('medical-reports')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) throw new Error(`Upload error: ${uploadError.message}`);

            // Get the public URL for the file
            const { data: urlData } = await supabase.storage
                .from('medical-reports')
                .getPublicUrl(filePath);

            if (!urlData || !urlData.publicUrl) {
                throw new Error("Failed to get public URL for the uploaded file");
            }

            const publicUrl = urlData.publicUrl;

            // Insert report metadata into Supabase database
            const { error: dbError } = await supabase
                .from('reports')
                .insert({
                    patient_id: currentUser.id,
                    name: file.name,
                    date: new Date().toISOString().split('T')[0],
                    type: getFileType(file.name),
                    file_path: filePath,
                    file_url: publicUrl
                });

            if (dbError) {
                // If database insert fails, also delete the uploaded file
                await supabase.storage
                    .from('medical-reports')
                    .remove([filePath]);
                    
                throw new Error(`Database error: ${dbError.message}`);
            }

            // Refresh the reports list
            fetchReports(currentUser.id);
        } catch (error) {
            console.error("Error uploading report:", error);
            setErrorMessage(`Failed to upload report: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDownload = async (report) => {
        try {
            // Check if file_url exists
            if (!report.file_url) {
                setErrorMessage("This report doesn't have an associated file.");
                return;
            }

            window.open(report.file_url, "_blank");
        } catch (error) {
            console.error("Error downloading report:", error);
            setErrorMessage(`Failed to download report: ${error.message}`);
        }
    };

    const handleDelete = async (id, filePath) => {
        try {
            // 1. Delete from Supabase database
            const { error: dbError } = await supabase
                .from('reports')
                .delete()
                .eq('id', id);

            if (dbError) throw new Error(`Database error: ${dbError.message}`);

            // 2. Delete from storage if path exists
            if (filePath) {
                const { error: storageError } = await supabase.storage
                    .from('medical-reports')
                    .remove([filePath]);

                if (storageError) {
                    console.warn("Could not delete file from storage:", storageError.message);
                    // Continue anyway since the database record is already deleted
                }
            }

            // 3. Refresh reports list
            if (currentUser) {
                fetchReports(currentUser.id);
            }
        } catch (error) {
            console.error("Error deleting report:", error);
            setErrorMessage(`Failed to delete report: ${error.message}`);
        }
    };

    // Helper function to determine file type based on extension
    const getFileType = (filename) => {
        const ext = filename.split('.').pop().toLowerCase();
        
        if (['pdf', 'doc', 'docx'].includes(ext)) return "Document";
        if (['jpg', 'jpeg', 'png', 'dicom', 'dcm'].includes(ext)) return "Imaging";
        if (['xls', 'xlsx', 'csv'].includes(ext)) return "Lab Test";
        return "Other";
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

            {/* Error Message */}
            {errorMessage && (
                <div className="w-full max-w-4xl bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {errorMessage}
                </div>
            )}

            {/* Report List */}
            <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-6 backdrop-blur-lg">
                {!currentUser ? (
                    <div className="text-center py-8 text-gray-500">
                        Please log in to view your reports.
                    </div>
                ) : reports.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No reports found. Upload your first report!
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-gray-700 font-semibold">
                                <th className="p-3">Report Name</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Type</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report) => (
                                <tr key={report.id} className="border-b hover:bg-gray-100 transition">
                                    <td className="p-3 flex items-center gap-2">
                                        <FaFileMedical className="text-blue-500" /> {report.name}
                                    </td>
                                    <td className="p-3">{report.date}</td>
                                    <td className="p-3">{report.type}</td>
                                    <td className="p-3 flex justify-center gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="bg-green-500 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                                            onClick={() => handleDownload(report)}
                                        >
                                            <FaDownload /> Download
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="bg-red-500 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                                            onClick={() => handleDelete(report.id, report.file_path)}
                                        >
                                            <FaTrash /> Delete
                                        </motion.button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Upload Section */}
            {currentUser && (
                <motion.label
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl shadow-lg cursor-pointer flex items-center gap-2 ${isUploading ? 'opacity-50' : ''}`}
                >
                    <FaUpload /> {isUploading ? 'Uploading...' : 'Upload Report'}
                    <input 
                        type="file" 
                        className="hidden" 
                        onChange={handleUpload} 
                        disabled={isUploading}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx,.csv,.dicom,.dcm"
                    />
                </motion.label>
            )}
        </div>
    );
};

export default Reports;