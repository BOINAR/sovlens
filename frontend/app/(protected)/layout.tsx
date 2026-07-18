'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { StorageProvider, useStorageMode } from '@/lib/storage/storage-context';

const NAV_ITEMS = [
  { href: '/gallery', label: 'Galerie' },
  { href: '/upload', label: 'Importer' },
  { href: '/albums', label: 'Albums' },
  { href: '/shared', label: 'Partagés' },
  { href: '/settings', label: 'Paramètres' },
];

const PAGE_TITLES: Record<string, string> = {
  '/gallery': 'Galerie',
  '/upload': 'Importer',
  '/albums': 'Albums',
  '/shared': 'Partagés',
  '/settings': 'Paramètres',
};

function NavLink({ item, active, onNavigate }: { item: { href: string; label: string }; active: boolean; onNavigate?: () => void }) {
  return (
    <a key={item.href} href={item.href} onClick={onNavigate} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13.5px] font-semibold" style={{ background: active ? 'var(--sv-soft)' : 'transparent', color: active ? 'var(--color-sv-text)' : 'var(--color-sv-text2)' }}>
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: active ? 'var(--color-sv-accent)' : 'transparent', border: active ? 'none' : '1.5px solid #454d58', boxShadow: active ? '0 0 10px var(--sv-ring)' : 'none' }} />
      {item.label}
    </a>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, logout } = useAuth();
  const { config, setMode } = useStorageMode();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isSovereign = config?.mode === 'sovereign';

  return (
    <div className="flex flex-col h-full p-3.5">
      <div className="flex items-center gap-2.5 px-2 pt-1.5 pb-5">
        <div className="w-7.5 h-7.5 rounded-full border-[2.5px] border-sv-accent flex items-center justify-center shadow-[0_0_16px_var(--sv-ring)]">
          <div className="w-2.25 h-2.25 rounded-full bg-sv-accent" />
        </div>
        <span className="font-display font-semibold text-[17px]">SovLens</span>
      </div>

      <nav className="flex flex-col gap-0.75">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} item={item} active={!!pathname?.startsWith(item.href)} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="flex-1" />

      <div className="border border-sv-border rounded-xl p-3 bg-sv-surface">
        <div className="font-mono text-[10px] tracking-wider uppercase text-sv-text3 mb-2">
          Mode de stockage
        </div>
        <div className="flex items-center gap-2.5 mb-2.5">
          <span
            className="w-2.25 h-2.25 rounded-full animate-pulse"
            style={{ background: 'var(--color-sv-accent)', boxShadow: '0 0 10px var(--sv-ring)' }}
          />
          <span className="font-bold text-sm">{isSovereign ? 'Souverain' : 'Cloud'}</span>
        </div>
        <div className="text-[11px] text-sv-text2 mb-2.5">
          {isSovereign ? 'Sur vos propres serveurs' : 'Serveurs SovLens · UE'}
        </div>
        <button
          onClick={() => setMode(isSovereign ? 'cloud' : 'sovereign')}
          className="w-full bg-sv-surface2 border border-[#333b46] text-sv-text2 py-1.5 rounded-lg text-xs font-semibold"
        >
          Basculer
        </button>
      </div>

      <div className="relative mt-3 pt-3 border-t border-sv-border">
        {menuOpen && (
          <div className="absolute bottom-13 left-0 right-0 bg-sv-surface2 border border-[#2c333d] rounded-xl p-1.5 shadow-[0_14px_40px_rgba(0,0,0,.5)]">
            <div className="px-2.5 py-2 rounded-md text-[12.5px] font-semibold text-sv-text2">Profil &amp; compte</div>
            <div className="px-2.5 py-2 rounded-md text-[12.5px] font-semibold text-sv-text2">Aide &amp; support</div>
            <div className="h-px bg-sv-border my-1 mx-1.5" />
            <button
              onClick={logout}
              className="w-full text-left px-2.5 py-2 rounded-md text-[12.5px] font-semibold text-red-400 hover:bg-red-950/30"
            >
              Se déconnecter
            </button>
          </div>
        )}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2.5 w-full px-2 py-3 pb-1 rounded-lg"
        >
          <div className="w-7.5 h-7.5 rounded-full bg-gradient-to-br from-[#2c333d] to-[#1a1e24] border border-[#333b46] flex-none" />
          <div className="leading-tight flex-1 min-w-0 text-left">
            <div className="font-semibold text-[12.5px] truncate">{user?.email?.split('@')[0]}</div>
            <div className="font-mono text-[10.5px] text-sv-text3 truncate">{user?.email}</div>
          </div>
          <span
            className="w-1.75 h-1.75 border-r-2 border-b-2 border-sv-text3 -mb-0.5 transition-transform"
            style={{ transform: menuOpen ? 'rotate(-135deg)' : 'rotate(45deg)' }}
          />
        </button>
      </div>
    </div>
  );
}

function AppShellInner({ children }: { children: React.ReactNode }) {
  const { config, setMode } = useStorageMode();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isSovereign = config?.mode === 'sovereign';
  const pageTitle = Object.entries(PAGE_TITLES).find(([href]) => pathname?.startsWith(href))?.[1] || 'SovLens';

  useEffect(() => {
    if (config) document.body.setAttribute('data-mode', config.mode);
  }, [config]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen md:fixed md:inset-0 md:flex">
      <div className="hidden md:block w-56 flex-none bg-[#0d0f13] border-r border-sv-border">
        <SidebarContent />
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-[#0d0f13] border-r border-sv-border">
            <SidebarContent onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 md:h-full">
        <div className="h-14 md:h-15 flex-none border-b border-sv-border flex items-center gap-3 md:gap-4 px-4 md:px-5.5 bg-[#0d0f13]/70 backdrop-blur-md">
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden w-8 h-8 flex-none flex flex-col items-center justify-center gap-1"
            aria-label="Ouvrir le menu"
          >
            <span className="w-4.5 h-0.5 bg-sv-text2 rounded-full" />
            <span className="w-4.5 h-0.5 bg-sv-text2 rounded-full" />
            <span className="w-4.5 h-0.5 bg-sv-text2 rounded-full" />
          </button>

          <h1 className="font-display font-semibold text-base md:text-lg tracking-tight m-0 truncate">
            {pageTitle}
          </h1>

          <div className="hidden sm:block flex-1 max-w-90 mx-auto">
            <div className="h-9.5 bg-sv-surface2 border border-sv-border rounded-lg flex items-center gap-2.5 px-3.5 text-sv-text3 text-[13px]">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-[#4a515b] shrink-0" />
              Rechercher lieux, dates, visages…
            </div>
          </div>

          <div className="flex bg-sv-surface2 border border-sv-border rounded-lg p-0.5 ml-auto sm:ml-0">
            <button
              onClick={() => setMode('cloud')}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md text-[12.5px] font-semibold"
              style={{
                background: !isSovereign ? 'var(--sv-soft)' : 'transparent',
                color: !isSovereign ? 'var(--color-sv-text)' : 'var(--color-sv-text2)',
              }}
            >
              <span className="w-1.75 h-1.75 rounded-full bg-sv-cloud" style={{ opacity: !isSovereign ? 1 : 0.45 }} />
              <span className="hidden sm:inline">Cloud</span>
            </button>
            <button
              onClick={() => setMode('sovereign')}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md text-[12.5px] font-semibold"
              style={{
                background: isSovereign ? 'var(--sv-soft)' : 'transparent',
                color: isSovereign ? 'var(--color-sv-text)' : 'var(--color-sv-text2)',
              }}
            >
              <span className="w-1.75 h-1.75 rounded-full bg-sv-sovereign" style={{ opacity: isSovereign ? 1 : 0.45 }} />
              <span className="hidden sm:inline">Souverain</span>
            </button>
          </div>

          <div className="hidden sm:block w-8.5 h-8.5 rounded-full bg-gradient-to-br from-[#2c333d] to-[#1a1e24] border border-[#333b46] flex-none" />
        </div>

        <div className="flex-1 overflow-auto px-4 sm:px-5 md:px-6.5 py-4 md:py-6">{children}</div>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login');
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center text-sv-text3 text-sm">
        Chargement de la session…
      </div>
    );
  }

  if (status === 'unauthenticated') return null;

  return (
    <StorageProvider>
      <AppShellInner>{children}</AppShellInner>
    </StorageProvider>
  );
}