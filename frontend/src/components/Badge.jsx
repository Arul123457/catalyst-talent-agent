/**
 * Badge Component
 * 
 * Small status indicator with multiple variants and optional dot indicator.
 * Used for tags, status labels, and categorical information.
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = ''
}) => {
  const baseStyles = 'inline-flex items-center font-semibold rounded-full transition-colors';

  const variants = {
    default: 'bg-gray-700 text-gray-200',
    success: 'bg-green-500/20 text-green-400 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
    info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    muted: 'bg-gray-800 text-gray-400 border border-gray-700',
    primary: 'bg-green-500/20 text-green-400 border border-green-500/30'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const dotColors = {
    default: 'bg-gray-400',
    success: 'bg-green-400',
    warning: 'bg-yellow-400',
    danger: 'bg-red-400',
    info: 'bg-blue-400',
    muted: 'bg-gray-500',
    primary: 'bg-green-400'
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && (
        <span className={`w-2 h-2 rounded-full mr-1.5 ${dotColors[variant]} animate-pulse-glow`} />
      )}
      {children}
    </span>
  );
};

export default Badge;
