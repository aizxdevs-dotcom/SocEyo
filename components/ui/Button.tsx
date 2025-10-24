"use client";

import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "default" | "secondary" | "link" | "outline";
}

const Button: React.FC<ButtonProps> = ({
  children,
  loading,
  className,
  variant = "default",
  ...rest
}) => {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 text-sm sm:text-base";

  const variants = {
    default: "bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-2 hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 sm:px-6 sm:py-2",
    link: "bg-transparent text-blue-600 hover:underline px-0 py-0",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 sm:px-5",
  };

  return (
    <button
      className={clsx(base, variants[variant], className)}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;