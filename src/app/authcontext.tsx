"use client";

import { createContext, useContext, useState } from "react";
import { MeResponse } from "@/domain/auth";

interface AuthContextType {
  user: MeResponse | null;
  setUser: (user: MeResponse | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<MeResponse | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
