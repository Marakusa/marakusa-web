import React from 'react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import Avatar from "./Avatar";
import LinkText from "./LinkText";
import ContextMenu from "./ContextMenu";
import { Spinner } from './Spinner';

const Header: React.FC = () => {
    const { user, isLoading, logout } = useAuth();
    const navigate = useNavigate();

    const [isContextMenuOpen, setIsContextMenuOpen] = React.useState(false);
    const menuAnchorRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!isContextMenuOpen) return;

        function handlePointerDown(event: PointerEvent) {
            if (!menuAnchorRef.current?.contains(event.target as Node)) {
                setIsContextMenuOpen(false);
            }
        }

        document.addEventListener('pointerdown', handlePointerDown);
        return () => document.removeEventListener('pointerdown', handlePointerDown);
    }, [isContextMenuOpen]);

    function toggleContextMenu() {
        setIsContextMenuOpen((isOpen) => !isOpen);
    }

    return (
        <>
            <header>
                <h1 className="select-none cursor-pointer" onClick={() => navigate('/')}>Marakusa</h1>
                <nav className="flex space-x-12 select-none items-center">
                    <LinkText href="/store">Store</LinkText>
                    <LinkText href="/pricing">Pricing</LinkText>
                    <LinkText href="/licenses">Licenses</LinkText>
                    {user ? (
                        <div
                            className="avatar-menu-anchor"
                            ref={menuAnchorRef}
                            onClick={(event) => {
                                if (event.target instanceof Element && event.target.closest('.context-menu a')) {
                                    setIsContextMenuOpen(false);
                                }
                            }}
                        >
                            <Avatar avatar={user.avatar} username={user.username} onClick={toggleContextMenu} />
                            {isContextMenuOpen && (
                                <ContextMenu>
                                    <LinkText href="/profile">Profile</LinkText>
                                    <LinkText href="/settings">Settings</LinkText>
                                    <hr className="mt-1 opacity-25"></hr>
                                    
                                    {user?.admin && (
                                        <>
                                            <LinkText href="/dashboard">Dashboard</LinkText>
                                            <hr className="mt-1 opacity-25"></hr>
                                        </>
                                    )}

                                    <a onClick={logout} className="link-text">Log Out</a>
                                </ContextMenu>
                            )}
                        </div>
                    ) : !isLoading ? (
                        <Button onClick={() => window.location.assign('/api/auth/login')}>Log In</Button>
                    ) : <Spinner />}
                </nav>
            </header>
        </>
    );
};

export default Header;