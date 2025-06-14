import { useEffect } from 'react';
import { useLatest } from '../use-latest';

export const useWindowEvent = <K extends string>(
  type: K,
  listener: K extends keyof WindowEventMap ? (e: WindowEventMap[K]) => void : (e: CustomEvent) => void,
  options?: boolean | AddEventListenerOptions,
) => {
  const listenerRef = useLatest(listener);

  useEffect(() => {
    const handlers = (e: any) => listenerRef.current(e);
    window.addEventListener(type as any, handlers, options);
    return () => window.removeEventListener(type as any, handlers);
  }, [type]);
};
