import React from 'react';

interface SubheadingProps {
  children: React.ReactNode;
}

const Subheading: React.FC<SubheadingProps> = ({ children }) => {
  return <h2>{children}</h2>;
};

export default Subheading;