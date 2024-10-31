import { configureStore } from "@reduxjs/toolkit";

import chatReducer from '../features/chatSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    chat: chatReducer,  

  },
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => typeof store.dispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

