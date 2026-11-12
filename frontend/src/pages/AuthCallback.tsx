import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

const AuthCallback = () => {
    const navigate = useNavigate();
    const { authenticate } = useAuth();
    const requestStarted = useRef(false);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (requestStarted.current) return;

        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (!code) return;

        requestStarted.current = true;
        const verify = async () => {
            try {
                const response = await fetch(`/api/auth/verify?code=${encodeURIComponent(code)}`);
                const data: { token?: string; error?: string } = await response.json();
                if (!response.ok || !data.token) {
                    throw new Error(data.error || 'Authentication failed');
                }

                await authenticate(data.token);
                navigate('/');
            } catch (err) {
                console.error('Error verifying authentication:', err);
                setError('Authentication failed');
            }
        };

        void verify();
    }, [authenticate, navigate]);

    if (error) {
        return <div>{error}</div>;
    }
    return <div>Authenticating...</div>;
};

export default AuthCallback;