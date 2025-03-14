import { useState } from "react";
import { FaVideo, FaMicrophone, FaMicrophoneSlash, FaPhoneSlash, FaRegClock, FaComments, FaFileUpload, FaRecordVinyl, FaBell, FaDesktop, FaRedo, FaGlobe, FaUsers, FaHeadset } from "react-icons/fa";
import { motion } from "framer-motion";

const VideoCall = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(true);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-purple-600 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-white p-6 rounded-2xl shadow-xl text-center"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-4">📹 Video Call Interface</h1>
        <p className="text-gray-600">Seamless consultation experience with your doctor.</p>
        
        <div className="flex justify-center gap-6 mt-6">
          <button onClick={() => setVideoOn(!videoOn)} className="bg-blue-500 p-4 rounded-full shadow-lg text-white text-xl hover:bg-blue-700 transition">
            {videoOn ? <FaVideo /> : "📷"}
          </button>
          <button onClick={() => setIsMuted(!isMuted)} className="bg-green-500 p-4 rounded-full shadow-lg text-white text-xl hover:bg-green-700 transition">
            {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
          </button>
          <button className="bg-red-500 p-4 rounded-full shadow-lg text-white text-xl hover:bg-red-700 transition">
            <FaPhoneSlash />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          <Feature icon={<FaRegClock />} title="Call Timer" />
          <Feature icon={<FaComments />} title="Live Chat" />
          <Feature icon={<FaFileUpload />} title="File Sharing" />
          <Feature icon={<FaRecordVinyl />} title="Call Recording" />
          <Feature icon={<FaBell />} title="Reminders & Alerts" />
          <Feature icon={<FaDesktop />} title="Screen Share" />
          <Feature icon={<FaRedo />} title="Auto-Reconnect" />
          <Feature icon={<FaGlobe />} title="Real-Time Translation" />
          <Feature icon={<FaUsers />} title="Doctor Queue" />
          <Feature icon={<FaHeadset />} title="Emergency Call" />
        </div>
      </motion.div>
    </div>
  );
};

const Feature = ({ icon, title }) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    className="flex flex-col items-center bg-gray-100 p-4 rounded-xl shadow-md"
  >
    <div className="text-4xl text-blue-500 mb-2">{icon}</div>
    <p className="text-gray-700 font-semibold">{title}</p>
  </motion.div>
);

export default VideoCall;
