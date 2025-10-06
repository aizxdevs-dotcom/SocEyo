"use client";

import React from "react";
import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="font-medium text-sm text-gray-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            // plain white background only
            "rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none",
            "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          {...rest}
        />
        {error && (
          <span className="text-xs text-red-500">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;