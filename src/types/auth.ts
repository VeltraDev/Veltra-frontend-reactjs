export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  displayStatus: string | null;
  createdAt: string;
  role?: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
  };
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  code: number;
  statusCode: number;
  message: string;
  data: {
    access_token: string;
    user: User;
  };
}