import { useEffect, useRef } from 'react';

export const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const firstRef = useRef(true);

  useEffect(() => {
    if (firstRef.current) {
      firstRef.current = false;
      return;
    }
    return effect();
  }, deps);
};
