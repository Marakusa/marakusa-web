import React from 'react';

interface LinkTextProps {
  children: React.ReactNode;
  href: string;
  newTab?: boolean;
}

const LinkText: React.FC<LinkTextProps> = ({ children, href, newTab }) => {
  return <a className="link-text" href={href} target={newTab ? "_blank" : undefined} rel={newTab ? "noopener noreferrer" : undefined}>{children}</a>;
};

export default LinkText;