/**
 * Skeleton Component
 * 
 * Animated loading placeholder that mimics content structure.
 * Used to indicate loading states while maintaining layout.
 */
const Skeleton = ({
  variant = 'text',
  width,
  height,
  className = '',
  count = 1
}) => {
  const baseStyles = 'animate-pulse bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%]';
  
  const variants = {
    text: 'h-4 rounded',
    title: 'h-8 rounded',
    circle: 'rounded-full',
    rect: 'rounded-lg',
    card: 'h-48 rounded-2xl'
  };

  const style = {
    width: width || '100%',
    height: height || undefined
  };

  // Render multiple skeletons if count > 1
  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            style={style}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={style}
    />
  );
};

/**
 * SkeletonCard Component
 * 
 * Pre-composed skeleton for card layouts.
 */
export const SkeletonCard = ({ className = '' }) => {
  return (
    <div className={`bg-gray-800 border border-gray-700 rounded-2xl p-6 ${className}`}>
      <div className="flex items-start gap-4 mb-4">
        <Skeleton variant="circle" width="48px" height="48px" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="title" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="text" count={3} />
    </div>
  );
};

/**
 * SkeletonTable Component
 * 
 * Pre-composed skeleton for table layouts.
 */
export const SkeletonTable = ({ rows = 5, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-4">
          <Skeleton variant="circle" width="40px" height="40px" />
          <Skeleton variant="text" className="flex-1" />
          <Skeleton variant="text" width="100px" />
          <Skeleton variant="text" width="80px" />
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
