import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className, disabled }) => {
  return <button className={`btn select-none ${className ?? ''}`} onClick={onClick} disabled={disabled}>{children}</button>;
};

export default Button;