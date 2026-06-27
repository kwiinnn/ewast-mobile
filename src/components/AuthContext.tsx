import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';
const TOKEN_KEY = 'ewast_access_token';
const EMAIL_KEY = 'ewast_user_email';

// ─── Types ────────────────────────────────────────────────────────────────────

export type User = {
  firstname: string;
  lastname: string;
  email: string;
};

type Language = 'english' | 'bisaya';

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  /** Called by the login screen after a successful POST /api/users/login */
  setToken: (accessToken: string, tokenType: string, email: string) => Promise<void>;
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

interface CitizenResponse {
  user_id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown) {
    super(`Request failed: ${status}`);
    this.status = status;
    this.body = body;
  }
}

async function apiSignup(payload: SignupPayload): Promise<SignupResponse> {
  const response = await fetch(`${API_BASE_URL}/api/users/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let body: unknown;
    try { body = await response.json(); } catch { body = null; }
    throw new ApiError(response.status, body);
  }

  return response.json() as Promise<SignupResponse>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('english');
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetches the citizen list and returns the entry matching the given email.
   * Called after login and on app rehydration to populate the user profile.
   */
  const fetchUserProfile = async (accessToken: string, email: string): Promise<User | null> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/citizens`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) return null;
      const citizens: CitizenResponse[] = await res.json();
      const match = citizens.find((c) => c.email === email);
      if (!match) return null;
      return { firstname: match.firstname, lastname: match.lastname, email: match.email };
    } catch {
      return null;
    }
  };

  // Rehydrate token + user profile from storage on app launch
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(TOKEN_KEY);
        if (!stored) return;
        setTokenState(stored);
        const storedEmail = await AsyncStorage.getItem(EMAIL_KEY);
        if (storedEmail) {
          const profile = await fetchUserProfile(stored, storedEmail);
          if (profile) setUser(profile);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  /**
   * Called by the login screen after a successful POST /api/users/login.
   * Persists the token, then fetches the full profile from /api/users/citizens.
   */
  const setToken = async (accessToken: string, _tokenType: string, email: string) => {
    await AsyncStorage.setItem(TOKEN_KEY, accessToken);
    await AsyncStorage.setItem(EMAIL_KEY, email);
    setTokenState(accessToken);
    const profile = await fetchUserProfile(accessToken, email);
    setUser(profile ?? { firstname: '', lastname: '', email });
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
    setUser({ firstname: result.firstname, lastname: result.lastname, email: result.email });
  };

  const logout = async () => {
    await AsyncStorage.multiRemove([TOKEN_KEY, EMAIL_KEY]);
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        isLoading,
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