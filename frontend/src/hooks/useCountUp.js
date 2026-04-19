import { useState, useEffect, useRef } from 'react';

export const useCountUp = (targetValue, duration = 1000) => {
  const [count, setCount] = useState(0);
  const targetRef = useRef(targetValue);
  
  useEffect(() => {
    targetRef.current = targetValue;
    const startValue = count;
    const startTime = performance.now();
    const endValue = targetValue;
    
    if (startValue === endValue) return;
    
    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * easeOut;
      setCount(Math.floor(current));
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };
    
    requestAnimationFrame(updateCount);
  }, [targetValue, duration]);
  
  return count;
};