import { useState, useEffect } from 'react';
import { Spinner } from '../components/Spinner';

interface Profile {
    username: string;
}

function Profile() {
    const [user, setUser] = useState<Profile | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await fetch('/api/profile', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(res => res.json());
                setUser(userData);
            } catch (err) {
                setError('Failed to fetch user data');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, []);
    
    return (
        <div className="grow">
            {!isLoading && user ? (
                <div>
                    <h1>Hello, {user?.username}!</h1>
                    <p>Username: {user.username}</p>
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