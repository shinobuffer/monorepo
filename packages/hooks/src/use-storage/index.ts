import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { isBrowser, isFunction } from 'es-toolkit';
import { logger } from '../common/logger';
import { useLatest } from '../use-latest';
import { useUpdateEffect } from '../use-update-effect';
import { useWindowEvent } from '../use-window-event';

type StorageType = 'localStorage' | 'sessionStorage';

type StorageCustomEvent<T> = CustomEvent<{ key: string; value: T }>;

export interface UseStorageOptions<T> {
  key: string;
  sync?: boolean;
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
}

const useStorage = <T>(type: StorageType, { key, sync = true, serializer, deserializer }: UseStorageOptions<T>) => {
  const eventName = `shinobu_${type}` as const;
  const serializerRef = useLatest(serializer);
  const deserializerRef = useLatest(deserializer);

  const writeToStorage = useCallback((key: string, value: T | undefined) => {
    try {
      const storage = window[type];
      if (value === undefined) {
        return storage.removeItem(key);
      }
      storage.setItem(key, serializerRef.current ? serializerRef.current(value) : JSON.stringify(value));
    } catch (e) {
      logger.warn('Failed to serializer value', value);
      throw e;
    }
  }, []);

  const readFromStorage = useCallback((key: string): T | undefined => {
    try {
      const storage = window[type];
      const storageValue = storage.getItem(key);
      if (storageValue === null) {
        return undefined;
      }
      return deserializerRef.current ? deserializerRef.current(storageValue) : JSON.parse(storageValue);
    } catch (e) {
      logger.warn('Failed to serializer value', value);
      throw e;
    }
  }, []);

  const [value, setValue] = useState<T | undefined>(() => (isBrowser() ? readFromStorage(key) : undefined));

  const set = useCallback<Dispatch<SetStateAction<T | undefined>>>(
    (valueOrValueFunc) => {
      if (isFunction(valueOrValueFunc)) {
        setValue((prev) => {
          const nextValue = valueOrValueFunc(prev);
          writeToStorage(key, nextValue);
          queueMicrotask(() => {
            window.dispatchEvent(new CustomEvent(eventName, { detail: { key, value: nextValue } }));
          });
          return nextValue;
        });
      } else {
        writeToStorage(key, valueOrValueFunc);
        window.dispatchEvent(new CustomEvent(eventName, { detail: { key, value: valueOrValueFunc } }));
        setValue(valueOrValueFunc);
      }
    },
    [key],
  );

  const remove = useCallback(() => {
    const storage = window[type];
    storage.removeItem(key);
    window.dispatchEvent(new CustomEvent(eventName, { detail: { key, value: undefined } }));
  }, [key]);

  // Handle storage change event from other tab
  useWindowEvent('storage', (e) => {
    if (!sync) {
      return;
    }
    if (e.storageArea === window[type] && e.key === key) {
      setValue(readFromStorage(e.key));
    }
  });

  // Handle storage change event from current tab
  useWindowEvent(eventName, (e: StorageCustomEvent<T>) => {
    if (!sync) {
      return;
    }
    if (e.detail.key === key) {
      setValue(e.detail.value);
    }
  });

  useUpdateEffect(() => {
    setValue(readFromStorage(key));
  }, [key]);

  return {
    /**
     * `value` will be `undefinde` in the following cases:
     * 1. Failed to accss storage or failed to deserialize the value from storage during initialization, leaving `value` unset
     * 2. Access a storage value that does not exist
     */
    value,
    /** `set(undefined)` equals to `remove()` */
    set,
    remove,
  } as const;
};

export const useLocalStorage = <T = string>(options: UseStorageOptions<T>) => useStorage('localStorage', options);

export const useSessionStorage = <T = string>(options: UseStorageOptions<T>) => useStorage('sessionStorage', options);
