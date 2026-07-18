'use client';

import { useEffect, useState, useCallback } from 'react';
import { photosApi, sharingApi } from '@/lib/api/endpoints';
import { Photo, ApiError } from '@/lib/api/types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatSize(bytes: number) {
  return (bytes / 1024 / 1024).toFixed(1) + ' Mo';
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPhotos(await photosApi.list());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Impossible de charger la galerie.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setShareLink(null);
  }, [openIndex]);

  async function handleDelete(id: string) {
    if (!confirm('Supprimer définitivement cette photo ?')) return;
    await photosApi.remove(id);
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    setOpenIndex(null);
  }

  async function handleShare(id: string) {
    const link = await sharingApi.sharePhoto(id);
    setShareLink(link.url);
  }

  const current = openIndex !== null ? photos[openIndex] : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4.5">
        <div className="flex items-center gap-2.5 text-[13px] font-medium text-sv-text2">
          <span className="text-sv-accent font-bold">{photos.length}</span> photos
        </div>
        <a href="/upload" className="bg-sv-accent text-[#04150e] px-3.75 py-2 rounded-lg font-bold text-[13px]">
          + Importer
        </a>
      </div>

      {loading && <p className="text-sv-text3 text-sm">Chargement…</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      {!loading && !error && photos.length === 0 && (
        <div className="border border-dashed border-sv-border rounded-2xl p-16 text-center text-sv-text3">
          Aucune photo pour l&apos;instant.{' '}
          <a href="/upload" className="text-sv-accent font-semibold">
            Envoyer votre première photo
          </a>
        </div>
      )}

      <div className="[column-width:230px] gap-x-3.5">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setOpenIndex(i)}
            className="block w-full break-inside-avoid mb-3.5 rounded-xl overflow-hidden border border-[#20262f] relative text-left hover:border-sv-accent transition-colors"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt={photo.originalName} className="w-full h-auto block" />
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent pointer-events-none" />
            <div className="absolute left-2.5 bottom-2 font-mono text-[10.5px] text-white/70 truncate max-w-[85%]">
              {photo.originalName}
            </div>
            <span
              className="absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: photo.storageMode === 'sovereign' ? 'rgba(62,224,161,.16)' : 'rgba(110,168,254,.16)',
                color: photo.storageMode === 'sovereign' ? '#7ff0c4' : '#a9caff',
              }}
            >
              {photo.storageMode === 'sovereign' ? 'Souverain' : 'Cloud'}
            </span>
          </button>
        ))}
      </div>

      {current && (
        <div className="fixed inset-0 z-30 bg-[#06080b]/86 backdrop-blur-md flex flex-col md:flex-row">
          <div className="flex-1 flex items-center justify-center relative p-4 md:p-10">
            <button
              onClick={() => setOpenIndex(null)}
              className="absolute top-4 left-4 md:top-5.5 md:left-5.5 w-9 h-9 md:w-9.5 md:h-9.5 rounded-full bg-white/6 border border-[#333b46] flex items-center justify-center text-sv-text2"
            >
              ✕
            </button>
            {openIndex! > 0 && (
              <button
                onClick={() => setOpenIndex((i) => (i !== null ? i - 1 : i))}
                className="hidden md:flex absolute left-5.5 top-1/2 -translate-y-1/2 w-10.5 h-10.5 rounded-full bg-white/6 border border-[#333b46] items-center justify-center"
              >
                ←
              </button>
            )}
            {openIndex! < photos.length - 1 && (
              <button
                onClick={() => setOpenIndex((i) => (i !== null ? i + 1 : i))}
                className="hidden md:flex absolute right-5.5 top-1/2 -translate-y-1/2 w-10.5 h-10.5 rounded-full bg-white/6 border border-[#333b46] items-center justify-center"
              >
                →
              </button>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.url}
              alt={current.originalName}
              className="max-w-full md:max-w-[80%] max-h-[50vh] md:max-h-[70%] rounded-2xl border border-[#2c333d] shadow-[0_30px_90px_rgba(0,0,0,.6)] object-contain"
            />
          </div>

          <div className="w-full md:w-85 flex-none bg-[#0d0f13] border-t md:border-t-0 md:border-l border-sv-border p-5 md:p-6 flex flex-col overflow-y-auto">
            <div className="font-display font-bold text-lg mb-1 truncate">{current.originalName}</div>
            <div className="text-[12.5px] text-sv-text3 mb-5">{formatDate(current.createdAt)}</div>

            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full w-fit text-xs font-semibold mb-5"
              style={{
                background: 'var(--sv-soft)',
                color: current.storageMode === 'sovereign' ? '#7ff0c4' : '#a9caff',
                border: '1px solid var(--sv-ring)',
              }}
            >
              {current.storageMode === 'sovereign' ? 'Stockage souverain' : 'Stockage cloud SovLens'}
            </span>

            <div className="grid gap-2.5 my-5 py-4 border-t border-b border-sv-border">
              <div className="flex justify-between text-[12.5px]">
                <span className="text-sv-text3">Type</span>
                <span>{current.mimeType}</span>
              </div>
              <div className="flex justify-between text-[12.5px]">
                <span className="text-sv-text3">Taille</span>
                <span>{formatSize(current.size)}</span>
              </div>
            </div>

            <div className="grid gap-2.5">
              <a href={current.url} download={current.originalName} className="w-full text-center bg-sv-accent text-[#04150e] h-11 rounded-[11px] font-bold text-sm flex items-center justify-center">
                Télécharger l&apos;original
              </a>
              <button
                onClick={() => handleShare(current.id)}
                className="w-full bg-sv-surface2 border border-[#333b46] h-10.5 rounded-[11px] font-semibold text-[13.5px]"
              >
                Partager…
              </button>
              <button
                onClick={() => handleDelete(current.id)}
                className="w-full bg-transparent text-red-400 border border-red-900/40 h-10.5 rounded-[11px] font-semibold text-[13.5px]"
              >
                Supprimer
              </button>
            </div>

            {shareLink && (
              <div className="mt-4">
                <p className="text-xs text-sv-text3 mb-1">Lien de partage :</p>
                <code className="text-xs bg-sv-surface2 px-2 py-1 rounded block break-all">{shareLink}</code>
              </div>
            )}

            <div className="flex-1" />
            <div className="font-mono text-[11px] text-sv-text3 text-center hidden md:block">
              {current.storageMode === 'sovereign' ? 'Chiffré · vos serveurs' : 'Cloud SovLens · UE'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}