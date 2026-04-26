/**
 * Avatar Component
 * 
 * Displays user initials in a colored circle.
 * Color is deterministically generated from the name using a hash function.
 */
const Avatar = ({
  name = 'User',
  size = 'md',
  className = ''
}) => {
  // Generate initials from name
  const getInitials = (name) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Generate consistent color from name using simple hash
  const getColorFromName = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      'bg-green-500',
      'bg-blue-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-yellow-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-teal-500',
      'bg-cyan-500',
      'bg-orange-500'
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl'
  };

  const initials = getInitials(name);
  const colorClass = getColorFromName(name);

  return (
    <div
      className={`${sizes[size]} ${colorClass} rounded-full flex items-center justify-center font-bold text-white ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
};

export default Avatar;
