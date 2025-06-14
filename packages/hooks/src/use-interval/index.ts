import { useEffect } from 'react';
import { useLatest } from '../use-latest';

/**
 * @param delay Stop the interval by setting `delay` to null
 */
export const useInterval = (fn: () => void, delay: number | null) => {
  const fnRef = useLatest(fn);

  useEffect(() => {
    if (delay !== null) {
      const interval = setInterval(() => fnRef.current(), delay);
      return () => clearInterval(interval);
    }
    return;
  }, [delay]);
};
