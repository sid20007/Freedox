"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Role = "Faculty" | "Dean";

interface RoleContextType {
  userName: string;
  role: Role;
  isSet: boolean;
  setIdentity: (name: string, role: Role) => void;
  setRole: (role: Role) => void;
  switchIdentity: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [userName, setUserName] = useState<string>("");
  const [role, setRoleState] = useState<Role>("Faculty");
  const [isSet, setIsSet] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const savedName = sessionStorage.getItem("freedox_session_user_name");
    const savedRole = sessionStorage.getItem("freedox_session_role") as Role;

    if (savedName && (savedRole === "Faculty" || savedRole === "Dean")) {
      setUserName(savedName);
      setRoleState(savedRole);
      setIsSet(true);
    }
    setMounted(true);
  }, []);

  const setIdentity = (name: string, newRole: Role) => {
    const cleanName = name.trim();
    setUserName(cleanName);
    setRoleState(newRole);
    setIsSet(true);
    sessionStorage.setItem("freedox_session_user_name", cleanName);
    sessionStorage.setItem("freedox_session_role", newRole);
  };

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    sessionStorage.setItem("freedox_session_role", newRole);
  };

  const switchIdentity = () => {
    setIsSet(false);
  };

  return (
    <RoleContext.Provider
      value={{
        userName,
        role,
        isSet,
        setIdentity,
        setRole,
        switchIdentity,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
