'use client';

import { useState } from 'react';
import { User } from '@/lib/api/types';

interface UserAvatarProps {
  user: User | null;
  className?: string;
}

// Photo de profil si disponible, sinon l'initiale de l'email
export default function UserAvatar({ user, className = '' }: UserAvatarProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const avatarUrl = user?.avatarUrl ?? null;
  const initial = user?.email?.charAt(0).toUpperCase() ?? '';

  return (
    <div
      className={`rounded-full overflow-hidden flex-none flex items-center justify-center bg-gradient-to-br from-sv-surface2 to-sv-elevated border border-sv-border-strong text-sv-text2 font-semibold ${className}`}
    >
      {avatarUrl && avatarUrl !== failedUrl ? (
        // URL signée S3 externe : next/image n'apporte rien ici
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt="Photo de profil"
          className="w-full h-full object-cover"
          onError={() => setFailedUrl(avatarUrl)}
        />
      ) : (
        <span aria-hidden="true">{initial}</span>
      )}
    </div>
  );
}
