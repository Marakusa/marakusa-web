import { useAuth } from '../../context/auth';

function Dashboard() {
    const { user } = useAuth();

    if (!user?.admin) {
        return <p>Access denied</p>;
    }

    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    );
}

export default Dashboard;