import { Outlet } from 'react-router-dom';
import LinkText from '../../components/LinkText';

function DashboardHeader() {
    return (
        <div className="grow">
            <nav className="flex items-center space-x-12 px-4 border-b border-b-white/10 pb-6 mb-6">
                <LinkText href="/dashboard">Overview</LinkText>
                <LinkText href="/dashboard/products">Products</LinkText>
            </nav>

            <Outlet />
        </div>
    );
}

export default DashboardHeader;