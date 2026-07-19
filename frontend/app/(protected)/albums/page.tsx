'use client';

import { useEffect, useState, useCallback, SubmitEvent } from 'react';
import { albumsApi, photosApi } from '@/lib/api/endpoints';
import { Album, Photo, ApiError } from '@/lib/api/types';

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [selected, setSelected] = useState<Album | null>(null);
  const [adding, setAdding] = useState(false);
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setAlbums(await albumsApi.list());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Impossible de charger les albums.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function handleCreate(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newName.trim()) return;
    const album = await albumsApi.create(newName.trim());
    setAlbums((prev) => [album, ...prev]);
    setNewName('');
    setCreating(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cet album ? Les photos ne seront pas supprimées.')) return;
    await albumsApi.remove(id);
    setAlbums((prev) => prev.filter((a) => a.id !== id));
    setSelected(null);
  }

  async function openAddPhotos() {
    setAdding(true);
    setLoadingPhotos(true);
    try {
      setAllPhotos(await photosApi.list());
    } catch {
      setAllPhotos([]);
    } finally {
      setLoadingPhotos(false);
    }
  }

  async function handleAddPhoto(photo: Photo) {
    if (!selected) return;
    const updated = await albumsApi.addPhoto(selected.id, photo.id);
    setSelected(updated);
    setAlbums((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  }

  if (selected) {
    const inAlbumIds = new Set(selected.photos?.map((p) => p.id) ?? []);
    const availablePhotos = allPhotos.filter((p) => !inAlbumIds.has(p.id));

    return (
      <div>
        <button onClick={() => setSelected(null)} className="text-sv-text3 text-sm mb-4 hover:text-sv-text">
          ← Retour aux albums
        </button>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-xl">{selected.name}</h2>
          <div className="flex gap-2">
            <button
              onClick={openAddPhotos}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-sv-accent text-[#04150e]"
            >
              + Ajouter des photos
            </button>
            <button
              onClick={() => handleDelete(selected.id)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-900/50 text-red-400 hover:bg-red-950/30"
            >
              Supprimer l&apos;album
            </button>
          </div>
        </div>

        {adding && (
          <div className="mb-5 border border-sv-border bg-sv-surface rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Choisir des photos à ajouter</span>
              <button onClick={() => setAdding(false)} className="text-sv-text3 text-xs hover:text-sv-text">
                Fermer
              </button>
            </div>
            {loadingPhotos && <p className="text-sv-text3 text-sm">Chargement…</p>}
            {!loadingPhotos && availablePhotos.length === 0 && (
              <p className="text-sv-text3 text-sm">Toutes vos photos sont déjà dans cet album.</p>
            )}
            <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))' }}>
              {availablePhotos.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => handleAddPhoto(photo)}
                  className="aspect-square rounded-lg overflow-hidden border border-sv-border hover:border-sv-accent relative bg-sv-surface2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photo.originalName}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.opacity = '0'; }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="[column-width:180px] sm:[column-width:200px] gap-x-3">
          {selected.photos?.map((photo) => (
            <div key={photo.id} className="break-inside-avoid mb-3 rounded-xl overflow-hidden border border-[#20262f] aspect-square bg-sv-surface2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.originalName}
                className="w-full h-full object-cover block"
                onError={(e) => { e.currentTarget.style.opacity = '0'; }}
              />
            </div>
          ))}
          {(!selected.photos || selected.photos.length === 0) && !adding && (
            <p className="text-sv-text3 text-sm">Cet album est vide pour l&apos;instant.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {creating && (
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-2 mb-5">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nom de l'album"
            className="bg-sv-surface2 border border-sv-border rounded-lg px-3.5 py-2 text-sm outline-none focus:border-sv-accent flex-1"
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-sv-accent text-[#04150e] font-bold rounded-lg px-4 py-2 text-sm">
              Créer
            </button>
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="text-sv-text2 font-semibold rounded-lg px-4 py-2 text-sm border border-sv-border"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {loading && <p className="text-sv-text3 text-sm">Chargement…</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
        {albums.map((album) => (
          <button
            key={album.id}
            onClick={() => setSelected(album)}
            className="text-left border border-[#20262f] rounded-2xl overflow-hidden bg-sv-surface hover:border-sv-accent transition-colors"
          >
            <div
              className="h-33 grid gap-0.5"
              style={{
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                background: 'linear-gradient(145deg,#1b212b,#262e39)',
              }}
            >
              <div className="bg-white/3" />
              <div className="bg-white/6" />
              <div className="bg-white/5" />
              <div className="bg-black/15" />
            </div>
            <div className="p-3.25">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-[14.5px] truncate">{album.name}</span>
                <span
                  className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full shrink-0 ml-2"
                  style={{ background: 'var(--sv-soft)', color: 'var(--color-sv-accent)' }}
                >
                  {album.photos?.[0]?.storageMode === 'cloud' ? 'Cloud' : 'Souverain'}
                </span>
              </div>
              <div className="text-xs text-sv-text3">{album.photos?.length ?? 0} photos</div>
            </div>
          </button>
        ))}

        <button
          onClick={() => setCreating(true)}
          className="border-[1.5px] border-dashed border-[#333b46] rounded-2xl flex flex-col items-center justify-center gap-2.5 min-h-50 text-sv-text2 hover:border-sv-accent hover:text-sv-accent transition-colors"
        >
          <div className="w-8.5 h-8.5 rounded-full border-2 border-current flex items-center justify-center text-xl font-light">
            +
          </div>
          <span className="font-semibold text-[13px]">Nouvel album</span>
        </button>
      </div>
    </div>
  );
}