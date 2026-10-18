'use client';

import { useSyncExternalStore } from 'react';
import { getTheme, setTheme, subscribeToTheme } from '@/lib/theme/theme';

export default function ThemeToggle() {
  // Côté serveur le thème est inconnu : on rend l'état sombre, puis React se resynchronise
  const theme = useSyncExternalStore(subscribeToTheme, getTheme, () => 'dark' as const);
  const isLight = theme === 'light';
  const label = isLight ? 'Passer en mode sombre' : 'Passer en mode clair';

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      aria-label={label}
      title={label}
      className="w-8.5 h-8.5 flex-none rounded-lg bg-sv-surface2 border border-sv-border flex items-center justify-center text-sv-text2 hover:text-sv-text transition-colors"
    >
      {isLight ? (
        // Lune
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      ) : (
        // Soleil
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      )}
    </button>
  );
}
