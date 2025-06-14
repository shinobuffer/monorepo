import { useCallback, useEffect, useRef, useState } from 'react';
import { useUpdateEffect } from '../use-update-effect';

interface UseIntervalOptions {
  fn: () => void;
  interval: number;
  /** If set, the interval must be start manually, `false` by default */
  manualInvoke?: boolean;
}

export const useInterval = ({ fn, interval, manualInvoke = false }: UseIntervalOptions) => {
  const [active, setActive] = useState(!manualInvoke);
  const intervalRef = useRef<number>(-1);
  const fnRef = useRef<() => void>(null);

  fnRef.current = fn;

  const start = useCallback(() => {
    setActive((prev) => {
      if (!prev && intervalRef.current === -1) {
        intervalRef.current = window.setInterval(fnRef.current!, interval);
      }
      return true;
    });
  }, [interval]);

  const stop = useCallback(() => {
    setActive((prev) => {
      if (prev && intervalRef.current !== -1) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = -1;
      }
      return false;
    });
  }, []);

  const toggle = useCallback(() => {
    if (active) {
      return stop();
    }
    return start();
  }, [active]);

  useUpdateEffect(() => {
    start();
    return stop;
  }, [interval]);

  useEffect(() => {
    if (manualInvoke) {
      return;
    }
    start();
  }, []);

  return { start, stop, toggle, active };
};
