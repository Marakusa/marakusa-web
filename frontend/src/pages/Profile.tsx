import { useState, useEffect } from 'react';
import { Spinner } from '../components/Spinner';
import type { ProfileType } from '../interfaces/Profile';
import LinkText from '../components/LinkText';
import { apiFetch } from '../utils/api';

function Profile() {
    const [user, setUser] = useState<ProfileType | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await apiFetch<ProfileType>('/api/profile', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUser(userData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch user data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);
    
    return (
        <div className="grow">
            {!isLoading && user ? (
                <div className="text-left">
                    <img src={user?.avatar} alt={user?.username} className="w-32 h-32 rounded-full border-2 mb-4" />
                    <h1>Hello, {user?.username}!</h1>
                    <LinkText href="/licenses">My Licenses</LinkText>
                </div>
            ) : isLoading ? (
                <div className="grow"><Spinner /></div>
            ) : error ? (
                <p>{error}</p>
            ) : null
            }
        </div>
    );
}

export default Profile;