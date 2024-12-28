import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext= createContext();

export const useAuth= ()=> {
    return useContext(AuthContext);
}

export const AuthProvider= ({children}) =>{
    const navigate= useNavigate();
    const [user, setUser]= useState(null);
    const [loading, setLoading]= useState(true);
    const [error, setError] = useState(null);

    // this will check is user's info is available or not
    useEffect(()=> {
        const fetchUser= ()=> {
            const access_token= localStorage.getItem("access_token");
            const refresh_token= localStorage.getItem("refresh_token");
            if (access_token && refresh_token){
                setUser(true);
            }
            setLoading(false);
        }
        fetchUser();
    }, [])


    // Handle login 
    const login= async (formData) => {
        const base_url= import.meta.env.VITE_API_BASE_URL;
        
        try {
            const response = await axios.post(`${base_url}/forum/login/`, formData);
            if (response.status === 200) {
                console.log(response.data.token);
                
                localStorage.setItem("access_token", response.data.token.access);
                localStorage.setItem("refresh_token", response.data.token.refresh);
                setUser(true);
                navigate('/');
            }
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || 'Login failed');
        }

    }

    // Handle logout
    const logout= ()=> {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        navigate("/")
        
    }


    return (
        <AuthContext.Provider value={{ user, login, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    )
}


