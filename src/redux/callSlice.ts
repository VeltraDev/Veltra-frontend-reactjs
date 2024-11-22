import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types";

interface CallState {
  incomingCall: {
    from: User;
    offer: RTCSessionDescriptionInit;
    conversationId: string;
  } | null;
  callAnswered: RTCSessionDescriptionInit | null;
  isCallActive: boolean;
}

const initialState: CallState = {
  incomingCall: null,
  callAnswered: null,
  isCallActive: false,
};

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    setIncomingCall: (
      state,
      action: PayloadAction<{
        from: User;
        offer: RTCSessionDescriptionInit;
        conversationId: string;
      }>
    ) => {
      state.incomingCall = action.payload;
    },
    setCallAnswered: (
      state,
      action: PayloadAction<RTCSessionDescriptionInit>
    ) => {
      state.callAnswered = action.payload;
      state.isCallActive = true;
    },
    startCall: (state) => {
      state.isCallActive = true;
    },
    endCall: (state) => {
      state.incomingCall = null;
      state.callAnswered = null;
      state.isCallActive = false;
    },
  },
});

export const { setIncomingCall, setCallAnswered, startCall, endCall } = callSlice.actions;
export default callSlice.reducer;
