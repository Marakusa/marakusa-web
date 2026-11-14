import type { ReactNode } from 'react';
import { useAuth } from './auth';
import { Navigate } from 'react-router-dom';
import { Spinner } from '../components/Spinner';

function ProtectedRoute({ children, loginRequired = true, adminOnly = true }: { children: ReactNode, loginRequired?: boolean, adminOnly?: boolean }) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="grow"><Spinner /></div>;
    }

    if (loginRequired && !user) {
        return <Navigate to="/api/auth/login" />;
    }

    if (adminOnly && !user?.admin) {
        return <Navigate to="/" />;
    }

    return children;
}

export default ProtectedRoute;