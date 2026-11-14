import { createContext, useContext } from 'react';

export interface AuthUser {
    _id: string;
    discord_id: string;
    username: string;
    avatar: string | null;
    role: string;
    admin: boolean;
}

export interface AuthContextValue {
    user: AuthUser | null;
    isLoading: boolean;
    authenticate: (token: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};