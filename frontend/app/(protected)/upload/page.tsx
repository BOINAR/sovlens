'use client';

import { useState, useCallback, DragEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { photosApi } from '@/lib/api/endpoints';
import { useStorageMode } from '@/lib/storage/storage-context';
import { ApiError } from '@/lib/api/types';

const MAX_SIZE = 10 * 1024 * 1024;

interface QueueItem {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
}

export default function UploadPage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const { config } = useStorageMode();
  const router = useRouter();
  const isSovereign = config?.mode === 'sovereign';
  const uploading = queue.some((q) => q.status === 'uploading');

  const addFiles = useCallback((files: FileList | File[]) => {
    const items: QueueItem[] = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .map((file) => ({
        file,
        progress: 0,
        status: file.size > MAX_SIZE ? 'error' : 'pending',
        error: file.size > MAX_SIZE ? 'Fichier > 10 Mo' : undefined,
      }));
    setQueue((prev) => [...prev, ...items]);
  }, []);

  async function startUpload() {
    for (let i = 0; i < queue.length; i++) {
      if (queue[i].status !== 'pending') continue;

      setQueue((prev) => prev.map((q, idx) => (idx === i ? { ...q, status: 'uploading', progress: 5 } : q)));

      const tick = setInterval(() => {
        setQueue((prev) =>
          prev.map((q, idx) => (idx === i && q.status === 'uploading' ? { ...q, progress: Math.min(92, q.progress + 7) } : q))
        );
      }, 180);

      try {
        await photosApi.upload(queue[i].file);
        clearInterval(tick);
        setQueue((prev) => prev.map((q, idx) => (idx === i ? { ...q, status: 'done', progress: 100 } : q)));
      } catch (err) {
        clearInterval(tick);
        const message = err instanceof ApiError ? err.message : "Échec de l'envoi";
        setQueue((prev) => prev.map((q, idx) => (idx === i ? { ...q, status: 'error', error: message } : q)));
      }
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) addFiles(e.target.files);
  }

  const allDone = queue.length > 0 && queue.every((q) => q.status === 'done');
  const pendingCount = queue.filter((q) => q.status !== 'done' && q.status !== 'error').length;

  return (
    <div className="max-w-180 mx-auto">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
        className="rounded-[18px] p-8 md:p-12 text-center cursor-pointer transition-colors"
        style={{
          border: `2px dashed ${dragOver ? 'var(--color-sv-accent)' : 'var(--sv-ring)'}`,
          background: 'var(--sv-soft)',
        }}
      >
        <input id="file-input" type="file" multiple accept="image/*" className="hidden" onChange={handleInputChange} />

        <div className="w-14 h-14 rounded-full border-2 border-dashed border-sv-accent flex items-center justify-center mx-auto mb-4.5">
          <div
            className="w-0 h-0"
            style={{
              borderLeft: '9px solid transparent',
              borderRight: '9px solid transparent',
              borderBottom: '14px solid var(--color-sv-accent)',
            }}
          />
        </div>
        <div className="font-display font-bold text-lg md:text-[19px] mb-2">Glissez vos photos ici</div>
        <div className="text-[13.5px] text-sv-text2 mb-4">
          ou cliquez pour parcourir · JPG, PNG, RAW, HEIC — jusqu&apos;à 10 Mo
        </div>
        <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-sv-accent">
          <span className="w-1.75 h-1.75 rounded-full bg-sv-accent" />
          {isSovereign ? 'Destination : vos serveurs · chiffré' : 'Destination : cloud SovLens · UE'}
        </div>
      </div>

      {queue.length > 0 && (
        <div className="mt-5.5 border border-sv-border bg-sv-surface rounded-2xl overflow-hidden">
          <div className="px-4.5 py-3.5 border-b border-sv-border flex items-center justify-between">
            <span className="font-semibold text-[13.5px]">
              {allDone ? 'Import terminé' : `Import — ${queue.length} fichier${queue.length > 1 ? 's' : ''}`}
            </span>
            <span className="font-mono text-[11.5px] text-sv-accent hidden sm:inline">
              {isSovereign ? 'chiffrement local en cours' : 'transfert sécurisé'}
            </span>
          </div>
          <div className="px-4.5 py-1.5 pb-4">
            {queue.map((item, i) => (
              <div key={i} className="py-3 border-b border-sv-surface2 last:border-0">
                <div className="flex justify-between mb-2 text-[12.5px]">
                  <span className="truncate mr-3">{item.file.name}</span>
                  <span
                    className={
                      item.status === 'error' ? 'text-red-400' : item.status === 'done' ? 'text-sv-accent' : 'text-sv-text2'
                    }
                  >
                    {item.status === 'error' ? item.error || 'Erreur' : `${item.progress}%`}
                  </span>
                </div>
                <div className="h-1.25 bg-sv-elevated rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-200"
                    style={{
                      width: `${item.progress}%`,
                      background: item.status === 'error' ? '#f2685f' : 'var(--color-sv-accent)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="px-4.5 pb-4.5 flex gap-3">
            {!uploading && pendingCount > 0 && (
              <button onClick={startUpload} className="bg-sv-accent text-[#04150e] font-bold rounded-lg px-4 py-2 text-sm">
                Lancer l&apos;envoi
              </button>
            )}
            {allDone && (
              <button
                onClick={() => router.push('/gallery')}
                className="bg-sv-accent text-[#04150e] font-bold rounded-lg px-4 py-2 text-sm"
              >
                Voir la galerie
              </button>
            )}
            <button
              onClick={() => setQueue([])}
              disabled={uploading}
              className="text-sv-text2 font-semibold rounded-lg px-4 py-2 text-sm border border-sv-border disabled:opacity-40"
            >
              Vider la liste
            </button>
          </div>
        </div>
      )}
    </div>
  );
}