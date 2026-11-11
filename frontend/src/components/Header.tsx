import React from 'react';
import Button from './Button';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center px-4">
      <h1 className="select-none cursor-pointer" onClick={() => window.location.href = '/'}>Marakusa</h1>
      <nav className="space-x-12 select-none">
        <a href="/store" className="link-text">Store</a>
        <a href="/pricing" className="link-text">Pricing</a>
        <a href="/licenses" className="link-text">Licenses</a>
        <Button onClick={() => window.location.href = '/login'}>Log In</Button>
      </nav>
    </header>
  );
};

export default Header;