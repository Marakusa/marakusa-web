import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return <button className="btn select-none" onClick={onClick}>{children}</button>;
};

export default Button;