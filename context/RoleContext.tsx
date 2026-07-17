import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'estudiante' | 'administrador' | 'profesor_tutor' | 'profesor';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  showJustificantes: boolean;
  setShowJustificantes: (show: boolean) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('estudiante');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showJustificantes, setShowJustificantes] = useState(false);

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        isSidebarOpen,
        setIsSidebarOpen,
        showSettings,
        setShowSettings,
        showNotifications,
        setShowNotifications,
        showJustificantes,
        setShowJustificantes,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole debe usarse dentro de un RoleProvider');
  }
  return context;
}
