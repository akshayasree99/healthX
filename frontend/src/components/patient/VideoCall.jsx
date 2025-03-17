import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import {
    FaVideo, FaMicrophone, FaMicrophoneSlash, FaPhoneSlash, FaRegClock, FaComments,
    FaFileUpload, FaRecordVinyl, FaBell, FaDesktop, FaRedo, FaGlobe, FaUsers, FaHeadset
} from "react-icons/fa";
import { motion } from "framer-motion";

const socket = io("http://localhost:5000");

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
        console.log("Joined room:", roomId);

        socket.on("offer", async ({ offer }) => handleOffer(offer));
        socket.on("answer", async ({ answer }) => peerConnection?.setRemoteDescription(new RTCSessionDescription(answer)));
        socket.on("candidate", ({ candidate }) => peerConnection?.addIceCandidate(new RTCIceCandidate(candidate)));
        socket.on("leave-room", () => endCall());

        return () => {
            socket.off("offer");
            socket.off("answer");
            socket.off("candidate");
            socket.off("leave-room");
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
                console.log("Receiving remote stream");
                remoteVideoRef.current.srcObject = event.streams[0];
            };
            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    console.log("Sending ICE Candidate:", event.candidate);
                    socket.emit("candidate", { roomId, candidate: event.candidate });
                }
            };

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket.emit("offer", { roomId, offer });
        } catch (error) {
            console.error("Error starting call:", error);
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
                console.log("Receiving remote stream");
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
            socket.emit("answer", { roomId, answer });
        } catch (error) {
            console.error("Error handling offer:", error);
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
        <div className="flex flex-col items-center bg-gray-900 min-h-screen text-white p-6">
            <h2 className="text-2xl font-bold mb-4">Video Call</h2>
            {!joined ? (
                <div className="flex flex-col items-center space-y-4">
                    <input type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="Enter Room ID" className="border p-2 rounded-md text-black" />
                    <button onClick={joinRoom} className="bg-green-500 text-white px-4 py-2 rounded">Join Room</button>
                </div>
            ) : (
                <>
                    <div className="flex space-x-6 mb-4">
                        <video ref={localVideoRef} autoPlay playsInline className="border rounded-md w-64 h-48 bg-black" />
                        <video ref={remoteVideoRef} autoPlay playsInline className="border rounded-md w-64 h-48 bg-black" />
                    </div>
                    <div className="flex space-x-4 mb-6">
                        <button onClick={startCall} className="bg-blue-500 text-white px-4 py-2 rounded flex items-center space-x-2"><FaVideo /> Start Call</button>
                        <button onClick={endCall} className="bg-red-500 text-white px-4 py-2 rounded flex items-center space-x-2"><FaPhoneSlash /> End Call</button>
                        <button onClick={() => setVideoOn(!videoOn)} className="bg-gray-500 text-white px-4 py-2 rounded">{videoOn ? <FaVideo /> : "📷"}</button>
                        <button onClick={() => setIsMuted(!isMuted)} className="bg-green-500 text-white px-4 py-2 rounded">{isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}</button>
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                        {[FaRegClock, FaComments, FaFileUpload, FaRecordVinyl, FaBell, FaDesktop, FaRedo, FaGlobe, FaUsers, FaHeadset].map((Icon, index) => (
                            <motion.div key={index} whileHover={{ scale: 1.1 }} className="flex flex-col items-center bg-gray-800 p-4 rounded-xl shadow-md">
                                <Icon className="text-4xl text-blue-400 mb-2" />
                            </motion.div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default VideoCall;