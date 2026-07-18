'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { storageApi } from '../api/endpoints';
import { StorageConfig, UpdateStorageConfigRequest } from '../api/types';

interface StorageContextValue {
  config: StorageConfig | null;
  loading: boolean;
  setCloudMode: () => Promise<void>;
  setSovereignConfig: (data: Omit<UpdateStorageConfigRequest, 'mode'>) => Promise<void>;
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  const setCloudMode = useCallback(async () => {
    const previous = config;
    setConfig((c) => (c ? { ...c, mode: 'cloud' } : c));
    try {
      const updated = await storageApi.updateConfig({ mode: 'cloud' });
      setConfig(updated);
    } catch (err) {
      setConfig(previous);
      throw err;
    }
  }, [config]);

  const setSovereignConfig = useCallback(async (data: Omit<UpdateStorageConfigRequest, 'mode'>) => {
    const updated = await storageApi.updateConfig({ mode: 'sovereign', ...data });
    setConfig(updated);
  }, []);

  return (
    <StorageContext.Provider value={{ config, loading, setCloudMode, setSovereignConfig, refresh }}>
      {children}
    </StorageContext.Provider>
  );
}

export function useStorageMode() {
  const ctx = useContext(StorageContext);
  if (!ctx) throw new Error('useStorageMode doit être utilisé dans <StorageProvider>');
  return ctx;
}