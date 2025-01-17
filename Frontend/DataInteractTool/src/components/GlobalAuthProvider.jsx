// GlobalContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Create a Context
const GlobalContext = createContext();

// Create a Provider Component
export const GlobalAuthProvider = ({ children }) => {
    const [userAuthenticated, setUserAuthenticated] = useState(false);
    const [globalUsername, setGlobalUsername] = useState('');
    const [globalDataset, setGlobalDataset] = useState('');

    const checkSession = async () => {

        try {
            const response = await axios.get('http://127.0.0.1:8000/check-session/', {
                params: { session_id: localStorage.getItem('session_id') },
                withCredentials: true
            });
            
            console.log(response.data);
            setUserAuthenticated(response.data.isAuthenticated);
            setGlobalUsername(response.data.username);
        } catch (error) {
            console.error('Session check failed', error);
        }
    };
    useEffect(() => {
        checkSession();
    }, []); // Only runs on component mount

    const value = {
        userAuthenticated,
        setUserAuthenticated,
        globalUsername,
        setGlobalUsername,
        globalDataset,
        setGlobalDataset
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};

// Custom hook for easy access to context
export const useGlobalContext = () => useContext(GlobalContext);
