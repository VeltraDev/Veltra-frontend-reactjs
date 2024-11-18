import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useSocket } from '@/contexts/SocketContext';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
import {
    Mic, MicOff, Video, VideoOff, PhoneOff,
    Maximize2, Minimize2, Settings, Users
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { endCall, setCallAnswered, addIceCandidate } from '@/redux/chatSlice';

export default function VideoCallPage() {
    const navigate = useNavigate();
    const { conversationId } = useParams<{ conversationId: string }>();
    const dispatch = useDispatch();
    const { currentTheme } = useTheme();
    const { socketService } = useSocket();

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);
    const [callDuration, setCallDuration] = useState(0);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const callTimerRef = useRef<NodeJS.Timeout>();

    const [isCallInitialized, setIsCallInitialized] = useState(false);


    const currentUser = useSelector((state: RootState) => state.auth.user?.user);
    const conversation = useSelector((state: RootState) =>
        state.chat.conversations.find(c => c.id === conversationId)
    );

    const incomingCall = useSelector((state: RootState) => state.chat.call.incomingCall);
    const iceCandidates = useSelector((state: RootState) => state.chat.call.iceCandidates);
    const peerConnection = new RTCPeerConnection();
    // Using peerConnection somewhere

    useEffect(() => {
        if (incomingCall) {
            const handleIncomingCall = async () => {
                // Logic nhận cuộc gọi
                await peerConnection.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);

                socketService.answerCall(incomingCall.conversationId, incomingCall.from.id, answer);
            };

            handleIncomingCall();
        }
    }, [incomingCall]);


    useEffect(() => {
        if (isCallInitialized || !conversationId || !conversation || !currentUser) {
            // toast.error('Invalid conversation');
            // navigate('/chat');
            return;
        }

        // Get the other user from conversation
        const otherUser = conversation.users.find(u => u.id !== currentUser.id);
        if (!otherUser) {
            toast.error('Cannot find user to call');
            navigate('/chat');
            return;
        }

        const initializeCall = async () => {
            if (!conversation || !currentUser) {
                toast.error('Invalid conversation');
                return;
            }

            // Get the other user from conversation
            const otherUser = conversation.users.find(u => u.id !== currentUser.id);
            if (!otherUser) {
                toast.error('Cannot find user to call');
                return;
            }

            try {
                // Yêu cầu truy cập camera và mic
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                setLocalStream(stream);

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // Tạo RTCPeerConnection
                const peerConnection = new RTCPeerConnection({
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'stun:stun1.l.google.com:19302' },
                        { urls: 'stun:stun2.l.google.com:19302' }
                    ]
                });

                // Thêm track từ luồng địa phương
                stream.getTracks().forEach((track) => {
                    peerConnection.addTrack(track, stream);
                });

                peerConnectionRef.current = peerConnection;

                // Xử lý ICE candidate
                peerConnection.onicecandidate = (event) => {
                    if (event.candidate) {
                        const otherUser = conversation?.users.find((u) => u.id !== currentUser?.id);
                        if (otherUser) {
                            socketService.sendIceCandidate(conversationId, otherUser.id, event.candidate);
                        }
                    }
                };
                peerConnection.onicecandidate = (event) => {
                    if (event.candidate && peerConnection.iceGatheringState !== 'complete') {
                        socketService.sendIceCandidate(conversationId, otherUser.id, event.candidate);
                    }
                };

                // Xử lý remote stream
                peerConnection.ontrack = (event) => {
                    setRemoteStream(event.streams[0]);
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = event.streams[0];
                    }
                };

                // Caller tạo offer
                if (!incomingCall) {
                    const offer = await peerConnection.createOffer();
                    await peerConnection.setLocalDescription(offer);
                    const otherUser = conversation?.users.find((u) => u.id !== currentUser?.id);
                    if (otherUser) {
                        socketService.callUser(conversationId, otherUser.id, offer);
                    }
                } else {
                    // Callee nhận và trả lời offer
                    await peerConnection.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
                    const answer = await peerConnection.createAnswer();
                    await peerConnection.setLocalDescription(answer);

                    const conversationId = incomingCall.conversationId; // Lấy ID cuộc trò chuyện từ incomingCall
                    const fromUserId = incomingCall.from.id; // Người gọi

                    // Truyền đầy đủ tham số
                    socketService.answerCall(conversationId, fromUserId, answer);
                }

                setIsConnecting(false);
                callTimerRef.current = setInterval(() => {
                    setCallDuration((prev) => prev + 1);
                }, 1000);
            } catch (error) {
                console.error('Error initializing call:', error);
                toast.error('Không thể truy cập camera/microphone.');
                handleEndCall();
            }
        };


        initializeCall();
        setIsCallInitialized(true);
        return () => {
            cleanup();
        };
    }, [conversationId, conversation, incomingCall]);

    // Handle incoming ICE candidates
    useEffect(() => {
        const addIceCandidates = async () => {
            if (!peerConnectionRef.current) return;

            for (const candidate of iceCandidates) {
                try {
                    // Check if signalingState is 'closed' before adding the candidate
                    if (peerConnectionRef.current.signalingState !== 'closed') {
                        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                        console.log('Added ICE candidate:', candidate);
                    } else {
                        console.log('PeerConnection is closed. Cannot add ICE candidate.');
                    }
                } catch (error) {
                    console.error('Error adding ICE candidate:', error);
                }
            }
        };


        addIceCandidates();
    }, [iceCandidates]);

    const cleanup = () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
        }
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }
        if (callTimerRef.current) {
            clearInterval(callTimerRef.current);
        }
        dispatch(endCall());
    };


    const handleEndCall = () => {
        if (!conversation || !currentUser) {
            console.error('Invalid conversation or user context');
            return;
        }

        const otherUser = conversation.users.find((u) => u.id !== currentUser.id);
        if (otherUser) {
            const conversationId = conversation.id; // Lấy ID cuộc trò chuyện
            const toUserId = otherUser.id; // Lấy ID người dùng bên kia
            socketService.endCall(conversationId, toUserId); // Gọi endCall với đủ tham số
        }

        cleanup();
        navigate('/chat');
    };


    const toggleMic = () => {
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setIsMuted(!audioTrack.enabled);
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setIsVideoOff(!videoTrack.enabled);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`h-screen ${currentTheme.bg} flex flex-col`}>
            {/* Call Info Bar */}
            <div className={`
        p-4 flex items-center justify-between
        bg-gradient-to-b from-black/50 to-transparent
        absolute top-0 left-0 right-0 z-10
      `}>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <img
                            src={conversation?.picture || `https://ui-avatars.com/api/?name=${conversation?.name}`}
                            alt={conversation?.name}
                            className="w-10 h-10 rounded-full ring-2 ring-white/50"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 ring-2 ring-white" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold">
                            {conversation?.name}
                        </h3>
                        <p className="text-white/80 text-sm">
                            {isConnecting ? 'Connecting...' : formatDuration(callDuration)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleFullscreen}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                    >
                        {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                    >
                        <Settings className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>

            {/* Video Grid */}
            <div className="flex-1 grid grid-cols-2 gap-4 p-4">
                {/* Local Video */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative rounded-2xl overflow-hidden shadow-lg"
                >
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`
              w-full h-full object-cover
              ${isVideoOff ? 'hidden' : ''}
            `}
                    />
                    {isVideoOff && (
                        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-10 h-10 text-gray-400" />
                                </div>
                                <p className="text-gray-400">Camera is off</p>
                            </div>
                        </div>
                    )}
                    <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg text-white text-sm">
                        You
                    </div>
                </motion.div>

                {/* Remote Video */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative rounded-2xl overflow-hidden shadow-lg"
                >
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg text-white text-sm">
                        {conversation?.users.find(u => u.id !== currentUser?.id)?.firstName || 'Remote User'}
                    </div>
                </motion.div>
            </div>

            {/* Controls */}
            <div className={`
        p-6 flex items-center justify-center space-x-4
        bg-gradient-to-t from-black/50 to-transparent
      `}>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleMic}
                    className={`
            p-4 rounded-full text-white
            ${isMuted ? 'bg-red-500' : 'bg-white/10 hover:bg-white/20'}
            transition-colors
          `}
                >
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleEndCall}
                    className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600"
                >
                    <PhoneOff className="w-6 h-6" />
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleVideo}
                    className={`
            p-4 rounded-full text-white
            ${isVideoOff ? 'bg-red-500' : 'bg-white/10 hover:bg-white/20'}
            transition-colors
          `}
                >
                    {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </motion.button>
            </div>

            {/* Loading Overlay */}
            {isConnecting && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                    <div className="text-center text-white">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-lg font-medium">Connecting...</p>
                    </div>
                </div>
            )}
        </div>
    );
}