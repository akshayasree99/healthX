import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import {
    FaVideo, FaMicrophone, FaMicrophoneSlash, FaPhoneSlash, FaRegClock, FaComments,
    FaFileUpload, FaRecordVinyl, FaBell, FaDesktop, FaRedo, FaGlobe, FaUsers, FaHeadset
} from "react-icons/fa";
import { motion } from "framer-motion";

const socket = io("http://localhost:5001");

const VideoCall = () => {
    const [roomId, setRoomId] = useState("");
    const [joined, setJoined] = useState(false);
    const [peerConnection, setPeerConnection] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [videoOn, setVideoOn] = useState(true);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const localStreamRef = useRef(null);

    useEffect(() => {
        if (!joined) return;
    
        socket.emit("join-room", roomId);
    
        socket.on("offer", async ({ offer }) => {
            console.log("📥 Received Offer:", offer);
            handleOffer(offer);
        });
    
        socket.on("answer", async ({ answer }) => {
            console.log("📥 Received Answer:", answer);
            peerConnection?.setRemoteDescription(new RTCSessionDescription(answer));
        });
    
        socket.on("candidate", ({ candidate }) => {
            console.log("📥 Received ICE Candidate:", candidate);
            peerConnection?.addIceCandidate(new RTCIceCandidate(candidate));
        });
    
        socket.on("user-joined", ({ userId }) => {
            console.log(`👤 User ${userId} joined the room`);
        });
    
        socket.on("user-left", ({ userId }) => {
            console.log(`🚪 User ${userId} left the call`);
        });
    
        return () => {
            socket.off("offer");
            socket.off("answer");
            socket.off("candidate");
            socket.off("user-joined");
            socket.off("user-left");
        };
    }, [peerConnection, joined]);

    const joinRoom = () => {
        if (!roomId.trim()) return alert("Please enter a Room ID");
        setJoined(true);
    };

    const startCall = async () => {
        try {
            const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = localStream;
            localVideoRef.current.srcObject = localStream;
    
            const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
            setPeerConnection(pc);
    
            localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
            pc.ontrack = (event) => {
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = event.streams[0];
                }
            };
    
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit("candidate", { roomId, candidate: event.candidate });
                }
            };
    
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            
            console.log("📤 Sending Offer:", offer);
            socket.emit("offer", { roomId, offer });
    
        } catch (error) {
            console.error("❌ Error starting call:", error);
        }
    };

    const handleOffer = async (offer) => {
        try {
            const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = localStream;
            localVideoRef.current.srcObject = localStream;
    
            const pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
            setPeerConnection(pc);
    
            localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
            pc.ontrack = (event) => {
                remoteVideoRef.current.srcObject = event.streams[0];
            };
    
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit("candidate", { roomId, candidate: event.candidate });
                }
            };
    
            await pc.setRemoteDescription(new RTCSessionDescription(offer));
    
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
    
            console.log("📤 Sending Answer:", answer);
            socket.emit("answer", { roomId, answer });
    
        } catch (error) {
            console.error("❌ Error handling offer:", error);
        }
    };

    const endCall = () => {
        peerConnection?.close();
        setPeerConnection(null);
        localStreamRef.current?.getTracks().forEach(track => track.stop());
        localVideoRef.current.srcObject = null;
        remoteVideoRef.current.srcObject = null;
        socket.emit("leave-room", { roomId });
        setJoined(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900">
            {!joined ? (
                <div className="flex flex-col items-center justify-center min-h-screen px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl"
                    >
                        <h2 className="text-3xl font-bold mb-8 text-white text-center">
                            Join Video Call
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <input
                                    type="text"
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value)}
                                    placeholder="Enter Room ID"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={joinRoom}
                                className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all duration-200 shadow-lg"
                            >
                                Join Room
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            ) : (
                <div className="container mx-auto p-6">
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <video
                                        ref={localVideoRef}
                                        autoPlay
                                        playsInline
                                        className="w-full rounded-xl object-cover aspect-video bg-black/40"
                                    />
                                    <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg text-white text-sm">
                                        You
                                    </div>
                                </div>
                                <div className="relative">
                                    <video
                                        ref={remoteVideoRef}
                                        autoPlay
                                        playsInline
                                        className="w-full rounded-xl object-cover aspect-video bg-black/40"
                                    />
                                    <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg text-white text-sm">
                                        Remote User
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-wrap justify-center gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={startCall}
                                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg"
                                >
                                    <FaVideo className="text-xl" />
                                    <span>Start Call</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={endCall}
                                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:opacity-90 transition-all duration-200 shadow-lg"
                                >
                                    <FaPhoneSlash className="text-xl" />
                                    <span>End Call</span>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setVideoOn(!videoOn)}
                                    className={`px-6 py-3 rounded-xl text-white transition-all duration-200 shadow-lg ${
                                        videoOn ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-orange-500 to-red-500'
                                    }`}
                                >
                                    <FaVideo className="text-xl" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsMuted(!isMuted)}
                                    className={`px-6 py-3 rounded-xl text-white transition-all duration-200 shadow-lg ${
                                        !isMuted ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-orange-500 to-red-500'
                                    }`}
                                >
                                    {isMuted ? <FaMicrophoneSlash className="text-xl" /> : <FaMicrophone className="text-xl" />}
                                </motion.button>
                            </div>

                            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                {[FaRegClock, FaComments, FaFileUpload, FaRecordVinyl, FaBell, FaDesktop, FaRedo, FaGlobe, FaUsers, FaHeadset].map((Icon, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex flex-col items-center justify-center p-4 bg-white/5 backdrop-blur-sm rounded-xl cursor-pointer hover:bg-white/10 transition-all duration-200"
                                    >
                                        <Icon className="text-2xl text-white/80 mb-2" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoCall;