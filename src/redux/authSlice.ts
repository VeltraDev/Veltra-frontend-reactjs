import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, LoginCredentials, AuthResponse, User } from "../types/auth";
import  {http}  from "../api/http";

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunk for login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await http.post<AuthResponse>(
        "/auth/login",
        credentials
      );
      console.log("Login response:", response.data); // Debugging
      return response.data;
    } catch (error: any) {
      console.error("Login error:", error); // Debugging
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

// Async thunk for getting user info
export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await http.get<User>("/auth/account");
      return response.data;
    } catch (error: any) {
      console.error("GetMe error:", error); // Debugging
      return rejectWithValue(
        error.response?.data || "Failed to fetch user info"
      );
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<{ access_token: string }>) => {
      state.accessToken = action.payload.access_token;
      localStorage.setItem("accessToken", action.payload.access_token);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
        localStorage.setItem("accessToken", action.payload.access_token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getMe.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setTokens, logout } = authSlice.actions;
export default authSlice.reducer;
