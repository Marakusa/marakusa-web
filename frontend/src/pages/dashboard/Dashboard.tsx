import { useAuth } from '../../context/auth';

import './Dashboard.css';

function Dashboard() {
    const { user } = useAuth();

    if (!user?.admin) {
        return <p>Access denied</p>;
    }

    return (
        <div className="grow">
            <h2>Welcome, {user?.username}</h2>
        </div>
    );
}

export default Dashboard;