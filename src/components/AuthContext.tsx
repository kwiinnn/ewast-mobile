import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';
const TOKEN_KEY = 'ewast_access_token';

// ─── Types ────────────────────────────────────────────────────────────────────

export type User = {
  fullName: string;
  email: string;
};

type Language = 'english' | 'bisaya';

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  /** Called by the login screen after a successful POST /api/users/login */
  setToken: (accessToken: string, tokenType: string) => Promise<void>;
  signup: (data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    password_confirm: string;
    role?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  language: Language;
  setLanguage: (l: Language) => void;
};

// ─── API helpers ──────────────────────────────────────────────────────────────

interface SignupPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  password_confirm: string;
  role: string;
}

interface SignupResponse {
  user_id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

async function apiSignup(payload: SignupPayload): Promise<SignupResponse> {
  const response = await fetch(`${API_BASE_URL}/api/users/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Signup failed: ${response.status}`);
  }

  return response.json() as Promise<SignupResponse>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('english');

  // Rehydrate token from storage on app launch
  useEffect(() => {
    AsyncStorage.getItem(TOKEN_KEY).then((stored: string | null) => {
      if (stored) setTokenState(stored);
    });
  }, []);

  /**
   * Called by LoginScreenWeb after a successful POST /api/users/login.
   * Persists the token to AsyncStorage and marks the user as logged in.
   *
   * Note: the login endpoint only returns a token, not user profile data.
   * We store a minimal user object derived from the email for now; if you
   * need the full profile, add a GET /api/users/me call here.
   */
  const setToken = async (accessToken: string, _tokenType: string) => {
    await AsyncStorage.setItem(TOKEN_KEY, accessToken);
    setTokenState(accessToken);
    // Minimal user — replace with a /me fetch if the API supports it
    setUser({ fullName: '', email: '' });
  };

  /**
   * Registers a new account. The signup endpoint returns a user object
   * but no token, so the caller should redirect to login afterwards.
   */
  const signup = async (data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    password_confirm: string;
    role?: string;
  }) => {
    const result = await apiSignup({
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: data.password,
      password_confirm: data.password_confirm,
      role: data.role ?? 'citizen',
    });

    // Signup does not return a token — the user must log in separately.
    // We still populate the user state so the UI can show a success screen
    // if needed, but isLoggedIn will remain false until setToken is called.
    setUser({ fullName: `${result.firstname} ${result.lastname}`.trim(), email: result.email });
  };

  const logout = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        user,
        token,
        setToken,
        signup,
        logout,
        language,
        setLanguage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}