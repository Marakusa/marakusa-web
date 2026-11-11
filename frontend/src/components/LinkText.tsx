import React from 'react';

interface LinkTextProps {
  children: React.ReactNode;
  href: string;
}

const LinkText: React.FC<LinkTextProps> = ({ children, href }) => {
  return <a className="link-text" href={href}>{children}</a>;
};

export default LinkText;