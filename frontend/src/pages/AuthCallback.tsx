import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
    const navigate = useNavigate();
    const requestStarted = useRef(false);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (requestStarted.current) return;

        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (!code) return;

        requestStarted.current = true;
        fetch(`/api/auth/verify?code=${encodeURIComponent(code)}`)
            .then(response => response.json())
            .then(data => {
                if (!data.token) throw new Error('Authentication failed');

                localStorage.setItem('token', data.token);
                navigate('/');
            })
            .catch(err => {
                console.error('Error verifying authentication:', err);
                setError('Authentication failed');
            });
    }, [navigate]);

    if (error) {
        return <div>{error}</div>;
    }
    return <div>Authenticating...</div>;
};

export default AuthCallback;