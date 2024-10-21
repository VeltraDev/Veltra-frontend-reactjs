import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import productSlice from "./features/productSlice";
import authSlice from "./features/authSlice"; // Import the auth slice

export const store = configureStore({
  reducer: {
    products: productSlice,
    auth: authSlice, // Add the auth slice to the store
  },
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;