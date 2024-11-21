import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useSocket } from "@/contexts/SocketContext";
import { useTheme } from "@/contexts/ThemeContext";
import { motion } from "framer-motion";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Maximize2,
  Minimize2,
  Settings,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { endCall } from "@/redux/callSlice";
import { getConversationById } from "@/redux/chatSlice";

export default function VideoCallPage() {
  const navigate = useNavigate();
  const { conversationId } = useParams<{ conversationId: string }>();
  const { currentTheme } = useTheme();
  const { socketService } = useSocket();

  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const callTimerRef = useRef<NodeJS.Timeout>();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  const dispatch = useDispatch<AppDispatch>();
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);

  const currentUser = useSelector((state: RootState) => state.auth.user?.user);
  const conversation = useSelector((state: RootState) =>
    state.chat.conversations.find((c) => c.id === conversationId)
  );
  const incomingCall = useSelector((state: RootState) => state.call.incomingCall);
  const queuedIceCandidates = useRef<RTCIceCandidate[]>([]);
  const isCallee = !!incomingCall;

  useEffect(() => {
    if (socketService) {
      socketService.setupListeners((path: string) => navigate(path));
    }
  }, [socketService, navigate]);

  useEffect(() => {
    const fetchConversation = async () => {
      if (!conversation && conversationId) {
        setIsLoadingConversation(true);
        try {
          await dispatch(getConversationById(conversationId)).unwrap();
        } catch (error) {
          console.error("Failed to fetch conversation:", error);
          toast.error("Failed to load conversation. Please try again.");
          navigate("/chat");
          return;
        } finally {
          setIsLoadingConversation(false);
        }
      }
    };

    fetchConversation();
  }, [conversationId, conversation, dispatch]);

  if (isLoadingConversation) {
    return <div>Loading conversation...</div>;
  }

  useEffect(() => {
    if (!socketService) return;

    socketService.onIceCandidateCallback = async (candidate: RTCIceCandidate) => {
      console.log("ICE Candidate received:", candidate);

      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(candidate);
          console.log("ICE Candidate added successfully.");
        } catch (error) {
          console.error("Error adding ICE candidate:", error);
        }
      } else {
        console.log("PeerConnection chưa sẵn sàng, lưu ICE Candidate.");
        queuedIceCandidates.current.push(candidate);
      }
    };

    return () => {
      socketService.onIceCandidateCallback = null;
    };
  }, [socketService]);

  useEffect(() => {
    if (!conversationId || !conversation || !currentUser) {
      toast.error("Invalid conversation");
      navigate("/chat");
      return;
    }

    const otherUser = conversation.users.find((u) => u.id !== currentUser.id);
    if (!otherUser) {
      toast.error("Cannot find user to call");
      navigate("/chat");
      return;
    }

    const initializeCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const peerConnection = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        peerConnectionRef.current = peerConnection;

        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });

        peerConnection.onicecandidate = (event) => {
          if (event.candidate && otherUser) {
            socketService.sendIceCandidate(
              conversationId,
              otherUser.id,
              event.candidate
            );
          }
        };

        peerConnection.ontrack = (event) => {
          remoteStreamRef.current = event.streams[0];
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        if (queuedIceCandidates.current.length > 0) {
          console.log("Adding queued ICE candidates.");
          for (const candidate of queuedIceCandidates.current) {
            try {
              await peerConnection.addIceCandidate(candidate);
              console.log("Queued ICE Candidate added successfully.");
            } catch (error) {
              console.error("Error adding queued ICE candidate:", error);
            }
          }
          queuedIceCandidates.current = [];
        }

        if (!incomingCall) {
          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);
          socketService.callUser(conversationId, otherUser.id, offer);
        } else {
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(incomingCall.offer)
          );
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          socketService.answerCall(conversationId, incomingCall.from.id, answer);
        }

        setIsConnecting(false);
        callTimerRef.current = setInterval(
          () => setCallDuration((prev) => prev + 1),
          1000
        );
      } catch (error) {
        console.error("Error initializing call:", error);
        toast.error("Failed to access camera/microphone.");
        handleEndCall();
      }
    };

    if (incomingCall || !isCallee) {
      initializeCall();
    }

    return () => {
      cleanup();
    };
  }, [conversationId, conversation, incomingCall]);

  const cleanup = () => {
    console.log("cleanup called");
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        console.log(`Stopping local track: ${track.kind}`);
        track.stop();
      });
      localStreamRef.current = null;
    }
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((track) => {
        console.log(`Stopping remote track: ${track.kind}`);
        track.stop();
      });
      remoteStreamRef.current = null;
    }
    if (peerConnectionRef.current) {
      console.log("Closing peer connection");
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }
    dispatch(endCall());
  };

  const handleEndCall = () => {
    cleanup();
    const otherUser = conversation?.users.find((u) => u.id !== currentUser?.id);
    if (otherUser) {
      socketService.endCall(conversationId, otherUser.id);
    }
    navigate("/chat");
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
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
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`h-screen ${currentTheme.bg} flex flex-col`}>
      <div className="p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent absolute top-0 left-0 right-0 z-10">
        <div className="flex items-center space-x-4">
          <h3 className="text-white font-semibold">{conversation?.name}</h3>
          <p className="text-white/80 text-sm">
            {isConnecting ? "Connecting..." : formatDuration(callDuration)}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
          >
            {isFullscreen ? <Minimize2 /> : <Maximize2 />}
          </motion.button>
          <motion.button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">
            <Settings />
          </motion.button>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-4 p-4">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover ${isVideoOff ? "hidden" : ""}`}
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6 flex items-center justify-center space-x-4 bg-gradient-to-t from-black/50 to-transparent">
        <motion.button
          onClick={toggleMic}
          className={`p-4 rounded-full text-white ${
            isMuted ? "bg-red-500" : "bg-white/10 hover:bg-white/20"
          }`}
        >
          {isMuted ? <MicOff /> : <Mic />}
        </motion.button>
        <motion.button
          onClick={handleEndCall}
          className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600"
        >
          <PhoneOff />
        </motion.button>
        <motion.button
          onClick={toggleVideo}
          className={`p-4 rounded-full text-white ${
            isVideoOff ? "bg-red-500" : "bg-white/10 hover:bg-white/20"
          }`}
        >
          {isVideoOff ? <VideoOff /> : <Video />}
        </motion.button>
      </div>
    </div>
  );
}
