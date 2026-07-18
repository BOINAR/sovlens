'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { storageApi } from '../api/endpoints';
import { StorageConfig, StorageMode } from '../api/types';

interface StorageContextValue {
  config: StorageConfig | null;
  loading: boolean;
  setMode: (mode: StorageMode) => Promise<void>;
  refresh: () => Promise<void>;
}

const StorageContext = createContext<StorageContextValue | null>(null);

export function StorageProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<StorageConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const cfg = await storageApi.getConfig();
      setConfig(cfg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const setMode = useCallback(
    async (mode: StorageMode) => {
      const previous = config;
      setConfig((c) => (c ? { ...c, mode } : c));
      try {
        const updated = await storageApi.updateConfig({ mode });
        setConfig(updated);
      } catch (err) {
        setConfig(previous);
        throw err;
      }
    },
    [config]
  );

  return (
    <StorageContext.Provider value={{ config, loading, setMode, refresh }}>
      {children}
    </StorageContext.Provider>
  );
}

export function useStorageMode() {
  const ctx = useContext(StorageContext);
  if (!ctx) throw new Error('useStorageMode doit être utilisé dans <StorageProvider>');
  return ctx;
}