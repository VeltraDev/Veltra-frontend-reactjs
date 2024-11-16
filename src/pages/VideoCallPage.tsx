import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useSocket } from '@/contexts/SocketContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Mic, MicOff, Video, VideoOff, PhoneOff, X, Phone } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function VideoCallPage() {
    const navigate = useNavigate();
    const { conversationId } = useParams();
    const dispatch = useDispatch();
    const { currentTheme } = useTheme();
    const { socketService } = useSocket();

    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);
    const [callStatus, setCallStatus] = useState<'connecting' | 'ringing' | 'connected' | 'ended'>('connecting');

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

    const incomingCall = useSelector((state: RootState) => state.chat.call.incomingCall);
    const conversation = useSelector((state: RootState) =>
        state.chat.conversations.find(c => c.id === conversationId)
    );
    const currentUser = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        if (!conversation || !currentUser) {
            navigate('/chat');
            return;
        }

        // Only allow calls in non-group conversations
        if (conversation.isGroup) {
            toast.error('Video calls are not available in group chats');
            navigate('/chat');
            return;
        }

        const initializeCall = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

                setLocalStream(stream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // Initialize WebRTC connection
                const peerConnection = new RTCPeerConnection({
                    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
                });

                // Add local stream tracks
                stream.getTracks().forEach(track => {
                    peerConnection.addTrack(track, stream);
                });

                // Handle remote stream
                peerConnection.ontrack = (event) => {
                    setRemoteStream(event.streams[0]);
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = event.streams[0];
                    }
                    setCallStatus('connected');
                };

                // Handle ICE candidates
                peerConnection.onicecandidate = (event) => {
                    if (event.candidate) {
                        socketService.socket?.emit('ice-candidate', {
                            candidate: event.candidate,
                            conversationId,
                            to: conversation.users.find(u => u.id !== currentUser.id)?.id
                        });
                    }
                };

                peerConnectionRef.current = peerConnection;
                setIsConnecting(false);
                setCallStatus('ringing');

                // Create and send offer
                const offer = await peerConnection.createOffer();
                await peerConnection.setLocalDescription(offer);

                socketService.socket?.emit('call-user', {
                    conversationId,
                    to: conversation.users.find(u => u.id !== currentUser.id)?.id,
                    offer
                });

            } catch (error) {
                console.error('Failed to initialize call:', error);
                toast.error('Failed to access camera/microphone');
                navigate('/chat');
            }
        };

        // Handle incoming call
        const handleIncomingCall = async (data: { from: any; offer: RTCSessionDescriptionInit }) => {
            setIncomingCall(data);
            setCallStatus('ringing');
        };

        socketService.socket?.on('receive-call', handleIncomingCall);

        // Only initialize call if we're not receiving one
        if (!incomingCall) {
            initializeCall();
        }

        return () => {
            // Cleanup
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
            socketService.socket?.off('receive-call', handleIncomingCall);
        };
    }, [conversation, currentUser, incomingCall]);

    // Handle socket events
    useEffect(() => {
        if (!socketService.socket) return;

        const handleCallAnswered = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
                setCallStatus('connected');
            }
        };

        const handleIceCandidate = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
            try {
                if (peerConnectionRef.current) {
                    await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                }
            } catch (error) {
                console.error('Error adding ICE candidate:', error);
            }
        };

        const handleCallRejected = () => {
            toast.error('Call was rejected');
            navigate('/chat');
        };

        const handleCallEnded = () => {
            toast.info('Call ended');
            navigate('/chat');
        };

        socketService.socket.on('call-answered', handleCallAnswered);
        socketService.socket.on('ice-candidate', handleIceCandidate);
        socketService.socket.on('call-rejected', handleCallRejected);
        socketService.socket.on('call-ended', handleCallEnded);

        return () => {
            socketService.socket?.off('call-answered', handleCallAnswered);
            socketService.socket?.off('ice-candidate', handleIceCandidate);
            socketService.socket?.off('call-rejected', handleCallRejected);
            socketService.socket?.off('call-ended', handleCallEnded);
        };
    }, [socketService.socket]);

    const answerCall = async () => {
        if (!incomingCall || !peerConnectionRef.current) return;

        try {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);

            socketService.socket?.emit('call-answered', {
                to: incomingCall.from.id,
                answer
            });

            setCallStatus('connected');
            setIncomingCall(null);
        } catch (error) {
            console.error('Error answering call:', error);
            toast.error('Failed to answer call');
        }
    };

    const rejectCall = () => {
        if (!incomingCall) return;

        socketService.socket?.emit('call-rejected', {
            to: incomingCall.from.id
        });
        navigate('/chat');
    };

    const toggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
                setIsMuted(!track.enabled);
            });
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
                setIsVideoOff(!track.enabled);
            });
        }
    };

    const endCall = () => {
        socketService.socket?.emit('end-call', {
            conversationId,
            to: conversation?.users.find(u => u.id !== currentUser?.id)?.id
        });
        navigate('/chat');
    };

    // Show incoming call UI
    if (incomingCall && callStatus === 'ringing') {
        return (
            <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
                <div className="text-center space-y-6">
                    <div className="w-24 h-24 rounded-full bg-blue-500 mx-auto flex items-center justify-center animate-pulse">
                        <Video className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-2xl text-white font-semibold">
                        Incoming call from {incomingCall.from.firstName}
                    </h2>
                    <div className="flex items-center justify-center space-x-6">
                        <button
                            onClick={rejectCall}
                            className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                        >
                            <PhoneOff className="w-8 h-8 text-white" />
                        </button>
                        <button
                            onClick={answerCall}
                            className="p-4 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
                        >
                            <Phone className="w-8 h-8 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black flex flex-col">
            {/* Header */}
            <div className="p-4 flex items-center justify-between z-10">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/chat')}
                        className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-800"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                    <div className="text-white">
                        <h2 className="font-semibold">
                            {conversation?.name || 'Video Call'}
                        </h2>
                        <p className="text-sm text-gray-300">
                            {callStatus === 'connecting' && 'Initializing...'}
                            {callStatus === 'ringing' && 'Calling...'}
                            {callStatus === 'connected' && 'Connected'}
                            {callStatus === 'ended' && 'Call ended'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Video Grid */}
            <div className="flex-1 grid grid-cols-2 gap-4 p-4">
                {/* Local Video */}
                <div className="relative rounded-2xl overflow-hidden bg-gray-900">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover mirror"
                    />
                    <div className="absolute bottom-4 left-4 text-white text-sm">
                        You
                    </div>
                </div>

                {/* Remote Video */}
                <div className="relative rounded-2xl overflow-hidden bg-gray-900">
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />
                    {remoteStream ? (
                        <div className="absolute bottom-4 left-4 text-white text-sm">
                            {conversation?.name}
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-gray-800 mx-auto mb-4 flex items-center justify-center">
                                    <Video className="w-8 h-8" />
                                </div>
                                <p>Waiting for {conversation?.name} to join...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="p-8 flex items-center justify-center space-x-4">
                <button
                    onClick={toggleMute}
                    className={`p-4 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-800'
                        } hover:opacity-90 transition-opacity`}
                >
                    {isMuted ? (
                        <MicOff className="w-6 h-6 text-white" />
                    ) : (
                        <Mic className="w-6 h-6 text-white" />
                    )}
                </button>

                <button
                    onClick={endCall}
                    className="p-4 rounded-full bg-red-500 hover:opacity-90 transition-opacity"
                >
                    <PhoneOff className="w-6 h-6 text-white" />
                </button>

                <button
                    onClick={toggleVideo}
                    className={`p-4 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-gray-800'
                        } hover:opacity-90 transition-opacity`}
                >
                    {isVideoOff ? (
                        <VideoOff className="w-6 h-6 text-white" />
                    ) : (
                        <Video className="w-6 h-6 text-white" />
                    )}
                </button>
            </div>

            <style jsx>{`
        .mirror {
          transform: scaleX(-1);
        }
      `}</style>
        </div>
    );
}