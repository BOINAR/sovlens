'use client';

import { useEffect, useState, useCallback } from 'react';
import { sharingApi } from '@/lib/api/endpoints';
import { ShareLinkSummary, ApiError } from '@/lib/api/types';

function formatExpiry(expiresAt: string | null, status: 'active' | 'expired') {
  if (status === 'expired') return 'lien expiré';
  if (!expiresAt) return 'sans expiration';
  const days = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "expire aujourd'hui";
  return `expire dans ${days} jour${days > 1 ? 's' : ''}`;
}

export default function SharedPage() {
  const [links, setLinks] = useState<ShareLinkSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setLinks(await sharingApi.listMine());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Impossible de charger les partages.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleRevoke(token: string) {
    if (!confirm('Révoquer ce lien de partage ? Il ne sera plus accessible.')) return;
    await sharingApi.revoke(token);
    setLinks((prev) => prev.filter((l) => l.token !== token));
  }

  function handleCopy(url: string, token: string) {
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  }

  if (loading) {
    return <p className="text-sv-text3 text-sm">Chargement…</p>;
  }

  if (error) {
    return <p className="text-red-400 text-sm">{error}</p>;
  }

  if (links.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <h1 className="font-display font-semibold text-xl mb-2">Partagés</h1>
        <p className="text-sv-text2 text-sm mb-6">
          Aucun lien de partage actif. Créez-en un depuis la Galerie ou un Album.
        </p>
        <a href="/gallery" className="inline-block bg-sv-accent text-[#04150e] font-bold rounded-lg px-4 py-2 text-sm">
          Aller à la Galerie
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-[13px] font-medium text-sv-text2 mb-4.5">
        <span className="text-sv-accent font-bold">{links.length}</span> partage{links.length > 1 ? 's' : ''} actif{links.length > 1 ? 's' : ''}
      </div>

      <div className="border border-sv-border bg-sv-surface rounded-2xl overflow-hidden">
        {links.map((link) => (
          <div
            key={link.token}
            className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4.5 py-4 border-b border-sv-surface2 last:border-0"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10.5 h-10.5 rounded-lg bg-sv-surface2 border border-sv-border flex-none" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[14px] truncate">{link.name}</span>
                  {link.storageMode && (
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                      style={{
                        background: link.storageMode === 'sovereign' ? 'rgba(62,224,161,.16)' : 'rgba(110,168,254,.16)',
                        color: link.storageMode === 'sovereign' ? '#7ff0c4' : '#a9caff',
                      }}
                    >
                      {link.storageMode === 'sovereign' ? 'Souverain' : 'Cloud'}
                    </span>
                  )}
                </div>
                <div className="text-xs text-sv-text3 truncate">
                  {link.type === 'album' ? 'Album' : 'Photo'} · {link.url.replace(/^https?:\/\//, '')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 flex-none">
              <div className="text-right">
                <span
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: link.status === 'active' ? 'rgba(66,214,127,.14)' : 'rgba(242,104,95,.14)',
                    color: link.status === 'active' ? '#6be89a' : '#f2685f',
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: link.status === 'active' ? '#42d67f' : '#f2685f' }}
                  />
                  {link.status === 'active' ? 'Actif' : 'Expiré'}
                </span>
                <div className="text-[11px] text-sv-text3 mt-1">{formatExpiry(link.expiresAt, link.status)}</div>
              </div>

              <div className="flex gap-2">
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-sv-border hover:border-sv-accent">
                  Ouvrir
                </a>
                <button
                  onClick={() => handleCopy(link.url, link.token)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-sv-border hover:border-sv-accent"
                >
                  {copiedToken === link.token ? 'Copié ✓' : 'Copier'}
                </button>
                <button
                  onClick={() => handleRevoke(link.token)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-900/40 text-red-400 hover:bg-red-950/30"
                >
                  Révoquer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}