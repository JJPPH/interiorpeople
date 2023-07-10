import React, { createContext, useState, useEffect } from "react";
import { Cookies } from "react-cookie";

const cookies = new Cookies();
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    const userId = cookies.get("user");
    if (userId) {
      setUser(userId);
    } else {
      setUser();
    }
  }, [user]);

  return (
    <AuthContext.Provider value={[user, setUser]}>
      {children}
    </AuthContext.Provider>
  );
};
