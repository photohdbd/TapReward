
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { User, UserStatus } from '../types';
import * as api from '../services/mockApi';

interface AuthContextType {
    user: User | null;
    isAdmin: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<User | null>;
    adminLogin: (email: string, password: string) => Promise<boolean>;
    signup: (name: string, email: string, password: string) => Promise<User | null>;
    logout: () => void;
    updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const loadUser = useCallback(() => {
        const storedUser = api.getCurrentUser();
        const storedIsAdmin = api.getIsAdmin();
        if (storedUser) {
            setUser(storedUser);
        }
        if (storedIsAdmin) {
            setIsAdmin(true);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const login = async (email: string, password: string): Promise<User | null> => {
        const loggedInUser = await api.login(email, password);
        if (loggedInUser) {
            setUser(loggedInUser);
            setIsAdmin(false);
        }
        return loggedInUser;
    };

    const adminLogin = async (email: string, password: string): Promise<boolean> => {
        // FIX: The `api.adminLogin` function expects only one argument (password), but two were provided.
        const success = await api.adminLogin(password);
        if (success) {
            setIsAdmin(true);
            setUser(null);
        }
        return success;
    };

    const signup = async (name: string, email: string, password: string): Promise<User | null> => {
        const newUser = await api.signup(name, email, password);
        if (newUser) {
            setUser(newUser);
        }
        return newUser;
    };

    const logout = () => {
        api.logout();
        setUser(null);
        setIsAdmin(false);
    };
    
    const updateUser = (updatedUser: Partial<User>) => {
        if (user) {
            const newUser = { ...user, ...updatedUser };
            setUser(newUser);
            api.updateUserInDb(newUser);
        }
    };


    return (
        <AuthContext.Provider value={{ user, isAdmin, loading, login, adminLogin, signup, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
