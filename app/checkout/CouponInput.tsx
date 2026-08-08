'use client';

import { ArrowRight, Trash2 } from 'lucide-react';

type CouponInputProps = {
  value: string;
  onChange: (value: string) => void;
  onApply: () => void;
  onRemove: () => void;
  loading?: boolean;
  applied?: boolean;
  error?: string | null;
};

export function CouponInput({ value, onChange, onApply, onRemove, loading = false, applied = false, error }: CouponInputProps) {
  return (
    <section className="luxury-panel rounded-3xl p-5 border border-ink/10 bg-white/95 text-ink shadow-lg shadow-black/5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Coupon</p>
          <h2 className="mt-2 font-serif text-2xl text-ink">Apply a perfume offer</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">Use a promo code to unlock the best available scent savings.</p>
        </div>
        {applied && <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[.18em] text-gold">Applied</span>}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="luxury-input uppercase tracking-[.18em]"
          placeholder="GOLD20"
          autoComplete="off"
          spellCheck={false}
        />
        {applied ? (
          <button type="button" onClick={onRemove} className="button-outline whitespace-nowrap">
            <Trash2 className="mr-2" size={15} /> Remove
          </button>
        ) : (
          <button type="button" onClick={onApply} disabled={loading || !value.trim()} className="button-gold whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Checking…' : <span className="inline-flex items-center"><ArrowRight className="mr-2" size={15} />Apply</span>}
          </button>
        )}
      </div>

      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
    </section>
  );
}