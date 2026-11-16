import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { Spinner } from '../components/Spinner';
import { apiFetch } from '../utils/api';

interface VerifyResponse {
    token?: string;
    error?: string;
}

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
                const data = await apiFetch<VerifyResponse>(`/api/auth/verify?code=${encodeURIComponent(code)}`);
                if (!data.token) {
                    throw new Error(data.error || 'Authorization failed, please try again...');
                }

                await authenticate(data.token);
                navigate('/');
            } catch (err) {
                console.error('Error verifying authorization:', err);
                setError('Authorization failed, please try again...');
            }
        };

        void verify();
    }, [authenticate, navigate]);

    return <div className={`flex justify-center items-center py-6 ${error ? 'text-red-500' : ''}`}>{error ? error : <Spinner />}</div>;
};

export default AuthCallback;