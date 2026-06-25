import React, { createContext, useContext, useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type User = {
  fullName: string;
  email: string;
};

type Language = 'english' | 'bisaya';

type AuthContextType = {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { fullName: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  language: Language;
  setLanguage: (l: Language) => void;
};


// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>('english');

  const login = async (email: string, password: string) => {
    // TODO: Replace with actual API call
    // Simulates network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setUser({ fullName: 'User', email });
  };

  const signup = async (data: { fullName: string; email: string; password: string }) => {
    // TODO: Replace with actual API call
    // Simulates network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setUser({ fullName: data.fullName, email: data.email });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!user, user, login, signup, logout, language, setLanguage }}>
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
