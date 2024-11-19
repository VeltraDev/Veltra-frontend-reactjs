import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '@/contexts/SocketContext';
import { useTheme } from '@/contexts/ThemeContext';
import { X, Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { RootState } from '@/redux/store';
import { addIceCandidate, clearIceCandidates } from '@/redux/chatSlice';

interface VideoCallProps {
    isOpen: boolean;
    onClose: () => void;
    recipientId: string;
    isIncoming?: boolean;
    callerId?: string;
    offer?: RTCSessionDescriptionInit;
}

export default function VideoCall({
    isOpen,
    onClose,
    recipientId,
    isIncoming = false,
    callerId,
    offer
}: VideoCallProps) {
    const dispatch = useDispatch();
    const { currentTheme } = useTheme();
    const { callSocketService } = useSocket();
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true);

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

    // Get queued ICE candidates from Redux store
    const queuedCandidates = useSelector((state: RootState) => state.chat.call.iceCandidates);

    useEffect(() => {
        if (!isOpen) return;

        const initializeMedia = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                setStream(mediaStream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = mediaStream;
                }

                // Initialize WebRTC connection
                const peerConnection = new RTCPeerConnection({
                    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
                });

                // Add local stream tracks to peer connection
                mediaStream.getTracks().forEach(track => {
                    peerConnection.addTrack(track, mediaStream);
                });

                // Handle incoming tracks
                peerConnection.ontrack = (event) => {
                    setRemoteStream(event.streams[0]);
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = event.streams[0];
                    }
                };

                // Handle ICE candidates
                peerConnection.onicecandidate = (event) => {
                    if (event.candidate) {
                        callSocketService.socket?.emit('ice-candidate', {
                            candidate: event.candidate,
                            to: isIncoming ? callerId : recipientId
                        });
                    }
                };

                peerConnectionRef.current = peerConnection;

                // Handle incoming call
                if (isIncoming && offer) {
                    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
                    const answer = await peerConnection.createAnswer();
                    await peerConnection.setLocalDescription(answer);

                    callSocketService.socket?.emit('call-answered', {
                        to: callerId,
                        answer
                    });

                    // Add any queued ICE candidates
                    for (const candidate of queuedCandidates) {
                        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                    }
                    dispatch(clearIceCandidates());
                }
                // Initiate call
                else if (!isIncoming) {
                    const offer = await peerConnection.createOffer();
                    await peerConnection.setLocalDescription(offer);

                    callSocketService.socket?.emit('call-user', {
                        to: recipientId,
                        offer
                    });
                }

                setIsConnecting(false);
            } catch (error) {
                console.error('Failed to initialize media:', error);
                toast.error('Failed to access camera/microphone');
                onClose();
            }
        };

        initializeMedia();

        return () => {
            // Cleanup
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
            dispatch(clearIceCandidates());
        };
    }, [isOpen]);

    // Handle socket events
    useEffect(() => {
        if (!callSocketService.socket) return;

        const handleIceCandidate = async ({ candidate }: { candidate: RTCIceCandidate }) => {
            try {
                if (peerConnectionRef.current && peerConnectionRef.current.remoteDescription) {
                    await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
                } else {
                    // Queue the candidate if peer connection isn't ready
                    dispatch(addIceCandidate(candidate));
                }
            } catch (error) {
                console.error('Error adding received ice candidate:', error);
            }
        };

        const handleCallEnded = () => {
            toast.info('Call ended');
            onClose();
        };

        callSocketService.socket.on('ice-candidate', handleIceCandidate);
        callSocketService.socket.on('call-ended', handleCallEnded);

        return () => {
            callSocketService.socket?.off('ice-candidate', handleIceCandidate);
            callSocketService.socket?.off('call-ended', handleCallEnded);
        };
    }, [callSocketService.socket]);

    // Rest of the component remains the same...
}