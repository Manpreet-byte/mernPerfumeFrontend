'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Chrome, Eye, EyeOff, ShieldCheck, UserRound } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCurrentUser, login } from '@/store/slices/authSlice';
import { AuthShell } from '@/components/auth-shell';
import { GoogleAuthButton } from '@/components/google-auth-button';
import { getGoogleAuthUrl } from '@/utils/auth';
import { PerfumeCarousel } from '@/components/perfume-carousel';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [googleMessage, setGoogleMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const googleLoginUrl = useMemo(getGoogleAuthUrl, []);

  const highlights = [
    { title: 'Resume your ritual', copy: 'Return to saved carts, wishlists, and profile details without starting over.', icon: UserRound },
    { title: 'One Google tap', copy: 'Use the same Google account for both fresh signups and returning sign-ins.', icon: Chrome },
    { title: 'Protected by design', copy: 'Your session stays tied to a secure token-based backend flow.', icon: ShieldCheck },
  ];

  useEffect(() => {
    const token = searchParams?.get('token');
    const googleError = searchParams?.get('googleError');
    const provider = searchParams?.get('provider');

    if (googleError) {
      setGoogleMessage('Google sign-in failed. Please try again.');
      return;
    }

    if (!token || provider !== 'google') {
      return;
    }

    localStorage.setItem('aurelia-token', token);

    (async () => {
      const result = await dispatch(fetchCurrentUser());
      if (fetchCurrentUser.fulfilled.match(result)) {
        router.replace('/');
      } else {
        setGoogleMessage('Google login succeeded, but profile could not be loaded. Please retry.');
      }
    })();
  }, [dispatch, router, searchParams]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) router.push('/');
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your Aurelia account."
      copy="Pick up your fragrance journey exactly where you left off with a refined email login or a single Google tap."
      highlights={highlights}
      media={
        <PerfumeCarousel
          eyebrow="Aurelia account"
          title="A rotating perfume gallery."
          copy="Browse a curated carousel of luxury fragrance imagery while you sign in."
          badge="2-minute access"
        />
      }
    >
      <div className="text-ink dark:text-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Secure access</p>
            <h2 className="mt-3 font-serif text-3xl">Sign in</h2>
          </div>
          <span className="rounded-full border border-gold/20 bg-gold/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[.22em] text-gold">
            2-minute checkout
          </span>
        </div>

        <p className="mt-4 max-w-md text-sm leading-7 text-ink/70 dark:text-white/70">
          Access your profile, orders, wishlist, and checkout details from a single polished account.
        </p>

        {googleMessage && (
          <p className="mt-5 rounded-2xl border border-gold/20 bg-gold/10 px-4 py-3 text-sm text-gold">
            {googleMessage}
          </p>
        )}

        <div className="mt-6">
          <GoogleAuthButton
            href={googleLoginUrl}
            label="Continue with Google"
            subtitle="Use your Google account to sign in instantly."
          />
        </div>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-ink/15 dark:bg-white/15" />
          <span className="text-[10px] font-bold uppercase tracking-[.26em] text-ink/40 dark:text-white/40">or sign in with email</span>
          <span className="h-px flex-1 bg-ink/15 dark:bg-white/15" />
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <label className="luxury-label" htmlFor="login-email">Email address</label>
            <input id="login-email" required name="email" type="email" autoComplete="email" placeholder="you@example.com" className="luxury-input" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="luxury-label" htmlFor="login-password">Password</label>
            <div className="relative">
              <input id="login-password" required name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Your secure password" className="luxury-input pr-12" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
              <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute inset-y-0 right-3 grid place-items-center text-ink/40 transition hover:text-gold dark:text-white/40">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-500 dark:text-rose-300">{error}</p>}
          <button className="button-gold w-full gap-2 py-4 text-sm" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
            {!loading && <ArrowRight size={15} />}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink/70 dark:text-white/70">
          New to Aurelia? <Link className="font-semibold text-gold underline decoration-gold/40 underline-offset-4" href="/signup">Create an account</Link>
        </p>
      </div>
    </AuthShell>
  );
}