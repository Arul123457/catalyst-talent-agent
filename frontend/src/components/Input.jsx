import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

/**
 * Input Component
 * 
 * Styled input field with label, error state, helper text, and password toggle.
 * Supports all standard input types and textarea variant.
 */
const Input = ({
  label,
  type = 'text',
  error,
  helperText,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const baseStyles = 'w-full px-4 py-2.5 bg-gray-900 text-white rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 placeholder:text-gray-500';
  
  const borderStyles = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-700 focus:border-green-500 focus:ring-green-500';

  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type={inputType}
          className={`${baseStyles} ${borderStyles} ${isPassword ? 'pr-12' : ''} ${className}`}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-1.5 text-sm text-red-400">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-400">{helperText}</p>
      )}
    </div>
  );
};

/**
 * Textarea Component
 * 
 * Styled textarea field with label, error state, and helper text.
 */
export const Textarea = ({
  label,
  error,
  helperText,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const baseStyles = 'w-full px-4 py-2.5 bg-gray-900 text-white rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 placeholder:text-gray-500 resize-y';
  
  const borderStyles = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-700 focus:border-green-500 focus:ring-green-500';

  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <textarea
        className={`${baseStyles} ${borderStyles} ${className}`}
        {...props}
      />
      
      {error && (
        <p className="mt-1.5 text-sm text-red-400">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-400">{helperText}</p>
      )}
    </div>
  );
};

/**
 * Select Component
 * 
 * Styled select dropdown with label, error state, and helper text.
 */
export const Select = ({
  label,
  error,
  helperText,
  children,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const baseStyles = 'w-full px-4 py-2.5 bg-gray-900 text-white rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950';
  
  const borderStyles = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-700 focus:border-green-500 focus:ring-green-500';

  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <select
        className={`${baseStyles} ${borderStyles} ${className}`}
        {...props}
      >
        {children}
      </select>
      
      {error && (
        <p className="mt-1.5 text-sm text-red-400">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-400">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
