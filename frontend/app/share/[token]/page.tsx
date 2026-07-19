'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { sharingApi } from '@/lib/api/endpoints';
import { SharedResource, Album, Photo, ApiError } from '@/lib/api/types';

function isAlbum(resource: SharedResource): resource is SharedResource & { resource: Album } {
  return resource.type === 'album';
}

export default function SharedPage() {
  const params = useParams<{ token: string }>();
  const [data, setData] = useState<SharedResource | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.token) return;
    sharingApi
      .getShared(params.token)
      .then(setData)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Ce lien est invalide ou a expiré.'))
      .finally(() => setLoading(false));
  }, [params.token]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-sv-base text-sv-text3 text-sm">Chargement…</div>;
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sv-base text-center px-4">
        <div>
          <p className="font-display font-semibold text-xl mb-2 text-sv-text">Lien indisponible</p>
          <p className="text-sv-text3 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const photos: Photo[] = isAlbum(data) ? data.resource.photos : [data.resource as Photo];
  const title = isAlbum(data) ? data.resource.name : (data.resource as Photo).originalName;

  return (
    <div className="min-h-screen bg-sv-base">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-6 h-6 rounded-full border-2 border-sv-sovereign flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-sv-sovereign" />
          </div>
          <span className="font-display font-semibold text-sv-text">SovLens</span>
        </div>

        <h1 className="font-display font-semibold text-2xl mb-6 text-sv-text">{title}</h1>

        <div className="[column-width:230px] gap-x-3.5">
          {photos.map((photo) => (
            <a key={photo.id} href={photo.url} target="_blank" rel="noopener noreferrer" className="block break-inside-avoid mb-3.5 rounded-xl overflow-hidden border border-sv-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt={photo.originalName} className="w-full h-auto block" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}