'use client';

import Link from 'next/link';
import { Heart, Menu, Moon, Search, ShoppingBag, Sun, UserRound, X, LogIn, UserPlus } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';

export function Header() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const count = useAppSelector((state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));
  const user = useAppSelector((state) => state.auth.user);
  const links = [['Home', '/'], ['Collections', '/products?category=luxury'], ['About', '/about'], ['Contact', '/contact']];

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-black/80">
      <div className="bg-ink px-5 py-2 text-center text-[10px] font-bold uppercase tracking-[.26em] text-gold/90">
        Bespoke fragrance, curated for every mood and moment.
      </div>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 text-ink dark:text-white">
        <button className="md:hidden" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/" className="font-serif text-2xl tracking-[.25em]">AURELIA</Link>
          <nav className="flex items-center gap-8">{links.map(([label, href]) => <Link key={label} href={href} className="text-xs font-bold uppercase tracking-[.14em] transition hover:text-gold">{label}</Link>)}</nav>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/products"><Search size={18} /></Link>
          {user && <Link href="/profile" className="hidden sm:block"><UserRound size={18} /></Link>}
          <Link href="/wishlist"><Heart size={18} /></Link>
          { !user && (
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login" className="text-xs font-bold uppercase tracking-[.14em] transition hover:text-gold">Sign in</Link>
              <Link href="/signup" className="text-xs font-bold uppercase tracking-[.14em] transition hover:text-gold">Sign up</Link>
            </div>
          )}
          <Link href="/cart" className="relative">
            <ShoppingBag size={18} />
            {count > 0 && <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-gold text-[9px] text-white">{count}</span>}
          </Link>
          <button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')} aria-label="Toggle dark mode" className="rounded-full border border-ink/10 p-2 transition hover:border-gold dark:border-white/10">
            {mounted && resolvedTheme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>

      <div className="mx-auto flex items-center justify-center border-t border-ink/10 bg-white/80 py-4 text-ink dark:border-white/10 dark:bg-black/80 md:hidden">
        <Link href="/" className="font-serif text-2xl tracking-[.25em]">AURELIA</Link>
      </div>
      {open && (
        <nav className="flex flex-col gap-5 border-t border-ink/10 bg-white px-6 py-6 text-ink dark:border-white/10 dark:bg-black dark:text-white md:hidden">
          {links.map(([label, href]) => (
            <Link onClick={() => setOpen(false)} key={label} href={href} className="text-sm font-semibold uppercase tracking-widest">
              {label}
            </Link>
          ))}
          <div className="mt-2 border-t border-ink/10 pt-5 dark:border-white/10">
            {user ? (
              <>
                <Link onClick={() => setOpen(false)} href="/profile" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest">
                  <UserRound size={16} /> Profile
                </Link>
              </>
            ) : (
              <>
                <Link onClick={() => setOpen(false)} href="/login" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest hover:text-gold">
                  <LogIn size={16} /> Sign in
                </Link>
                <Link onClick={() => setOpen(false)} href="/signup" className="mt-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest hover:text-gold">
                  <UserPlus size={16} /> Sign up
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}