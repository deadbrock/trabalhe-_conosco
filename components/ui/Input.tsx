import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", type, leftIcon, rightIcon, ...props }, ref) => {
    if (!leftIcon && !rightIcon) {
      return (
        <input
          type={type}
          className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
          ref={ref}
          {...props}
        />
      );
    }

    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <span className="absolute left-3 flex items-center text-gray-400 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          type={type}
          className={`flex h-10 w-full rounded-md border border-gray-300 bg-white py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 ${leftIcon ? "pl-9" : "px-3"} ${rightIcon ? "pr-9" : "px-3"} ${className}`}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 flex items-center text-gray-400 pointer-events-none">
            {rightIcon}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
