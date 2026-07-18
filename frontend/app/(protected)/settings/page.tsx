'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useStorageMode } from '@/lib/storage/storage-context';
import { useAuth } from '@/lib/auth/auth-context';
import { ApiError } from '@/lib/api/types';

export default function SettingsPage() {
  const { config, setCloudMode, setSovereignConfig } = useStorageMode();
  const { user } = useAuth();

  const [endpoint, setEndpoint] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [bucket, setBucket] = useState('');
  const [saving, setSaving] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (config?.endpoint) setEndpoint(config.endpoint);
    if (config?.bucket) setBucket(config.bucket);
  }, [config]);

  const isSovereign = config?.mode === 'sovereign';

  async function handleCloudClick() {
    setError(null);
    setSwitching(true);
    try {
      await setCloudMode();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Impossible de basculer en mode cloud.');
    } finally {
      setSwitching(false);
    }
  }

  async function handleSovereignSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await setSovereignConfig({ endpoint, accessKey, secretKey, bucket });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Configuration invalide. Vérifiez vos identifiants.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-190 mx-auto">
      {/* Killer feature */}
      <div
        className="border rounded-[18px] p-5 md:p-6 mb-5.5 relative overflow-hidden bg-sv-surface"
        style={{ borderColor: 'var(--sv-ring)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(500px 220px at 88% -30%, rgba(62,224,161,.1), transparent 60%)' }}
        />
        <div className="relative">
          <span className="font-mono text-[11px] tracking-[.12em] uppercase text-sv-accent">Killer feature</span>
          <h2 className="font-display font-bold text-xl md:text-[22px] tracking-tight mt-1 mb-1.5">
            Où vivent vos photos&nbsp;?
          </h2>
          <p className="text-[13.5px] text-sv-text2 mb-5 max-w-[52ch]">
            Basculez à tout moment. Le changement recolore l&apos;application entière pour que vous sachiez,
            d&apos;un coup d&apos;œil, où sont vos données.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={handleCloudClick}
              disabled={switching}
              className="text-left rounded-2xl p-4 transition-all disabled:opacity-60"
              style={{
                border: !isSovereign ? '1.5px solid #6ea8fe' : '1px solid #262c35',
                background: !isSovereign ? 'rgba(255,255,255,.02)' : 'var(--color-sv-base)',
                boxShadow: !isSovereign ? '0 0 0 4px rgba(110,168,254,.1)' : 'none',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 font-bold text-[15px]">
                  <span className="w-2.75 h-2.75 rounded-full bg-sv-cloud" />
                  Cloud SovLens
                </span>
                <span
                  className="w-5 h-5 rounded-full shrink-0"
                  style={!isSovereign ? { background: '#6ea8fe', boxShadow: '0 0 10px rgba(110,168,254,.5)' } : { border: '2px solid #333b46' }}
                />
              </div>
              <p className="text-[12.5px] text-sv-text2 mb-3 min-h-13">
                Confort maximal : sauvegarde chiffrée sur nos serveurs en Europe, synchro instantanée.
              </p>
              <div className="grid gap-1.5 text-[11.5px] font-medium text-sv-text2">
                <div>Serveurs · UE (Paris, Francfort)</div>
                <div>Sync temps réel · multi-appareils</div>
                <div>Chiffrement au repos AES-256</div>
              </div>
            </button>

            <div
              className="rounded-2xl p-4"
              style={{
                border: isSovereign ? '1.5px solid #3ee0a1' : '1px solid #262c35',
                background: isSovereign ? 'rgba(255,255,255,.02)' : 'var(--color-sv-base)',
                boxShadow: isSovereign ? '0 0 0 4px rgba(62,224,161,.1)' : 'none',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 font-bold text-[15px]">
                  <span className="w-2.75 h-2.75 rounded-full bg-sv-sovereign" />
                  Souverain
                </span>
                <span
                  className="w-5 h-5 rounded-full shrink-0"
                  style={isSovereign ? { background: '#3ee0a1', boxShadow: '0 0 10px rgba(62,224,161,.5)' } : { border: '2px solid #333b46' }}
                />
              </div>
              <p className="text-[12.5px] text-sv-text2 mb-3 min-h-13">
                Contrôle total : vos photos ne quittent jamais vos serveurs. Renseignez vos identifiants ci-dessous.
              </p>
              <div className="grid gap-1.5 text-[11.5px] font-medium text-sv-text2">
                <div>Vos serveurs · auto-hébergé</div>
                <div>Clés privées · zéro-connaissance</div>
                <div>Aucune dépendance tierce</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4.5 px-4 py-3.5 bg-sv-surface2 border border-sv-border rounded-xl">
            <div className="flex items-center gap-2.5">
              <span
                className="w-2.25 h-2.25 rounded-full"
                style={{ background: 'var(--color-sv-accent)', boxShadow: '0 0 10px var(--sv-ring)' }}
              />
              <span className="font-semibold text-[13.5px]">Mode actif : {isSovereign ? 'Souverain' : 'Cloud'}</span>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        </div>
      </div>

      {/* Config serveur souverain */}
      <div className="border border-sv-border rounded-2xl bg-sv-surface overflow-hidden mb-5.5">
        <div className="px-4.5 md:px-5.5 py-4 border-b border-sv-border">
          <div className="font-semibold text-[13.5px]">Configuration du serveur souverain</div>
          <div className="text-xs text-sv-text3 mt-0.5">Endpoint S3, bucket et identifiants Garage</div>
        </div>

        <form onSubmit={handleSovereignSubmit} className="p-4.5 md:p-5.5 flex flex-col gap-3.5">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-sv-text2">Endpoint S3</span>
            <input
              required
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="https://votre-homelab.example.com:3900"
              className="bg-sv-surface2 border border-sv-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-sv-accent font-mono"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-sv-text2">Bucket</span>
            <input
              required
              value={bucket}
              onChange={(e) => setBucket(e.target.value)}
              placeholder="sovlens-photos"
              className="bg-sv-surface2 border border-sv-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-sv-accent font-mono"
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-sv-text2">Access Key</span>
              <input
                required
                type="password"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="••••••••"
                className="bg-sv-surface2 border border-sv-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-sv-accent font-mono"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-sv-text2">Secret Key</span>
              <input
                required
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="••••••••"
                className="bg-sv-surface2 border border-sv-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-sv-accent font-mono"
              />
            </label>
          </div>

          {success && <p className="text-sv-accent text-sm">Configuration enregistrée, mode souverain activé.</p>}

          <button
            type="submit"
            disabled={saving}
            className="self-start bg-sv-accent text-[#04150e] font-bold rounded-lg px-4 py-2 text-sm disabled:opacity-60"
          >
            {saving ? 'Enregistrement…' : 'Enregistrer et activer'}
          </button>
        </form>
      </div>

      {/* Autres réglages */}
      <div className="border border-sv-border rounded-2xl bg-sv-surface overflow-hidden">
        <div className="flex items-center justify-between px-4.5 md:px-5.5 py-4 border-b border-sv-surface2">
          <div>
            <div className="font-semibold text-[13.5px]">Compte</div>
            <div className="text-xs text-sv-text3">{user?.email}</div>
          </div>
        </div>
        <div className="flex items-center justify-between px-4.5 md:px-5.5 py-4">
          <div>
            <div className="font-semibold text-[13.5px]">Apparence</div>
            <div className="text-xs text-sv-text3">Sombre (par défaut)</div>
          </div>
        </div>
      </div>
    </div>
  );
}