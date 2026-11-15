import React from 'react';
import Button from '../../components/Button';
import { useAuth } from '../../context/auth';
import Avatar from "../../components/Avatar";
import LinkText from "../../components/LinkText";
import ContextMenu from "../../components/ContextMenu";
import { Spinner } from '../../components/Spinner';

function DashboardHeader() {
    const { user, isLoading, logout } = useAuth();

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
                <h1 className="select-none cursor-pointer" onClick={() => window.location.href = '/'}>Marakusa</h1>
                <nav className="flex space-x-12 select-none items-center">
                    <LinkText href="/dashboard">Overview</LinkText>
                    <LinkText href="/dashboard/products">Products</LinkText>
                    <span>∙</span>
                    <LinkText href="/">Return</LinkText>
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
                                            <LinkText href="/">Return</LinkText>
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
}

export default DashboardHeader;