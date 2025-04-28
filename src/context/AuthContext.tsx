"use client"
import { createContext, useState } from "react";

export const AuthContext = createContext({
  isSignedIn: false,
  setIsSignedIn: (value: boolean) => {}
});

import { ReactNode } from "react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  return (
    <AuthContext.Provider value={{ isSignedIn, setIsSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
};