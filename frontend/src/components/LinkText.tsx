import React from 'react';
import { Link } from 'react-router-dom';

interface LinkTextProps {
    children: React.ReactNode;
    href: string;
    newTab?: boolean;
}

const LinkText: React.FC<LinkTextProps> = ({ children, href, newTab }) => {
    return <Link className="link-text" to={href} target={newTab ? "_blank" : undefined} rel={newTab ? "noopener noreferrer" : undefined}>{children}</Link>;
};

export default LinkText;