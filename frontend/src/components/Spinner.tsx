import React from 'react';
import './Spinner.css';

interface SpinnerProps {
  size?: number;
  color?: string;
  thickness?: number;
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 32,
  color = '#e9757c',
  thickness = 4,
  label = 'Loading...',
}) => {
  return (
    <div
      className="spinner"
      role="status"
      aria-label={label}
      style={{
        width: size,
        height: size,
        borderWidth: thickness,
        borderColor: color,
      }}
    />
  );
};
