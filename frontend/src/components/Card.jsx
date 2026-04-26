/**
 * Card Component
 * 
 * Base card container with optional hover effects and variants.
 * Provides consistent styling for content containers throughout the app.
 */
const Card = ({
  children,
  hover = false,
  variant = 'default',
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-300';

  const variants = {
    default: 'bg-gray-800 border border-gray-700',
    surface: 'bg-gray-900 border border-gray-800',
    glass: 'bg-gray-800/70 backdrop-blur-sm border border-gray-700',
    gradient: 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
  };

  const hoverStyles = hover
    ? 'hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10 hover:scale-[1.02] cursor-pointer'
    : '';

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
