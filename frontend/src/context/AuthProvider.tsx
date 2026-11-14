import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { AuthContext, type AuthUser } from './auth';

const getUserFromToken = async (token: string): Promise<AuthUser> => {
    const response = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Invalid token');

    const data: AuthUser = await response.json();
    return data;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(() => Boolean(localStorage.getItem('token')));
    const validationStarted = useRef(false);

    const authenticate = useCallback(async (token: string) => {
        const authenticatedUser = await getUserFromToken(token);
        localStorage.setItem('token', token);
        setUser(authenticatedUser);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setUser(null);
    }, []);

    useEffect(() => {
        if (validationStarted.current) return;
        validationStarted.current = true;

        const token = localStorage.getItem('token');
        if (!token) return;

        getUserFromToken(token)
            .then(setUser)
            .catch(() => {
                localStorage.removeItem('token');
                setUser(null);
            })
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading, authenticate, logout }}>
            {children}
        </AuthContext.Provider>
    );
};