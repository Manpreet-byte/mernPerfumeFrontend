'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, WandSparkles, ShieldCheck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCurrentUser, logout } from '@/store/slices/authSlice';
import { AuthShell } from '@/components/auth-shell';

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  const highlights = [
  { title: 'Fresh start', copy: 'Your saved session is cleared, but your fragrance history is still only a sign in away.', icon: Sparkles },
  { title: 'Curated edits', copy: 'Discover a tighter collection of perfumes, now with richer editorial storytelling.', icon: WandSparkles },
  { title: 'Secure return', copy: 'Log in again with Google or email and continue from the same protected account flow.', icon: ShieldCheck },
  ];

  useEffect(() => {
    if (!user) dispatch(fetchCurrentUser());
  }, [dispatch, user]);

  if (loading && !user) return <div className="mx-auto max-w-4xl px-6 py-20 text-black dark:text-white"><h1 className="font-serif text-5xl">Your account</h1><p className="mt-5 text-black">Loading profile…</p></div>;

  if (!user) {
    return (
      <AuthShell
        eyebrow="Signed out"
        title="Your account is ready when you are."
        copy="You’re no longer signed in, but your profile, wishlist, and order history will be waiting after a quick return."
        highlights={highlights}
      >
        <div className="text-black dark:text-white">
          <div className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white/80 dark:border-white/10 dark:bg-white/5">
            <div className="relative h-72 overflow-hidden">
              <img src="https://www.lightxeditor.com/blog/wp-content/uploads/2026/01/image4-1.webp" alt="Perfume bottles arranged on a table" className="h-full w-full object-cover object-center" loading="eager" decoding="async" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white drop-shadow-lg">
                <p className="eyebrow text-gold/90">Aurelia ritual</p>
                <h2 className="mt-3 font-serif text-4xl leading-tight">Return to your fragrance wardrobe.</h2>
                      <p className="mt-3 max-w-md text-sm leading-7 text-black">Sign in again to revisit your wishlist, saved details, and curated order history.</p>
              </div>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <Link href="/login" className="button-gold gap-2 py-4 text-sm">Sign in <ArrowRight size={15} /></Link>
              <Link href="/signup" className="button-outline gap-2 py-4 text-sm">Create account</Link>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="luxury-panel rounded-3xl p-5">
              <p className="eyebrow">What awaits</p>
              <p className="mt-3 text-sm leading-7 text-black/80 dark:text-white/80">Profile details, wishlist items, and your order history return instantly once you sign back in.</p>
            </div>
            <div className="luxury-panel rounded-3xl p-5">
              <p className="eyebrow">Discover more</p>
              <p className="mt-3 text-sm leading-7 text-black/80 dark:text-white/80">Browse the latest perfume edit while you decide which scent fits the next chapter.</p>
            </div>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-14 text-black dark:text-white">
      <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,.14),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(183,147,78,.16),transparent_30%)] p-8 shadow-[0_40px_110px_rgba(0,0,0,.22)]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">Private account</p>
            <h1 className="mt-3 font-serif text-5xl text-white">Hello, {user.name}</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-black">Welcome back to your personal fragrance atelier. Manage your profile, revisit saved scents, and keep your orders in a polished, high-contrast space.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 text-black shadow-[0_24px_60px_rgba(0,0,0,.12)]">
              <p className="text-xs uppercase tracking-[.24em] text-gold">Wishlist</p>
              <p className="mt-3 font-serif text-3xl">3 saved scents</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 text-black shadow-[0_24px_60px_rgba(0,0,0,.12)]">
              <p className="text-xs uppercase tracking-[.24em] text-gold">Orders</p>
              <p className="mt-3 font-serif text-3xl">Recent activity</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <section className="luxury-panel rounded-3xl p-6 bg-white/95 text-black shadow-[0_30px_80px_rgba(20,18,15,.06)] dark:bg-white/5 dark:text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-black dark:text-white">Account details</h2>
              <p className="mt-4 text-sm leading-7 text-black dark:text-stone-300">View and update your profile email, manage your preferences, and keep your account details polished.</p>
            </div>
            <span className="rounded-full bg-gold/10 px-3 py-2 text-[11px] uppercase tracking-[.24em] text-gold">Verified</span>
          </div>
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-black/10 bg-black/5 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs uppercase tracking-[.22em] text-black/70 dark:text-stone-400">Email</p>
              <p className="mt-2 font-medium text-black dark:text-white">{user.email}</p>
            </div>
            <button className="button-outline mt-2 text-black border-black/20 hover:border-gold hover:text-gold">Edit profile</button>
          </div>
        </section>

        <section className="luxury-panel rounded-3xl p-6 bg-white/95 text-black shadow-[0_30px_80px_rgba(20,18,15,.06)] dark:bg-white/5 dark:text-white">
          <div>
            <h2 className="font-serif text-2xl text-black dark:text-white">Order history</h2>
            <p className="mt-4 text-sm leading-7 text-black">Review the latest orders, reorder favorite fragrances, and keep your delivery details up to date.</p>
          </div>
          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-black/10 bg-black/5 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs uppercase tracking-[.22em] text-black/70 dark:text-stone-400">Status</p>
              <p className="mt-2 font-medium text-black dark:text-white">No recent orders yet</p>
            </div>
            <Link href="/products" className="button-outline mt-2 text-black border-black/20 hover:border-gold hover:text-gold">Discover fragrance</Link>
          </div>
        </section>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <div className="luxury-panel rounded-3xl p-6 bg-white/95 text-black shadow-[0_20px_60px_rgba(20,18,15,.05)] dark:bg-white/5 dark:text-white">
          <p className="text-xs uppercase tracking-[.24em] text-gold">Saved</p>
          <p className="mt-3 font-serif text-3xl">8 items</p>
          <p className="mt-3 text-sm leading-6 text-black dark:text-stone-300">Fragrances you have saved for later discovery.</p>
        </div>
        <div className="luxury-panel rounded-3xl p-6 bg-white/95 text-black shadow-[0_20px_60px_rgba(20,18,15,.05)] dark:bg-white/5 dark:text-white">
          <p className="text-xs uppercase tracking-[.24em] text-gold">Preferences</p>
          <p className="mt-3 font-serif text-3xl">Woody & amber</p>
          <p className="mt-3 text-sm leading-6 text-black dark:text-stone-300">Your current scent profile for personalized recommendations.</p>
        </div>
        <div className="luxury-panel rounded-3xl p-6 bg-white/95 text-black shadow-[0_20px_60px_rgba(20,18,15,.05)] dark:bg-white/5 dark:text-white">
          <p className="text-xs uppercase tracking-[.24em] text-gold">Support</p>
          <p className="mt-3 font-serif text-3xl">Concierge ready</p>
          <p className="mt-3 text-sm leading-6 text-black dark:text-stone-300">Message our boutique team anytime for tailored fragrance advice.</p>
        </div>
      </div>

      <button className="mt-8 text-xs font-bold uppercase tracking-widest text-gold" onClick={() => { dispatch(logout()); router.push('/profile'); }}>
        Log out
      </button>
    </div>
  );
}