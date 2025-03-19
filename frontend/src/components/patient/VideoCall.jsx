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
        <div className="flex flex-col items-center bg-[#d7e6f5] min-h-screen text-gray-800 p-8">
            <h2 className="text-3xl font-bold mb-8 text-[#2a5c99]">Video Call</h2>
            {!joined ? (
                <div className="flex flex-col items-center space-y-6 bg-[#fef3c7] p-8 rounded-2xl shadow-lg">
                    <input
                        type="text"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        placeholder="Enter Room ID"
                        className="border border-gray-300 p-3 w-80 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
                    />
                    <button onClick={joinRoom} className="bg-[#fbbf24] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#f59e0b]">
                        Join Room
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex justify-center space-x-8 mb-6">
                        <video ref={localVideoRef} autoPlay playsInline className="border rounded-lg w-[480px] h-[360px] bg-black shadow-lg" />
                        <video ref={remoteVideoRef} autoPlay playsInline className="border rounded-lg w-[480px] h-[360px] bg-black shadow-lg" />
                    </div>
                    <div className="flex space-x-6 mb-6">
                        <button onClick={startCall} className="bg-[#2a5c99] text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-[#1f4a77]">
                            <FaVideo /> <span>Start Call</span>
                        </button>
                        <button onClick={endCall} className="bg-[#ef476f] text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-[#d43f5e]">
                            <FaPhoneSlash /> <span>End Call</span>
                        </button>
                        <button onClick={() => setVideoOn(!videoOn)} className="bg-[#fbbf24] text-white px-6 py-3 rounded-lg">
                            {videoOn ? <FaVideo /> : "📷"}
                        </button>
                        <button onClick={() => setIsMuted(!isMuted)} className="bg-[#6b7280] text-white px-6 py-3 rounded-lg">
                            {isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
                        </button>
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                        {[FaRegClock, FaComments, FaFileUpload, FaRecordVinyl, FaBell, FaDesktop, FaRedo, FaGlobe, FaUsers, FaHeadset].map((Icon, index) => (
                            <motion.div key={index} whileHover={{ scale: 1.1 }} className="flex flex-col items-center bg-[#e0f2fe] p-4 rounded-xl shadow-md">
                                <Icon className="text-4xl text-[#2a5c99] mb-2" />
                            </motion.div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default VideoCall;