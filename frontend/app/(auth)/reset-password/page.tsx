'use client';

import { Suspense, useState, SyntheticEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/endpoints';
import { ApiError } from '@/lib/api/types';

const INPUT_CLASS =
  'w-full h-11 bg-sv-surface2 border border-sv-border rounded-lg px-3.5 text-sm outline-none focus:border-sv-accent';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    setError(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get('password') as string;
    const confirm = formData.get('confirm') as string;

    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      setDone(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Impossible de contacter l'API.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <>
        <h3 className="font-display font-bold text-xl mb-1.5">Lien invalide</h3>
        <p className="text-[13px] text-sv-text2 mb-5">
          Ce lien de réinitialisation est incomplet. Demandez-en un nouveau depuis la page de connexion.
        </p>
        <Link href="/login" className="text-sv-accent text-sm font-semibold">
          Retour à la connexion
        </Link>
      </>
    );
  }

  if (done) {
    return (
      <>
        <h3 className="font-display font-bold text-xl mb-1.5">Mot de passe modifié</h3>
        <p className="text-[13px] text-sv-text2">Redirection vers la page de connexion…</p>
      </>
    );
  }

  return (
    <>
      <h3 className="font-display font-bold text-xl mb-1.5">Nouveau mot de passe</h3>
      <p className="text-[13px] text-sv-text2 mb-5">Choisissez un mot de passe d&apos;au moins 8 caractères.</p>
      <form onSubmit={handleSubmit}>
        <label className="block text-xs font-semibold text-sv-text2 mb-1.5">Nouveau mot de passe</label>
        <input
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="••••••••"
          className={`${INPUT_CLASS} mb-3.5`}
        />
        <label className="block text-xs font-semibold text-sv-text2 mb-1.5">Confirmation</label>
        <input
          type="password"
          name="confirm"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="••••••••"
          className={`${INPUT_CLASS} mb-5`}
        />
        {error && <p className="text-red-400 text-xs mb-4">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sv-accent text-[#04150e] font-bold h-11.5 rounded-[11px] text-[15px] disabled:opacity-60"
        >
          {loading ? '...' : 'Réinitialiser le mot de passe'}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0d0f13]">
      <div className="w-full max-w-85">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-8 h-8 rounded-full border-[2.5px] border-sv-accent flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-sv-accent" />
          </div>
          <span className="font-display font-bold text-lg">SovLens</span>
        </div>
        <Suspense fallback={null}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
