import { useEffect, useRef, useState } from 'react';

/**
 * useScrollReveal Hook
 * 
 * Provides scroll-triggered reveal animations using IntersectionObserver.
 * Elements fade in and slide up when they enter the viewport.
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Percentage of element visibility to trigger (0-1)
 * @param {number} options.delay - Delay before animation starts (ms)
 * @param {number} options.duration - Animation duration (ms)
 * @param {boolean} options.once - Whether to animate only once
 * @returns {Object} - { ref, isVisible }
 */
export const useScrollReveal = ({
  threshold = 0.15,
  delay = 0,
  duration = 600,
  once = true
} = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Skip if already animated and once is true
    if (once && hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Apply delay if specified
          if (delay > 0) {
            setTimeout(() => {
              setIsVisible(true);
              hasAnimated.current = true;
            }, delay);
          } else {
            setIsVisible(true);
            hasAnimated.current = true;
          }

          // Unobserve if once is true
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px'
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, delay, once]);

  // Generate animation styles
  const animationStyles = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
    transition: `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`
  };

  return { ref, isVisible, animationStyles };
};

/**
 * useStaggeredReveal Hook
 * 
 * Provides staggered reveal animations for multiple child elements.
 * Each child animates with a delay based on its index.
 * 
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Percentage of element visibility to trigger (0-1)
 * @param {number} options.staggerDelay - Delay between each child animation (ms)
 * @param {number} options.duration - Animation duration (ms)
 * @returns {Object} - { ref, isVisible }
 */
export const useStaggeredReveal = ({
  threshold = 0.15,
  staggerDelay = 100,
  duration = 600
} = {}) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          // Apply staggered delays to children
          const children = element.querySelectorAll('[data-stagger-item]');
          children.forEach((child, index) => {
            const delay = index * staggerDelay;
            child.style.transitionDelay = `${delay}ms`;
          });

          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin: '0px'
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, staggerDelay]);

  return { ref, isVisible };
};

export default useScrollReveal;
