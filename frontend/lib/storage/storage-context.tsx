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

  // Pas de mise à jour optimiste : le mode ne change qu'après confirmation
  // du backend, pour que la galerie recharge une fois la base à jour.
  const setCloudMode = useCallback(async () => {
    const updated = await storageApi.updateConfig({ mode: 'cloud' });
    setConfig(updated);
  }, []);

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