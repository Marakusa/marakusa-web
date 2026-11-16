import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { AuthContext, type AuthUser } from './auth';
import { ApiError, apiFetch } from '../utils/api';

const getUserFromToken = (token: string) =>
    apiFetch<AuthUser>('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });

const isAuthFailure = (err: unknown) => err instanceof ApiError && err.status === 401;
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// Retry temporary failures (429, 5xx, network) with backoff; give up immediately on 401
const getUserWithRetry = async (token: string, attempts = 5): Promise<AuthUser> => {
    for (let i = 0; ; i++) {
        try {
            return await getUserFromToken(token);
        } catch (err) {
            if (isAuthFailure(err) || i >= attempts - 1) throw err;
            await sleep(Math.min(2000 * 2 ** i, 30000)); // exponential timeout: (2s, 4s, 8s, etc.)
        }
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(() => Boolean(localStorage.getItem('token')));
    const [authError, setAuthError] = useState<string | null>(null);
    const validationStarted = useRef(false);

    const authenticate = useCallback(async (token: string) => {
        localStorage.setItem('token', token);
        try {
            setUser(await getUserWithRetry(token));
            setAuthError(null);
        } catch (err) {
            if (isAuthFailure(err)) localStorage.removeItem('token');
            throw err;
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setUser(null);
        setAuthError(null);
    }, []);

    useEffect(() => {
        if (validationStarted.current) return;
        validationStarted.current = true;

        const token = localStorage.getItem('token');
        if (!token) return;

        getUserWithRetry(token)
            .then(user => { setUser(user); setAuthError(null); })
            .catch(err => {
                if (isAuthFailure(err)) {
                    localStorage.removeItem('token');
                } else {
                    setAuthError(err instanceof Error ? err.message : 'Could not verify your session');
                }
                setUser(null);
            })
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading, authError, authenticate, logout }}>
            {children}
        </AuthContext.Provider>
    );
};