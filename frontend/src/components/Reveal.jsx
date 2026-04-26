import { useScrollReveal } from '../hooks/useScrollReveal';

/**
 * Reveal Component
 * 
 * Wrapper component that applies scroll-triggered reveal animations to its children.
 * Uses IntersectionObserver to detect when element enters viewport.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to animate
 * @param {number} props.threshold - Visibility threshold (0-1)
 * @param {number} props.delay - Animation delay in ms
 * @param {number} props.duration - Animation duration in ms
 * @param {boolean} props.once - Animate only once
 * @param {string} props.className - Additional CSS classes
 */
const Reveal = ({
  children,
  threshold = 0.15,
  delay = 0,
  duration = 600,
  once = true,
  className = ''
}) => {
  const { ref, animationStyles } = useScrollReveal({
    threshold,
    delay,
    duration,
    once
  });

  return (
    <div ref={ref} style={animationStyles} className={className}>
      {children}
    </div>
  );
};

export default Reveal;
