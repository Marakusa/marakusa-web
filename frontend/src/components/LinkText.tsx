import React from 'react';
import { Link } from 'react-router-dom';

interface LinkTextProps {
    children: React.ReactNode;
    href: string;
    newTab?: boolean;
}

const LinkText: React.FC<LinkTextProps> = ({ children, href, newTab }) => {
    // If the link is /api or an absolute URL, use <a> instead of <Link>
    if (/^(?:\/api(?:\/|[?#]|$)|[a-z][a-z\d+.-]*:|\/\/)/i.test(href)) {
        return <a className="link-text" href={href} target={newTab ? "_blank" : undefined} rel={newTab ? "noopener noreferrer" : undefined}>{children}</a>;
    }

    return <Link className="link-text" to={href} target={newTab ? "_blank" : undefined} rel={newTab ? "noopener noreferrer" : undefined}>{children}</Link>;
};

export default LinkText;