'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserRole = 'admin' | 'staff' | 'student' | 'teacher';

interface PersonalInfoContextType {
  isOpen: boolean;
  userRole?: UserRole;
  openModal: (role: UserRole) => void;
  closeModal: () => void;
}

const PersonalInfoContext = createContext<PersonalInfoContextType | undefined>(
  undefined
);

export const usePersonalInfo = () => {
  const context = useContext(PersonalInfoContext);
  if (context === undefined) {
    throw new Error(
      'usePersonalInfo must be used within a PersonalInfoProvider'
    );
  }
  return context;
};

interface PersonalInfoProviderProps {
  children: ReactNode;
}

export const PersonalInfoProvider: React.FC<PersonalInfoProviderProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>();

  const openModal = (role: UserRole) => {
    setUserRole(role);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const value = {
    isOpen,
    userRole,
    openModal,
    closeModal,
  };

  return (
    <PersonalInfoContext.Provider value={value}>
      {children}
    </PersonalInfoContext.Provider>
  );
};
