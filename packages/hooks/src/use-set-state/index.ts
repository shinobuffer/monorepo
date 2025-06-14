import { useCallback, useState } from 'react';
import { isFunction } from 'es-toolkit';

type SetStateType<T> = (state: Partial<T> | ((prev: T) => Partial<T>)) => void;

export const useSetState = <T extends Record<string, any>>(initialState: T | (() => T)) => {
  const [state, setState] = useState(initialState);

  const _setState = useCallback<SetStateType<T>>((stateOrStateFunc) => {
    setState((prev) => ({ ...prev, ...(isFunction(stateOrStateFunc) ? stateOrStateFunc(prev) : stateOrStateFunc) }));
  }, []);

  return [state, _setState];
};
