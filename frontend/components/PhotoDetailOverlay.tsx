'use client';

import { useState } from 'react';
import { Photo } from '@/lib/api/types';
import { sharingApi } from '@/lib/api/endpoints';

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

interface PhotoDetailOverlayProps {
  photo: Photo;
  onClose: () => void;
  onDelete: (id: string) => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  removeFromAlbumLabel?: string;
  onRemoveFromAlbum?: (photoId: string) => void;
}

export function PhotoDetailOverlay({
  photo,
  onClose,
  onDelete,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  removeFromAlbumLabel,
  onRemoveFromAlbum,
}: PhotoDetailOverlayProps) {
  const [shareLink, setShareLink] = useState<string | null>(null);

  async function handleShare() {
    const link = await sharingApi.sharePhoto(photo.id);
    setShareLink(link.url);
  }

  return (
    <div className="fixed inset-0 z-30 bg-[#06080b]/86 backdrop-blur-md flex flex-col md:flex-row">
      <div className="flex-1 flex items-center justify-center relative p-4 md:p-10">
        <button onClick={onClose} className="absolute top-4 left-4 md:top-5.5 md:left-5.5 w-9 h-9 md:w-9.5 md:h-9.5 rounded-full bg-white/6 border border-[#333b46] flex items-center justify-center text-sv-text2">
          ✕
        </button>
        {hasPrev && onPrev && (
          <button onClick={onPrev} className="hidden md:flex absolute left-5.5 top-1/2 -translate-y-1/2 w-10.5 h-10.5 rounded-full bg-white/6 border border-[#333b46] items-center justify-center">
            ←
          </button>
        )}
        {hasNext && onNext && (
          <button onClick={onNext} className="hidden md:flex absolute right-5.5 top-1/2 -translate-y-1/2 w-10.5 h-10.5 rounded-full bg-white/6 border border-[#333b46] items-center justify-center">
            →
          </button>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.url} alt={photo.originalName} className="max-w-full md:max-w-[80%] max-h-[50vh] md:max-h-[70%] rounded-2xl border border-[#2c333d] shadow-[0_30px_90px_rgba(0,0,0,.6)] object-contain" />
      </div>

      <div className="w-full md:w-85 flex-none bg-[#0d0f13] border-t md:border-t-0 md:border-l border-sv-border p-5 md:p-6 flex flex-col overflow-y-auto">
        <div className="font-display font-bold text-lg mb-1 truncate">{photo.originalName}</div>
        <div className="text-[12.5px] text-sv-text3 mb-5">{formatDate(photo.createdAt)}</div>

        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full w-fit text-xs font-semibold mb-5"
          style={{
            background: 'var(--sv-soft)',
            color: photo.storageMode === 'sovereign' ? '#7ff0c4' : '#a9caff',
            border: '1px solid var(--sv-ring)',
          }}
        >
          {photo.storageMode === 'sovereign' ? 'Stockage souverain' : 'Stockage cloud SovLens'}
        </span>

        <div className="grid gap-2.5 my-5 py-4 border-t border-b border-sv-border">
          <div className="flex justify-between text-[12.5px]">
            <span className="text-sv-text3">Type</span>
            <span>{photo.mimeType}</span>
          </div>
          <div className="flex justify-between text-[12.5px]">
            <span className="text-sv-text3">Taille</span>
            <span>{formatSize(photo.size)}</span>
          </div>
        </div>

        <div className="grid gap-2.5">
          <a href={photo.url} download={photo.originalName} className="w-full text-center bg-sv-accent text-[#04150e] h-11 rounded-[11px] font-bold text-sm flex items-center justify-center">
            Télécharger l&apos;original
          </a>
          <button onClick={handleShare} className="w-full bg-sv-surface2 border border-[#333b46] h-10.5 rounded-[11px] font-semibold text-[13.5px]">
            Partager…
          </button>
          {removeFromAlbumLabel && onRemoveFromAlbum && (
            <button onClick={() => onRemoveFromAlbum(photo.id)} className="w-full bg-sv-surface2 border border-[#333b46] h-10.5 rounded-[11px] font-semibold text-[13.5px]">
              {removeFromAlbumLabel}
            </button>
          )}
          <button onClick={() => onDelete(photo.id)} className="w-full bg-transparent text-red-400 border border-red-900/40 h-10.5 rounded-[11px] font-semibold text-[13.5px]">
            Supprimer définitivement
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
          {photo.storageMode === 'sovereign' ? 'Chiffré · vos serveurs' : 'Cloud SovLens · UE'}
        </div>
      </div>
    </div>
  );
}