import React from 'react';
import Button from './Button';
import { useAuth } from '../context/auth';
import Avatar from "./Avatar";
import LinkText from "./LinkText";
import ContextMenu from "./ContextMenu";

const Header: React.FC = () => {
    const { user, isLoading, logout } = useAuth();

    const [isContextMenuOpen, setIsContextMenuOpen] = React.useState(false);

    function toggleContextMenu() {
        setIsContextMenuOpen((isOpen) => !isOpen);
    }

    return (
        <>
            <header>
                <h1 className="select-none cursor-pointer" onClick={() => window.location.href = '/'}>Marakusa</h1>
                <nav className="flex space-x-12 select-none">
                    <LinkText href="/store">Store</LinkText>
                    <LinkText href="/pricing">Pricing</LinkText>
                    <LinkText href="/licenses">Licenses</LinkText>
                    {user ? (
                        <div className="avatar-menu-anchor">
                            <Avatar avatar={user.avatar} username={user.username} onClick={toggleContextMenu} />
                            {isContextMenuOpen && (
                                <ContextMenu>
                                    <LinkText href="/profile">Profile</LinkText>
                                    <LinkText href="/settings">Settings</LinkText>
                                    <hr className="mt-2 opacity-25"></hr>
                                    <a onClick={logout} className="link-text">Log Out</a>
                                </ContextMenu>
                            )}
                        </div>
                    ) : !isLoading ? (
                        <Button onClick={() => window.location.assign('/api/auth/login')}>Log In</Button>
                    ) : null}
                </nav>
            </header>
        </>
    );
};

export default Header;