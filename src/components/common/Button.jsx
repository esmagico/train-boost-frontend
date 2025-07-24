// Button.jsx
import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary', 
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors";
  
  const variantClasses = {
    primary: disabled 
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer",
    secondary: disabled
      ? "border border-gray-300 text-gray-400 cursor-not-allowed bg-gray-50"
      : "border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;