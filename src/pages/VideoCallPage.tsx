import React, { useEffect, useRef, useState, useCallback } from 'react';

import { chatSocketService } from '@/services/chatsocket';
import { toast } from 'react-toastify';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface VideoCallPageProps {
    conversationId: string;
    calleeId: string;
    onEndCall: () => void;
}

const VideoCallPage: React.FC<VideoCallPageProps> = ({ onEndCall }) => {

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [receivingCall, setReceivingCall] = useState(false);
    const [callerId, setCallerId] = useState('');
    const [callerOffer, setCallerOffer] = useState<RTCSessionDescriptionInit | null>(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [iceCandidateQueue, setIceCandidateQueue] = useState<RTCIceCandidate[]>([]);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isCalling, setIsCalling] = useState(false);

    const myVideoRef = useRef<HTMLVideoElement>(null);
    const userVideoRef = useRef<HTMLVideoElement>(null);
    const connectionRef = useRef<RTCPeerConnection | null>(null);
    const endCallRef = useRef<() => void>();
    const navigate = useNavigate()
    const conversationId = useSelector((state: RootState)=> state.chat.activeConversation?.id)
    const currentUser = useSelector((state: RootState) => state.auth.user?.user);
    const conversation = useSelector((state: RootState) =>
        state.chat.conversations.find(c => c.id === conversationId)
    );

    // Ensure conversation is defined before accessing its properties
    const calleeId = conversation ? conversation.users.find(u => u.id !== currentUser.id)?.id : null;
    const endCall = useCallback(() => {
        if (connectionRef.current) {
            connectionRef.current.close();
            connectionRef.current = null;
        }

        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        setCallAccepted(false);
        setReceivingCall(false);
        setCallerId('');
        setCallerOffer(null);
        setIsMicOn(true);
        setIsCameraOn(true);
        setIsCalling(false);

        chatSocketService.socket?.emit('end-call', {
            to: callerId || calleeId,
            conversationId
        });

        if (onEndCall) onEndCall();

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                if (myVideoRef.current) {
                    myVideoRef.current.srcObject = currentStream;
                }
            })
            .catch((err) => console.error('Error restarting media devices:', err));
    }, [callerId, calleeId, conversationId, onEndCall, stream]);

    useEffect(() => {
        endCallRef.current = endCall;
    }, [endCall]);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                if (myVideoRef.current) {
                    myVideoRef.current.srcObject = currentStream;
                }
            });

        const socket = chatSocketService.socket;
        if (!socket) return;

        socket.on('receive-call', (data: { from: string; offer: RTCSessionDescriptionInit; conversationId: string }) => {
            console.log(`dang co cuoc goi den, ${data.from}`)
            if (data.conversationId === conversationId) {
                setReceivingCall(true);
                setCallerId(data.from);
                setCallerOffer(data.offer);
            }
        });

        socket.on('call-answered', (data: { answer: RTCSessionDescriptionInit; conversationId: string }) => {
            if (data.conversationId === conversationId && connectionRef.current) {
                connectionRef.current.setRemoteDescription(new RTCSessionDescription(data.answer))
                    .catch((err) => console.error('Error setting remote description:', err));
                setCallAccepted(true);
                setIsCalling(false);
            }
        });

        socket.on('ice-candidate', (data: { candidate: RTCIceCandidateInit; conversationId: string }) => {
            if (data.conversationId === conversationId) {
                if (connectionRef.current) {
                    connectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate))
                        .catch((err) => console.error('Error adding received ice candidate:', err));
                } else {
                    setIceCandidateQueue(prev => [...prev, new RTCIceCandidate(data.candidate)]);
                }
            }
        });

        socket.on('end-call', (data: { conversationId: string }) => {
            if (data.conversationId === conversationId && endCallRef.current) {
                endCallRef.current();
            }
        });

        return () => {
            socket.off('receive-call');
            socket.off('call-answered');
            socket.off('ice-candidate');
            socket.off('end-call');
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [conversationId]);

    const createPeerConnection = (toId: string, isCaller: boolean) => {
        const peer = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' }
            ]
        });
        peer.onicecandidate = (event) => {
            if (event.candidate) {
                chatSocketService.socket?.emit('send-ice-candidate', {
                    to: toId,
                    candidate: event.candidate,
                    conversationId
                });
            }
        };

        peer.ontrack = (event) => {
            if (userVideoRef.current) {
                userVideoRef.current.srcObject = event.streams[0];
            }
        };

        if (stream) {
            stream.getTracks().forEach(track => peer.addTrack(track, stream));
        }

        if (isCaller) connectionRef.current = peer;

        return peer;
    };

    const callUser = async () => {
        if (!calleeId) return console.log('no');

        setIsCalling(true);
        const peer = createPeerConnection(calleeId, true);
        console.log('2132')
        try {
            const offer = await peer.createOffer();
            await peer.setLocalDescription(offer);

            chatSocketService.socket?.emit('call-user', {
                to: calleeId,
                offer,
                conversationId
            });

            connectionRef.current = peer;
        } catch (err) {
            console.error('Error creating offer:', err);
            setIsCalling(false);
        }
    };

    const answerCall = async () => {
        setCallAccepted(true);
        setIsCalling(false);

        const peer = createPeerConnection(callerId, false);

        try {
            if (callerOffer) {
                await peer.setRemoteDescription(new RTCSessionDescription(callerOffer));
                const answer = await peer.createAnswer();
                await peer.setLocalDescription(answer);

                chatSocketService.socket?.emit('answer-call', {
                    to: callerId,
                    answer,
                    conversationId
                });

                connectionRef.current = peer;

                iceCandidateQueue.forEach(candidate => {
                    connectionRef.current?.addIceCandidate(candidate)
                        .catch((err) => console.error('Error adding ice candidate from queue:', err));
                });
                setIceCandidateQueue([]);
            }
        } catch (err) {
            console.error('Error answering call:', err);
            setIsCalling(false);
        }
    };

    const toggleMic = () => {
        if (stream) {
            stream.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
                setIsMicOn(track.enabled);
            });
        }
    };

    const toggleCamera = () => {
        if (stream) {
            stream.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
                setIsCameraOn(track.enabled);
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                        <video ref={myVideoRef} autoPlay playsInline muted className="w-full rounded-lg" />
                        <p className="text-center mt-2">Bạn</p>
                    </div>
                    {callAccepted && (
                        <div className="relative">
                            <video ref={userVideoRef} autoPlay playsInline className="w-full rounded-lg" />
                            <p className="text-center mt-2">Đối tác</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-center gap-4 mt-6">
                    {!callAccepted && !receivingCall && (
                        <button
                            onClick={callUser}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            disabled={isCalling}
                        >
                            <i className="fas fa-phone mr-2"></i>
                            {isCalling ? 'Đang gọi...' : 'Gọi'}
                        </button>
                    )}

                    {receivingCall && !callAccepted && (
                        <button
                            onClick={answerCall}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            <i className="fas fa-phone-alt mr-2"></i>
                            Trả lời
                        </button>
                    )}

                    {callAccepted && (
                        <>
                            <button
                                onClick={toggleMic}
                                className={`px-4 py-2 rounded-lg ${isMicOn ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
                                    } text-white`}
                            >
                                <i className={`fas ${isMicOn ? 'fa-microphone' : 'fa-microphone-slash'} mr-2`}></i>
                                {isMicOn ? 'Tắt Mic' : 'Bật Mic'}
                            </button>

                            <button
                                onClick={toggleCamera}
                                className={`px-4 py-2 rounded-lg ${isCameraOn ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'
                                    } text-white`}
                            >
                                <i className={`fas ${isCameraOn ? 'fa-video' : 'fa-video-slash'} mr-2`}></i>
                                {isCameraOn ? 'Tắt Camera' : 'Bật Camera'}
                            </button>
                        </>
                    )}

                    <button
                        onClick={endCall}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                        <i className="fas fa-phone-slash mr-2"></i>
                        Kết thúc
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoCallPage;