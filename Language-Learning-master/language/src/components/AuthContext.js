// src/context/AuthContext.js
import React, { createContext, useState } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Function to log in the user
    const login = (userData) => {
        setUser(userData);
    };

    // Function to log out the user
    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
