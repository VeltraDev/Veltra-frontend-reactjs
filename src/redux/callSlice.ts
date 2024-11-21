import { User } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CallState {
  incomingCall: {
    from: User;
    offer: RTCSessionDescriptionInit;
    conversationId: string;
  } | null;
  isCallActive: boolean;
  callAnswered: RTCSessionDescriptionInit | null;
  connectionRef: RTCPeerConnection | null;
}

const initialState: CallState = {
  incomingCall: null,
  isCallActive: false,
  callAnswered: null,
  connectionRef: null,
};

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    setConnectionRef: (state, action: PayloadAction<RTCPeerConnection>) => {
      if (state.connectionRef) {
        state.connectionRef.close();
      }
      state.connectionRef = action.payload;
    },
    clearConnectionRef: (state) => {
      if (state.connectionRef) {
        state.connectionRef.close();
        state.connectionRef = null;
      }
    },
    updateConnectionState: (state, action: PayloadAction<string>) => {
      if (state.connectionRef) {
        console.log(`Connection state updated to: ${action.payload}`);
      }
    },
    setIncomingCall: (
      state,
      action: PayloadAction<{
        from: User;
        offer: RTCSessionDescriptionInit;
        conversationId: string;
      }>
    ) => {
      state.incomingCall = action.payload;
      state.isCallActive = true;
    },
    setCallAnswered: (state, action: PayloadAction<RTCSessionDescriptionInit>) => {
      state.callAnswered = action.payload;
      state.isCallActive = true;
    },
    endCall: (state) => {
      state.incomingCall = null;
      state.isCallActive = false;
      state.callAnswered = null;
    },
  },
});

export const {
  setConnectionRef,
  clearConnectionRef,
  updateConnectionState,
  setIncomingCall,
  setCallAnswered,
  endCall,
} = callSlice.actions;

export default callSlice.reducer;
