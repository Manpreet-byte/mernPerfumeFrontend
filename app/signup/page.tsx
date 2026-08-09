'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Gift, ShieldCheck, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { register } from '@/store/slices/authSlice';
import { AuthShell } from '@/components/auth-shell';
import { GoogleAuthButton } from '@/components/google-auth-button';
import { getGoogleAuthUrl } from '@/utils/auth';
import { PerfumeCarousel } from '@/components/perfume-carousel';

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const googleSignupUrl = getGoogleAuthUrl();

  const highlights = [
    { title: 'Instant account', copy: 'Google can create your Aurelia profile in one step, no extra form fatigue.', icon: Sparkles },
    { title: 'Gift-ready details', copy: 'Save addresses and preferences once so future checkouts move faster.', icon: Gift },
    { title: 'Protected onboarding', copy: 'Every account is set up against the same secure session flow.', icon: ShieldCheck },
  ];

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) router.push('/profile');
  };

  return (
    <AuthShell
      eyebrow="Begin your ritual"
      title="Create your Aurelia profile."
      copy="Set up an account with email or let Google handle the onboarding in a single polished step."
      highlights={highlights}
      media={
        <PerfumeCarousel
          eyebrow="New membership"
          title="Perfume inspiration before signup."
          copy="A polished carousel of fragrance imagery to set the tone for your account creation."
          badge="Less than a minute"
        />
      }
    >
      <div className="text-ink dark:text-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">New membership</p>
            <h2 className="mt-3 font-serif text-3xl">Create account</h2>
          </div>
          <span className="rounded-full border border-gold/20 bg-gold/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[.22em] text-gold">
            Less than a minute
          </span>
        </div>

        <p className="mt-4 max-w-md text-sm leading-7 text-ink/70 dark:text-white/70">
          Join Aurelia to keep your fragrance wishlist, order history, and checkout details in one elegant account.
        </p>

        <div className="mt-6">
          <GoogleAuthButton
            href={googleSignupUrl}
            label="Continue with Google"
            subtitle="Create your account with one trusted click."
          />
        </div>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-ink/15 dark:bg-white/15" />
          <span className="text-[10px] font-bold uppercase tracking-[.26em] text-ink/40 dark:text-white/40">or create with email</span>
          <span className="h-px flex-1 bg-ink/15 dark:bg-white/15" />
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <label className="luxury-label" htmlFor="signup-name">Full name</label>
            <input id="signup-name" required name="name" autoComplete="name" placeholder="Your name" className="luxury-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="luxury-label" htmlFor="signup-email">Email address</label>
            <input id="signup-email" required name="email" type="email" autoComplete="email" placeholder="you@example.com" className="luxury-input" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="luxury-label" htmlFor="signup-password">Password</label>
            <div className="relative">
              <input id="signup-password" required name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={8} placeholder="Create a password" className="luxury-input pr-12" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
              <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute inset-y-0 right-3 grid place-items-center text-ink/40 transition hover:text-gold dark:text-white/40">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-500 dark:text-rose-300">{error}</p>}
          <button className="button-gold w-full gap-2 py-4 text-sm" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
            {!loading && <ArrowRight size={15} />}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink/70 dark:text-white/70">
          Already a member? <Link className="font-semibold text-gold underline decoration-gold/40 underline-offset-4" href="/login">Sign in</Link>
        </p>
      </div>
    </AuthShell>
  );
}