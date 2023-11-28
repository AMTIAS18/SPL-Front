import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  const updateAdminStatus = (status) => {
    setIsAdmin(status);
  };

  return (
    <UserContext.Provider value={{ user, setUser: updateUser, isAdmin, setIsAdmin: updateAdminStatus }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser debe estar dentro del UserProvider');
  }
  return context;
};
