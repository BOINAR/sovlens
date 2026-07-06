'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { authApi } from '@/lib/api/endpoints';
import { ApiError } from '@/lib/api/types';

type View = 'login' | 'register' | 'forgot';

const TRUST_ITEMS = [
  'Aucune revente de données',
  'Open-source & auto-hébergeable',
  'Export intégral en un clic',
];

export default function LoginPage() {
  const [view, setView] = useState<View>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      if (view === 'login') {
        await login(email, password);
        router.push('/gallery');
      } else if (view === 'register') {
        await register(email, password);
        router.push('/gallery');
      } else {
        await authApi.forgotPassword(email);
        setInfo('Le lien expire après 30 minutes.');
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Impossible de contacter l'API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 flex">
      <div className="flex-1 relative overflow-hidden border-r border-sv-border p-12 flex flex-col justify-between">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(700px 360px at 30% 10%, rgba(62,224,161,.12), transparent 62%)',
          }}
        />
        <div className="relative flex items-center gap-3">
          <div className="w-9.5 h-9.5 rounded-full border-[3px] border-sv-accent flex items-center justify-center shadow-[0_0_24px_var(--sv-ring)]">
            <div className="w-2.75 h-2.75 rounded-full bg-sv-accent" />
          </div>
          <span className="font-display font-bold text-[22px]">SovLens</span>
        </div>

        <div className="relative">
          <h2 className="font-display font-bold text-[34px] leading-[1.1] tracking-tight mb-4 max-w-[16ch]">
            Vos souvenirs, à l&apos;abri des regards.
          </h2>
          <p className="text-[15px] text-sv-text2 max-w-[42ch] mb-6">
            Chiffrement de bout en bout. Choisissez de tout garder sur vos serveurs, ou le
            confort du cloud SovLens. À tout moment, sans compromis.
          </p>
          <div className="grid gap-2.5 max-w-[34ch]">
            {TRUST_ITEMS.map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-[13.5px] font-semibold text-sv-text2">
                <span className="w-5.5 h-5.5 rounded-md bg-(--sv-soft) flex items-center justify-center shrink-0">
                  <span className="w-1.75 h-1.75 rounded-full bg-sv-accent" />
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative font-mono text-[11.5px] text-sv-text3">RGAA AA · chiffré · sans traceur</div>
      </div>

      <div className="w-110 flex items-center justify-center p-10 bg-[#0d0f13]">
        <div className="w-full max-w-85">
          {view === 'forgot' ? (
            <>
              <button
                type="button"
                onClick={() => setView('login')}
                className="inline-flex items-center gap-1.5 text-sv-text2 text-xs font-semibold mb-5"
              >
                <span className="inline-block w-1.75 h-1.75 border-l-2 border-b-2 border-sv-text2 rotate-45" />
                Retour à la connexion
              </button>
              <h3 className="font-display font-bold text-xl mb-1.5">Mot de passe oublié&nbsp;?</h3>
              <p className="text-[13px] text-sv-text2 mb-5">
                Entrez votre e-mail : nous vous enverrons un lien sécurisé pour réinitialiser votre mot de passe.
              </p>
              <form onSubmit={handleSubmit}>
                <label className="block text-xs font-semibold text-sv-text2 mb-1.5">E-mail</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.fr"
                  className="w-full h-11 bg-sv-surface2 border border-sv-border rounded-lg px-3.5 text-sm outline-none focus:border-sv-accent mb-5"
                />
                {info && <p className="text-sv-sovereign text-xs mb-4">{info}</p>}
                {error && <p className="text-red-400 text-xs mb-4">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sv-accent text-[#04150e] font-bold h-11.5 rounded-[11px] text-[15px] disabled:opacity-60"
                >
                  {loading ? '...' : 'Envoyer le lien de réinitialisation'}
                </button>
                <p className="text-center font-mono text-[11.5px] text-sv-text3 mt-4">
                  Le lien expire après 30 minutes.
                </p>
              </form>
            </>
          ) : (
            <>
              <div className="flex bg-sv-surface2 border border-sv-border rounded-[11px] p-1 mb-6">
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className={`flex-1 text-center py-2.5 rounded-lg text-[13.5px] transition-colors ${
                    view === 'login' ? 'bg-(--sv-soft) text-sv-text font-bold' : 'text-sv-text2 font-semibold'
                  }`}
                >
                  Connexion
                </button>
                <button
                  type="button"
                  onClick={() => setView('register')}
                  className={`flex-1 text-center py-2.5 rounded-lg text-[13.5px] transition-colors ${
                    view === 'register' ? 'bg-(--sv-soft) text-sv-text font-bold' : 'text-sv-text2 font-semibold'
                  }`}
                >
                  Inscription
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <label className="block text-xs font-semibold text-sv-text2 mb-1.5">E-mail</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.fr"
                  className="w-full h-11 bg-sv-surface2 border border-sv-border rounded-lg px-3.5 text-sm outline-none focus:border-sv-accent mb-3.5"
                />

                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-sv-text2">Mot de passe</label>
                  {view === 'login' && (
                    <button
                      type="button"
                      onClick={() => setView('forgot')}
                      className="text-sv-accent text-xs font-semibold"
                    >
                      Mot de passe oublié&nbsp;?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 bg-sv-surface2 border border-sv-border rounded-lg px-3.5 text-sm outline-none focus:border-sv-accent mb-5"
                />

                {error && <p className="text-red-400 text-xs mb-4">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-sv-accent text-[#04150e] font-bold h-11.5 rounded-[11px] text-[15px] disabled:opacity-60"
                >
                  {loading ? '...' : view === 'login' ? 'Se connecter →' : 'Créer un compte →'}
                </button>
                <p className="text-center font-mono text-[11.5px] text-sv-text3 mt-4">
                  {view === 'login'
                    ? 'Connexion chiffrée · vos identifiants ne quittent jamais votre appareil en clair.'
                    : 'En créant un compte, vous acceptez nos conditions. Vos données restent chiffrées.'}
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}