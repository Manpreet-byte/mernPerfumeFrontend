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

  if (loading && !user) return <div className="mx-auto max-w-4xl px-6 py-20 text-white"><h1 className="font-serif text-5xl">Your account</h1><p className="mt-5 text-stone-300">Loading profile…</p></div>;

  if (!user) {
    return (
      <AuthShell
        eyebrow="Signed out"
        title="Your account is ready when you are."
        copy="You’re no longer signed in, but your profile, wishlist, and order history will be waiting after a quick return."
        highlights={highlights}
      >
        <div className="text-ink dark:text-white">
          <div className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white/80 dark:border-white/10 dark:bg-white/5">
            <div className="relative h-72 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1400&q=85" alt="Perfume bottles arranged on a table" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="eyebrow text-gold/90">Aurelia ritual</p>
                <h2 className="mt-3 font-serif text-4xl leading-tight">Return to your fragrance wardrobe.</h2>
                <p className="mt-3 max-w-md text-sm leading-7 text-stone-100">Sign in again to revisit your wishlist, saved details, and curated order history.</p>
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
              <p className="mt-3 text-sm leading-7 text-ink/80 dark:text-white/80">Profile details, wishlist items, and your order history return instantly once you sign back in.</p>
            </div>
            <div className="luxury-panel rounded-3xl p-5">
              <p className="eyebrow">Discover more</p>
              <p className="mt-3 text-sm leading-7 text-ink/80 dark:text-white/80">Browse the latest perfume edit while you decide which scent fits the next chapter.</p>
            </div>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-14 text-white">
      <p className="eyebrow">Private account</p>
      <h1 className="mt-3 font-serif text-5xl">Hello, {user.name}</h1>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <section className="luxury-panel rounded-3xl p-6">
          <h2 className="font-serif text-2xl">Account details</h2>
          <p className="mt-4 text-sm">{user.email}</p>
          <button className="button-outline mt-6">Edit profile</button>
        </section>
        <section className="luxury-panel rounded-3xl p-6">
          <h2 className="font-serif text-2xl">Order history</h2>
          <p className="mt-4 text-sm text-stone-300">Your recent orders will appear here.</p>
          <Link href="/products" className="button-outline mt-6">Discover fragrance</Link>
        </section>
      </div>
      <button className="mt-8 text-xs font-bold uppercase tracking-widest text-gold" onClick={() => { dispatch(logout()); router.push('/profile'); }}>
        Log out
      </button>
    </div>
  );
}