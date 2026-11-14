import type { ReactNode } from 'react';
import { useAuth } from './auth';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, loginRequired = true, adminOnly = true }: { children: ReactNode, loginRequired?: boolean, adminOnly?: boolean }) {
    const { user } = useAuth();

    if (loginRequired && !user) {
        return <Navigate to="/api/auth/login" />;
    }

    if (adminOnly && !user?.admin) {
        return <Navigate to="/" />;
    }

    return children;
}

export default ProtectedRoute;